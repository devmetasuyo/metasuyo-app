"use client";

import { useState } from "react";
import styles from "./SidebarFilters.module.scss"; // Importar estilos específicos
import PriceFilter from "./PriceFilter"; // Importar el nuevo componente de filtro de precio

const SidebarFilters = ({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) => {
  const [selectedRarity, setSelectedRarity] = useState<string>("");

  const handleRarityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedRarity(value);
    onFilterChange({ rarity: value });
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ price: [min, max] });
  };

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.filterTitle}>Filtros</h3>
      <div className={styles.filterGroup}>
        <label htmlFor="rarity">Rareza:</label>
        <select
          id="rarity"
          value={selectedRarity}
          onChange={handleRarityChange}
          className={styles.raritySelect} // Añadir clase para el select
        >
          <option value="">Todos</option>
          <option value="1">Común</option>
          <option value="2">Raro</option>
          <option value="3">Épico</option>
          <option value="4">Legendario</option> {/* Nueva rareza */}
          <option value="5">Mítico</option> {/* Nueva rareza */}
        </select>
      </div>
      <PriceFilter onPriceChange={handlePriceChange} />
    </div>
  );
};

export default SidebarFilters;
