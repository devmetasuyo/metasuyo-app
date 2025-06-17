"use client";

import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";
import {
  stringToHex,
  type Address,
  type ContractFunctionParameters,
} from "viem";
import { MetasuyoAbi } from "@/abis/MetasuyoAbi";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Modal } from "../common";
import { NftMintCard } from "../Cards";
import { useAccount } from "wagmi";

const NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT =
  process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT;

export function TransactionWrapper({
  address,
  idNtf,
  uid,
  nftData,
  onSuccess,
}: {
  address: Address;
  idNtf: number;
  uid: string;
  nftData: {
    imageUri: string;
    name: string;
    rarity: number;
  };
  onSuccess: () => void;
}) {
  const { chainId, isConnecting } = useAccount();
  const { imageUri, name, rarity } = nftData;
  const [modalOpen, setModalOpen] = useState(false);
  const [bytes32Uid, setBytes32Uid] = useState("");

  const contracts = [
    {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: MetasuyoAbi,
      functionName: "clone_nft",
      args: [idNtf, bytes32Uid],
    },
  ] as unknown as ContractFunctionParameters[];

  useEffect(() => {
    setBytes32Uid(stringToHex(uid, { size: 32 }));
  }, [uid]);

  const handleSuccess = useCallback(
    (state: LifecycleStatus) => {
      onSuccess();
      if (state.statusName === "success") {
        setModalOpen(true);
      }
    },
    [onSuccess]
  );

  if (isConnecting) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Transaction
        capabilities={{
          paymasterService: {
            url: NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT as string,
          },
        }}
        chainId={chainId}
        contracts={contracts}
        onStatus={handleSuccess}
      >
        <TransactionButton
          className={styles.ghostButton}
          text="Reclamar"
        ></TransactionButton>
      </Transaction>
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
