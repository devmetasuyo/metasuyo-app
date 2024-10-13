"use client";

import UIDForm from "./UIDForm";
import CollectionForm from "./CollectionForm";
import NFTForm from "./NFTForm";
import { useAccount } from "wagmi";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { Spinner } from "../Common";

const addressWallet = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function CreateNFT() {
  const { collectionNames, isLoading } = useGetCollectionNames(addressWallet);
  const { address: userAddress } = useAccount();

  if (isLoading) return <Spinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <UIDForm />
      <CollectionForm />
      <NFTForm userAddress={userAddress} collections={collectionNames ?? []} />
    </div>
  );
}
