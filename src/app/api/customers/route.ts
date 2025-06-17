import { prisma } from "@/utils/prismaClient";
import { NextRequest } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { wallet } = body;

  const newCustomer = await prisma.clientes.create({
    data: {
      nombre: "nuevo",
      correo: "test@gmail.com",
      wallet,
    },
  });
  return new Response(
    JSON.stringify({
      newCustomer,
    }),
    { status: 200 }
  );
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const wallet = searchParams.get("wallet");

  const customer = await prisma.clientes.findFirst({
    where: {
      wallet,
    },
  });

  return Response.json(
    {
      customer,
      status: "success",
    },
    { status: 200 }
  );
};

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const { wallet } = body;

  const updatedData = await prisma.$transaction(async (prisma) => {
    const customer = await prisma.clientes.findFirst({
      where: {
        wallet,
      },
    });

    return await prisma.clientes.update({
      where: {
        id: customer?.id,
      },
      data: {
        apellido: body.lastName,
        correo: body.email,
        nombre: body.name,
        telefono: body.phone,
      },
    });
  });

  return new Response(
    JSON.stringify({ customer: updatedData, status: "success" })
  );
};
