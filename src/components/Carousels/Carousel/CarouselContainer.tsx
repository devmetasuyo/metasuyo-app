"use client";

import "keen-slider/keen-slider.min.css";
import "./styles.scss";
import React from "react";
import styles from "./styles.module.scss";
import { useKeenSlider } from "keen-slider/react";
import clsx from "clsx";

interface MyCarouselProps extends React.PropsWithChildren {}

export const CarouselContainer: React.FC<MyCarouselProps> = ({ children }) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: "snap",
    loop: true,
    rtl: false,
    slides: {
      perView: "auto",
    },
  });

  return (
    <div
      ref={sliderRef}
      className={clsx(styles.carouselContainer, "keen-slider")}
      style={{ minHeight: "256px", marginBottom: "1.5rem" }}
    >
      {children}
    </div>
  );
};
