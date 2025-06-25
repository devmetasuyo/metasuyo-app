import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";
import Big from "big.js";
import { getEthPrice } from "@/utils/getEthPrice";
import { v4 as uuidv4 } from "uuid";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const { items, referencia, client, paymentMethod = "EFECTIVO" } = data;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({
        status: "error",
        message: "Debe incluir productos en la factura",
      }, { status: 400 });
    }

    if (!client || !client.id) {
      return Response.json({
        status: "error",
        message: "Debe seleccionar un cliente",
      }, { status: 400 });
    }

    const productsInCard: { id: string; quantity: number }[] = items;

    // Verificar que todos los productos existan y tengan stock
    const productos = await prisma.productos.findMany({
      where: {
        id: {
          in: productsInCard.map((item) => item.id),
        },
      },
    });

    if (productos.length !== productsInCard.length) {
      return Response.json({
        status: "error",
        message: "Algunos productos no fueron encontrados",
      }, { status: 404 });
    }

    // Verificar stock disponible
    for (const item of productsInCard) {
      const producto = productos.find(p => p.id === item.id);
      if (producto && producto.cantidad < item.quantity) {
        return Response.json({
          status: "error",
          message: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidad}, Solicitado: ${item.quantity}`,
        }, { status: 400 });
      }
    }

    const itemsParaFacturar: {
      producto_id: string;
      cantidad: number;
      sub_total: number;
    }[] = [];

    // Calcular totales con precisión
    const total = productos.reduce((total: number, item) => {
      const cantidad = new Big(
        productsInCard.find((p) => p.id === item.id)?.quantity || 0
      );

      const sub_total = cantidad.mul(Number(item.precio)).toNumber();
      itemsParaFacturar.push({
        producto_id: item.id,
        cantidad: cantidad.toNumber(),
        sub_total,
      });

      return total + sub_total;
    }, 0);

    const tasa = await getEthPrice();

    // Crear factura con transacción para consistencia
    const invoice = await prisma.$transaction(async (prisma) => {
      // Crear la factura
      const newInvoice = await prisma.facturas.create({
        data: {
          id: uuidv4(),
          tasa_dollar: tasa?.price || 3000, // Fallback price
          cliente_id: client.id,
          total,
          estado: paymentMethod === "EFECTIVO" ? "pagado" : "pendiente",
          hash: referencia || `POS-${Date.now()}`,
          fecha: new Date(),
          productos: {
            createMany: {
              data: itemsParaFacturar,
            },
          },
        },
        include: {
          productos: {
            include: {
              productos: true,
            },
          },
          clientes: true,
        },
      });

      // Reducir stock de productos
      for (const item of itemsParaFacturar) {
        await prisma.productos.update({
          where: { id: item.producto_id },
          data: {
            cantidad: {
              decrement: item.cantidad,
            },
          },
        });
      }

      return newInvoice;
    });

    return Response.json({ 
      invoice, 
      status: "success",
      message: "Factura creada exitosamente",
      details: {
        facturaId: invoice.id,
        total: total,
        totalUSD: total,
        totalETH: tasa?.price ? (total / tasa.price).toFixed(6) : "0.000000",
        cliente: invoice.clientes?.nombre + " " + invoice.clientes?.apellido,
        fecha: invoice.fecha,
        productos: invoice.productos.length,
      }
    });

  } catch (error) {
    console.error("Error creating POS invoice:", error);
    return Response.json({
      status: "error",
      message: error instanceof Error ? error.message : "Error interno del servidor",
    }, { status: 500 });
  }
};
