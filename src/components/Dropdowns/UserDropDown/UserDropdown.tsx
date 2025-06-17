"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
} from "wagmi";
import { FaChevronDown, FaUser, FaCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "@/components/common";
import { normalize } from "viem/ens";
import { usePrivySession } from "@/hooks/usePrivySession";
import { privyConfig } from "@/privy";

export const UserDropdown: React.FC = () => {
  const { address, chainId } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: chainId as number });
  const { data: avatar } = useEnsAvatar({
    name: normalize(ensName ?? ""),
    chainId: chainId as number,
  });
  const { login, logout, session, loading } = usePrivySession();
  const { chain } = useAccount();
  const { switchChain, chains } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: balanceData, refetch } = useBalance({
    address: session?.wallet as `0x${string}`,
    chainId: privyConfig.defaultChain?.id as number,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles["user-dropdown"]}>
      {session?.wallet ? (
        <button className={styles["dropdown-toggle"]} onClick={toggleDropdown}>
          {avatar ? (
            <img src={avatar} alt="User Avatar" className={styles["avatar"]} />
          ) : (
            <FaUser size={20} />
          )}
          <span>
            {ensName ?? `${session?.wallet?.slice(0, 6)}...${session?.wallet?.slice(-4)}`}
          </span>
          <FaChevronDown size={20} />
        </button>
      ) : (
        <button className={styles["connect-button"]} onClick={login} disabled={loading}>
          {loading ? "Conectando..." : "Únete"}
        </button>
      )}
      {isOpen && session && (
        <div className={styles["dropdown-menu"]}>
          <div className={styles["chain-info"]}>
            <span>Cadena actual</span>
            <p style={{ fontWeight: "bold", margin: "0" }}>{chain?.name}</p>
          </div>
          <div className={styles["wallet-info"]}>
            <span>Saldo</span>
            <p>{(Number(balanceData?.value) / 100000000000000000).toString()}</p>
          </div>
          <div className={styles["wallet-info"]}>
            <span>Dirección de la wallet:</span>
            <p>
                {session?.wallet
                ? `${session?.wallet.slice(0, 20)}...${session?.wallet.slice(-4)}`
                : "No conectado"}
            </p>
            <CopyToClipboard text={session?.wallet ?? ""} onCopy={handleCopy}>
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
          <Button onClick={() => { disconnect(); logout(); }}>Salir</Button>
        </div>
      )}
    </div>
  );
};
