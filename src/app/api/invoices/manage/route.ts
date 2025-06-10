import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";
// process.env.NEXT_PUBLIC_ADMIN_WALLET
const toAddress = "0xD2417A0fa4836876c75a71dfD49829353e526a3f";

export const POST = async (request: NextRequest) => {
  const data = await request.json();

  const { total, wallet, id } = data;

  const factura = await prisma.$transaction(async (prisma) => {
    const customer = await prisma.clientes.findFirst({
      where: { wallet },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }

    return await prisma.facturas.upsert({
      where: {
        id,
      },
      create: {
        id,
        estado: "pendiente",
        total: total,
        cliente_id: customer?.id,
        fecha: new Date(),
      },
      update: {
        total: total,
      },
    });
  });

  return Response.json({ order: factura, status: "success", toAddress });
};

export const PUT = async (request: NextRequest) => {
  const data = await request.json();

  const { hash, id } = data;

  // const total = productos.reduce(
  //   (
  //     total: number,
  //     item: {
  //       sub_total: number;
  //       cantidad: number;
  //     }
  //   ) => total + item.sub_total * item.cantidad,
  //   0
  // ) as number;

  if (!id)
    return Response.json({
      data: null,
      status: "error",
      message: "ID not found",
    });

  const factura = await prisma.facturas.update({
    data: {
      estado: "pagado",
      hash: hash,
    },
    where: {
      id,
    },
  });

  return Response.json({ data: factura });
};
