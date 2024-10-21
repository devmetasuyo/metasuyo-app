import { prisma } from "@/utils/prismaClient";

export const GET = async () => {
  const customers = await prisma.clientes.findMany();
  return Response.json({ customers });
};
