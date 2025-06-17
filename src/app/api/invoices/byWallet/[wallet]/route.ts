import { prisma } from "@/utils/prismaClient";

export const GET = async (
  request: Request,
  { params }: { params: { wallet: string } }
) => {
  const { wallet: id } = params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const token = searchParams.get("token") || "";

  if (!id || !status) {
    return Response.json({
      data: null,
      status: 400,
      message: "ID not found",
    });
  }

  const invoice = await prisma.facturas.findFirst({
    where: {
      wallet: id,
      estado: status,
    },
    include: {
      productos: true,
    },
  });

  return Response.json({
    invoice,
    status: "success",
  });
};
