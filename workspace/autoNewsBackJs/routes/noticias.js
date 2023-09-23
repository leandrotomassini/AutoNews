const { Router } = require("express");

const { buscarNuevasNoticias } = require("../controllers/noticias");

const router = Router();

/**
 * {{url}}/api/noticias
 */

//  Buscar nuevas noticias
router.get("/nuevas", buscarNuevasNoticias);

module.exports = router;
