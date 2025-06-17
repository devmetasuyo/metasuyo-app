import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi";
import { stringToHex } from "viem";

export const useCreateUIDs = (address: `0x${string}`) => {
  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isSuccess: isTransactionSuccess,
    isLoading: isTransactionLoading,
    error: transactionError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const executeGenerateUIDs = (UIDs: string[]) => {
    if (!isWritePending) {
      const hexUIDs = UIDs.map((UID) => stringToHex(UID, { size: 32 }));
      writeContract({
        address: address,
        abi: MetasuyoABI,
        functionName: "batchGenerateUID",
        args: [hexUIDs],
      });
    }
  };

  return {
    // Función para ejecutar
    executeGenerateUIDs,

    // Estado y errores de writeContract
    isWritePending,
    writeError,

    // Estado y errores de useWaitForTransactionReceipt
    isTransactionSuccess,
    isTransactionLoading,
    transactionError,

    // Hash de la transacción
    txHash,
  };
};
