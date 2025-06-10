import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";


export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const urlParams = request.nextUrl.searchParams;
  const wallet = urlParams.get("wallet");
  const customer = await prisma.clientes.findFirst({
    where: {
      OR: [{ id: Number(id) === 0 ? undefined : Number(id) }, { wallet }],
    },
  });

  return Response.json({ customer });
};
