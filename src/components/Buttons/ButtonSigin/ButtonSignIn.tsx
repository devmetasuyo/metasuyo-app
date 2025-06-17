"use client";

import { useAccount } from "wagmi";
import { Button } from "../../common/Button";
import { usePrivySession } from "@/hooks/usePrivySession";

export function ButtonSignIn({
  children,
  style,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  const { login, session, loading } = usePrivySession();
  const { address } = useAccount();

  return (
    <>
      {!session && (
        <Button
          size="xs"
          onClick={login}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            ...style,
          }}
          disabled={loading}
        >
          {loading ? "Conectando..." : children}
        </Button>
      )}
    </>
  );
}
