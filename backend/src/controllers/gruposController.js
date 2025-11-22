const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// OBTENER TODOS LOS GRUPOS
// ============================================
const obtenerGrupos = async (req, res) => {
  try {
    const { skip = 0, take = 1000, isDeleted = false } = req.query;

    const where = {
      isDeleted: isDeleted === "true",
    };

    const grupos = await prisma.grupo.findMany({
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

    const total = await prisma.grupo.count({ where });

    res.json({
      success: true,
      data: grupos,
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
// OBTENER GRUPO POR ID
// ============================================
const obtenerGrupoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const grupo = await prisma.grupo.findUnique({
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

    if (!grupo) {
      return res.status(404).json({
        error: true,
        message: "Grupo no encontrado",
      });
    }

    res.json({
      success: true,
      data: grupo,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CREAR NUEVO GRUPO
// ============================================
const crearGrupo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({
        error: true,
        message: "El nombre del grupo es requerido",
      });
    }

    const grupo = await prisma.grupo.create({
      data: {
        nombre,
        descripcion,
      },
    });

    res.status(201).json({
      success: true,
      message: "Grupo creado exitosamente",
      data: grupo,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ACTUALIZAR GRUPO
// ============================================
const actualizarGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const grupoExiste = await prisma.grupo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!grupoExiste) {
      return res.status(404).json({
        error: true,
        message: "Grupo no encontrado",
      });
    }

    const grupoActualizado = await prisma.grupo.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
      },
    });

    res.json({
      success: true,
      message: "Grupo actualizado exitosamente",
      data: grupoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// ELIMINAR GRUPO (Lógico)
// ============================================
const eliminarGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    const grupoExiste = await prisma.grupo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!grupoExiste) {
      return res.status(404).json({
        error: true,
        message: "Grupo no encontrado",
      });
    }

    // Eliminación lógica (soft delete)
    const grupoEliminado = await prisma.grupo.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    res.json({
      success: true,
      message: "Grupo eliminado exitosamente",
      data: grupoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  obtenerGrupos,
  obtenerGrupoPorId,
  crearGrupo,
  actualizarGrupo,
  eliminarGrupo,
};
