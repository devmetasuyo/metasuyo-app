"use client";

import { Banner, Degradado, Title } from "@/components";
import textos from "@/utils/text.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterButton from "./FilterButton";
import FilterDrawer from "./FilterDrawer";
import styles from "./Ecommerce.module.scss";
import NftItem from "./NftItem";
import Pagination from "./Pagination";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

import useOrder from "@/hooks/useOrder";
import Cart from "./Cart";

function EcommercePage() {
  const { addItemToCart,order,removeItemFromCart ,totalPrice} = useOrder();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const itemsPerPage = 5;

  useEffect(() => {
    async function getAllProducts() {
      const response = await fetch("/api/products/all");
      const data = await response.json();
      if (data) {
        setProducts(data.products);
      }
    }
    getAllProducts();
  }, []);

  const handleFilterChange = useCallback(
    (filters?: { categoria?: string; precio?: [0, 1000] }) => {
      let updatedProducts = products;
      if (filters && filters.categoria) {
        updatedProducts = updatedProducts.filter(
          (products) => products.categoria === filters.categoria
        );
      }
      if (filters) {
        updatedProducts = updatedProducts.filter((products) => {
          if (filters.precio)
            products.precio >= filters.precio[0] &&
              products.precio <= filters.precio[1];
        });
      }
      setFilteredProducts(updatedProducts);
      setCurrentPage(1);
    },
    [products]
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = useMemo(() => {
    handleFilterChange();
    return filteredProducts;
  }, [products, filteredProducts]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Banner
        title={textos.ecommerce.banner.title}
        subtitle={""}
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <Title title="Colección de NFTs" />

      <FilterDrawer
        isOpen={showFilters}
        onClose={toggleFilters}
        onFilterChange={handleFilterChange}
      />
      <div className={styles.container}>
        <FilterButton onClick={toggleFilters} />
        <Cart order={order} handleRemoveItemFromCart={removeItemFromCart} totalPrice={totalPrice}  />
        <div className={styles.nftGrid}>
          {currentProducts.map(
            ({ precio, categoria, id, image, nombre, descripcion }) => (
              <NftItem
                key={id}
                id={id}
                categoria={categoria}
                descripcion={descripcion}
                image={image}
                nombre={nombre}
                precio={Number(precio)}
                onBuy={() =>
                  addItemToCart({
                    id: id.toString(),
                    imageSrc: image,
                    name: nombre,
                    quantity: 1,
                    price: Number(precio),
                  })
                }
              />
            )
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default EcommercePage;
