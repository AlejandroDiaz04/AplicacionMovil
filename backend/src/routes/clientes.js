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

// Restaurar cliente eliminado (reactivar)
router.patch("/:id/restaurar", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: { isDeleted: false },
    });

    res.json({
      success: true,
      message: "Cliente restaurado exitosamente",
      data: cliente,
    });

    await prisma.$disconnect();
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Eliminar cliente (soft delete)
router.delete("/:id", authenticateToken, clientesController.eliminarCliente);

module.exports = router;
