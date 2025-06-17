"use client";

import { useState } from "react";
import styles from "./Filters.module.scss"; // Importar estilos específicos
import PriceFilter from "./PriceFilter"; // Importar el nuevo componente de filtro de precio
import {
  Button,
  Drawer,
  DrawerActions,
  DrawerBody,
  DrawerHeader,
} from "@/components";

export const Filters = ({
  onFilterChange,
  values,
}: {
  onFilterChange: (filters: { price: [number, number] }) => void;
  values: {
    priceMin: number;
    priceMax: number;
  };
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  return (
    <>
      <Button
        className={styles.filterButton}
        onClick={() => setShowFilters(true)}
      >
        <span className="icon">🔍</span> Filtros
      </Button>
      <Drawer isOpen={showFilters} onClose={() => setShowFilters(false)}>
        <DrawerHeader>
          <h3 className={styles.filterTitle}>Filtros</h3>
        </DrawerHeader>
        <DrawerBody>
          <PriceFilter
            min={values.priceMin}
            max={values.priceMax}
            onPriceChange={handlePriceChange}
          />
        </DrawerBody>
        <DrawerActions>
          <Button
            color="danger"
            onClick={() => setShowFilters(false)}
            style={{
              marginRight: "10px",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onFilterChange({ price: priceRange });
              setShowFilters(false);
            }}
          >
            Buscar
          </Button>
        </DrawerActions>
      </Drawer>
    </>
  );
};
