// ============================================
// MATRIZ DE PERMISOS POR ROL
// ============================================
const permisos = {
  admin: {
    productos: ["crear", "leer", "actualizar", "eliminar"],
    categorias: ["crear", "leer", "actualizar", "eliminar"],
    precios: ["crear", "leer", "actualizar", "eliminar"],
    clientes: ["crear", "leer", "actualizar", "eliminar"],
    ventas: ["crear", "leer", "actualizar", "eliminar"],
    reportes: ["leer"],
    usuarios: ["crear", "leer", "actualizar", "eliminar"],
    auditoria: ["leer"],
  },
  gerente: {
    productos: ["leer", "actualizar"],
    categorias: ["leer"],
    precios: ["leer", "actualizar"],
    clientes: ["leer", "crear"],
    ventas: ["leer", "actualizar"],
    reportes: ["leer"],
    usuarios: ["leer"],
    auditoria: ["leer"],
  },
  vendedor: {
    productos: ["leer"],
    categorias: ["leer"],
    precios: ["leer"],
    clientes: ["leer", "crear"],
    ventas: ["crear", "leer"],
    reportes: [],
    usuarios: [],
    auditoria: [],
  },
};

// ============================================
// MIDDLEWARE DE AUTORIZACIÓN
// ============================================
const autorizar = (tabla, accion) => {
  return (req, res, next) => {
    const rol = req.user.rol;

    // Admin tiene acceso a todo
    if (rol === "admin") {
      return next();
    }

    // Verificar si el rol tiene permisos para esta tabla y acción
    const rolesPermitidos = permisos[rol];

    if (!rolesPermitidos) {
      return res.status(403).json({
        error: true,
        message: `Rol '${rol}' no reconocido`,
      });
    }

    const accionesPermitidas = rolesPermitidos[tabla];

    if (!accionesPermitidas || !accionesPermitidas.includes(accion)) {
      return res.status(403).json({
        error: true,
        message: `No tienes permiso para ${accion} en ${tabla}`,
        rol,
        tabla,
        accion,
      });
    }

    next();
  };
};

// ============================================
// MIDDLEWARE DE AUDITORIA
// ============================================
const registrarAuditoria = (tabla, accion) => {
  return (req, res, next) => {
    // Guardar información para registrar después
    req.auditoria = {
      tabla,
      accion,
      usuarioId: req.user.id,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get("user-agent"),
      datos_antes: null,
      datos_despues: null,
      registro_id: req.params.id || req.body.id || null,
    };

    next();
  };
};

module.exports = {
  autorizar,
  registrarAuditoria,
  permisos,
};
