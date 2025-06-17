import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "name";

    const customers = await prisma.clientes.findMany({
      where: {
        ...(type === "name"
          ? {
              OR: [
                { nombre: { contains: search, mode: "insensitive" } },
                { apellido: { contains: search, mode: "insensitive" } },
              ],
            }
          : {
              wallet: { contains: search, mode: "insensitive" },
            }),
      },
    });

    return NextResponse.json({
      status: "success",
      customers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Error al obtener los clientes",
      },
      { status: 500 }
    );
  }
}
