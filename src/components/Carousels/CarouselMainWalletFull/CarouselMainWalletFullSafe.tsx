"use client";

import { CarouselContainer } from "../Carousel/CarouselContainer";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { CarouselNftList } from "./CarouselNftList";
import { CarouselWrapperData } from "./CarouselWrapperData";
import { Spinner, Alert } from "@/components/common";

export const CarouselMainWalletFullSafe = () => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { collectionNames, isLoading, isError, error } = useGetCollectionNames(contractAddress);

  if (isLoading) {
    return (
      <div style={{ minHeight: "256px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    console.warn("Error loading collections for market:", error);
    return (
      <div style={{ minHeight: "256px", padding: '2rem' }}>
        <Alert type="info">
          <div style={{ textAlign: 'center' }}>
            <p>No se pueden cargar las colecciones en este momento.</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Verifica tu conexión de wallet para acceder al marketplace completo.
            </p>
          </div>
        </Alert>
      </div>
    );
  }

  if (!collectionNames || collectionNames.length === 0) {
    return (
      <div style={{ minHeight: "256px", padding: '2rem' }}>
        <Alert type="info">
          <div style={{ textAlign: 'center' }}>
            <p>No hay colecciones disponibles en el marketplace.</p>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {collectionNames.map((collection) => {
        return (
          <CarouselWrapperData
            key={collection.id}
            address={contractAddress}
            collectionId={collection.id}
          >
            <CarouselContainer key={`container-${collection.id}`}>
              <CarouselNftList collectionId={collection.id} />
            </CarouselContainer>
          </CarouselWrapperData>
        );
      })}
    </>
  );
}; 