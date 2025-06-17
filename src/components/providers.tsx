"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { FeedbackModalProvider } from "@/components/Modals/FeedbackModal";
import { useWagmiConfig } from "@/hooks/useWagminConfig";
import { PrivyProvider } from '@privy-io/react-auth';
import { privyConfig } from '@/privy';

const NEXT_PUBLIC_ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;
const NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const baseSepoliaChain = {
  id: baseSepolia.id,
  name: baseSepolia.name,
  network: baseSepolia.network,
  rpcUrls: baseSepolia.rpcUrls,
  blockExplorers: baseSepolia.blockExplorers,
  nativeCurrency: baseSepolia.nativeCurrency,
};

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const config = useWagmiConfig();
  const [queryClient] = useState(() => new QueryClient());

  if (!config) return null;

  return (
    <PrivyProvider appId={NEXT_PUBLIC_PRIVY_APP_ID!} config={privyConfig}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={baseSepoliaChain}
          >
            <RainbowKitProvider>
              <FeedbackModalProvider>{props.children}</FeedbackModalProvider>
            </RainbowKitProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}

export default Providers;
