import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [username, password] = Buffer.from(
      authHeader.replace("Basic ", ""),
      "base64"
    )
      .toString()
      .split(":");

    if (
      username !== process.env.BACKUP_USER ||
      !bcrypt.compareSync(password, process.env.BACKUP_PASSWORD_HASH || "")
    ) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Obtener todos los datos
    const [clientes, facturas, productos] = await Promise.all([
      prisma.clientes.findMany(),
      prisma.facturas.findMany({
        include: {
          productos: true,
          clientes: true,
          sunat_en_factura: true,
        },
      }),
      prisma.productos.findMany(),
    ]);

    const backup = {
      fecha: new Date(),
      data: {
        clientes,
        facturas,
        productos,
      },
    };

    // Crear nombre del archivo con fecha
    const date = new Date().toISOString().split("T")[0];
    const fileName = `backup-${date}.json`;

    return NextResponse.json(
      {
        status: "success",
        fileName,
        backup,
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename=${fileName}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating backup:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al crear el backup",
      },
      { status: 500 }
    );
  }
}
