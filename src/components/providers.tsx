"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import { FeedbackModalProvider } from "@/components/Modals/FeedbackModal";
import { PrivyProvider } from '@privy-io/react-auth';
import { privyConfig } from '@/privy';
import { useWagmiConfig } from "@/hooks/useWagminConfig";

const NEXT_PUBLIC_PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const config = useWagmiConfig();

  if (!config) return null;

  return (
    <WagmiProvider config={config}>
          <PrivyProvider appId={NEXT_PUBLIC_PRIVY_APP_ID!} config={privyConfig}>
            <QueryClientProvider client={queryClient}>
              <FeedbackModalProvider>{props.children}</FeedbackModalProvider>
        </QueryClientProvider> 
          </PrivyProvider>
    </WagmiProvider>
  );
}

export default Providers;
