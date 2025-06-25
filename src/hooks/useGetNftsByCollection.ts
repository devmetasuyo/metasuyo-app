import { useReadContract } from "wagmi";
import { privyConfig } from "@/privy";
import { MetasuyoAbi as MetasuyoABI } from "@/abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato

export const useGetNftsByCollection = (
  contractAddress: `0x${string}`,
  collectionId: number
) => {
  const {
    data: nftsInCollection,
    error,
    isLoading,
    isError,
  } = useReadContract({
    address: contractAddress,
    abi: MetasuyoABI,
    functionName: "getNFTsInCollection",
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

  const names =
    nftsInCollection && nftsInCollection.length > 0 ? nftsInCollection[1] : [];
  const ids =
    nftsInCollection && nftsInCollection.length > 0 ? nftsInCollection[0] : [];

  if (names.length !== ids.length) throw new Error("Invalid collection names");

  const parsedNftsInCollection = names.map((name, index) => ({
    id: Number(ids[index]),
    name,
  }));

  return {
    data: parsedNftsInCollection,
    isLoading,
    isError,
    error,
  };
};
