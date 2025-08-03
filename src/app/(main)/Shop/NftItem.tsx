"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NftItem.module.scss";
import { Button, Text } from "@/components";
import { SiEthereum } from "react-icons/si";
import { CartProduct } from "../Dashboard/pos/page";
import { PiCurrencyDollar, PiCurrencyEthFill } from "react-icons/pi";

// Tipo específico para productos del Shop con ID string
interface ShopProduct extends Omit<CartProduct, 'id'> {
  id: string;
}

interface NftItemProps extends ShopProduct {
  onBuy: () => void;
}

const NftItem: React.FC<NftItemProps> = ({
  id,
  precio,
  categoria,
  image,
  nombre,
  onBuy,
}) => {
  const router = useRouter();
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setPrice(Number(price));
    }
  }, [id]);

  return (
    <div className={`${styles.nftItem}`}>
      <img 
        src={image} 
        alt={nombre} 
        className={styles.nftImage}
        onClick={() => {
          console.log("Click en imagen, id:", id);
          router.push(`/Shop/${id}`);
        }}
        style={{ cursor: 'pointer' }}
      />
      <div className={styles.nftDetails}>
        <h3 
          className={styles.nftName}
          onClick={() => {
            console.log("Click en título, id:", id);
            router.push(`/Shop/${id}`);
          }}
          style={{ cursor: 'pointer' }}
        >
          {nombre}
        </h3>
        <Text>{categoria}</Text>
        <div className={styles.nftPriceContainer}>
          <p className={styles.nftPrice}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "0.25rem",
                marginRight: "2rem",
              }}
            >
              <PiCurrencyDollar size={16} />{" "}
              {Intl.NumberFormat("es-ES", {
                maximumSignificantDigits: 2,
                maximumFractionDigits: 2,
                roundingPriority: "morePrecision",
              }).format(precio * price)}
            </span>
          </p>
          <p className={styles.nftPrice}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "0.25rem",
                marginRight: "2rem",
              }}
            >
              <PiCurrencyEthFill size={16} /> {precio}
            </span>
          </p>
          <Button 
            className={styles.buyButton} 
            size="xs" 
            onClick={(e) => {
              e.stopPropagation(); // Evitar que se propague el click
              console.log("Click en comprar, id:", id);
              onBuy();
            }}
          >
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
