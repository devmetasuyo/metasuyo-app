import { NextRequest } from "next/server";
import * as jose from "jose";
export const GET = async (request: NextRequest) => {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return Response.json(
      {
        data: null,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const { payload, protectedHeader } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return Response.json(
    {
      data: null,
      status: 200,
      message: "Authorized",
    },
    { status: 200 }
  );
};
