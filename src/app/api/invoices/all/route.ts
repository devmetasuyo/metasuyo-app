import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET(request: NextRequest) {
  try {
    const invoices = await prisma.facturas.findMany({
      include: {
        clientes: true,
        productos: true,
        sunat_en_factura: true,
      },
      orderBy: {
        fecha: "desc",
      },
    });

    return NextResponse.json({
      status: "success",
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        fecha: invoice.fecha,
        total: invoice.total,
        estado: invoice.estado,
        estado_sunat: invoice.sunat_en_factura?.estado_sunat ?? "pendiente",
        cliente: {
          nombre: invoice.clientes?.nombre,
          apellido: invoice.clientes?.apellido,
          wallet: invoice.clientes?.wallet,
        },
        productos: invoice.productos.map((producto) => ({
          nombre: producto.producto_id,
          cantidad: producto.cantidad,
          precio: producto.sub_total,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al obtener las facturas",
      },
      { status: 500 }
    );
  }
}
