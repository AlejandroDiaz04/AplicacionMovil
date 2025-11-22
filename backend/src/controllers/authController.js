const { PrismaClient } = require("@prisma/client");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");
const prisma = new PrismaClient();

// ============================================
// LOGIN - Obtener Token JWT
// ============================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({
        error: true,
        message: "Credenciales inválidas",
      });
    }

    // Verificar que el usuario no esté eliminado
    if (usuario.isDeleted) {
      return res.status(403).json({
        error: true,
        message: "Usuario desactivado",
      });
    }

    // Comparar contraseñas
    const passwordValida = await comparePassword(
      password,
      usuario.passwordHash
    );

    if (!passwordValida) {
      return res.status(401).json({
        error: true,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
    });

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
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
// REGISTRAR NUEVO USUARIO
// ============================================
const registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol = "vendedor" } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Nombre, email y contraseña son requeridos",
      });
    }

    // Verificar si usuario ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({
        error: true,
        message: "El email ya está registrado",
      });
    }

    // Encriptar contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash,
        rol,
      },
    });

    // Generar token
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.nombre,
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
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
// OBTENER PERFIL DEL USUARIO ACTUAL
// ============================================
const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: true,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
const cambiarContrasena = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuarioId = req.user.id;

    // Validaciones
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        error: true,
        message: "Contraseña actual y nueva son requeridas",
      });
    }

    // Obtener usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      return res.status(404).json({
        error: true,
        message: "Usuario no encontrado",
      });
    }

    // Verificar contraseña actual
    const passwordValida = await comparePassword(
      passwordActual,
      usuario.passwordHash
    );

    if (!passwordValida) {
      return res.status(401).json({
        error: true,
        message: "Contraseña actual incorrecta",
      });
    }

    // Encriptar nueva contraseña
    const nuevoHash = await hashPassword(passwordNueva);

    // Actualizar
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: { passwordHash: nuevoHash },
    });

    res.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// ============================================
// LOGOUT (Opcional - solo en frontend)
// ============================================
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Sesión cerrada. Elimina el token del cliente.",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  registrar,
  obtenerPerfil,
  cambiarContrasena,
  logout,
};
