const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODAS LAS MARCAS
// ============================================
const obtenerMarcas = async (req, res) => {
  try {
    const { skip = 0, take = 1000, isDeleted = false } = req.query;

    const where = {
      isDeleted: isDeleted === "true",
    };

    const marcas = await prisma.marca.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { nombre: "asc" },
    });

    const total = await prisma.marca.count({ where });

    res.json({
      success: true,
      data: marcas,
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
// OBTENER MARCA POR ID
// ============================================
const obtenerMarcaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const marca = await prisma.marca.findUnique({
      where: { id: parseInt(id) },
      include: {
        productos: {
          where: { isDeleted: false },
          select: {
            id: true,
            codigo: true,
            nombre: true,
            stockActual: true,
          },
        },
      },
    });

    if (!marca) {
      return res.status(404).json({
        error: true,
        message: "Marca no encontrada",
      });
    }

    res.json({
      success: true,
      data: marca,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVA MARCA
// ============================================
const crearMarca = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({
        error: true,
        message: "El nombre de la marca es requerido",
      });
    }

    const marca = await prisma.marca.create({
      data: {
        nombre,
        descripcion,
      },
    });

    res.status(201).json({
      success: true,
      message: "Marca creada exitosamente",
      data: marca,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR MARCA
// ============================================
const actualizarMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const marcaExiste = await prisma.marca.findUnique({
      where: { id: parseInt(id) },
    });

    if (!marcaExiste) {
      return res.status(404).json({
        error: true,
        message: "Marca no encontrada",
      });
    }

    const marcaActualizada = await prisma.marca.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
      },
    });

    res.json({
      success: true,
      message: "Marca actualizada exitosamente",
      data: marcaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR MARCA (Lógico)
// ============================================
const eliminarMarca = async (req, res) => {
  try {
    const { id } = req.params;

    const marcaExiste = await prisma.marca.findUnique({
      where: { id: parseInt(id) },
    });

    if (!marcaExiste) {
      return res.status(404).json({
        error: true,
        message: "Marca no encontrada",
      });
    }

    // Eliminación lógica (soft delete)
    const marcaEliminada = await prisma.marca.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: "Marca eliminada exitosamente",
      data: marcaEliminada,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca,
};
