import { prisma } from "@/utils/prismaClient";
import { revalidatePath } from "next/cache";

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
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
      
      // Revalidar la página del Shop para mostrar el nuevo producto inmediatamente
      revalidatePath("/Shop");
      
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

    // Revalidar la página del Shop para mostrar los cambios inmediatamente
    revalidatePath("/Shop");

    return Response.json({ product: newProduct, status: "success" });
  } catch (error) {
    console.error("[API][products] Error:", error);
    return Response.json(
      { error: "Error al procesar el producto", status: "error" },
      { status: 500 }
    );
  }
};
