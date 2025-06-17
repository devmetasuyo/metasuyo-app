import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.facturas.findUnique({
      where: {
        id: params.id,
      },
      include: {
        clientes: true,
        productos: {
          include: {
            productos: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        {
          status: "error",
          message: "Factura no encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      invoice: {
        id: invoice.id,
        fecha: invoice.fecha,
        total: invoice.total,
        estado: invoice.estado,
        cliente: {
          nombre: invoice.clientes?.nombre,
          apellido: invoice.clientes?.apellido,
          wallet: invoice.clientes?.wallet,
          email: invoice.clientes?.correo,
          telefono: invoice.clientes?.telefono,
        },
        productos: invoice.productos.map((producto) => ({
          nombre: producto.productos?.nombre,
          cantidad: producto.cantidad,
          precio: producto.sub_total,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al obtener la factura",
      },
      { status: 500 }
    );
  }
}
