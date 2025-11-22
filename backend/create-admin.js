const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash("administrador123", 10);

    console.log("🔐 Contraseña encriptada:", passwordHash);

    // Crear el usuario administrador
    const usuario = await prisma.usuario.create({
      data: {
        nombre: "Alejandro",
        email: "alejandrodiaz04zr@gmail.com",
        passwordHash: passwordHash,
        rol: "admin",
        isDeleted: false,
      },
    });

    console.log("✅ Usuario administrador creado exitosamente:");
    console.table(usuario);

    console.log("\n📋 Credenciales de login:");
    console.log("   Email:", usuario.email);
    console.log("   Contraseña: administrador123");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
