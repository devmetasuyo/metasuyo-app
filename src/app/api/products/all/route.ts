import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";

export const GET = async () => {
  try {
    const products = await prisma.productos.findMany();
    return Response.json({ products });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return Response.json({ error: e.message, code: e.code },{
        status: 500,
        statusText: "Error en la petición"
      });
    }

    if (e instanceof Prisma.PrismaClientInitializationError) {
      return Response.json({ error: e.message, code: e.name },{
        status: 500,
        statusText: "Error en la inicialización de la base de datos"
      });
    }
  }
};