"use client";

import { Banner, Degradado } from "@/components";
import textos from "@/utils/text.json";
import { useCallback, useEffect, useMemo, useState } from "react";

import styles from "./Ecommerce.module.scss";
import NftItem from "./NftItem";
import Pagination from "./Pagination";

import useOrder from "@/hooks/useOrder";
import Cart from "./Cart";
import { Filters } from "./Filters";
import { CartProduct } from "../Dashboard/pos/page";

const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

function EcommercePage() {
  const {
    addItemToCart,
    order,
    removeItemFromCart,
    totalPrice,
    totalItems,
    checkItemsInCart,
  } = useOrder();

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [productsPriceRange] = useState<
    [number, number]
  >([0, 100000]);

  const [filters, setFilters] = useState<{ price: [number, number] }>({
    price: [0, 100000],
  });

  const itemsPerPage = 5;

  const getAllProducts = useCallback(async () => {
    const response = await fetch("/api/products/all");
    const data = await response.json();
    if (data) {
      setProducts(data.products);
    }
  }, [products]);

  useEffect(() => {
    if (order && products.length > 0) checkItemsInCart(products);
  }, [products, order]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const currentProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        +product.precio >= filters.price[0] &&
        +product.precio <= filters.price[1]
      )
        return products;
    });
  }, [products, filters]);

  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);

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
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <Filters
            values={{
              priceMin: productsPriceRange[0],
              priceMax: productsPriceRange[1],
            }}
            onFilterChange={(filtersIn) => {
              setFilters({ price: filtersIn.price ?? filters.price });
            }}
          />
          <Cart
            to={adminWallet}
            totalItems={totalItems}
            order={order}
            handleRemoveItemFromCart={removeItemFromCart}
            totalPrice={totalPrice}
          />
        </div>
        <div className={styles.nftGrid}>
          {currentProducts.map(
            ({ precio, categoria, id, image, nombre, descripcion, cantidad }) =>
              cantidad > 0 && (
                <NftItem
                  key={id}
                  id={id}
                  cantidad={cantidad}
                  categoria={categoria}
                  descripcion={descripcion}
                  image={image}
                  nombre={nombre}
                  precio={Number(precio)}
                  onBuy={() => {
                    if (!id) return;
                    addItemToCart({
                      id: id.toString(),
                      imageSrc: image,
                      name: nombre,
                      quantity: 1,
                      price: Number(precio),
                    });
                  }}
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
