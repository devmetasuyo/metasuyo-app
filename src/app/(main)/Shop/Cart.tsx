"use client";

import { PiCurrencyDollar, PiCurrencyEthFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import styles from "./Cart.module.scss";
import {
  Button,
  Drawer,
  DrawerActions,
  DrawerBody,
  DrawerHeader,
  Text,
} from "@/components";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem } from "@/types/cartItem";
import { usePrivySession } from "@/hooks/usePrivySession";

interface CartProps {
  to: `0x${string}`;
  totalItems: number;
  totalPrice: number;
  order: Order | null;
  handleRemoveItemFromCart: (item: CartItem) => void;
}

const Cart: React.FC<CartProps> = ({
  to,
  totalItems,
  totalPrice,
  order,
  handleRemoveItemFromCart,
}) => {
  const { session, loading } = usePrivySession();
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setPrice(Number(price));
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleRedirectToCheckout = async () => {
    if (!order || !session) {
      alert("No hay orden para procesar o no tienes una sesión activa");
      return;
    }
    router.push(`/Shop/Checkout`);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Carrito({totalItems})</Button>
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerHeader>
          <Text as="h2" variant="primary">
            Carrito
          </Text>
        </DrawerHeader>
        <DrawerBody>
          {!order && <Text>No hay items en el carrito</Text>}
          {order &&
            Object.values(order.cart).map((item) => {
              if (typeof item !== "string")
                return (
                  <div key={item.id} className={styles.cartItem}>
                    <Image
                      width={100}
                      height={100}
                      src={item.imageSrc}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <Text variant="primary" as="h4">
                        {item.name}
                      </Text>
                      <Text as="span">Cantidad: {item.quantity}</Text>
                      <Text as="span">
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <PiCurrencyEthFill size={16} />
                          {Intl.NumberFormat("es-ES", {
                            maximumSignificantDigits: 4,
                            notation: "compact",
                          }).format(item.price * item.quantity)}
                        </span>
                      </Text>
                      <Text as="span">
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                            gap: "0.25rem",
                          }}
                        >
                          <PiCurrencyDollar size={16} />
                          {Intl.NumberFormat("es-ES", {
                            maximumSignificantDigits: 2,
                            maximumFractionDigits: 2,
                            roundingPriority: "morePrecision",
                          }).format(item.price * item.quantity * price)}
                        </span>
                      </Text>
                      <Button
                        size="xs"
                        color="danger"
                        onClick={() => handleRemoveItemFromCart(item)}
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                );
            })}
        </DrawerBody>
        <DrawerActions>
          <div className={styles.actionsContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                flexDirection: "column",
              }}
            >
              <p
                className={styles.totalPrice}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <PiCurrencyEthFill size={16} /> {totalPrice.toPrecision(4)}
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                className={styles.totalPrice}
              >
                <PiCurrencyDollar size={16} />{" "}
                {Intl.NumberFormat("es-ES", {
                  maximumSignificantDigits: 2,
                  maximumFractionDigits: 2,
                  roundingPriority: "morePrecision",
                }).format(totalPrice * price)}
              </p>
            </div>
            <Button onClick={handleRedirectToCheckout} disabled={loading || !session}>
              Pagar ({totalItems})
            </Button>
          </div>
        </DrawerActions>
      </Drawer>
    </>
  );
};

export default Cart;
