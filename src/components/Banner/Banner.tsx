"use client";

import React from "react";
import styles from "./styles.module.scss";
import { ButtonSignIn } from "../Buttons";
import Image from "next/image";

interface BannerProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  icon: boolean;
  session: boolean;
  style?: React.CSSProperties;
}

// Define the Banner component
const Banner: React.FC<BannerProps> = ({
  imageUrl,
  title,
  subtitle,
  style,
  session,
  icon,
}) => {
  return (
    <div
      className={styles.banner}
      style={{ backgroundImage: `url(${imageUrl})`, ...style }}
    >
      <h1 className={styles.title}>{title}</h1>
      {icon && (
        <Image
          width={180}
          height={180}
          src="/icon-big.png"
          className={styles.logoBanner}
          alt="icono"
        />
      )}
      <h2 className={styles.subtitle}>{subtitle}</h2>
      {!session && <ButtonSignIn>Unete</ButtonSignIn>}
    </div>
  );
};

export default Banner;
