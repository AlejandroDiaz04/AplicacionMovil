const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ============================================
// FUNCIONES DE CONTRASEÑA
// ============================================

/**
 * Encriptar contraseña
 * @param {string} password - Contraseña sin encriptar
 * @returns {Promise<string>} Contraseña encriptada
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Comparar contraseña
 * @param {string} password - Contraseña sin encriptar
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// ============================================
// FUNCIONES DE JWT
// ============================================

/**
 * Generar token JWT
 * @param {object} payload - Datos a incluir en el token
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verificar token JWT
 * @param {string} token - Token a verificar
 * @returns {object} Datos decodificados del token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};

/**
 * Decodificar token sin verificar
 * @param {string} token - Token a decodificar
 * @returns {object} Datos decodificados
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  decodeToken,
};
