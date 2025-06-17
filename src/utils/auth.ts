import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function createToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(SECRET_KEY));

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY)
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export function setTokenCookie(token: string) {
  const cookiesStore = cookies();

  cookiesStore.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    maxAge: 60 * 60 * 2,
    path: "/",
  });
}

export function getTokenCookie() {
  const cookiesStore = cookies();
  return cookiesStore.get("token")?.value;
}

export function removeTokenCookie() {
  const cookiesStore = cookies();
  cookiesStore.delete("token");
}
