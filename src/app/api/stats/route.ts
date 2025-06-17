import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaClient";

export async function GET() {
  try {
    const totalClients = await prisma.clientes.count();
    const newClientsThisMonth = await prisma.clientes.count({
      where: {
        creado_el: {
          gte: new Date(new Date().setDate(1)) // Primer día del mes actual
        }
      }
    });

    const totalInvoices = await prisma.facturas.count();
    const totalRevenue = await prisma.facturas.aggregate({
      _sum: {
        total: true
      },
      where: {
        estado: "pagado"
      }
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.facturas.groupBy({
      by: ['fecha'],
      _sum: {
        total: true
      },
      where: {
        fecha: {
          gte: sixMonthsAgo
        },
        estado: "pagado"
      }
    });

    const topProducts = await prisma.productos_en_factura.groupBy({
      by: ['producto_id'],
      _sum: {
        cantidad: true
      },
      orderBy: {
        _sum: {
          cantidad: 'desc'
        }
      },
      take: 5
    });

    return NextResponse.json({
      status: "success",
      data: {
        clients: {
          total: totalClients,
          newThisMonth: newClientsThisMonth
        },
        invoices: {
          total: totalInvoices,
          totalRevenue: totalRevenue._sum.total || 0,
          monthlyRevenue: monthlyRevenue
        },
        products: {
          topSellers: topProducts
        }
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al obtener estadísticas"
      },
      { status: 500 }
    );
  }
} 