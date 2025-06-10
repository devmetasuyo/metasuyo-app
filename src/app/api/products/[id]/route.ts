import { prisma } from "@/utils/prismaClient";
export const dynamic = "force-dynamic";

export const GET = async (
  _: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  const product = await prisma.productos.findUnique({
    where: {
      id: Number(id),
    },
  });

  return Response.json({ product });
};
