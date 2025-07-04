"use client";

import { useGetCollection } from "@/hooks/useGetCollection";
import { useGetNftsByCollection } from "@/hooks/useGetNftsByCollection";
import { PropsWithChildren } from "react";

import Image from "next/image";

import styles from "./CarouselWrapperData.module.scss";
import { Spinner, Title } from "@/components/common";

interface CarouselWrapperDataProps extends PropsWithChildren {
  collectionId: number;
  address: `0x${string}`;
}

export const CarouselWrapperData = ({
  address,
  children,
  collectionId,
}: CarouselWrapperDataProps) => {
  const { data, isLoading: isLoadingCollection } = useGetCollection(address, collectionId);
  const { data: nftsData, isLoading: isLoadingNfts } = useGetNftsByCollection(address, collectionId);

  if (isLoadingCollection || isLoadingNfts)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <Spinner />
      </div>
    );

  // Si no hay datos de colección, no renderizar nada
  if (!data) {
    return null;
  }

  // Si no hay NFTs, no renderizar nada
  if (!nftsData || nftsData.length === 0) {
    return null;
  }

  // Filtrar NFTs válidos (con nombres)
  const validNfts = nftsData.filter(nft => nft.name.trim() !== "");
  
  // Si no hay NFTs válidos, no renderizar nada
  if (validNfts.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Title title={data?.name ?? "Sin titulo"} />
      <p
        style={{
          textAlign: "center",
          color: "white",
          paddingBottom: "20px",
        }}
      >
        {data?.description}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          padding: "0 2rem",
        }}
      >
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            width={300}
            height={400}
            alt="Imagen de la colección"
            src={data?.imgUrl ?? "/icon.png"}
            onError={(e) => {
              e.currentTarget.src = "/icon.png";
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            borderTop: "#F5A602 2px solid",
            padding: "1rem 0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
