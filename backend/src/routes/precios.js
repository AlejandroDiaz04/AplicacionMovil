const express = require("express");
const router = express.Router();
const preciosController = require("../controllers/preciosController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE LISTAS DE PRECIOS
// ============================================

// Obtener todas las listas de precios
router.get("/", authenticateToken, preciosController.obtenerListasPrecios);

// Obtener lista de precios por ID con sus precios
router.get(
  "/:listaPreciosId",
  authenticateToken,
  preciosController.obtenerListaPreciosPorId
);

// Obtener todos los precios de una lista
router.get(
  "/:listaPreciosId/precios",
  authenticateToken,
  preciosController.obtenerPreciosLista
);

// Crear nueva lista de precios
router.post("/", authenticateToken, preciosController.crearListaPrecios);

// Actualizar lista de precios
router.put("/:id", authenticateToken, preciosController.actualizarListaPrecios);

// Eliminar lista de precios (soft delete)
router.delete(
  "/:id",
  authenticateToken,
  preciosController.eliminarListaPrecios
);

// ============================================
// RUTAS DE PRECIOS (Asignación de precios a productos)
// ============================================

// Obtener precio de un producto en una lista específica
router.get(
  "/producto/precio",
  authenticateToken,
  preciosController.obtenerPrecioProducto
);

// Asignar o actualizar precio de un producto en una lista
router.post(
  "/producto/asignar",
  authenticateToken,
  preciosController.asignarPrecioProducto
);

// Eliminar precio de un producto en una lista
router.delete(
  "/:listaPreciosId/productos/:productoId",
  authenticateToken,
  preciosController.eliminarPrecio
);

module.exports = router;
