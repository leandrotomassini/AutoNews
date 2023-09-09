import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';

import Server from '../classes/server';

import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/tn', async (req: Request, resp: Response) => {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
        });

        const page = await browser.newPage();

        await page.goto('https://tn.com.ar/ultimas-noticias/pagina/1/');

        const linksNoticias = await page.evaluate(() => {
            const noticiasTarjetas = document.querySelectorAll('.card__container');

            const listadoNoticias = Array.from(noticiasTarjetas).map((tarjetaNoticia) => {
                const enlace = tarjetaNoticia.querySelector('a.card__image.card__media');
                const href = enlace ? enlace.getAttribute('href') : null;

                return {
                    linkNoticia: 'https://tn.com.ar' + href,
                };
            });

            return listadoNoticias;
        });

        await browser.close();

        // Leer el archivo existente de noticias
        let noticiasExistentes = [];
        try {
            const data = await fs.readFile('data/noticias.json', 'utf-8');
            noticiasExistentes = JSON.parse(data);
        } catch (error) {
            // El archivo no existe o no se puede leer
        }

        // Obtener el último ID existente
        const ultimoIdExistente = noticiasExistentes.length > 0 ? noticiasExistentes[noticiasExistentes.length - 1].id : 0;

        // Comparar y agregar noticias nuevas con IDs incrementados
        const nuevasNoticias = [];
        let id = ultimoIdExistente + 1;
        for (const nuevaNoticia of linksNoticias) {
            if (nuevaNoticia.linkNoticia && nuevaNoticia.linkNoticia !== "https://tn.com.arnull" && !noticiasExistentes.some((existente: any) => existente.linkNoticia === nuevaNoticia.linkNoticia)) {
                nuevasNoticias.push({ id, ...nuevaNoticia });
                id++;
            }
        }

        // Actualizar el archivo con las nuevas noticias
        const noticiasActualizadas = [...noticiasExistentes, ...nuevasNoticias];
        await fs.writeFile('data/noticias.json', JSON.stringify(noticiasActualizadas));

        // Acceder a los títulos de las nuevas noticias y guardarlos en el archivo noticias.json
        const textonoticias = [];
        let i = 0;

        if (nuevasNoticias.length > 0) {
            console.log('accediendo a títulos');
            for (const nuevaNoticia of nuevasNoticias) {
                i++;

                try {
                    const browser2 = await puppeteer.launch({
                        headless: 'new',
                        executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
                    });
                    const page2 = await browser2.newPage();

                    await page2.goto(nuevaNoticia.linkNoticia);

                    // Esperar a que aparezca el título
                    await page2.waitForSelector('h1');

                    const datosNoticia = await page2.evaluate(() => {
                        const h1 = document.querySelector('h1')!.innerHTML;
                        const h2 = document.querySelector('h2')!.innerHTML;
                        const portada = document.querySelector('.content-image')?.getAttribute('src');
                        const fotos = Array.from(document.querySelectorAll('img.content-image')).map((imagen) => imagen.getAttribute('src'));
                        const parrafos = Array.from(document.querySelectorAll('.paragraph')).map((parrafo) => parrafo.textContent);

                        return { h1, h2, portada, fotos, parrafos };
                    });

                    console.log('Cargando: ' + i + '-' + datosNoticia.h1);

                    textonoticias.push({ id: i, idLinkNoticia: nuevaNoticia.id, ...datosNoticia });
                    console.log('Insertada en el arreglo correctamente.');
                    await browser2.close();
                } catch (error) {
                    console.error(`Error al procesar noticia: ${error}`);
                }
            }
        }

        // Actualizar el archivo noticias.json con los títulos de las noticias
        const noticiasConTitulos = noticiasActualizadas.map((noticia: any) => {
            const tituloData = textonoticias.find((titulo: any) => titulo.idLinkNoticia === noticia.id);
            return { ...noticia, ...tituloData };
        });

        await fs.writeFile('data/noticias.json', JSON.stringify(noticiasConTitulos));

        // Obtener las últimas 20 noticias del archivo (o menos si hay menos de 20)
        const noticiasMasRecientes = noticiasConTitulos.slice(-20);

        resp.json(noticiasMasRecientes);
    } catch (error) {
        console.error(`Error general: ${error}`);
        resp.status(500).json({ error: 'Error en el servidor' });
    }
});


router.get('/mensajes', (req: Request, resp: Response) => {

    resp.status(200).json({
        ok: true,
        mensaje: 'Todo está bien !!!'
    });
});


router.post('/mensajes', (req: Request, resp: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }

    // Tiene la propiedad de socket.io para mandar mensajes
    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload);

    resp.status(200).json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, resp: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    // Tiene la propiedad de socket.io para mandar mensajes
    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);

    resp.status(200).json({
        ok: true,
        cuerpo,
        de,
        id
    });
});


router.get('/usuarios', (req: Request, resp: Response) => {

    const server = Server.instance;

    server.io.allSockets().then((clientes) => {
        resp.json({
            ok: true,
            clientes: Array.from(clientes)
        })
    }).catch((error) => {
        resp.json({
            ok: false,
            error
        })
    });

});

router.get('/usuarios/detalle', (req: Request, resp: Response) => {

    resp.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    })

});

export default router;