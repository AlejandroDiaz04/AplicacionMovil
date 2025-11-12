const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const usuarios = await prisma.usuario.findMany();

    console.log(" Usuarios en la base de datos:");
    console.table(usuarios);

    usuarios.forEach((u) => {
      console.log(`ID: ${u.id}, Email: "${u.email}", Nombre: "${u.nombre}"`);
    });
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
