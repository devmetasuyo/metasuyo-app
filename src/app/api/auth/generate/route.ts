import { NextRequest } from "next/server";
import * as jose from "jose";
export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;

  const hash = params.get("hash");
  const timestamp = params.get("timestamp");
  const wallet = params.get("wallet");

  if (!hash || !timestamp || !wallet) {
    return Response.json({
      data: null,
      status: 400,
      message: "Hash or timestamp not found",
    });
  }

  const payload = { hash, timestamp, wallet };

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return Response.json({
    token,
    status: "success",
  });
};
