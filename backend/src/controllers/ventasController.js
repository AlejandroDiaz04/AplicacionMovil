const { PrismaClient } = require("@prisma/client");
const { Decimal } = require("@prisma/client/runtime/library");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODAS LAS VENTAS
// ============================================
const obtenerVentas = async (req, res) => {
  try {
    const {
      skip = 0,
      take = 10,
      estado,
      clienteId,
      fechaInicio,
      fechaFin,
    } = req.query;

    const where = {};
    if (estado) {
      where.estado = estado;
    }
    if (clienteId) {
      where.clienteId = parseInt(clienteId);
    }
    if (fechaInicio || fechaFin) {
      where.fechaVenta = {};
      if (fechaInicio) {
        where.fechaVenta.gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        where.fechaVenta.lte = new Date(fechaFin);
      }
    }

    const ventas = await prisma.venta.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        cliente: {
          select: { id: true, nombre: true, documento: true, email: true },
        },
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        detalles: {
          include: {
            producto: {
              select: { id: true, codigo: true, nombre: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.venta.count({ where });

    res.json({
      success: true,
      data: ventas,
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
// OBTENER VENTA POR ID
// ============================================
const obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: true,
        usuario: {
          select: { id: true, nombre: true, email: true, rol: true },
        },
        detalles: {
          include: {
            producto: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                precioBase: true,
                ivaIncluido: true,
                porcentajeIva: true,
              },
            },
          },
        },
      },
    });

    if (!venta) {
      return res.status(404).json({
        error: true,
        message: "Venta no encontrada",
      });
    }

    res.json({
      success: true,
      data: venta,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVA VENTA
// ============================================
const crearVenta = async (req, res) => {
  try {
    const { clienteId, detalles, observaciones } = req.body;
    const usuarioId = req.user.id;

    // Validaciones
    if (!clienteId || !detalles || detalles.length === 0) {
      return res.status(400).json({
        error: true,
        message: "ClienteId y detalles son requeridos",
      });
    }

    // Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(clienteId) },
    });

    if (!cliente) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    // Calcular totales y validar productos
    let subtotal = 0;
    let totalIva = 0;
    const detallesProcessados = [];

    for (const detalle of detalles) {
      const { productoId, cantidad, precioUnit, descuento = 0 } = detalle;

      if (!productoId || !cantidad || !precioUnit) {
        return res.status(400).json({
          error: true,
          message: "Cada detalle debe tener productoId, cantidad y precioUnit",
        });
      }

      // Verificar que el producto existe
      const producto = await prisma.producto.findUnique({
        where: { id: parseInt(productoId) },
      });

      if (!producto) {
        return res.status(404).json({
          error: true,
          message: `Producto con ID ${productoId} no encontrado`,
        });
      }

      // Verificar stock
      if (producto.stockActual < parseInt(cantidad)) {
        return res.status(400).json({
          error: true,
          message: `Stock insuficiente para el producto ${producto.nombre}`,
        });
      }

      // Calcular subtotal sin IVA
      const subtotalDetalle =
        parseFloat(precioUnit) * parseInt(cantidad) - parseFloat(descuento);

      // Calcular IVA
      const ivaDetalle = producto.ivaIncluido
        ? (subtotalDetalle * producto.porcentajeIva) /
          (100 + producto.porcentajeIva)
        : (subtotalDetalle * producto.porcentajeIva) / 100;

      subtotal += subtotalDetalle;
      totalIva += ivaDetalle;

      detallesProcessados.push({
        productoId: parseInt(productoId),
        cantidad: parseInt(cantidad),
        precioUnit: parseFloat(precioUnit),
        descuento: parseFloat(descuento),
        iva: ivaDetalle,
        subtotal: subtotalDetalle,
      });
    }

    const total = subtotal + totalIva;

    // Generar número de factura único
    const numeroFactura = `FAC-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Crear la venta
    const venta = await prisma.venta.create({
      data: {
        numeroFactura,
        clienteId: parseInt(clienteId),
        usuarioId,
        subtotal: new Decimal(subtotal.toFixed(2)),
        iva: new Decimal(totalIva.toFixed(2)),
        total: new Decimal(total.toFixed(2)),
        estado: "completada",
        observaciones,
        detalles: {
          create: detallesProcessados,
        },
      },
      include: {
        cliente: true,
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
        detalles: {
          include: {
            producto: {
              select: { id: true, codigo: true, nombre: true },
            },
          },
        },
      },
    });

    // Actualizar stock de los productos
    for (const detalle of detallesProcessados) {
      const producto = await prisma.producto.findUnique({
        where: { id: detalle.productoId },
      });

      await prisma.producto.update({
        where: { id: detalle.productoId },
        data: {
          stockActual: producto.stockActual - detalle.cantidad,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Venta creada exitosamente",
      data: venta,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CANCELAR VENTA
// ============================================
const cancelarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const venta = await prisma.venta.findUnique({
      where: { id: parseInt(id) },
      include: { detalles: true },
    });

    if (!venta) {
      return res.status(404).json({
        error: true,
        message: "Venta no encontrada",
      });
    }

    if (venta.estado === "cancelada") {
      return res.status(400).json({
        error: true,
        message: "La venta ya está cancelada",
      });
    }

    // Revertir stock
    for (const detalle of venta.detalles) {
      const producto = await prisma.producto.findUnique({
        where: { id: detalle.productoId },
      });

      await prisma.producto.update({
        where: { id: detalle.productoId },
        data: {
          stockActual: producto.stockActual + detalle.cantidad,
        },
      });
    }

    // Actualizar estado de la venta
    const ventaCancelada = await prisma.venta.update({
      where: { id: parseInt(id) },
      data: {
        estado: "cancelada",
        observaciones: `CANCELADA - ${motivo || "Sin motivo especificado"}`,
      },
    });

    res.json({
      success: true,
      message: "Venta cancelada exitosamente",
      data: ventaCancelada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// OBTENER RESUMEN DE VENTAS
// ============================================
const obtenerResumenVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const where = {};
    if (fechaInicio || fechaFin) {
      where.fechaVenta = {};
      if (fechaInicio) {
        where.fechaVenta.gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        where.fechaVenta.lte = new Date(fechaFin);
      }
    }
    where.estado = "completada";

    const ventas = await prisma.venta.findMany({
      where,
      include: { detalles: true },
    });

    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const totalIva = ventas.reduce((sum, v) => sum + parseFloat(v.iva), 0);
    const totalSubtotal = ventas.reduce(
      (sum, v) => sum + parseFloat(v.subtotal),
      0
    );

    res.json({
      success: true,
      data: {
        totalVentas,
        totalMonto: parseFloat(totalMonto.toFixed(2)),
        totalSubtotal: parseFloat(totalSubtotal.toFixed(2)),
        totalIva: parseFloat(totalIva.toFixed(2)),
        promedioPorVenta:
          totalVentas > 0
            ? parseFloat((totalMonto / totalVentas).toFixed(2))
            : 0,
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
// OBTENER VENTAS POR CLIENTE
// ============================================
const obtenerVentasPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const ventas = await prisma.venta.findMany({
      where: { clienteId: parseInt(clienteId) },
      include: {
        detalles: {
          include: {
            producto: {
              select: { id: true, codigo: true, nombre: true },
            },
          },
        },
      },
      orderBy: { fechaVenta: "desc" },
    });

    res.json({
      success: true,
      data: ventas,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  cancelarVenta,
  obtenerResumenVentas,
  obtenerVentasPorCliente,
};
