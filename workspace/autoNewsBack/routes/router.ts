import { Router, Request, Response } from 'express';
import puppeteer from "puppeteer";
import fs from "fs/promises";

import Server from '../classes/server';

import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/tn', async (req: Request, resp: Response) => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath:
            "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
    });

    const page = await browser.newPage();

    await page.goto("https://tn.com.ar/ultimas-noticias/pagina/1/");

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
        const data = await fs.readFile("data/linksNoticias.json", "utf-8");
        noticiasExistentes = JSON.parse(data);
    } catch (error) {
        // El archivo no existe o no se puede leer
    }

    // Comparar y agregar noticias nuevas
    const nuevasNoticias = [];
    let id = noticiasExistentes.length + 1;
    for (const nuevaNoticia of linksNoticias) {
        if (!noticiasExistentes.some((existente: any) => existente.linkNoticia === nuevaNoticia.linkNoticia)) {
            nuevasNoticias.push({ id, ...nuevaNoticia });
            id++;
        }
    }

    // Actualizar el archivo con las nuevas noticias
    const noticiasActualizadas = [...noticiasExistentes, ...nuevasNoticias];
    await fs.writeFile("data/linksNoticias.json", JSON.stringify(noticiasActualizadas));

    console.log('accediendo a títulos');

    // Acceder a los títulos de las nuevas noticias
    for (const nuevaNoticia of nuevasNoticias) {
        const browser2 = await puppeteer.launch({
            headless: false,
            executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        });
        const page2 = await browser2.newPage();

        await page2.goto(nuevaNoticia.linkNoticia);

        // Esperar a que aparezca el título
        await page2.waitForSelector('h1');

        const textoNoticia = await page2.evaluate(() => {
            const h1 = document.querySelector('h1')!.innerHTML;
            const h2 = document.querySelector('h2')!.innerHTML;
            const portada = document.querySelector('.content-image')?.src;
            const fotos = document.querySelectorAll('img.content-image');
            const parrafos = document.querySelectorAll('.paragraph');

            return `${h1} - ${h2}`;
        });

        console.log(`Título de la noticia: ${textoNoticia}`);

        await browser2.close();
    }

    resp.json(nuevasNoticias);
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


// document.querySelector('h1').innerHTML
// document.querySelector('h2').innerHTML
// document.querySelector('.content-image')?.src
// const enlacesImagenes = document.querySelectorAll('img.content-image');
// document.querySelectorAll('.paragraph')
