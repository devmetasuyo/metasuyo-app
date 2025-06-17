import { useReadContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato

export const useGetNftUri = (address: `0x${string}`, tokenId: number) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: address,
    abi: MetasuyoABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
