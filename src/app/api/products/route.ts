import { prisma } from "@/utils/prismaClient";

export const POST = async (request: Request) => {
  const data = await request.json();

  if (data.id === "new") {
    const newProduct = await prisma.productos.create({
      data: {
        categoria: data.categoria,
        image: data.image,
        nombre: data.nombre,
        precio: +data.precio,
        cantidad: +data.cantidad,
        descripcion: data.descripcion,
      },
    });
    return Response.json({ product: newProduct, status: "success" });
  }

  const newProduct = await prisma.productos.update({
    where: {
      id: data.id,
    },
    data: {
      categoria: data.categoria,
      image: data.image ?? undefined,
      nombre: data.nombre,
      precio: +data.precio,
      cantidad: +data.cantidad,
      descripcion: data.descripcion,
    },
  });

  return Response.json({ product: newProduct, status: "success" });
};
