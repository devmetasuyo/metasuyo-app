"use client";

import { CarouselContainer } from "../Carousel/CarouselContainer";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { CarouselNftList } from "./CarouselNftList";
import { Spinner } from "@/components/common";

export const CarouselMainWallet = () => {
  const contractAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const { collectionNames, isLoading } = useGetCollectionNames(contractAddress);

  if (isLoading) {
    return (
      <div style={{ minHeight: "256px" }}>
        <Spinner />
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
