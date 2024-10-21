import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.clientes.createMany({
    data: [
      {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juan.perez@email.com",
        telefono: "123456789",
        direccion: "Calle Falsa 123, Ciudad A",
      },
      {
        id: 2,
        nombre: "María López",
        correo: "maria.lopez@email.com",
        telefono: "987654321",
        direccion: "Avenida Siempreviva 456, Ciudad B",
      },
      {
        id: 3,
        nombre: "Carlos Rodríguez",
        correo: "carlos.rod@example.com",
        telefono: "654321987",
        direccion: "Calle Real 789, Ciudad C",
      },
    ],
  });

  await prisma.productos.createMany({
    data: [
      {
        id: 1,
        nombre: "Laptop X100",
        categoria: "Electrónica",
        precio: "999.99",
        descripcion: "Laptop de alto rendimiento con 16GB de RAM y 512GB SSD.",
      },
      {
        id: 2,
        nombre: "Smartphone A10",
        categoria: "Electrónica",
        precio: "499.99",
        descripcion:
          "Modelo más reciente con pantalla de 6.5 pulgadas y 128GB de almacenamiento.",
      },
      {
        id: 3,
        nombre: "Auriculares Bluetooth",
        categoria: "Audio",
        precio: "79.99",
        descripcion: "Auriculares con cancelación de ruido y Bluetooth 5.0.",
      },
      {
        id: 4,
        nombre: "Ratón Gaming G5",
        categoria: "Accesorios",
        precio: "29.99",
        descripcion: "Ratón ergonómico con DPI ajustable.",
      },
      {
        id: 5,
        nombre: "Monitor 4K UltraView",
        categoria: "Electrónica",
        precio: "299.99",
        descripcion: "Monitor 4K de 27 pulgadas con soporte HDR.",
      },
      {
        id: 6,
        nombre: "Teclado Mecánico MK720",
        categoria: "Accesorios",
        precio: "89.99",
        descripcion: "Teclado mecánico RGB con interruptores Cherry MX.",
      },
    ],
  });

  await prisma.facturas.createMany({
    data: [
      {
        id: 1,
        cliente_id: 1,
        fecha: "2024-10-19T16:08:45.602Z",
        total: "1529.97",
        estado: "aprobado",
      },
      {
        id: 2,
        cliente_id: 2,
        fecha: "2024-10-19T16:08:45.602Z",
        total: "579.98",
        estado: "aprobado",
      },
    ],
  });

  await prisma.detalle_factura.createMany({
    data: [
      {
        id: 1,
        factura_id: 1,
        producto_id: 1,
        cantidad: 1,
        precio_unitario: "999.99",
      },
      {
        id: 2,
        factura_id: 1,
        producto_id: 5,
        cantidad: 1,
        precio_unitario: "299.99",
      },
      {
        id: 3,
        factura_id: 2,
        producto_id: 2,
        cantidad: 1,
        precio_unitario: "499.99",
      },
      {
        id: 4,
        factura_id: 2,
        producto_id: 4,
        cantidad: 1,
        precio_unitario: "29.99",
      },
    ],
  });
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
