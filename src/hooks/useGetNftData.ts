import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato
import { Nft } from "@/types";
import { ResponseByContract } from "@/types/responseByContract";
import { useReadContract } from "wagmi";
import { privyConfig } from "@/privy";

export const useGetNftData = (
  contractAddress: `0x${string}`,
  tokenId: number
): ResponseByContract<Nft> => {
  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress,
    abi: MetasuyoABI,
    functionName: "nftData",
    args: [BigInt(tokenId)],
    chainId: privyConfig.defaultChain?.id,
    query: {
      enabled: !!contractAddress && tokenId >= 0,
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  return {
    data: data
      ? {
          name: data[0],
          rarity: Number(data[1]),
          collectionId: Number(data[2]),
          jsonData: data[3],
          imageUri: data[4],
          price: Number(data[6]),
          duplicates: Number(data[7]),
        }
      : null,
    isLoading,
    isError,
    error,
  };
};
