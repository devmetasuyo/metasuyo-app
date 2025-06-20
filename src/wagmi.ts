import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import { PrivyProvider } from '@privy-io/react-auth';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    multiInjectedProviderDiscovery: false,
    connectors: [
      metaMask(),
      coinbaseWallet({
        appName: "Metasuyo",
        preference: "all",
        version: "4",
      }),
      // Temporalmente deshabilitado WalletConnect para evitar errores de custom elements
      // walletConnect({
      //   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "default",
      // }),
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
}

declare module "wagmi" {
  interface Register {
    config: typeof getConfig;
  }
}
