"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { baseSepolia } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { FeedbackModalProvider } from "@/components/Modals/FeedbackModal";
import { useWagmiConfig } from "@/hooks/useWagminConfig";

const NEXT_PUBLIC_ONCHAINKIT_API_KEY = process.env.NEXT_PUBLIC_CDP_API_KEY;

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const config = useWagmiConfig();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          <RainbowKitProvider>
            <FeedbackModalProvider>{props.children}</FeedbackModalProvider>
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
