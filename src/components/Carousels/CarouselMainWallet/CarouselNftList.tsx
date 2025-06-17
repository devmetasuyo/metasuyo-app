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
  if (isError) return <div>Error {error?.message}</div>;

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

  return (
    <>
      {data?.map(
        (nft) =>
          nft.name.trim() !== "" && (
            <CarouselNftVerifyOwner
              key={nft.id}
              addressCheck={adminWallet}
              id={nft.id}
            >
              <CarouselMainNft id={nft.id} />
            </CarouselNftVerifyOwner>
          )
      )}
    </>
  );
};
