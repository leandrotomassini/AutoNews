const { Router } = require("express");

const {
  buscarNuevasNoticias,
  obtenerUltimas20Noticias,
  obtenerUltimas20Publicaciones,
  publicarNoticia,
} = require("../controllers/noticias");

const router = Router();

/**
 * {{url}}/api/noticias
 */

//  Buscar nuevas noticias
router.get("/nuevas", buscarNuevasNoticias);
router.get("/ultimas-noticias", obtenerUltimas20Noticias);
router.get("/ultimas-publicaciones", obtenerUltimas20Publicaciones);
router.post("/:id", publicarNoticia);

module.exports = router;
