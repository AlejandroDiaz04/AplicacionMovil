const express = require("express");
const router = express.Router();
const auditoriaController = require("../controllers/auditoriaController");
const { authenticateToken } = require("../middleware/auth");
const { autorizar } = require("../middleware/permissions");

// ============================================
// RUTAS DE AUDITORÍA
// ============================================

// Obtener todos los registros de auditoría (Solo Admin)
router.get(
  "/",
  authenticateToken,
  autorizar("auditoria", "leer"),
  auditoriaController.obtenerAuditoria
);

// Obtener resumen de auditoría (Solo Admin)
router.get(
  "/resumen",
  authenticateToken,
  autorizar("auditoria", "leer"),
  auditoriaController.obtenerResumenAuditoria
);

// Obtener actividad de un usuario (Solo Admin)
router.get(
  "/usuario/:usuarioId",
  authenticateToken,
  autorizar("auditoria", "leer"),
  auditoriaController.obtenerActividadUsuario
);

module.exports = router;
