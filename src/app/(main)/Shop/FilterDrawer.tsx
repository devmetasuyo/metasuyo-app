"use client";

import { useEffect } from "react";
import styles from "./FilterDrawer.module.scss"; // Asegúrate de crear este archivo de estilos
import SidebarFilters from "./SidebarFilters";

const FilterDrawer = ({
  isOpen,
  onClose,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: any) => void;
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖
      </button>
      <SidebarFilters onFilterChange={onFilterChange} />
    </div>
  );
};

export default FilterDrawer;
