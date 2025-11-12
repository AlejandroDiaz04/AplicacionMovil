const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE CATEGORÍAS
// ============================================

// Obtener todas las categorías
router.get("/", authenticateToken, categoriasController.obtenerCategorias);

// Obtener categoría por ID
router.get(
  "/:id",
  authenticateToken,
  categoriasController.obtenerCategoriaPorId
);

// Crear nueva categoría
router.post("/", authenticateToken, categoriasController.crearCategoria);

// Actualizar categoría
router.put("/:id", authenticateToken, categoriasController.actualizarCategoria);

// Eliminar categoría (soft delete)
router.delete(
  "/:id",
  authenticateToken,
  categoriasController.eliminarCategoria
);

module.exports = router;
