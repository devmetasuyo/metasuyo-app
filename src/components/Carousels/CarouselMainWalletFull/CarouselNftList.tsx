"use client";

import { useGetNftsByCollection } from "@/hooks/useGetNftsByCollection";
import { CarouselMainNft } from "./CarouseMainNft";

import { CarouselNftVerifyOwner } from "../Carousel/CarouselNftVerifyOwner";
import { Spinner } from "@/components/common";

export const CarouselNftList = ({ collectionId }: { collectionId: number }) => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { data, isLoading, isError, error } = useGetNftsByCollection(
    contractAddress,
    collectionId
  );

  if (isLoading) return <Spinner />;
  
  if (isError) {
    console.warn(`Error cargando NFTs de la colección ${collectionId}:`, error);
    return (
      <div style={{ color: 'white', padding: '1rem', textAlign: 'center' }}>
        <p>No se pueden cargar los NFTs de esta colección</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'white', padding: '1rem', textAlign: 'center' }}>
        <p>No hay NFTs disponibles en esta colección</p>
      </div>
    );
  }

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

  // Filtrar NFTs con nombres válidos
  const validNfts = data.filter(nft => nft.name.trim() !== "");
  
  if (validNfts.length === 0) {
    return (
      <div style={{ color: 'white', padding: '1rem', textAlign: 'center' }}>
        <p>No hay NFTs con nombres válidos en esta colección</p>
      </div>
    );
  }

  return (
    <>
      {validNfts.map((nft) => (
        <CarouselNftVerifyOwner
          key={nft.id}
          addressCheck={adminWallet || ""} // Fallback a string vacío
          id={nft.id}
        >
          <CarouselMainNft id={nft.id} />
        </CarouselNftVerifyOwner>
      ))}
    </>
  );
};
