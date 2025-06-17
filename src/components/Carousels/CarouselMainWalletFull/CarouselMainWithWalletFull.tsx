"use client";

import { CarouselContainer } from "../Carousel/CarouselContainer";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { CarouselNftList } from "./CarouselNftList";

import { CarouselWrapperData } from "./CarouselWrapperData";
import { Spinner } from "@/components/common";

export const CarouselMainWalletFull = () => {
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
          <CarouselWrapperData
            key={collection.id}
            address={contractAddress}
            collectionId={collection.id}
          >
            <CarouselContainer key={collection.id}>
              <CarouselNftList collectionId={collection.id} />
            </CarouselContainer>
          </CarouselWrapperData>
        );
      })}
    </>
  );
};
