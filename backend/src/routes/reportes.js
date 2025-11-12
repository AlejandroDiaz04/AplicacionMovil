const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE REPORTES
// ============================================

// Reporte de ventas por período
router.get(
  "/ventas/periodo",
  authenticateToken,
  reportesController.obtenerReporteVentasPeriodo
);

// Reporte de ventas diarias
router.get(
  "/ventas/diarias",
  authenticateToken,
  reportesController.obtenerReporteVentasDiarias
);

// Top 10 productos más vendidos
router.get(
  "/productos/top-vendidos",
  authenticateToken,
  reportesController.obtenerTopProductos
);

// Top clientes
router.get(
  "/clientes/top-clientes",
  authenticateToken,
  reportesController.obtenerTopClientes
);

// Desempeño de vendedores
router.get(
  "/vendedores/desempenio",
  authenticateToken,
  reportesController.obtenerDesempenoVendedores
);

// Estado de inventario
router.get(
  "/inventario/estado",
  authenticateToken,
  reportesController.obtenerReporteInventario
);

// Dashboard general
router.get(
  "/dashboard",
  authenticateToken,
  reportesController.obtenerDashboard
);

module.exports = router;
