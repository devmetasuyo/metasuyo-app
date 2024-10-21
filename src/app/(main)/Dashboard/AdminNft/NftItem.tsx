import React from "react";
import styles from "./NftItem.module.scss";
import { RarityToColor } from "@/utils/RarityToColor";
import { RarityToString } from "@/utils/RarityToString";
import Image from "next/image";

interface NftItemProps {
  name: string;
  imageUri: string;
  price: number;
  duplicates: number;
  rarity: number; // Cambiado a número para usar con las funciones
}

const rarityMap: { [key: number]: string } = {
  1: "Ordinario",
  2: "Común",
  3: "Raro",
  4: "Legendario",
  5: "Mítico",
};

const NftItem: React.FC<NftItemProps> = ({
  name,
  imageUri,
  price,
  duplicates,
  rarity,
}) => {
  return (
    <div
      key={name}
      className={`${styles.nftCard} ${styles[`rarity${rarity}`]}`}
    >
      <div className={styles.nftInfo}>
        <span className={styles.rank}>{Math.floor(Math.random() * 100)}</span>
        <Image
          src={imageUri}
          alt={name}
          width={48}
          height={48}
          className={styles.nftImage}
        />
        <div>
          <p className={styles.nftName}>{name}</p>
          <span
            className={`${styles.rarityTag} ${styles[`rarityTag${rarity}`]}`}
          >
            {rarityMap[rarity]}
          </span>
        </div>
      </div>
      <div className={styles.priceInfo}>
        <p className={styles.price}>
          $
          {(price * 1000).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className={styles.ethPrice}>Ξ{price.toFixed(2)}</p>
        {duplicates > 0 && (
          <p className={styles.duplicates}>Duplicados: {duplicates}</p>
        )}
      </div>
    </div>
  );
};

export default NftItem;
