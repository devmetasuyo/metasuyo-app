import { removeTokenCookie } from "@/utils/auth";
import { cookies } from "next/headers";
export const GET = async () => {
  removeTokenCookie();
  cookies().delete("isAdmin");
  return Response.json({ status: "success" }, { status: 200 });
};
