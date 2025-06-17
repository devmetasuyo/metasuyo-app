"use client";

import React, { useState } from "react";
import { useGetNftOwner } from "@/hooks/useGetNftOwner";
import { Button, Input, TransactionWrapper } from "@/components";
import { useAccount } from "wagmi";
import { Nft } from "@/types";

export interface NFTOwnershipProps {
  id: number;
  data: Nft;
}

export function NFTOwnershipActions({ id, data }: NFTOwnershipProps) {
  const addressContract = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { address: userAddress, isConnecting } = useAccount();
  const { data: owner } = useGetNftOwner(addressContract, id);

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

  if (isConnecting) {
    return <span>Loading...</span>;
  }

  if (owner?.toLowerCase() === userAddress?.toLowerCase()) {
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

  if (owner?.toLowerCase() !== userAddress?.toLowerCase() && userAddress) {
    return (
      <>
        <Input
          id="uid"
          placeholder="UID"
          label="Código de promoción"
          onChange={handleChange}
          value={formData.uid}
        />
        <TransactionWrapper
          address={userAddress}
          idNtf={id}
          uid={formData.uid}
          nftData={data}
          onSuccess={() => {}}
        />
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

  return <span className="owner-message">El dueño es: {owner}</span>;
}
