import { useTransaction, useWriteContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato
import { parseEther } from "viem";

export const useSetNftPrise = (
  address: `0x${string}`,
  tokenId: number,
  newPrice: number
) => {
  const { data, writeContract, isPending, isSuccess, error } =
    useWriteContract();

  const { isLoading: isPriceSettingLoading, isSuccess: isPriceSettingSuccess } =
    useTransaction({
      hash: data,
    });

  const executeSetPrice = () => {
    if (isPriceSettingLoading)
      writeContract({
        address: address,
        abi: MetasuyoABI,
        functionName: "setPrice",
        args: [BigInt(tokenId), parseEther(newPrice.toString())],
      });
  };

  return {
    executeSetPrice,
    isPriceSettingLoading,
    isPriceSettingSuccess,
    isPending,
    isSuccess,
    error,
  };
};
