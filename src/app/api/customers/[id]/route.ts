import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.clientes.findUnique({
      where: {
        id: params.id,
      },
      include: {
        facturas: {
          include: {
           productos:true
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          status: "error",
          message: "Cliente no encontrado",
        },
        { status: 404 }
      );
    }

    // Transformar los datos de las facturas
    const facturasFormateadas = customer.facturas.map((factura) => ({
      id: factura.id,
      fecha: factura.fecha,
      total: factura.total,
      estado: factura.estado,
      productos: factura.productos.map((detalle) => ({
        nombre: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio: detalle.sub_total,
      })),
    }));

    return NextResponse.json({
      status: "success",
      customer: {
        ...customer,
        facturas: facturasFormateadas,
      },
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al obtener el cliente",
      },
      { status: 500 }
    );
  }
}
