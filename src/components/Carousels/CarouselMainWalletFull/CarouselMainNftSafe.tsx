import { CarouselCard } from "@/components/Cards";
import { useGetNftData } from "@/hooks/useGetNftData";
import { Alert } from "@/components/common";

export const CarouselMainNftSafe = ({ id }: { id: number }) => {
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
    console.warn(`Error loading NFT data for ID ${id}:`, error);
    return (
      <div style={{ padding: '1rem', minWidth: '200px' }}>
        <Alert type="info">
          <p style={{ fontSize: '0.8rem' }}>Error cargando NFT #{id}</p>
        </Alert>
      </div>
    );
  }

  if (!nft) {
    return (
      <div style={{ padding: '1rem', minWidth: '200px' }}>
        <Alert type="info">
          <p style={{ fontSize: '0.8rem' }}>NFT #{id} no encontrado</p>
        </Alert>
      </div>
    );
  }

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