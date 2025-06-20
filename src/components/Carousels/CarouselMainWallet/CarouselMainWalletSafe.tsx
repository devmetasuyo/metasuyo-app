"use client";

import { CarouselContainer } from "../Carousel/CarouselContainer";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { CarouselNftList } from "./CarouselNftList";
import { Spinner, Alert } from "@/components/common";

export const CarouselMainWalletSafe = () => {
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
    console.warn("Error loading collections:", error);
    return (
      <div style={{ minHeight: "256px", padding: '2rem' }}>
        <Alert type="info">
          <div style={{ textAlign: 'center' }}>
            <p>Las colecciones se cargarán cuando tengas una conexión activa.</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Conecta tu wallet para ver el contenido completo.
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
            <p>No hay colecciones disponibles en este momento.</p>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {collectionNames.map((collection) => {
        return (
          <CarouselContainer key={collection.id}>
            <CarouselNftList collectionId={collection.id} />
          </CarouselContainer>
        );
      })}
    </>
  );
}; 