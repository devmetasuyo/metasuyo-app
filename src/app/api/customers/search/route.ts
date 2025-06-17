import { prisma } from "@/utils/prismaClient";
import { Prisma } from "@prisma/client";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  try {
    const customers = await prisma.clientes.findMany({
      where: {
        OR: [{ nombre: { contains: name } }],
      },
    });

    return Response.json(
      { customers, status: "success" },
      {
        status: 200,
      }
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return Response.json(
        { error: e.message, status: "error" },
        {
          status: 500,
          statusText: "Error en la inicialización de la base de datos",
        }
      );
    }

    return Response.json(
      { error: JSON.stringify(e), status: "error" },
      {
        status: 500,
        statusText: "Error en la inicialización de la base de datos",
      }
    );
  }
};
