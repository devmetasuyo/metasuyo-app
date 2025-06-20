"use client";

import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';

export function useWalletSync() {
  const { isConnected: wagmiConnected, address: wagmiAddress } = useAccount();
  const { authenticated, user } = usePrivy();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Solo desconectar wagmi si Privy se desautentica explícitamente
    // y wagmi sigue conectado (evita desconexiones accidentales)
    if (!authenticated && wagmiConnected && user === null) {
      console.log('Desconectando wagmi debido a logout de Privy');
      disconnect();
    }
  }, [authenticated, wagmiConnected, disconnect, user]);

  return {
    privyAuthenticated: authenticated,
    privyAddress: user?.wallet?.address,
    wagmiConnected,
    wagmiAddress,
    isFullyConnected: authenticated && wagmiConnected,
  };
} 