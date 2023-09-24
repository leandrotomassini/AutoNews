const { Router } = require("express");

const {
  buscarNuevasNoticias,
  obtenerUltimas20Noticias,
} = require("../controllers/noticias");

const router = Router();

/**
 * {{url}}/api/noticias
 */

//  Buscar nuevas noticias
router.get("/nuevas", buscarNuevasNoticias);
router.get("/ultimas-noticias", obtenerUltimas20Noticias);

module.exports = router;
