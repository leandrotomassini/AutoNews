const { Schema, model } = require("mongoose");

const Noticiachema = Schema({
  link: {
    type: String,
    required: [true, "El titulo es obligatorio"],
    unique: true,
  },
  titulo: {
    type: String,
    required: [true, "El titulo es obligatorio"],
  },
  subtitulo: {
    type: String,
    required: [true, "El subtitulo es obligatorio"],
  },
  contenidoCrudo: {
    type: String,
    required: [true, "El contenido en crudo es obligatorio"],
  },
  contenidoTerminado: {
    type: String,
    required: [false],
  },
  publicada: {
    type: Boolean,
    default: true,
    required: true,
  },
  fotos: {
    type: [String],
    default: [],
    required: true,
  },
});

Noticiachema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model("Noticia", Noticiachema);
