import { useReadContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato

export const useGetNftOwner = (address: `0x${string}`, tokenId: number) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: address,
    abi: MetasuyoABI,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
