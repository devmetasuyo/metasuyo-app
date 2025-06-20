import React from 'react';
import { useWalletSync } from '@/hooks/useWalletSync';
import { Alert } from '../common';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

export function ConnectionStatus({ showDetails = false }: ConnectionStatusProps) {
  const { 
    privyAuthenticated, 
    privyAddress, 
    wagmiConnected, 
    wagmiAddress, 
    isFullyConnected 
  } = useWalletSync();

  if (!showDetails) {
    return null;
  }

  return (
    <div style={{ padding: '1rem', fontSize: '0.8rem' }}>
      <Alert type={isFullyConnected ? "success" : "info"}>
        <div>
          <h4>Estado de Conexiones:</h4>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            <li>
              Privy: {privyAuthenticated ? '✅' : '❌'} 
              {privyAddress && ` (${privyAddress.slice(0, 6)}...${privyAddress.slice(-4)})`}
            </li>
            <li>
              Wagmi: {wagmiConnected ? '✅' : '❌'} 
              {wagmiAddress && ` (${wagmiAddress.slice(0, 6)}...${wagmiAddress.slice(-4)})`}
            </li>
            <li>
              Transacciones: {isFullyConnected ? '✅ Habilitadas' : '❌ Deshabilitadas'}
            </li>
          </ul>
        </div>
      </Alert>
    </div>
  );
} 