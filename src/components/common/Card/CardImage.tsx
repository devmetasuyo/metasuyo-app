import Image from "next/image";
import styles from "./styles.module.scss";

export const CardImage = ({
  imageUri,
  height,
  width,
  alt,
}: {
  imageUri: string;
  height: number;
  width: number;
  alt: string;
}) => {
  return (
    <Image
      src={imageUri}
      className={styles.cardImage}
      height={height}
      width={width}
      alt={alt}
    />
  );
};
