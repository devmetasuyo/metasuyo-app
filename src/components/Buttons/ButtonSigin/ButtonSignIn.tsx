import { useCallback } from "react";
import { useAccount, useConnect } from "wagmi";
import { Button } from "../../Common/Button";

export function ButtonSignIn({
  children,
  style,
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);
  return (
    <>
      {!address && (
        <Button
          size="xs"
          onClick={createWallet}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            ...style,
          }}
        >
          {children}
        </Button>
      )}
    </>
  );
}
