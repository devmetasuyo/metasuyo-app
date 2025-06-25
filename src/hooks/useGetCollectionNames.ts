import { useReadContract } from "wagmi";
import { privyConfig } from "@/privy";
import { MetasuyoAbi as MetasuyoABI } from "../abis/MetasuyoAbi"; // Asegúrate de tener el ABI del contrato

// Obtener los nombres de las colecciones

export const useGetCollectionNames = (contractAddress: `0x${string}`) => {
  const {
    data: collectionNames,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: contractAddress,
    abi: MetasuyoABI,
    functionName: "getCollectionNames",
    chainId: privyConfig.defaultChain?.id,
    query: {
      enabled: !!contractAddress,
      retry: 3,
      retryDelay: 1000,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      // Permitir lectura sin conexión de wallet
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  });

  const names =
    collectionNames && collectionNames.length > 0 ? collectionNames[0] : [];
  const ids =
    collectionNames && collectionNames.length > 0 ? collectionNames[1] : [];

  if (names.length !== ids.length) throw new Error("Invalid collection names");

  const parsedCollectionNames = names.map((name, index) => ({
    id: Number(ids[index]),
    name,
  }));

  return {
    isLoading,
    isError,
    error,
    collectionNames: parsedCollectionNames,
  };
};
