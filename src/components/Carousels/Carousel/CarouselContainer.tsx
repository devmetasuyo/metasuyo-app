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
    breakpoints: {
      "(min-width: 600px)": {
        slides: { perView: 4, spacing: 10 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 6, spacing: 15 },
      },
    },
    slides: { perView: 1 },
  });

  return (
    <div
      ref={sliderRef}
      className={clsx(styles.carouselContainer, "keen-slider")}
      style={{ minHeight: "256px", marginBottom: "20px" }}
    >
      {children}
    </div>
  );
};
