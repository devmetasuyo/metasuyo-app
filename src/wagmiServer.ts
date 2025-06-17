import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

export function getServerConfig() {
  return createConfig({
    chains: [baseSepolia, base],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      [base.id]: http(),
    },
  });
}