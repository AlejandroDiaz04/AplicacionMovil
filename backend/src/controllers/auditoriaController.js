const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============================================
// REGISTRAR ACCIÓN EN AUDITORÍA
// ============================================
const registrarAuditoria = async (data) => {
  try {
    await prisma.auditoria.create({
      data: {
        usuarioId: data.usuarioId,
        accion: data.accion,
        tabla: data.tabla,
        registro_id: data.registro_id,
        datos_antes: data.datos_antes,
        datos_despues: data.datos_despues,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
      },
    });
  } catch (error) {
    console.error("Error registrando auditoría:", error);
  }
};

// ============================================
// OBTENER LOG DE AUDITORÍA
// ============================================
const obtenerAuditoria = async (req, res) => {
  try {
    const { skip = 0, take = 50, usuarioId, tabla, accion } = req.query;

    const where = {};
    if (usuarioId) where.usuarioId = parseInt(usuarioId);
    if (tabla) where.tabla = tabla;
    if (accion) where.accion = accion;

    const registros = await prisma.auditoria.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.auditoria.count({ where });

    res.json({
      success: true,
      data: registros,
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
// OBTENER ACTIVIDAD DE USUARIO
// ============================================
const obtenerActividadUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { skip = 0, take = 50 } = req.query;

    const registros = await prisma.auditoria.findMany({
      where: { usuarioId: parseInt(usuarioId) },
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.auditoria.count({
      where: { usuarioId: parseInt(usuarioId) },
    });

    res.json({
      success: true,
      data: registros,
      pagination: {
        total,
        skip: parseInt(skip),
        take: parseInt(take),
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
// OBTENER RESUMEN DE AUDITORÍA POR TABLA
// ============================================
const obtenerResumenAuditoria = async (req, res) => {
  try {
    const resumen = await prisma.auditoria.groupBy({
      by: ["tabla", "accion"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    res.json({
      success: true,
      data: resumen,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  registrarAuditoria,
  obtenerAuditoria,
  obtenerActividadUsuario,
  obtenerResumenAuditoria,
};
