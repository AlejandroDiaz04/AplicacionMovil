const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Inicializar Prisma
const prisma = new PrismaClient();

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Permitir peticiones desde cualquier origen (cambiar en producción)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Parsear JSON
app.use(express.json());

// Parsear URL encoded
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS DE PRUEBA
// ============================================

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando correctamente",
    timestamp: new Date(),
    database: "Connected",
  });
});

// API Info
app.get("/api", (req, res) => {
  res.json({
    name: "Sistema de Gestión de Negocio",
    version: "1.0.0",
    author: "Alejandro Díaz",
    endpoints: {
      health: "/health",
      clientes: "/api/clientes",
      productos: "/api/productos",
      precios: "/api/precios",
      ventas: "/api/ventas",
    },
  });
});

// ============================================
// IMPORTAR RUTAS
// ============================================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/precios", require("./routes/precios"));
app.use("/api/ventas", require("./routes/ventas"));
app.use("/api/reportes", require("./routes/reportes"));
app.use("/api/auditoria", require("./routes/auditoria"));
// TODO: Importar rutas cuando las creemos
// app.use('/api/clientes', require('./routes/clientes'));
// app.use('/api/productos', require('./routes/productos'));
// app.use('/api/precios', require('./routes/precios'));
// app.use('/api/ventas', require('./routes/ventas'));

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Error interno del servidor",
    status: err.status || 500,
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 SERVIDOR INICIADO CORRECTAMENTE        ║
╠════════════════════════════════════════════╣
║  Puerto: ${PORT}                           ║
║  URL: http://localhost:${PORT}            ║
║  Health: http://localhost:${PORT}/health  ║
╚════════════════════════════════════════════╝
  `);
});

// Manejar cierre gracioso
process.on("SIGINT", async () => {
  console.log("\n\nCerrando servidor...");
  await prisma.$disconnect();
  process.exit(0);
});
