import { RarityToColor } from "@/utils/RarityToColor";
import { RarityToString } from "@/utils/RarityToString";
import textos from "@/utils/text.json";
import styles from "./styles.module.scss";
interface Props {
  imageUri: string;
  name: string;
  rarity: number;
  onClose: () => void;
}

export const NftMintCard = ({ imageUri, name, rarity, onClose }: Props) => {
  const rarityStr = RarityToString(rarity);
  const color = RarityToColor(rarity);

  return (
    <div className={styles.nft}>
      <div className={styles.main}>
        <h2>{textos.modals.mintNft.title}!</h2>
        <p>{textos.modals.mintNft["sub-title"]}</p>
        <img
          className={styles.tokenImage}
          src={imageUri && imageUri.includes("https") ? imageUri : "/icon.png"}
          alt="NFT"
        />
        <h2>{name}</h2>
        <p
          className={styles.description}
          style={{
            color: color,
          }}
        >
          {rarityStr.toLocaleUpperCase()}
        </p>
        <button onClick={() => onClose()}>OK</button>
      </div>
    </div>
  );
};
