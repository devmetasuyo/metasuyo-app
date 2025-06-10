"use client";

import { useState } from "react";
import styles from "./FilterButton.module.scss"; // Asegúrate de crear este archivo de estilos

const FilterButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className={styles.filterButton} onClick={onClick}>
      <span className="icon">🔍</span>{" "}
      {/* Puedes usar un ícono de embudo aquí */}
      Filtros
    </button>
  );
};

export default FilterButton;
