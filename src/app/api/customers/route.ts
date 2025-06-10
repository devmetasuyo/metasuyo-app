import { prisma } from "@/utils/prismaClient";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { wallet } = body;

  const newCustomer = await prisma.clientes.create({
    data: {
      correo: "test@gmail.com",
      nombre: wallet,
      wallet,
    },
  });
  return new Response(JSON.stringify({
    newCustomer,
  }), { status: 200 });
};
