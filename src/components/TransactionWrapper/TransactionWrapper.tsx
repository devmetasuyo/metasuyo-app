"use client";

import {
  stringToHex,
  encodeFunctionData,
} from "viem";
import { MetasuyoAbi } from "@/abis/MetasuyoAbi";
import { useCallback, useState } from "react";
import { Modal } from "../common";
import { NftMintCard } from "../Cards";
import { usePrivySession } from "@/hooks/usePrivySession";
import { usePrivy } from "@privy-io/react-auth";
import { createPublicClient, http } from "viem";
import { privyConfig } from "@/privy";


export function TransactionWrapper({
  address,
  idNtf,
  uid,
  nftData,
  onSuccess,
}: {
  address: string;
  idNtf: number;
  uid: string;
  nftData: {
    imageUri: string;
    name: string;
    rarity: number;
  };
  onSuccess: () => void;
}) {
  const { user, loading } = usePrivySession();
  const { sendTransaction } = usePrivy();
  const [modalOpen, setModalOpen] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { imageUri, name, rarity } = nftData;
  const handleClaim = useCallback(async () => {
    setTxLoading(true);
    setError(null);
    try {
      if (!sendTransaction || !user?.wallet?.address) {
        setError("No se encontró la billetera de Privy.");
        setTxLoading(false);
        return;
      }

      // Prepara los datos de la transacción
      const data = encodeFunctionData({
        abi: MetasuyoAbi,
        functionName: "clone_nft",
        args: [BigInt(idNtf), stringToHex(uid, { size: 32 })],
      });

      const tx = {
        to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        data,
      };

      // Envía la transacción usando el método actualizado de Privy
      const { transactionHash } = await sendTransaction(tx);

      // Espera el receipt usando viem
      const publicClient = createPublicClient({
        chain: privyConfig.defaultChain as any, 
        transport: http(),
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash as `0x${string}` });

      setModalOpen(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al reclamar el NFT");
    } finally {
      setTxLoading(false);
    }
  }, [sendTransaction, user, idNtf, uid, onSuccess]);

  if (loading) return <span>Loading...</span>;

  return (
    <>
      <button
        className="btn"
        onClick={handleClaim}
        disabled={txLoading}
      >
        {txLoading ? "Reclamando..." : "Reclamar"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Modal isOpen={modalOpen} handleModal={() => setModalOpen(false)}>
        <NftMintCard
          onClose={() => setModalOpen(false)}
          imageUri={imageUri}
          name={name}
          rarity={rarity}
        />
      </Modal>
    </>
  );
}
