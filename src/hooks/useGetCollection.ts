import { useReadContract } from "wagmi";
import { privyConfig } from "@/privy";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi";
export const useGetCollection = (
  contractAddress: `0x${string}`,
  collectionId: number
) => {
  const {
    data: collectionData,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: contractAddress,
    abi: MetasuyoABI,
    functionName: "getCollectionData",
    args: [BigInt(collectionId)],
    chainId: privyConfig.defaultChain?.id,
    query: {
      enabled: !!contractAddress && collectionId >= 0,
      retry: 2,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  return {
    data: collectionData
      ? {
          name: collectionData[0] ?? "",
          description: collectionData[1] ?? "",
          imgUrl: collectionData[2] ?? "",
          ntfCount: collectionData[3] ?? "",
          createAt: collectionData[4] ?? "",
        }
      : null,
    isLoading,
    isError,
    error,
  };
};
