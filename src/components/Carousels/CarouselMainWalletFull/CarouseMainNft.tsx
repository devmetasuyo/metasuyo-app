import { CarouselCard } from "@/components/Cards";
import { useGetNftData } from "@/hooks/useGetNftData";

export const CarouselMainNft = ({ id }: { id: number }) => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const {
    data: nft,
    isLoading,
    isError,
    error,
  } = useGetNftData(contractAddress, id);

  if (isLoading) return <div style={{ color: 'white', padding: '1rem' }}>Cargando NFT...</div>;
  
  if (isError) {
    console.warn(`Error cargando datos del NFT ${id}:`, error);
    return null; // No mostrar nada si hay error
  }

  if (!nft) return null; // No mostrar nada si no hay datos

  return (
    <CarouselCard
      key={id}
      id={id}
      index={id}
      href={`/Article/${id}`}
      info={{
        name: nft.name,
        imageUri: nft.imageUri,
        rarity: nft.rarity,
        jsonData: nft.jsonData,
        price: nft.price,
        duplicates: nft.duplicates,
        collectionId: nft.collectionId,
      }}
    />
  );
};
