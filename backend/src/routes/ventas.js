const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE VENTAS
// ============================================

// Obtener todas las ventas
router.get("/", authenticateToken, ventasController.obtenerVentas);

// Obtener resumen de ventas
router.get(
  "/resumen/general",
  authenticateToken,
  ventasController.obtenerResumenVentas
);

// Obtener ventas de un cliente
router.get(
  "/cliente/:clienteId",
  authenticateToken,
  ventasController.obtenerVentasPorCliente
);

// Obtener venta por ID
router.get("/:id", authenticateToken, ventasController.obtenerVentaPorId);

// Crear nueva venta
router.post("/", authenticateToken, ventasController.crearVenta);

// Cancelar venta
router.post("/:id/cancelar", authenticateToken, ventasController.cancelarVenta);

module.exports = router;
