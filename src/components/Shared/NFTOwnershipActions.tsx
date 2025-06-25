"use client";

import React, { useState } from "react";
import { useGetNftOwner } from "@/hooks/useGetNftOwner";
import { Button, Input, TransactionWrapper } from "@/components";
import { usePrivySession } from "@/hooks/usePrivySession";
import { Nft } from "@/types";

export interface NFTOwnershipProps {
  id: number;
  data: Nft;
}

export function NFTOwnershipActions({ id, data }: NFTOwnershipProps) {
  const addressContract = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { session, loading } = usePrivySession();
  const { data: owner, isLoading: ownerLoading, isError: ownerError } = useGetNftOwner(addressContract, id);

  // Debug logs
  console.log('NFTOwnershipActions Debug:', {
    id,
    owner,
    userAddress: session?.wallet,
    loading,
    ownerLoading,
    ownerError,
    addressContract,
    isOwner: owner?.toLowerCase() === session?.wallet?.toLowerCase(),
    hasUserAddress: !!session?.wallet,
    hasOwner: !!owner
  });

  const [formData, setFormData] = useState({
    walletTo: "",
    uid: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const sendTransfer = () => {
    // Implementar la lógica de transferencia
    // TODO "Transferir a:", formData.walletTo
  };

  if (loading || ownerLoading) {
    return <span style={{ color: "white" }}>Cargando información del NFT...</span>;
  }

  if (ownerError) {
    return <span style={{ color: "red" }}>Error al cargar información del owner</span>;
  }

  if (!session?.wallet) {
    return <span style={{ color: "white" }}>Conecta tu wallet para interactuar con este NFT</span>;
  }

  if (!owner) {
    return <span style={{ color: "white" }}>No se pudo determinar el owner del NFT</span>;
  }

  if (owner?.toLowerCase() === session?.wallet?.toLowerCase()) {
    return (
      <>
        <span className="owner-message">Eres el dueño</span>
        <Input
          label="Dirección de recepción"
          id="walletTo"
          onChange={handleChange}
          value={formData.walletTo}
          placeholder="Wallet a transferir"
        />
        <Button onClick={sendTransfer}>Transferir</Button>
      </>
    );
  }

  if (owner?.toLowerCase() !== session?.wallet?.toLowerCase() && session?.wallet) {
    return (
      <>
        <Input
          id="uid"
          placeholder="UID"
          label="Código de promoción"
          onChange={handleChange}
          value={formData.uid}
        />
        {formData.uid ? (
          <TransactionWrapper
            address={session?.wallet as `0x${string}`}
            idNtf={id}
            uid={formData.uid}
            nftData={data}
            onSuccess={() => {
              // Reset the form after successful claim
              setFormData({ walletTo: "", uid: "" });
            }}
          />
        ) : (
          <Button disabled style={{ opacity: 0.5 }}>
            Ingrese un UID para reclamar
          </Button>
        )}
        <span
          style={{ color: "white", marginTop: "0.5rem", fontSize: "0.8rem" }}
        >
          Want to try this out? ask for your UID writing to @luisotravez in
          Telegram{" "}
          <a style={{ color: "white" }} href="https://T.me/luisotravez">
            @luisotravez
          </a>
        </span>
      </>
    );
  }

  return (
    <div style={{ color: "white" }}>
      <p>El dueño de este NFT es:</p>
      <p style={{ fontFamily: "monospace", fontSize: "0.9rem", wordBreak: "break-all" }}>{owner}</p>
      <p style={{ fontSize: "0.8rem", marginTop: "1rem" }}>
        Para reclamar este NFT, necesitas conectar una wallet diferente a la del owner.
      </p>
    </div>
  );
}
