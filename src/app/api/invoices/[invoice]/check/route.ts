import { prisma } from "@/utils/prismaClient";
import { stat } from "fs";
const toAddress = "0xD2417A0fa4836876c75a71dfD49829353e526a3f";

export const POST = async (request: Request, params: { invoice: string }) => {
  const { invoice } = params;

  const { productos } = await request.json();

  const factura = await prisma.$transaction(async (prisma) => {
    const checkFactura = await prisma.facturas.findFirst({
      where: { id: invoice },
      include: {
        productos: {
          include: {
            productos: true,
          },
        },
      },
    });

    if (!checkFactura) {
      throw new Error("Factura no encontrada");
    }

    const total = productos.reduce(
      (
        total: number,
        item: {
          precio: number;
          cantidad: number;
        }
      ) => (item.precio ? total + item.precio * item.cantidad : total),
      0
    );
    console.log(invoice);
    return await prisma.facturas.update({
      where: {
        id: checkFactura.id,
      },
      data: {
        total,
      },
    });
  });

  return Response.json({ order: factura, status: "success", toAddress });
};
