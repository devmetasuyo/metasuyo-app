import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi";

export const useCreateCollection = (address: `0x${string}`) => {
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

  const executeCreateCollection = ({
    name,
    description,
    imageUri,
  }: {
    name: string;
    description: string;
    imageUri: string;
  }) => {
    if (!isWritePending) {
      writeContract({
        address: address,
        abi: MetasuyoABI,
        functionName: "createCollection",
        args: [name, description, imageUri],
      });
    }
  };

  return {
    executeCreateCollection,
    isWritePending,
    isTransactionLoading,
    isTransactionSuccess,
    writeError: error,
    transactionError,
  };
};
