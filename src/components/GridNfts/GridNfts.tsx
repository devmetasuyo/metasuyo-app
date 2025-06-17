"use client";

import textos from "@/utils/text.json";
import { Spinner } from "@/components";
import { useGetCollectionNames } from "@/hooks/useGetCollectionNames";
import { GridNftsCollectionWrapper } from "./GridNftsCollectionWrapper";

export const GridNfts = () => {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { collectionNames, isLoading } = useGetCollectionNames(address);

  if (isLoading) return <Spinner />;
  return (
    <div
      style={{
        minHeight: "256px",
        position: "relative",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        margin: "20px",
      }}
    >
      {collectionNames.length > 0 ? (
        collectionNames.map((item: any) => {
          return (
            <GridNftsCollectionWrapper
              key={item.id}
              idCollection={item.id}
              address={address}
            />
          );
        })
      ) : (
        <p
          style={{
            position: "absolute",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            width: "100%",
            height: "100%",
            inset: 0,
          }}
        >
          {textos.profile.my_nfts}
        </p>
      )}
    </div>
  );
};
