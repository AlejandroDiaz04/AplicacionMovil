const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODOS LOS CLIENTES
// ============================================
const obtenerClientes = async (req, res) => {
  try {
    const { skip = 0, take = 100, isDeleted } = req.query;

    // Por defecto, solo mostrar clientes no eliminados
    const where = {};
    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted === "true";
    } else {
      // Si no se especifica, mostrar solo no eliminados
      where.isDeleted = false;
    }

    const clientes = await prisma.cliente.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        _count: {
          select: { ventas: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.cliente.count({ where });

    res.json({
      success: true,
      data: clientes,
      pagination: {
        total,
        skip: parseInt(skip),
        take: parseInt(take),
        pages: Math.ceil(total / parseInt(take)),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// OBTENER CLIENTE POR ID
// ============================================
const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: {
        ventas: {
          select: {
            id: true,
            numeroFactura: true,
            fechaVenta: true,
            total: true,
            estado: true,
          },
        },
      },
    });

    if (!cliente) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      data: cliente,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVO CLIENTE
// ============================================
const crearCliente = async (req, res) => {
  try {
    const { nombre, documento, email, telefono, direccion } = req.body;

    // Validaciones
    if (!nombre || !documento) {
      return res.status(400).json({
        error: true,
        message: "Nombre y documento son requeridos",
      });
    }

    // Verificar si el documento ya existe
    const existe = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (existe) {
      return res.status(400).json({
        error: true,
        message: "Ya existe un cliente con este documento",
      });
    }

    // Verificar si el email ya existe (si se proporciona)
    if (email) {
      const emailExiste = await prisma.cliente.findUnique({
        where: { email },
      });

      if (emailExiste) {
        return res.status(400).json({
          error: true,
          message: "Ya existe un cliente con este email",
        });
      }
    }

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        documento,
        email: email || null,
        telefono: telefono || null,
        direccion: direccion || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: cliente,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR CLIENTE
// ============================================
const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, isDeleted } = req.body;

    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExiste) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    // Verificar si el email ya existe en otro cliente
    if (email && email !== clienteExiste.email) {
      const emailExiste = await prisma.cliente.findUnique({
        where: { email },
      });

      if (emailExiste) {
        return res.status(400).json({
          error: true,
          message: "Ya existe otro cliente con este email",
        });
      }
    }

    const clienteActualizado = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        email,
        telefono,
        direccion,
        isDeleted,
      },
    });

    res.json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: clienteActualizado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR CLIENTE (Lógico)
// ============================================
const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteExiste = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExiste) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    // Eliminación lógica (soft delete)
    const clienteEliminado = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: "Cliente desactivado exitosamente",
      data: clienteEliminado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// BUSCAR CLIENTE POR DOCUMENTO
// ============================================
const buscarClientePorDocumento = async (req, res) => {
  try {
    const { documento } = req.query;

    if (!documento) {
      return res.status(400).json({
        error: true,
        message: "Documento es requerido",
      });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { documento },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });

    if (!cliente) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      data: cliente,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// OBTENER ESTADÍSTICAS DEL CLIENTE
// ============================================
const obtenerEstadisticasCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(clienteId) },
    });

    if (!cliente) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    const ventas = await prisma.venta.findMany({
      where: { clienteId: parseInt(clienteId), estado: "completada" },
    });

    const totalCompras = ventas.length;
    const totalGastado = ventas.reduce(
      (sum, v) => sum + parseFloat(v.total),
      0
    );
    const promedioPorCompra =
      totalCompras > 0 ? totalGastado / totalCompras : 0;

    res.json({
      success: true,
      data: {
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          documento: cliente.documento,
          email: cliente.email,
          telefono: cliente.telefono,
        },
        estadisticas: {
          totalCompras,
          totalGastado: parseFloat(totalGastado.toFixed(2)),
          promedioPorCompra: parseFloat(promedioPorCompra.toFixed(2)),
          ultimaCompra: ventas.length > 0 ? ventas[0].fechaVenta : null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarClientePorDocumento,
  obtenerEstadisticasCliente,
};
