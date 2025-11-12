const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================
const obtenerCategorias = async (req, res) => {
  try {
    const { skip = 0, take = 10, activo } = req.query;

    const where = {};
    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    const categorias = await prisma.categoria.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.categoria.count({ where });

    res.json({
      success: true,
      data: categorias,
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
// OBTENER CATEGORÍA POR ID
// ============================================
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: {
        productos: {
          where: { activo: true },
          select: {
            id: true,
            codigo: true,
            nombre: true,
            precioBase: true,
            stockActual: true,
          },
        },
      },
    });

    if (!categoria) {
      return res.status(404).json({
        error: true,
        message: "Categoría no encontrada",
      });
    }

    res.json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVA CATEGORÍA
// ============================================
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({
        error: true,
        message: "El nombre de la categoría es requerido",
      });
    }

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        descripcion,
      },
    });

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: categoria,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR CATEGORÍA
// ============================================
const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoriaExiste) {
      return res.status(404).json({
        error: true,
        message: "Categoría no encontrada",
      });
    }

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        activo,
      },
    });

    res.json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoriaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR CATEGORÍA (Lógico)
// ============================================
const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoriaExiste = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoriaExiste) {
      return res.status(404).json({
        error: true,
        message: "Categoría no encontrada",
      });
    }

    // Eliminación lógica (soft delete)
    const categoriaEliminada = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });

    res.json({
      success: true,
      message: "Categoría desactivada exitosamente",
      data: categoriaEliminada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
