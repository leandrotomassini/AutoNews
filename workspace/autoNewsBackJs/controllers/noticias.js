const { response } = require("express");

const Noticia = require("../models/noticia");

const buscarNuevasNoticias = async (req, res = response) => {
  const nuevaNoticia = {
    link: "fsdfads4d",
    titulo: "fdsdfsf",
    subtitulo: "fsdfsdf",
    contenidoCrudo: "fsdfsd",
    contenidoTerminado: "fsdfsd",
    publicada: false,
    fotos: ["fsdfsdf", "sdad2"],
  };

  try {
    const noticia = new Noticia(nuevaNoticia);

    await noticia.save();

    res.json({
      ok: true,
      msg: "Se buscaron nuevas noticias.",
      noticia,
    });
  } catch (error) {
    res.json({
      ok: false,
      error,
    });
  }
};

module.exports = {
  buscarNuevasNoticias,
};
