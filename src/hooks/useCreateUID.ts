import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi";
import { stringToHex } from "viem";

export const useCreateUID = (address: `0x${string}`) => {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const {
    isSuccess: isTransactionSuccess,
    status,
    error: errorTransaction,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const executeGenerateUID = (UID: string) => {
    if (!isPending) {
      writeContract({
        address: address,
        abi: MetasuyoABI,
        functionName: "generateUID",
        args: [stringToHex(UID, { size: 32 })],
      });
    }
  };

  return {
    executeGenerateUID,
    transactionStatus: status,
    errorTransaction,
    isGenerateUIDLoading: isPending,
    isGenerateUIDSuccess: isTransactionSuccess,
    error: error,
  };
};
