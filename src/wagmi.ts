import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    ssr: true,
    multiInjectedProviderDiscovery: false,
    connectors: [
      coinbaseWallet({
        appName: "Metasuyo",
        preference: "smartWalletOnly",
      }),
    ],
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
