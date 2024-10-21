// src/app/(main)/Shop/Cart.tsx
"use client";

import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import styles from "./Cart.module.scss";
import { useAccount } from "wagmi";

interface CartProps {
  totalPrice: number;
  order: Order | null;
  handleRemoveItemFromCart: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({
  totalPrice,
  order,
  handleRemoveItemFromCart,
}) => {
  const { address } = useAccount();
  const router = useRouter();

  const handleRedirectToShop = async () => {
    if (!order || !address) {
      alert("No hay orden para procesar o no tienes una cuenta conectada");
      return;
    }

    const products = Object.values(order.cart).map((item) => ({
      id: item.id,
      sub_total: item.price * item.quantity,
      cantidad: item.quantity,
    }));

    try {
      const response = await fetch("/api/invoices/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          wallet: address,
          total: totalPrice,
          products,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        router.push(`/Shop/Cart/${order.id}`);
      } else {
        throw new Error("Error al realizar la petición");
      }
    } catch (error) {
      console.error("Error al realizar la petición:", error);
    }
  };

  return (
    <div className={styles.cart}>
      <h2 className={styles.cartTitle}>Carrito</h2>
      {!order && <p className={styles.emptyCart}>No hay items en el carrito</p>}
      {order &&
        Object.values(order.cart).map((item) => {
          if (typeof item !== "string")
            return (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemQuantity}>
                    Cantidad: {item.quantity}
                  </p>
                  <p className={styles.itemPrice}>
                    Precio: ${item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => handleRemoveItemFromCart(item.id)}
                    className={styles.removeButton}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            );
        })}
      <p className={styles.totalPrice}>Total: ${totalPrice}</p>
      <button onClick={handleRedirectToShop} className={styles.shopButton}>
        Ir a Shop
      </button>
    </div>
  );
};

export default Cart;
