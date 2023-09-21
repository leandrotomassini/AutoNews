import { Request, Response } from "express";
import puppeteer from "puppeteer";

interface NewsItem {
  h1: string | null;
  h2: string | null;
  paragraphs?: string[];
  combinedText: string;
  cover: string | null;
  photos: (string | null)[];
  images: (string | null)[];
}

// Función para iniciar una instancia de Puppeteer
const launchPuppeteer = async () => {
  return await puppeteer.launch({
    headless: "new",
    executablePath:
      "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
    timeout: 60000,
  });
};

// Función para extraer enlaces de noticias desde TN
const scrapeTnLinks = async () => {
  const browser = await launchPuppeteer();
  const page = await browser.newPage();
  const newsLinks: { newsLink: string }[] = [];

  for (let i = 1; i <= 6; i++) {
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

      return newsList.filter((link) => link !== null) as { newsLink: string }[];
    });

    newsLinks.push(...pageLinks);
  }

  await browser.close();

  return newsLinks;
};

// Función para extraer datos de noticias individuales
const scrapeNewsData = async (newsLinks: any) => {
  const browser = await launchPuppeteer();
  const page = await browser.newPage();

  const newsData: (Omit<NewsItem, "cover" | "photos"> & {
    images: (string | null)[];
  })[] = [];

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
        .map((paragraph) => paragraph.textContent!.trim())
        .filter((paragraph) => !paragraph.startsWith("Leé también:"));
    });

    // Combinar las propiedades en un solo texto sin saltos de línea ni puntos
    const combinedText = [h1, h2, ...paragraphs].filter(Boolean).join(" ");

    // Agregar condición para omitir noticias con "Noticia en desarrollo"
    if (
      !combinedText.includes(
        "Noticia en desarrollo que está siendo actualizada"
      )
    ) {
      const images = await page.evaluate(() => {
        const imageElements = Array.from(
          document.querySelectorAll("img.content-image")
        );

        const imageUrls = imageElements.map((image) =>
          image.getAttribute("src")
        );

        return imageUrls.filter((imageUrl) => imageUrl !== null);
      });

      if (images.length >= 3) {
        const newsItem = {
          h1,
          h2,
          combinedText,
          images,
        };

        newsData.push(newsItem);
      }
    }
  }

  await browser.close();

  return newsData;
};

// Controlador para obtener noticias de TN
export const getTnNews = async (req: Request, res: Response) => {
  try {
    const newsLinks = await scrapeTnLinks();
    const newsData = await scrapeNewsData(newsLinks);

    // Agregar una propiedad "total" que indique la cantidad de noticias
    res.json({
      ok: true,
      total: newsData.length, // Agregar esta línea
      newsData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Error: Obtener noticias de TN",
    });
  }
};
