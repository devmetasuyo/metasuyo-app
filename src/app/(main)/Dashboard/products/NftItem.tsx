import React from "react";
import styles from "./NftItem.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface NftItemProps {
  id?: number;
  name: string;
  image?: string;
  price: number;
  category: string;
}

const NftItem: React.FC<NftItemProps> = ({
  name,
  image,
  price,
  category,
  id,
}) => {
  const router = useRouter();

  return (
    <div
      key={name}
      className={`${styles.nftCard} ${styles[`rarity${2}`]}`}
      onClick={() => router.push(`/Dashboard/products/${id}`)}
    >
      <div className={styles.nftInfo}>
        <Image
          src={image ?? "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className={styles.nftImage}
        />
        <div>
          <p className={styles.nftName}>{name}</p>
          <span className={`${styles.rarityTag} ${styles[`rarityTag${2}`]}`}>
            {category}
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
        <p className={styles.ethPrice}>{price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default NftItem;
