'use client'
import React, { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button, Alert } from '../common';
import { useWalletSync } from '@/hooks/useWalletSync';
import styles from './WalletConnector.module.scss';

interface WalletConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function WalletConnector({ onConnectionChange }: WalletConnectorProps) {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { privyAuthenticated, privyAddress, wagmiConnected, isFullyConnected } = useWalletSync();
  const [showConnectors, setShowConnectors] = useState(false);

  useEffect(() => {
    onConnectionChange?.(isFullyConnected);
  }, [isFullyConnected, onConnectionChange]);

  const handleConnect = (connector: any) => {
    connect({ connector });
    setShowConnectors(false);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isFullyConnected) {
    return (
      <div className={styles.connectedWallet}>
        <Alert type="success">
          <div className={styles.walletInfo}>
            <div>
              <div>✅ Privy: {privyAddress?.slice(0, 6)}...{privyAddress?.slice(-4)}</div>
              <div>✅ Wagmi: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
            </div>
            <Button 
              color="secondary" 
              size="sm" 
              onClick={handleDisconnect}
            >
              Desconectar Wagmi
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (privyAuthenticated && !wagmiConnected) {
    return (
      <div className={styles.walletConnector}>
        <Alert type="info">
          <div className={styles.connectionInfo}>
            <div>
              <div>✅ Privy conectado: {privyAddress?.slice(0, 6)}...{privyAddress?.slice(-4)}</div>
              <div>❌ Wagmi no conectado (necesario para transacciones)</div>
            </div>
            <Button 
              onClick={() => setShowConnectors(!showConnectors)}
              disabled={isPending}
            >
              {isPending ? 'Conectando...' : 'Conectar Wallet para Transacciones'}
            </Button>
          </div>
        </Alert>

        {showConnectors && (
          <div className={styles.connectorsList}>
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                color="secondary"
              >
                {connector.name}
              </Button>
            ))}
          </div>
        )}

        {error && (
          <Alert type="error">
            Error de conexión: {error.message}
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className={styles.walletConnector}>
      <Alert type="info">
        <div className={styles.connectionInfo}>
          <span>Wallet no conectado para transacciones</span>
          <Button 
            onClick={() => setShowConnectors(!showConnectors)}
            disabled={isPending}
          >
            {isPending ? 'Conectando...' : 'Conectar Wallet'}
          </Button>
        </div>
      </Alert>

      {showConnectors && (
        <div className={styles.connectorsList}>
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={isPending}
              color="secondary"
            >
              {connector.name}
            </Button>
          ))}
        </div>
      )}

      {error && (
        <Alert type="error">
          Error de conexión: {error.message}
        </Alert>
      )}
    </div>
  );
} 