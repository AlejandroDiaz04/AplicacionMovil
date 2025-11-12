const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientesController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE CLIENTES
// ============================================

// Obtener todos los clientes
router.get("/", authenticateToken, clientesController.obtenerClientes);

// Buscar cliente por documento
router.get(
  "/buscar",
  authenticateToken,
  clientesController.buscarClientePorDocumento
);

// Obtener estadísticas del cliente
router.get(
  "/:clienteId/estadisticas",
  authenticateToken,
  clientesController.obtenerEstadisticasCliente
);

// Obtener cliente por ID
router.get("/:id", authenticateToken, clientesController.obtenerClientePorId);

// Crear nuevo cliente
router.post("/", authenticateToken, clientesController.crearCliente);

// Actualizar cliente
router.put("/:id", authenticateToken, clientesController.actualizarCliente);

// Eliminar cliente (soft delete)
router.delete("/:id", authenticateToken, clientesController.eliminarCliente);

module.exports = router;
