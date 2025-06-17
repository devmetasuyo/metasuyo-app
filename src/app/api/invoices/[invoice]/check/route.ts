import { prisma } from "@/utils/prismaClient";

const toAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;

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
