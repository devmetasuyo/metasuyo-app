import { NextRequest } from "next/server";
import { setTokenCookie, createToken } from "@/utils/auth";
import { prisma } from "@/utils/prismaClient";

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  if (!wallet) return Response.json({ error: "No wallet provided" }, { status: 400 });

  // Busca o crea el usuario
  let user = await prisma.clientes.findFirst({ where: { wallet } });
  if (!user) {
    // Si quieres crear el usuario automáticamente:
    user = await prisma.clientes.create({
      data: {
        wallet,
        nombre: "Nuevo usuario",
        apellido: "",
        correo: "",
        tipo_documento: "",
      },
    });
  }

  // Crea y setea el token/cookie
  const newToken = await createToken({ wallet });
  setTokenCookie(newToken);

  return Response.json({ status: "success", user });
}
