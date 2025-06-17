import { prisma } from "@/utils/prismaClient";

export const GET = async (
  request: Request,
  { params }: { params: { invoice: string } }
) => {
  const { invoice: id } = params;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  if (!id) {
    return Response.json({
      data: null,
      status: 400,
      message: "ID not found",
    });
  }

  const invoice = await prisma.facturas.findUnique({
    where: {
      id,
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
