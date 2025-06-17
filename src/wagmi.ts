import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { PrivyProvider } from '@privy-io/react-auth';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    multiInjectedProviderDiscovery: false,
    connectors: [
      coinbaseWallet({
        appName: "Metasuyo",
        preference: "all",
        version: "4",
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
}

declare module "wagmi" {
  interface Register {
    config: typeof getConfig;
  }
}
