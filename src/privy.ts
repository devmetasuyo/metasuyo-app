import { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: 'light',
    accentColor: '#808080',
  },
  loginMethods: ['email', 'wallet', 'google'],
  embeddedWallets: {
    createOnLogin: 'all-users',
    noPromptOnSignature: true,
  },
  defaultChain: {
    id: 84532,
    name: 'Base Sepolia',
    rpcUrls: {
      default: {
        http: [process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Base Sepolia',
        url: 'https://sepolia.basescan.org',
      },
    },
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
}; 