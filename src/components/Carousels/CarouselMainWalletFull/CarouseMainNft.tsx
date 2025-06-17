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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error {error?.message}</div>;

  if (!nft) return <div>No nft</div>;

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
