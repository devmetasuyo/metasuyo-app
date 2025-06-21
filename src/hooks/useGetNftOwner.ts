import { useReadContract } from "wagmi";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato

export const useGetNftOwner = (address: `0x${string}`, tokenId: number) => {
  const { data, isLoading, isError, error } = useReadContract({
    address: address,
    abi: MetasuyoABI,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
    query: {
      enabled: !!address && tokenId >= 0,
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
