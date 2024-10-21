import { prisma } from "@/utils/prismaClient";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";

  const invoices = await prisma.facturas.findMany({
    where: {
      estado: status,
    },
    include: {
      productos: true,
    },
  });
  return Response.json({ invoices });
};
