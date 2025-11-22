const express = require("express");
const router = express.Router();
const {
  obtenerGrupos,
  obtenerGrupoPorId,
  crearGrupo,
  actualizarGrupo,
  eliminarGrupo,
} = require("../controllers/gruposController");
const { verificarToken } = require("../middleware/auth");

// Rutas públicas (sin autenticación por ahora)
router.get("/", obtenerGrupos);
router.get("/:id", obtenerGrupoPorId);
router.post("/", crearGrupo);
router.put("/:id", actualizarGrupo);
router.delete("/:id", eliminarGrupo);

module.exports = router;
