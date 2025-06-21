import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi";
import { stringToHex } from "viem";

export const useCreateNFT = (address: `0x${string}`) => {
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error,
  } = useWriteContract();

  const {
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const executeCreateNFT = ({
    to,
    collectionId,
    duplicates,
    imageUri,
    jsonData,
    name,
    newPrice,
    rarity,
    uid,
    uri,
  }: {
    to: `0x${string}`;
    newPrice: number;
    collectionId: number;
    name: string;
    rarity: number;
    jsonData: string;
    uri: string;
    imageUri: string;
    uid: string;
    duplicates: number;
  }) => {
    if (!isWritePending && to && address) {
      try {
        writeContract({
          address: address,
          abi: MetasuyoABI,
          functionName: "mintNFT",
          args: [
            to,
            BigInt(collectionId),
            name,
            BigInt(rarity),
            jsonData,
            uri,
            imageUri,
            stringToHex(uid, { size: 32 }),
            BigInt(newPrice),
            BigInt(duplicates),
          ],
        });
      } catch (error) {
        console.error("Error al ejecutar writeContract:", error);
      }
    }
  };

  return {
    executeCreateNFT,
    isWritePending,
    isTransactionLoading,
    isTransactionSuccess,
    writeError: error,
    transactionError,
  };
};
