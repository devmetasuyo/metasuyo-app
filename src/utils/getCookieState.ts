import { getServerConfig } from "@/wagmiServer";
import { cookies } from "next/headers";
import { cookieToInitialState, type State } from "wagmi";

export function getCookieState(): State | undefined {
  const cookiesStore = cookies().getAll();
  const toStringParsed = cookiesStore.reduce((acc, cookie, index, arr) => {
    return acc.concat(
      `${cookie.name}=${cookie.value}${index < arr.length - 1 ? "; " : ""}`
    );
  }, "");

  return cookieToInitialState(getServerConfig(), toStringParsed);
}
