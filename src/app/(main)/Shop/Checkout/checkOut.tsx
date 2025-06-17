"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaCreditCard,
  FaEthereum,
} from "react-icons/fa";
import styles from "./CheckOut.module.scss";
import { Button, Card, CardContent, Text } from "@/components";
import { Order } from "@/types/order";
import { PiCurrencyDollar } from "react-icons/pi";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
};

type CartProps = {
  onBuy: () => void;
  totalItems: number;
  totalPrice: number;
  order: Order | null;
  onAction: (id: CartItem, action: "increment" | "decrement") => void;
};

export default function Component({
  onBuy,
  order,
  totalPrice,
  onAction,
  totalItems,
}: CartProps) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setPrice(Number(price));
    }
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (order) {
      const CartToArray = Object.values(order.cart);
      setCartItems(CartToArray);
    }
  }, [order]);

  const formatEthPrice = (price: number) => {
    return price.toFixed(6);
  };

  const formatUsdPrice = (price: number) => {
    return Intl.NumberFormat("es-ES", {
      maximumSignificantDigits: 2,
      maximumFractionDigits: 2,
      roundingPriority: "morePrecision",
    }).format(price);
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        <Text as="h2" className={styles.summaryTitle}>
          <FaShoppingCart className={styles.icon} /> Carrito de Compras
        </Text>
        {cartItems.map((item) => (
          <Card key={item.id} className={styles.itemCard}>
            <Image
              src={item.imageSrc}
              alt={item.name}
              width={100}
              height={100}
              className={styles.itemImage}
            />
            <div className={styles.itemDetails}>
              <Text as="h3" className={styles.itemTitle}>
                {item.name}
              </Text>
              <Text className={styles.textSecondary}>{item.name}</Text>
              <Text as="span" className={styles.textMuted}>
                Cantidad: {item.quantity}
              </Text>
              <div className={styles.itemPriceContainer}>
                <Text className={styles.itemPrice}>
                  <FaEthereum className={styles.icon} />
                  {formatEthPrice(item.price)}
                </Text>
                <Text className={styles.itemPrice}>
                  <PiCurrencyDollar size={16} />
                  {formatUsdPrice(item.price * price)}
                </Text>
                <div className={styles.quantitySelector}>
                  <Button size="xs" onClick={() => onAction(item, "decrement")}>
                    <FaMinus size={16} />
                  </Button>
                  <Text className={styles.textPrimary}>{item.quantity}</Text>
                  <Button size="xs" onClick={() => onAction(item, "increment")}>
                    <FaPlus size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className={styles.cartSummary}>
        <CardContent>
          <div className={styles.summaryCard}>
            <Text as="h2" className={styles.summaryTitle}>
              Resumen Del Pedido
            </Text>
            <div className={styles.summaryItem}>
              <Text>Subtotal</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>
                <FaEthereum size={16} />
              </Text>
              <Text>{formatEthPrice(totalPrice)}</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>
                <PiCurrencyDollar size={16} />
              </Text>
              <Text>{formatUsdPrice(totalPrice * price)}</Text>
            </div>
            <div className={styles.summaryTotal}>
              <Text>Total</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>
                <FaEthereum size={16} />
              </Text>
              <Text>{formatEthPrice(totalPrice)}</Text>
            </div>
            <div className={styles.summaryItem}>
              <Text>
                <PiCurrencyDollar size={16} />
              </Text>
              <Text>{formatUsdPrice(totalPrice * price)}</Text>
            </div>
            <Button
              size="full"
              className={styles.checkoutButton}
              onClick={onBuy}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                <FaCreditCard className={styles.icon} /> Pagar ahora (
                {totalItems})
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
