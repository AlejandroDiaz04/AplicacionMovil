const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// REPORTES POR PERÍODO (Día, Mes, Año)
// ============================================
const obtenerReporteVentasPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validaciones
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: true,
        message: "fechaInicio y fechaFin son requeridos (formato: YYYY-MM-DD)",
      });
    }

    const inicio = new Date(`${fechaInicio}T00:00:00Z`);
    const fin = new Date(`${fechaFin}T23:59:59Z`);

    // Obtener todas las ventas en el período
    const ventas = await prisma.venta.findMany({
      where: {
        fechaVenta: {
          gte: inicio,
          lte: fin,
        },
        estado: "completada",
      },
      include: {
        detalles: true,
        cliente: true,
        usuario: true,
      },
    });

    // Calcular totales
    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const totalSubtotal = ventas.reduce(
      (sum, v) => sum + parseFloat(v.subtotal),
      0
    );
    const totalIva = ventas.reduce((sum, v) => sum + parseFloat(v.iva), 0);
    const promedioPorVenta = totalVentas > 0 ? totalMonto / totalVentas : 0;

    // Contar por estado
    const ventasCompletadas = ventas.filter(
      (v) => v.estado === "completada"
    ).length;
    const ventasCanceladas = await prisma.venta.count({
      where: {
        fechaVenta: { gte: inicio, lte: fin },
        estado: "cancelada",
      },
    });
    const ventasPendientes = await prisma.venta.count({
      where: {
        fechaVenta: { gte: inicio, lte: fin },
        estado: "pendiente",
      },
    });

    res.json({
      success: true,
      tipo_reporte: "ventas_periodo",
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin,
        dias: Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)),
      },
      resumen: {
        total_ventas: totalVentas,
        monto_total: parseFloat(totalMonto.toFixed(2)),
        subtotal: parseFloat(totalSubtotal.toFixed(2)),
        iva_total: parseFloat(totalIva.toFixed(2)),
        promedio_por_venta: parseFloat(promedioPorVenta.toFixed(2)),
      },
      desglose: {
        completadas: ventasCompletadas,
        canceladas: ventasCanceladas,
        pendientes: ventasPendientes,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// REPORTES DIARIOS
// ============================================
const obtenerReporteVentasDiarias = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        error: true,
        message: "fechaInicio y fechaFin son requeridos",
      });
    }

    const inicio = new Date(`${fechaInicio}T00:00:00Z`);
    const fin = new Date(`${fechaFin}T23:59:59Z`);

    const ventas = await prisma.venta.findMany({
      where: {
        fechaVenta: {
          gte: inicio,
          lte: fin,
        },
        estado: "completada",
      },
      include: { detalles: true },
    });

    // Agrupar por día
    const reportePorDia = {};

    ventas.forEach((venta) => {
      const fecha = venta.fechaVenta.toISOString().split("T")[0];

      if (!reportePorDia[fecha]) {
        reportePorDia[fecha] = {
          fecha,
          ventas: 0,
          monto: 0,
          iva: 0,
          productos_vendidos: 0,
        };
      }

      reportePorDia[fecha].ventas += 1;
      reportePorDia[fecha].monto += parseFloat(venta.total);
      reportePorDia[fecha].iva += parseFloat(venta.iva);
      reportePorDia[fecha].productos_vendidos += venta.detalles.reduce(
        (sum, d) => sum + d.cantidad,
        0
      );
    });

    // Convertir a array y ordenar
    const datos = Object.values(reportePorDia).sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );

    // Calcular totales
    const totalVentas = datos.reduce((sum, d) => sum + d.ventas, 0);
    const totalMonto = datos.reduce((sum, d) => sum + d.monto, 0);
    const totalProductos = datos.reduce(
      (sum, d) => sum + d.productos_vendidos,
      0
    );

    res.json({
      success: true,
      tipo_reporte: "ventas_diarias",
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin,
      },
      resumen: {
        total_ventas: totalVentas,
        monto_total: parseFloat(totalMonto.toFixed(2)),
        promedio_diario:
          datos.length > 0
            ? parseFloat((totalMonto / datos.length).toFixed(2))
            : 0,
        total_productos: totalProductos,
      },
      datos: datos.map((d) => ({
        ...d,
        monto: parseFloat(d.monto.toFixed(2)),
        iva: parseFloat(d.iva.toFixed(2)),
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// TOP 10 PRODUCTOS MÁS VENDIDOS
// ============================================
const obtenerTopProductos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limite = 10 } = req.query;

    const where = {};
    if (fechaInicio && fechaFin) {
      const inicio = new Date(`${fechaInicio}T00:00:00Z`);
      const fin = new Date(`${fechaFin}T23:59:59Z`);
      where.venta = {
        fechaVenta: {
          gte: inicio,
          lte: fin,
        },
        estado: "completada",
      };
    } else {
      where.venta = {
        estado: "completada",
      };
    }

    // Obtener detalles de ventas agrupados por producto
    const detalles = await prisma.detalleVenta.findMany({
      where,
      include: {
        producto: true,
      },
    });

    // Agrupar por producto
    const productoMap = {};

    detalles.forEach((detalle) => {
      const prodId = detalle.producto.id;

      if (!productoMap[prodId]) {
        productoMap[prodId] = {
          id: detalle.producto.id,
          codigo: detalle.producto.codigo,
          nombre: detalle.producto.nombre,
          cantidad: 0,
          monto: 0,
          promedio_precio: 0,
        };
      }

      productoMap[prodId].cantidad += detalle.cantidad;
      productoMap[prodId].monto += parseFloat(detalle.subtotal);
    });

    // Convertir a array y ordenar por cantidad
    const productos = Object.values(productoMap)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, parseInt(limite));

    // Calcular porcentajes
    const totalMonto = productos.reduce((sum, p) => sum + p.monto, 0);
    const datos = productos.map((p, index) => ({
      ranking: index + 1,
      ...p,
      monto: parseFloat(p.monto.toFixed(2)),
      porcentaje:
        totalMonto > 0
          ? parseFloat(((p.monto / totalMonto) * 100).toFixed(2))
          : 0,
    }));

    res.json({
      success: true,
      tipo_reporte: "top_productos",
      periodo: {
        inicio: fechaInicio || "Inicio de registros",
        fin: fechaFin || "Hoy",
      },
      resumen: {
        total_productos: datos.length,
        total_vendido: parseFloat(totalMonto.toFixed(2)),
        total_unidades: datos.reduce((sum, p) => sum + p.cantidad, 0),
      },
      datos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// TOP CLIENTES
// ============================================
const obtenerTopClientes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limite = 10 } = req.query;

    const where = {
      estado: "completada",
    };

    if (fechaInicio && fechaFin) {
      const inicio = new Date(`${fechaInicio}T00:00:00Z`);
      const fin = new Date(`${fechaFin}T23:59:59Z`);
      where.fechaVenta = {
        gte: inicio,
        lte: fin,
      };
    }

    // Obtener ventas agrupadas por cliente
    const ventas = await prisma.venta.findMany({
      where,
      include: {
        cliente: true,
      },
    });

    // Agrupar por cliente
    const clienteMap = {};

    ventas.forEach((venta) => {
      const clienteId = venta.cliente.id;

      if (!clienteMap[clienteId]) {
        clienteMap[clienteId] = {
          id: venta.cliente.id,
          nombre: venta.cliente.nombre,
          documento: venta.cliente.documento,
          compras: 0,
          monto_total: 0,
        };
      }

      clienteMap[clienteId].compras += 1;
      clienteMap[clienteId].monto_total += parseFloat(venta.total);
    });

    // Convertir a array y ordenar por monto
    const clientes = Object.values(clienteMap)
      .sort((a, b) => b.monto_total - a.monto_total)
      .slice(0, parseInt(limite));

    const totalMonto = clientes.reduce((sum, c) => sum + c.monto_total, 0);
    const datos = clientes.map((c, index) => ({
      ranking: index + 1,
      ...c,
      monto_total: parseFloat(c.monto_total.toFixed(2)),
      promedio_compra: parseFloat((c.monto_total / c.compras).toFixed(2)),
      porcentaje:
        totalMonto > 0
          ? parseFloat(((c.monto_total / totalMonto) * 100).toFixed(2))
          : 0,
    }));

    res.json({
      success: true,
      tipo_reporte: "top_clientes",
      periodo: {
        inicio: fechaInicio || "Inicio de registros",
        fin: fechaFin || "Hoy",
      },
      resumen: {
        total_clientes: datos.length,
        monto_total: parseFloat(totalMonto.toFixed(2)),
        promedio_cliente:
          datos.length > 0
            ? parseFloat((totalMonto / datos.length).toFixed(2))
            : 0,
      },
      datos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// DESEMPEÑO DE VENDEDORES
// ============================================
const obtenerDesempenoVendedores = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const where = {
      estado: "completada",
    };

    if (fechaInicio && fechaFin) {
      const inicio = new Date(`${fechaInicio}T00:00:00Z`);
      const fin = new Date(`${fechaFin}T23:59:59Z`);
      where.fechaVenta = {
        gte: inicio,
        lte: fin,
      };
    }

    // Obtener ventas agrupadas por vendedor
    const ventas = await prisma.venta.findMany({
      where,
      include: {
        usuario: true,
      },
    });

    // Agrupar por vendedor
    const vendedorMap = {};

    ventas.forEach((venta) => {
      const vendedorId = venta.usuario.id;

      if (!vendedorMap[vendedorId]) {
        vendedorMap[vendedorId] = {
          id: venta.usuario.id,
          nombre: venta.usuario.nombre,
          email: venta.usuario.email,
          total_ventas: 0,
          monto_total: 0,
        };
      }

      vendedorMap[vendedorId].total_ventas += 1;
      vendedorMap[vendedorId].monto_total += parseFloat(venta.total);
    });

    // Convertir a array y ordenar por monto
    const vendedores = Object.values(vendedorMap).sort(
      (a, b) => b.monto_total - a.monto_total
    );

    const totalMonto = vendedores.reduce((sum, v) => sum + v.monto_total, 0);
    const datos = vendedores.map((v, index) => ({
      ranking: index + 1,
      ...v,
      monto_total: parseFloat(v.monto_total.toFixed(2)),
      promedio_venta: parseFloat((v.monto_total / v.total_ventas).toFixed(2)),
      porcentaje:
        totalMonto > 0
          ? parseFloat(((v.monto_total / totalMonto) * 100).toFixed(2))
          : 0,
    }));

    res.json({
      success: true,
      tipo_reporte: "desempeño_vendedores",
      periodo: {
        inicio: fechaInicio || "Inicio de registros",
        fin: fechaFin || "Hoy",
      },
      resumen: {
        total_vendedores: datos.length,
        monto_total: parseFloat(totalMonto.toFixed(2)),
        promedio_vendedor:
          datos.length > 0
            ? parseFloat((totalMonto / datos.length).toFixed(2))
            : 0,
      },
      datos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ESTADO DE INVENTARIO
// ============================================
const obtenerReporteInventario = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: { activo: true },
      include: {
        categoria: true,
      },
    });

    let productosBajoStock = 0;
    let productosAgotados = 0;
    let totalValorInventario = 0;

    const datos = productos.map((p) => {
      const precioBase = parseFloat(p.precioBase);
      const valorInventario = precioBase * p.stockActual;
      totalValorInventario += valorInventario;

      let estado = "✅ OK";
      if (p.stockActual === 0) {
        estado = "❌ AGOTADO";
        productosAgotados += 1;
      } else if (p.stockActual < p.stockMinimo) {
        estado = "⚠️ BAJO";
        productosBajoStock += 1;
      }

      return {
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        categoria: p.categoria?.nombre || "Sin categoría",
        stock_actual: p.stockActual,
        stock_minimo: p.stockMinimo,
        precio_base: parseFloat(p.precioBase),
        valor_inventario: parseFloat(valorInventario.toFixed(2)),
        estado,
      };
    });

    res.json({
      success: true,
      tipo_reporte: "inventario",
      resumen: {
        total_productos: productos.length,
        bajo_stock: productosBajoStock,
        agotados: productosAgotados,
        total_valor_inventario: parseFloat(totalValorInventario.toFixed(2)),
      },
      datos: datos.sort((a, b) => b.valor_inventario - a.valor_inventario),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// DASHBOARD GENERAL
// ============================================
const obtenerDashboard = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const where = {
      estado: "completada",
    };

    if (fechaInicio && fechaFin) {
      const inicio = new Date(`${fechaInicio}T00:00:00Z`);
      const fin = new Date(`${fechaFin}T23:59:59Z`);
      where.fechaVenta = {
        gte: inicio,
        lte: fin,
      };
    }

    // Obtener datos para el dashboard
    const ventas = await prisma.venta.findMany({
      where,
      include: {
        detalles: true,
        cliente: true,
        usuario: true,
      },
    });

    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const totalProductos = ventas.reduce(
      (sum, v) => sum + v.detalles.reduce((s, d) => s + d.cantidad, 0),
      0
    );
    const totalClientes = new Set(ventas.map((v) => v.cliente.id)).size;

    // Top 5 productos
    const detalles = ventas.flatMap((v) => v.detalles);
    const productoMap = {};
    detalles.forEach((d) => {
      productoMap[d.productoId] = (productoMap[d.productoId] || 0) + d.cantidad;
    });
    const topProductos = Object.entries(productoMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    res.json({
      success: true,
      tipo_reporte: "dashboard",
      periodo: {
        inicio: fechaInicio || "Inicio de registros",
        fin: fechaFin || "Hoy",
      },
      metricas_principales: {
        total_ventas: totalVentas,
        monto_total: parseFloat(totalMonto.toFixed(2)),
        total_productos_vendidos: totalProductos,
        total_clientes: totalClientes,
        promedio_venta:
          totalVentas > 0
            ? parseFloat((totalMonto / totalVentas).toFixed(2))
            : 0,
      },
      top_5_productos: topProductos,
      estado_inventario: {
        productos_bajo_stock: await prisma.producto.count({
          where: {
            stockActual: {
              lt: prisma.producto.fields.stockMinimo,
            },
          },
        }),
        productos_agotados: await prisma.producto.count({
          where: { stockActual: 0 },
        }),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerReporteVentasPeriodo,
  obtenerReporteVentasDiarias,
  obtenerTopProductos,
  obtenerTopClientes,
  obtenerDesempenoVendedores,
  obtenerReporteInventario,
  obtenerDashboard,
};
