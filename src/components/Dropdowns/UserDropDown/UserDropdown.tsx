"use client";
import React, { useCallback, useState } from "react";
import styles from "./styles.module.scss";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { FaChevronDown, FaUser, FaCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "@/components/Common";

interface UserDropdownProps {
  account: string | null;
  chainId: string | null;
  avatar?: string;
  onConnect: () => void;
  onSwitchChain: (chainId: string) => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  account,

  avatar,
}) => {
  const { connectors, connect } = useConnect();
  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);
  const { disconnect } = useDisconnect();
  const { chain } = useAccount();
  const { switchChain, chains } = useSwitchChain();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles["user-dropdown"]}>
      {account ? (
        <button className={styles["dropdown-toggle"]} onClick={toggleDropdown}>
          {avatar ? (
            <img src={avatar} alt="User Avatar" className={styles["avatar"]} />
          ) : (
            <FaUser size={20} />
          )}
          <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
          <FaChevronDown size={20} />
        </button>
      ) : (
        <button className={styles["connect-button"]} onClick={createWallet}>
          Únete
        </button>
      )}
      {isOpen && account && (
        <div className={styles["dropdown-menu"]}>
          <div className={styles["chain-info"]}>
            <span>Cadena actual</span>
            <p style={{ fontWeight: "bold", margin: "0" }}>{chain?.name}</p>
          </div>

          <div className={styles["wallet-info"]}>
            <span>Dirección de la wallet:</span>
            <p>{account}</p>
            <CopyToClipboard text={account} onCopy={handleCopy}>
              <button className={styles["copy-button"]}>
                <FaCopy size={16} />
                {copied ? "Copiado" : "Copiar"}
              </button>
            </CopyToClipboard>
          </div>

          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
            >
              Conectar a {chain.name}
            </button>
          ))}

          <Button onClick={() => disconnect()}>Salir</Button>
        </div>
      )}
    </div>
  );
};
