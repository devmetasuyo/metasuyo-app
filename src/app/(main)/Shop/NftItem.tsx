"use client";

import React, { useEffect, useState } from "react";
import styles from "./NftItem.module.scss";
import { Button, Text } from "@/components";
import { SiEthereum } from "react-icons/si";
import { CartProduct } from "../Dashboard/pos/page";
import { PiCurrencyDollar, PiCurrencyEthFill } from "react-icons/pi";

interface NftItemProps extends CartProduct {
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
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setPrice(Number(price));
    }
  }, [id]);

  return (
    <div className={`${styles.nftItem}`}>
      <img src={image} alt={nombre} className={styles.nftImage} />
      <div className={styles.nftDetails}>
        <h3 className={styles.nftName}>{nombre}</h3>
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
              <PiCurrencyEthFill size={16} /> {precio}
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
              <PiCurrencyDollar size={16} />{" "}
              {Intl.NumberFormat("es-ES", {
                maximumSignificantDigits: 2,
                maximumFractionDigits: 2,
                roundingPriority: "morePrecision",
              }).format(precio * price)}
            </span>
          </p>
          <Button className={styles.buyButton} size="xs" onClick={onBuy}>
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
