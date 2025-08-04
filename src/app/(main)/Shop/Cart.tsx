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
  const { session, loading, login } = usePrivySession();
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
    console.log("🛒 handleRedirectToCheckout ejecutado");
    console.log("🛒 Order:", order);
    console.log("🛒 Session:", session);
    console.log("🛒 Loading:", loading);
    
    if (!order) {
      alert("No hay orden para procesar");
      return;
    }
    
    if (!session) {
      console.log("🛒 No hay sesión, abriendo login");
      // Abrir login de Privy si no hay sesión
      login();
      return;
    }
    
    console.log("🛒 Redirigiendo a /Shop/Checkout");
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
                          <PiCurrencyDollar size={16} />
                          ${Intl.NumberFormat("es-ES", {
                            maximumFractionDigits: 2,
                          }).format((item.price * item.quantity) * (price || 3000))}
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
                          <PiCurrencyEthFill size={16} />
                          {Intl.NumberFormat("es-ES", {
                            maximumSignificantDigits: 6,
                          }).format(item.price * item.quantity)}
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
                <PiCurrencyDollar size={16} /> ${(totalPrice * (price || 3000)).toFixed(2)}
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
                className={styles.totalPrice}
              >
                <PiCurrencyEthFill size={16} />{" "}
                {Intl.NumberFormat("es-ES", {
                  maximumSignificantDigits: 6,
                }).format(totalPrice)}
              </p>
            </div>
            <Button 
              onClick={() => {
                console.log("🛒 Botón Pagar presionado");
                handleRedirectToCheckout();
              }} 
              disabled={loading}
            >
              {!session ? "Iniciar sesión para pagar" : `Pagar (${totalItems})`}
            </Button>
          </div>
        </DrawerActions>
      </Drawer>
    </>
  );
};

export default Cart;
