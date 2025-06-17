import {
  createToken,
  getTokenCookie,
  setTokenCookie,
  verifyToken,
} from "@/utils/auth";
import { getCookieState } from "@/utils/getCookieState";
import { prisma } from "@/utils/prismaClient";
import { cookies } from "next/headers";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

export const GET = async () => {
  try {
    const token = getTokenCookie();


    if (!token) throw new Error("Token not found");

    const payload = await verifyToken(token);

    if (!payload) throw new Error("Payload not found");

    const user = await prisma.clientes.findFirst({
      where: {
        wallet: payload.wallet as `0x${string}`,
      },
    });

    if (!user) throw new Error("User not found");

    const isAdmin = user.wallet === adminWallet;

    if (isAdmin){
      const cookiesStore = cookies();
      cookiesStore.delete("isAdmin");
      cookiesStore.set({
        name: "isAdmin",
        value: String(isAdmin),
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "strict",
        maxAge: 60 * 60 * 2,
        path: "/",
      });
    }

    const newToken = await createToken({
      wallet: user.wallet,
    });
    setTokenCookie(newToken);

    return Response.json({ status: "success", user });
  } catch (error) {
    console.error("[SESSION] Error:", error);
    return Response.json({ error: "Error in session", status: 400 });
  }
};
