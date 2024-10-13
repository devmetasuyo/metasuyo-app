"use client";
import React, { useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import styles from "./styles.module.scss";
import { Nft } from "@/types";
import { Spinner } from "@/components/Common";
import { CarouselCard } from "@/components/Cards";

interface MyCarouselProps {
  collections: Nft[];
}

export const Carousel: React.FC<MyCarouselProps> = ({ collections }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slider, setSlider] = useState<boolean>(false);

  const [sliderRef] = useKeenSlider({
    initial: 0,
    loop: true,
    breakpoints: {
      "(min-width: 600px)": {
        slides: { perView: 4, spacing: 10 },
      },
      "(min-width: 1000px)": {
        slides: { perView: 6, spacing: 15 },
      },
    },
    slides: { perView: 1 },
    // slideChanged(slider) {
    //   setCurrentSlide(slider.track.details.rel);
    // },
    // created() {
    //   setLoading(false);
    //   setSlider(true);
    // },
  });

  if (loading) {
    return (
      <div style={{ minHeight: "256px" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.carouselContainer} style={{ minHeight: "256px" }}>
      {collections.length > 0 ? (
        <div
          ref={sliderRef}
          style={slider ? { display: "flex" } : { visibility: "collapse" }}
          className="keen-slider"
        >
          {collections.map((item: Nft) => (
            <CarouselCard
              key={item.collectionId}
              id={item.collectionId}
              info={item}
              href={`/Article/${item.collectionId}`}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "white",
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          No se encontraron colecciones
        </div>
      )}
    </div>
  );
};
