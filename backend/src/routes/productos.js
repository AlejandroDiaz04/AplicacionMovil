const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");
const { authenticateToken } = require("../middleware/auth");
const { autorizar, registrarAuditoria } = require("../middleware/permissions");

// ============================================
// RUTAS DE PRODUCTOS
// ============================================

// ⚠️ IMPORTANTE: Rutas específicas ANTES de rutas genéricas

// Buscar producto por código (ESPECÍFICO - va ANTES)
router.get(
  "/buscar",
  authenticateToken,
  autorizar("productos", "leer"),
  productosController.buscarProductoPorCodigo
);

// Actualizar stock (ESPECÍFICO - va ANTES)
router.patch(
  "/:id/stock",
  authenticateToken,
  autorizar("productos", "actualizar"),
  registrarAuditoria("productos", "actualizar"),
  productosController.actualizarStock
);

// ============================================
// RUTAS GENÉRICAS (van DESPUÉS de las específicas)
// ============================================

// Obtener todos los productos (GET sin ID)
router.get(
  "/",
  authenticateToken,
  autorizar("productos", "leer"),
  productosController.obtenerProductos
);

// Crear nuevo producto (POST)
router.post(
  "/",
  authenticateToken,
  autorizar("productos", "crear"),
  registrarAuditoria("productos", "crear"),
  productosController.crearProducto
);

// Obtener producto por ID (GET con ID)
router.get(
  "/:id",
  authenticateToken,
  autorizar("productos", "leer"),
  productosController.obtenerProductoPorId
);

// Actualizar producto (PUT con ID)
router.put(
  "/:id",
  authenticateToken,
  autorizar("productos", "actualizar"),
  registrarAuditoria("productos", "actualizar"),
  productosController.actualizarProducto
);

// Eliminar producto - soft delete (DELETE con ID)
router.delete(
  "/:id",
  authenticateToken,
  autorizar("productos", "eliminar"),
  registrarAuditoria("productos", "eliminar"),
  productosController.eliminarProducto
);

module.exports = router;
