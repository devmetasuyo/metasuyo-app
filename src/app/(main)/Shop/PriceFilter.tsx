"use client";

import { useState } from "react";
import styles from "./PriceFilter.module.scss";

const PriceFilter = ({
  onPriceChange,
}: {
  onPriceChange: (min: number, max: number) => void;
}) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxPrice);
    setMinPrice(value);
    onPriceChange(value, maxPrice);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minPrice);
    setMaxPrice(value);
    onPriceChange(minPrice, value);
  };

  return (
    <div className={styles.priceFilter}>
      <h4>Filtrar por Precio</h4>
      <div className={styles.inputGroup}>
        <label htmlFor="minPrice">Mínimo:</label>
        <div className={styles.inputWithLabel}>
          <input
            type="number"
            value={minPrice}
            onChange={handleMinChange}
            className={styles.numberInput}
          />
          <span>ETH</span>
        </div>
        <input
          type="range"
          id="minPrice"
          min="0"
          max="5"
          value={minPrice}
          onChange={handleMinChange}
          className={styles.rangeInput}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="maxPrice">Máximo:</label>
        <div className={styles.inputWithLabel}>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxChange}
            className={styles.numberInput}
          />
          <span>ETH</span>
        </div>
        <input
          type="range"
          id="maxPrice"
          min="0"
          max="5"
          value={maxPrice}
          onChange={handleMaxChange}
          className={styles.rangeInput}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
