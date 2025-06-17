import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";
import Big from "big.js";
import { getEthPrice } from "@/utils/getEthPrice";
export const POST = async (request: NextRequest) => {
  const data = await request.json();

  const productsInCard: { id: string; quantity: number }[] = data.items;

  const productos = await prisma.productos.findMany({
    where: {
      id: {
        in: productsInCard.map((item) => item.id),
      },
    },
  });

  const itemsParaFacturar: {
    producto_id: string;
    cantidad: number;
    sub_total: number;
  }[] = [];

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

  const invoice = await prisma.facturas.create({
    data: {
      tasa_dollar: tasa?.price,
      cliente_id: data.client.id,
      total,
      estado: "aprobado",
      hash: data.referencia,
      productos: {
        createMany: {
          data: itemsParaFacturar,
        },
      },
    },
  });

  return Response.json({ invoice, status: "success" });
};
