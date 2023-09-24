const { response } = require("express");
const puppeteer = require("puppeteer");

const Noticia = require("../models/noticia");

const buscarNuevasNoticias = async (req, res = response) => {
  try {
    const newsLinks = await scrapeTnLinks();
    const newsData = await scrapeNewsData(newsLinks);

    let noticiasGuardadas = 0;

    for (const newsItem of newsData) {
      const existingNoticia = await Noticia.findOne({
        link: newsItem.newsLink,
      });

      if (!existingNoticia) {
        const fotos = [newsItem.cover, ...newsItem.images];

        const nuevaNoticia = {
          link: newsItem.newsLink,
          titulo: newsItem.h1 || "",
          subtitulo: newsItem.h2 || "",
          contenidoCrudo: newsItem.combinedText,
          contenidoTerminado: "",
          publicada: false,
          fotos,
          fechaCreacion: new Date(),
        };

        const noticia = new Noticia(nuevaNoticia);
        await noticia.save();
        noticiasGuardadas++;
      }
    }

    res.json({
      ok: true,
      msg: `Se buscaron y guardaron ${noticiasGuardadas} nuevas noticias.`,
      total: noticiasGuardadas,
    });
  } catch (error) {
    res.json({
      ok: false,
      error,
    });
  }
};

const obtenerUltimas20Noticias = async (req, res = response) => {
  try {
    const noticias = await Noticia.find().sort({ fechaCreacion: -1 }).limit(20);

    res.json({
      ok: true,
      noticias,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las últimas noticias.",
      error,
    });
  }
};

// Función para iniciar una instancia de Puppeteer
const launchPuppeteer = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
    timeout: 60000,
  });

  return browser;
};

// Función para extraer enlaces de noticias desde TN
const scrapeTnLinks = async () => {
  const browser = await launchPuppeteer();
  const page = await browser.newPage();
  const newsLinks = [];

  // Aca es la cantidad de páginas, puedes cambiarlo según tus necesidades
  for (let i = 1; i <= 2; i++) {
    await page.goto(`https://tn.com.ar/ultimas-noticias/pagina/${i}/`);
    const pageLinks = await page.evaluate(() => {
      const newsCards = document.querySelectorAll(".card__container");
      const newsList = Array.from(newsCards).map((newsCard) => {
        const link = newsCard.querySelector("a.card__image.card__media");
        const href = link ? link.getAttribute("href") : null;
        if (href && !href.includes("https://tn.com.arnull")) {
          return {
            newsLink: "https://tn.com.ar" + href,
          };
        } else {
          return null;
        }
      });

      return newsList.filter((link) => link !== null);
    });

    newsLinks.push(...pageLinks);
  }

  await browser.close();
  return newsLinks;
};

const scrapeNewsData = async (newsLinks) => {
  const browser = await launchPuppeteer();
  const page = await browser.newPage();
  const newsData = [];

  for (let link of newsLinks) {
    await page.goto(link.newsLink);
    await page.waitForSelector("h1");

    const h1 = await page.evaluate(() => {
      const h1Element = document.querySelector("h1");
      return h1Element ? h1Element.textContent : null;
    });

    const h2 = await page.evaluate(() => {
      const h2Element = document.querySelector("h2");
      return h2Element ? h2Element.textContent : null;
    });

    const paragraphs = await page.evaluate(() => {
      const paragraphElements = Array.from(
        document.querySelectorAll(".paragraph")
      );
      return paragraphElements
        .map((paragraph) => paragraph.textContent.trim())
        .filter((paragraph) => !paragraph.startsWith("Leé también:"));
    });

    const combinedText = [h1, h2, ...paragraphs].filter(Boolean).join(" ");

    if (
      !combinedText.includes(
        "Noticia en desarrollo que está siendo actualizada"
      )
    ) {
      const cover = await page.evaluate(() => {
        const coverElement = document.querySelector(".image.cover img");
        return coverElement ? coverElement.getAttribute("src") : null;
      });

      const images = await page.evaluate(() => {
        const imageElements = Array.from(
          document.querySelectorAll("img.content-image")
        );

        const imageUrls = imageElements.map((image) =>
          image.getAttribute("src")
        );

        return imageUrls.filter((imageUrl) => imageUrl !== null);
      });

      if (images.length >= 2) {
        const newsItem = {
          newsLink: link.newsLink,
          h1,
          h2,
          combinedText,
          cover,
          images,
        };

        newsData.push(newsItem);
      }
    }
  }

  await browser.close();
  return newsData;
};
module.exports = {
  buscarNuevasNoticias,
  obtenerUltimas20Noticias,
};
