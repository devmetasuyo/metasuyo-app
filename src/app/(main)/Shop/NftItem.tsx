"use client";

import React from "react";
import styles from "./NftItem.module.scss";
import { Button } from "@/components";
import { Product } from "@/types/product";

interface NftItemProps extends Product {
  onBuy: () => void;
}

const NftItem: React.FC<NftItemProps> = ({
  id,
  descripcion,
  precio,
  categoria,
  image,
  nombre,
  onBuy,
}) => {
  return (
    <div className={`${styles.nftItem}`}>
      <img src={image} alt={nombre} className={styles.nftImage} />
      <div className={styles.nftDetails}>
        <h3 className={styles.nftName}>{nombre}</h3>
        <p className={styles.nftRarity}>{categoria}</p>
        <div className={styles.nftPriceContainer}>
          <p className={styles.nftPrice}>Precio: {precio} ETH</p>
          <Button className={styles.buyButton} size="xs" onClick={onBuy}>
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NftItem;
