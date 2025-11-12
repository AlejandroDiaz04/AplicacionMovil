const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

// Login
router.post("/login", authController.login);

// Registrar nuevo usuario
router.post("/registrar", authController.registrar);

// Obtener perfil (requiere autenticación)
router.get("/perfil", authenticateToken, authController.obtenerPerfil);

// Cambiar contraseña (requiere autenticación)
router.post(
  "/cambiar-contrasena",
  authenticateToken,
  authController.cambiarContrasena
);

// Logout
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
