// Configuración de RPC con múltiples endpoints de respaldo
export const RPC_URLS = {
  baseSepolia: [
    'https://sepolia.base.org',
    'https://base-sepolia.blockpi.network/v1/rpc/public',
    'https://base-sepolia-rpc.publicnode.com',
  ].filter(Boolean) as string[],
  
  base: [
    'https://mainnet.base.org',
    'https://base.blockpi.network/v1/rpc/public',
    'https://base-rpc.publicnode.com',
  ],
};

export function getWorkingRpcUrl(chainId: number): string {
  const urls = chainId === 84532 ? RPC_URLS.baseSepolia : RPC_URLS.base;
  return urls[0]; // Por ahora retorna el primero, se puede mejorar con health checks
} 