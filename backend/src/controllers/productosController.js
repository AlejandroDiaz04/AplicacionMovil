const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODOS LOS PRODUCTOS
// ============================================
const obtenerProductos = async (req, res) => {
  try {
    const { skip = 0, take = 10, activo, categoriaId } = req.query;

    const where = {};
    if (activo !== undefined) {
      where.activo = activo === "true";
    }
    if (categoriaId) {
      where.categoriaId = parseInt(categoriaId);
    }

    const productos = await prisma.producto.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        categoria: {
          select: { id: true, nombre: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.producto.count({ where });

    res.json({
      success: true,
      data: productos,
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
// OBTENER PRODUCTO POR ID
// ============================================
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        precios: {
          include: {
            listaPrecio: { select: { id: true, nombre: true } },
          },
        },
      },
    });

    if (!producto) {
      return res.status(404).json({
        error: true,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVO PRODUCTO
// ============================================
const crearProducto = async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      categoriaId,
      unidadMedida = "UNI",
      precioBase,
      ivaIncluido = true,
      porcentajeIva = 10,
      stockMinimo = 0,
    } = req.body;

    // Validaciones
    if (!codigo || !nombre || precioBase === undefined) {
      return res.status(400).json({
        error: true,
        message: "Código, nombre y precio base son requeridos",
      });
    }

    // Verificar si el código ya existe
    const existe = await prisma.producto.findUnique({
      where: { codigo },
    });

    if (existe) {
      return res.status(400).json({
        error: true,
        message: "Ya existe un producto con este código",
      });
    }

    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        descripcion,
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        unidadMedida,
        precioBase: parseFloat(precioBase),
        ivaIncluido,
        porcentajeIva: parseInt(porcentajeIva),
        stockMinimo: parseInt(stockMinimo),
        stockActual: 0,
      },
      include: {
        categoria: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: producto,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR PRODUCTO
// ============================================
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Verificar que el producto existe
    const productoExiste = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExiste) {
      return res.status(404).json({
        error: true,
        message: "Producto no encontrado",
      });
    }

    // Procesar datos numéricos
    if (datos.precioBase) datos.precioBase = parseFloat(datos.precioBase);
    if (datos.porcentajeIva)
      datos.porcentajeIva = parseInt(datos.porcentajeIva);
    if (datos.stockMinimo) datos.stockMinimo = parseInt(datos.stockMinimo);
    if (datos.stockActual) datos.stockActual = parseInt(datos.stockActual);
    if (datos.categoriaId) datos.categoriaId = parseInt(datos.categoriaId);

    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: datos,
      include: {
        categoria: true,
      },
    });

    res.json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR PRODUCTO (Lógico)
// ============================================
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoExiste = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExiste) {
      return res.status(404).json({
        error: true,
        message: "Producto no encontrado",
      });
    }

    // Eliminación lógica (soft delete)
    const productoEliminado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: "Producto desactivado exitosamente",
      data: productoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// BUSCAR PRODUCTO POR CÓDIGO
// ============================================
const buscarProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.query;

    if (!codigo) {
      return res.status(400).json({
        error: true,
        message: "Código de producto requerido",
      });
    }

    const producto = await prisma.producto.findUnique({
      where: { codigo },
      include: {
        categoria: true,
        precios: true,
      },
    });

    if (!producto) {
      return res.status(404).json({
        error: true,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR STOCK
// ============================================
const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, operacion = "sumar" } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({
        error: true,
        message: "Cantidad requerida",
      });
    }

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return res.status(404).json({
        error: true,
        message: "Producto no encontrado",
      });
    }

    let nuevoStock;
    if (operacion === "sumar") {
      nuevoStock = producto.stockActual + parseInt(cantidad);
    } else if (operacion === "restar") {
      nuevoStock = producto.stockActual - parseInt(cantidad);
      if (nuevoStock < 0) {
        return res.status(400).json({
          error: true,
          message: "Stock insuficiente",
        });
      }
    } else {
      nuevoStock = parseInt(cantidad);
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { stockActual: nuevoStock },
    });

    res.json({
      success: true,
      message: `Stock actualizado (${operacion})`,
      data: {
        id: productoActualizado.id,
        nombre: productoActualizado.nombre,
        stockAnterior: producto.stockActual,
        stockNuevo: productoActualizado.stockActual,
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
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProductoPorCodigo,
  actualizarStock,
};
