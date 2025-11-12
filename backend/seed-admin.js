const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // CAMBIA ESTO CON EL EMAIL EXACTO QUE VISTE EN LA TABLA
    const emailCorrecto = "alejandrodiaz04zr@gmail.com"; // Reemplaza si es diferente

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash("administrador123", 10);

    console.log("Contraseña encriptada:", passwordHash);

    // Actualizar el usuario
    const usuario = await prisma.usuario.update({
      where: { email: emailCorrecto },
      data: {
        passwordHash: passwordHash,
      },
    });

    console.log(" Usuario actualizado:", usuario);
  } catch (error) {
    console.error(" Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
