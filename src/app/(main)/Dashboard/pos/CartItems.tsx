"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItem } from "./CartItem";
import { Text } from "@/components";
import styles from "./CartItems.module.scss";
import { CartProduct } from "./page";

interface Props {
  categoryFilter?: string;
  priceFilter?: string;
  searchTerm?: string;
  handleSelectItem: (product: CartProduct) => void;
  priceUsd: number;
}

export const CartItems = ({
  categoryFilter = "all",
  priceFilter = "all",
  searchTerm = "",
  handleSelectItem,
  priceUsd,
}: Props) => {
  const [clothingItems, setClothingItems] = useState<CartProduct[]>([]);

  const filteredItems = useMemo(() => {
    return clothingItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.categoria === categoryFilter;
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under50" && item.precio < 50) ||
        (priceFilter === "50to100" &&
          item.precio >= 50 &&
          item.precio <= 100) ||
        (priceFilter === "over100" && item.precio > 100);
      const matchesSearch = item.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [categoryFilter, priceFilter, searchTerm, clothingItems]);

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("/api/products/all");
      const data = await response.json();

      if (data.status === "success") {
        const products = data.products;

        if (Array.isArray(products)) {
          const parsedProducts: CartProduct[] = products.map((product) => {
            return {
              id: product.id,
              categoria: product.categoria,
              nombre: product.nombre,
              precio: +product.precio,
              image: product.image,
              descripcion: product.descripcion,
              cantidad: 0,
            };
          });

          setClothingItems(parsedProducts);
        }
      }
    }

    fetchItems();
  }, []);

  return (
    <section className={styles.popularItems}>
      <Text as="h3">
        Artículos Populares{" "}
        <Text as="span" variant="primary" className={styles.seeMore}>
          Ver Más
        </Text>
      </Text>
      <div className={styles.items}>
        {filteredItems.map((item) => {
          if (item.id === undefined) return;

          return (
            <CartItem
              handleClick={handleSelectItem}
              key={item.id}
              id={item.id}
              image={item.image}
              name={item.nombre}
              price={item.precio}
              priceUsd={priceUsd * item.precio}
              category={item.categoria}
              description={item.descripcion}
              quantity={item.cantidad}
            />
          );
        })}
      </div>
    </section>
  );
};
