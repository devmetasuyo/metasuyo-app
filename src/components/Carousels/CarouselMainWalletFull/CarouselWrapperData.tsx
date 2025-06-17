"use client";

import { useGetCollection } from "@/hooks/useGetCollection";
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
  const { data, isLoading } = useGetCollection(address, collectionId);

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spinner />
      </div>
    );

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
            height={400} // Ajustado para mantener el aspect ratio 9:16
            alt="Imagen de la colección"
            src={data?.imgUrl ?? "/icon.png"}
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
