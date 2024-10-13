"use client";

import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { useMemo } from "react";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

const NEXT_PUBLIC_WC_PROJECT_ID = process.env
  .NEXT_PUBLIC_WC_PROJECT_ID as string;

export function useWagmiConfig() {
  const projectId = NEXT_PUBLIC_WC_PROJECT_ID ?? "";
  if (!projectId) {
    const providerErrMessage =
      "To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable";
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const wagmiConfig = createConfig({
      chains: [baseSepolia, base],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors: [
        coinbaseWallet({
          appName: "Metasuyo",
          preference: "all",
        }),
        walletConnect({
          projectId,
        }),
      ],
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}
