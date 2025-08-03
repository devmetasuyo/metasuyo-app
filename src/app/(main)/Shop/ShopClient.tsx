"use client";

import { useMemo, useState, useEffect } from "react";
import { CartProduct } from "../Dashboard/pos/page";
import useOrder from "@/hooks/useOrder";
import NftItem from "./NftItem";
import Cart from "./Cart";
import { Filters } from "./Filters";
import Pagination from "./Pagination";
import { Button } from "@/components";
import styles from "./Ecommerce.module.scss";

const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET as `0x${string}`;

interface ShopClientProps {
  initialProducts: CartProduct[];
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

  const [products] = useState<CartProduct[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  const [productsPriceRange] = useState<[number, number]>([0, 100000]);

  const [filters, setFilters] = useState<{ price: [number, number] }>({
    price: [0, 100000],
  });

  const itemsPerPage = 5;

  // Efecto para verificar items en el carrito cuando cambian los productos
  useEffect(() => {
    if (order && products.length > 0 && Object.keys(order.cart).length > 0) {
      console.log("🔍 Verificando items en carrito...");
      checkItemsInCart(products);
    }
  }, [products, order?.cart, checkItemsInCart]);

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
        <Button 
          onClick={() => {
            console.log("🧪 Test: Agregando producto de prueba");
            addItemToCart({
              id: "test-123",
              imageSrc: "/test-image.jpg",
              name: "Producto de Prueba",
              quantity: 1,
              price: 100,
            });
          }}
          style={{ marginLeft: "10px" }}
        >
          Test Add
        </Button>
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
                  console.log("🛒 onBuy ejecutado para producto:", { id, nombre, precio, image });
                  if (!id) {
                    console.log("❌ ID no válido:", id);
                    return;
                  }
                  const cartItem = {
                    id: id.toString(),
                    imageSrc: image,
                    name: nombre,
                    quantity: 1,
                    price: Number(precio),
                  };
                  console.log("📦 Item a agregar al carrito:", cartItem);
                  addItemToCart(cartItem);
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