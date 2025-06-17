"use client";

import { FaRegEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Nft } from "@/types";
import clsx from "clsx";

interface Props {
  id: number;
  info: Nft;
  index?: number;
  href?: string;
}

export const CarouselCard = ({ id, href, info, index }: Props) => {
  const router = useRouter();
  return (
    <div
      className={clsx(
        "keen-slider__slide",
        index ? "number-slide" + index : "",
        styles.metasuyoSlider
      )}
    >
      <Image
        width={200}
        height={200}
        className={styles.imgSlider}
        src={info.imageUri.trim() === "" ? "/icon.png" : info.imageUri}
        alt={`image-${id}`}
      />
      {href && (
        <button
          onClick={() => {
            router.push(href);
          }}
          className={clsx(styles.eyeButton)}
        >
          <FaRegEye />
        </button>
      )}
      <p className={styles.titleSlider}>{info.name}</p>
    </div>
  );
};
