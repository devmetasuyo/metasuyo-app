"use client";

import { useGetCollection } from "@/hooks/useGetCollection";
import { PropsWithChildren } from "react";
import Image from "next/image";
import styles from "./CarouselWrapperData.module.scss";
import { Spinner, Title, Alert } from "@/components/common";

interface CarouselWrapperDataSafeProps extends PropsWithChildren {
  collectionId: number;
  address: `0x${string}`;
}

export const CarouselWrapperDataSafe = ({
  address,
  children,
  collectionId,
}: CarouselWrapperDataSafeProps) => {
  const { data, isLoading, isError, error } = useGetCollection(address, collectionId);

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

  if (isError) {
    console.warn(`Error loading collection data for ID ${collectionId}:`, error);
    return (
      <div style={{ padding: '2rem' }}>
        <Alert type="info">
          <div style={{ textAlign: 'center' }}>
            <p>No se pueden cargar los datos de esta colección.</p>
          </div>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert type="info">
          <div style={{ textAlign: 'center' }}>
            <p>Colección no encontrada.</p>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Title title={data.name || "Sin título"} />
      <p
        style={{
          textAlign: "center",
          color: "white",
          paddingBottom: "20px",
        }}
      >
        {data.description || "Sin descripción"}
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
            src={data.imgUrl || "/icon.png"}
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