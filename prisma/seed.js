const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.clientes.createMany({
      data: [],
    });
    await prisma.productos.createMany({
      data: [],
    });
    await prisma.facturas.createMany({
      data: [],
    });

    await prisma.productos_en_factura.createMany({
      data: [],
    });
  } catch (e) {
    console.error(e);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
