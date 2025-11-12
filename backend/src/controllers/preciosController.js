const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODAS LAS LISTAS DE PRECIOS
// ============================================
const obtenerListasPrecios = async (req, res) => {
  try {
    const { skip = 0, take = 10, activo } = req.query;

    const where = {};
    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    const listas = await prisma.listaPrecios.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        _count: {
          select: { precios: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.listaPrecios.count({ where });

    res.json({
      success: true,
      data: listas,
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
// OBTENER LISTA DE PRECIOS POR ID
// ============================================
const obtenerListaPreciosPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await prisma.listaPrecios.findUnique({
      where: { id: parseInt(id) },
      include: {
        precios: {
          include: {
            producto: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                precioBase: true,
              },
            },
          },
        },
      },
    });

    if (!lista) {
      return res.status(404).json({
        error: true,
        message: "Lista de precios no encontrada",
      });
    }

    res.json({
      success: true,
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVA LISTA DE PRECIOS
// ============================================
const crearListaPrecios = async (req, res) => {
  try {
    const { nombre, descripcion, descuentoPorcentaje = 0 } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({
        error: true,
        message: "El nombre de la lista es requerido",
      });
    }

    const lista = await prisma.listaPrecios.create({
      data: {
        nombre,
        descripcion,
        descuentoPorcentaje: parseFloat(descuentoPorcentaje),
      },
    });

    res.status(201).json({
      success: true,
      message: "Lista de precios creada exitosamente",
      data: lista,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR LISTA DE PRECIOS
// ============================================
const actualizarListaPrecios = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, descuentoPorcentaje, activo } = req.body;

    const listaExiste = await prisma.listaPrecios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!listaExiste) {
      return res.status(404).json({
        error: true,
        message: "Lista de precios no encontrada",
      });
    }

    const listaActualizada = await prisma.listaPrecios.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        descuentoPorcentaje:
          descuentoPorcentaje !== undefined
            ? parseFloat(descuentoPorcentaje)
            : undefined,
        activo,
      },
    });

    res.json({
      success: true,
      message: "Lista de precios actualizada exitosamente",
      data: listaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR LISTA DE PRECIOS (Lógico)
// ============================================
const eliminarListaPrecios = async (req, res) => {
  try {
    const { id } = req.params;

    const listaExiste = await prisma.listaPrecios.findUnique({
      where: { id: parseInt(id) },
    });

    if (!listaExiste) {
      return res.status(404).json({
        error: true,
        message: "Lista de precios no encontrada",
      });
    }

    // Eliminación lógica (soft delete)
    const listaEliminada = await prisma.listaPrecios.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: "Lista de precios desactivada exitosamente",
      data: listaEliminada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ASIGNAR PRECIO A PRODUCTO EN LISTA
// ============================================
const asignarPrecioProducto = async (req, res) => {
  try {
    const { listaPreciosId, productoId, precioVenta } = req.body;

    // Validaciones
    if (!listaPreciosId || !productoId || precioVenta === undefined) {
      return res.status(400).json({
        error: true,
        message: "ListaPreciosId, productoId y precioVenta son requeridos",
      });
    }

    // Verificar que existan la lista y el producto
    const lista = await prisma.listaPrecios.findUnique({
      where: { id: parseInt(listaPreciosId) },
    });

    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(productoId) },
    });

    if (!lista || !producto) {
      return res.status(404).json({
        error: true,
        message: "Lista de precios o producto no encontrado",
      });
    }

    // Verificar si ya existe el precio
    const precioExistente = await prisma.precio.findUnique({
      where: {
        listaPreciosId_productoId: {
          listaPreciosId: parseInt(listaPreciosId),
          productoId: parseInt(productoId),
        },
      },
    });

    let precio;

    if (precioExistente) {
      // Actualizar precio existente
      precio = await prisma.precio.update({
        where: {
          listaPreciosId_productoId: {
            listaPreciosId: parseInt(listaPreciosId),
            productoId: parseInt(productoId),
          },
        },
        data: {
          precioVenta: parseFloat(precioVenta),
        },
        include: {
          producto: { select: { nombre: true, codigo: true } },
          listaPrecio: { select: { nombre: true } },
        },
      });

      res.json({
        success: true,
        message: "Precio actualizado exitosamente",
        data: precio,
      });
    } else {
      // Crear nuevo precio
      precio = await prisma.precio.create({
        data: {
          listaPreciosId: parseInt(listaPreciosId),
          productoId: parseInt(productoId),
          precioVenta: parseFloat(precioVenta),
        },
        include: {
          producto: { select: { nombre: true, codigo: true } },
          listaPrecio: { select: { nombre: true } },
        },
      });

      res.status(201).json({
        success: true,
        message: "Precio asignado exitosamente",
        data: precio,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// OBTENER PRECIO DE PRODUCTO EN LISTA
// ============================================
const obtenerPrecioProducto = async (req, res) => {
  try {
    const { productoId, listaPreciosId } = req.query;

    if (!productoId || !listaPreciosId) {
      return res.status(400).json({
        error: true,
        message: "productoId y listaPreciosId son requeridos",
      });
    }

    const precio = await prisma.precio.findUnique({
      where: {
        listaPreciosId_productoId: {
          listaPreciosId: parseInt(listaPreciosId),
          productoId: parseInt(productoId),
        },
      },
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
        listaPrecio: {
          select: {
            id: true,
            nombre: true,
            descuentoPorcentaje: true,
          },
        },
      },
    });

    if (!precio) {
      return res.status(404).json({
        error: true,
        message: "Precio no encontrado",
      });
    }

    res.json({
      success: true,
      data: precio,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// OBTENER TODOS LOS PRECIOS DE UNA LISTA
// ============================================
const obtenerPreciosLista = async (req, res) => {
  try {
    const { listaPreciosId } = req.params;
    const { skip = 0, take = 50 } = req.query;

    const precios = await prisma.precio.findMany({
      where: {
        listaPreciosId: parseInt(listaPreciosId),
      },
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        producto: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            precioBase: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.precio.count({
      where: { listaPreciosId: parseInt(listaPreciosId) },
    });

    res.json({
      success: true,
      data: precios,
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
// ELIMINAR PRECIO
// ============================================
const eliminarPrecio = async (req, res) => {
  try {
    const { listaPreciosId, productoId } = req.params;

    const precioExiste = await prisma.precio.findUnique({
      where: {
        listaPreciosId_productoId: {
          listaPreciosId: parseInt(listaPreciosId),
          productoId: parseInt(productoId),
        },
      },
    });

    if (!precioExiste) {
      return res.status(404).json({
        error: true,
        message: "Precio no encontrado",
      });
    }

    await prisma.precio.delete({
      where: {
        listaPreciosId_productoId: {
          listaPreciosId: parseInt(listaPreciosId),
          productoId: parseInt(productoId),
        },
      },
    });

    res.json({
      success: true,
      message: "Precio eliminado exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerListasPrecios,
  obtenerListaPreciosPorId,
  crearListaPrecios,
  actualizarListaPrecios,
  eliminarListaPrecios,
  asignarPrecioProducto,
  obtenerPrecioProducto,
  obtenerPreciosLista,
  eliminarPrecio,
};
