const express = require("express");
const router = express.Router();
const {
  obtenerMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca,
} = require("../controllers/marcasController");
const { verificarToken } = require("../middleware/auth");

// Rutas públicas (sin autenticación por ahora)
router.get("/", obtenerMarcas);
router.get("/:id", obtenerMarcaPorId);
router.post("/", crearMarca);
router.put("/:id", actualizarMarca);
router.delete("/:id", eliminarMarca);

module.exports = router;
