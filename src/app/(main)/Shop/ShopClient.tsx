"use client";

import { useMemo, useState, useEffect } from "react";
import { CartProduct } from "../Dashboard/pos/page";
import useOrder from "@/hooks/useOrder";
import NftItem from "./NftItem";
import Cart from "./Cart";
import { Filters } from "./Filters";
import Pagination from "./Pagination";
import styles from "./Ecommerce.module.scss";

const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

// Tipo específico para productos del Shop con ID string (UUID)
interface ShopProduct extends Omit<CartProduct, 'id'> {
  id: string;
}

interface ShopClientProps {
  initialProducts: ShopProduct[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const {
    addItemToCart,
    order,
    removeItemFromCart,
    totalPrice,
    totalItems,
    checkItemsInCart,
  } = useOrder();

  const [products] = useState<ShopProduct[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  const [productsPriceRange] = useState<[number, number]>([0, 100000]);

  const [filters, setFilters] = useState<{ price: [number, number] }>({
    price: [0, 100000],
  });

  const itemsPerPage = 5;

  // TEMPORALMENTE DESHABILITADO - Efecto para verificar items en el carrito 
  // useEffect(() => {
  //   console.log("🔍 useEffect - checkItemsInCart ejecutándose");
  //   console.log("🔍 Order:", order);
  //   console.log("🔍 Products length:", products.length);
  //   console.log("🔍 Cart length:", order ? Object.keys(order.cart).length : 0);
    
  //   if (order && products.length > 0 && Object.keys(order.cart).length > 0) {
  //     console.log("🔍 Ejecutando checkItemsInCart...");
  //     // Convertir ShopProduct[] a CartProduct[] para checkItemsInCart
  //     const cartProducts = products.map(product => ({
  //       ...product,
  //       id: parseInt(product.id.slice(-8), 16) || 1, // Convertir parte del UUID a number
  //     }));
  //     checkItemsInCart(cartProducts);
  //   } else {
  //     console.log("🔍 Condiciones no cumplidas, no ejecutando checkItemsInCart");
  //   }
  // }, [products, checkItemsInCart]); // Removido order?.cart para evitar ejecución al agregar items

  const currentProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        +product.precio >= filters.price[0] &&
        +product.precio <= filters.price[1]
      );
    });
  }, [products, filters]);

  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentProducts.slice(startIndex, endIndex);
  }, [currentProducts, currentPage, itemsPerPage]);

  return (
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
        {paginatedProducts.map(
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
                  console.log("🛒 Botón Comprar presionado para:", nombre);
                  console.log("🛒 ID del producto:", id);
                  console.log("🛒 Estado actual del carrito - totalItems:", totalItems);
                  if (!id) return;
                  const itemToAdd = {
                    id: id, // ID ya es string (UUID)
                    imageSrc: image,
                    name: nombre,
                    quantity: 1,
                    price: Number(precio),
                  };
                  console.log("🛒 Item a agregar:", itemToAdd);
                  addItemToCart(itemToAdd);
                  console.log("🛒 addItemToCart ejecutado");
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
  );
}