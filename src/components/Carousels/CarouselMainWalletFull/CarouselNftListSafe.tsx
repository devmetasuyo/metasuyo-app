"use client";

import { useGetNftsByCollection } from "@/hooks/useGetNftsByCollection";
import { CarouselMainNftSafe } from "./CarouselMainNftSafe";
import { CarouselNftVerifyOwnerSafe } from "./CarouselNftVerifyOwnerSafe";
import { Spinner, Alert } from "@/components/common";

export const CarouselNftListSafe = ({ collectionId }: { collectionId: number }) => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { data, isLoading, isError, error } = useGetNftsByCollection(
    contractAddress,
    collectionId
  );

  if (isLoading) return <Spinner />;
  
  if (isError) {
    console.warn(`Error loading NFTs for collection ${collectionId}:`, error);
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: 'white' }}>
        <Alert type="info">
          <p>No se pueden cargar los NFTs de esta colección.</p>
        </Alert>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: 'white' }}>
        <Alert type="info">
          <p>No hay NFTs disponibles en esta colección.</p>
        </Alert>
      </div>
    );
  }

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

  return (
    <>
      {data.map(
        (nft) =>
          nft.name.trim() !== "" && (
            <CarouselNftVerifyOwnerSafe
              key={nft.id}
              addressCheck={adminWallet}
              id={nft.id}
            >
              <CarouselMainNftSafe id={nft.id} />
            </CarouselNftVerifyOwnerSafe>
          )
      )}
    </>
  );
}; 