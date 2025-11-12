const { verifyToken } = require("../utils/auth");

/**
 * Middleware para verificar que el usuario está autenticado
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Token no proporcionado",
        status: 401,
      });
    }

    // Verificar token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: error.message || "Token inválido",
      status: 403,
    });
  }
};

/**
 * Middleware para verificar permisos de rol
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: "No autenticado",
        status: 401,
      });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        error: true,
        message: "Permiso denegado. Rol requerido: " + allowedRoles.join(", "),
        status: 403,
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
};
