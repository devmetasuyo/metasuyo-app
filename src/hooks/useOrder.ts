import { CartItem } from "@/types/cartItem";
import { Order } from "@/types/order";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const storedOrder = localStorage.getItem("order");
    if (storedOrder) {
      const storedOrderData: Order = JSON.parse(storedOrder);
      setOrder(storedOrderData);
      setTotalPrice(calculateTotalPrice(storedOrderData));
    }
  }, []);

  const calculateTotalPrice = (order: Order) => {
    if (order) {
      return Object.values(order.cart).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    } else {
      return 0;
    }
  };

  const addItemToCart = (item: CartItem) => {
    setOrder((prevOrder) => {
      if (prevOrder) {
        const updatedOrder: Order = { ...prevOrder };
        updatedOrder.cart[item.id] = item;
        localStorage.setItem("order", JSON.stringify(updatedOrder));
        return updatedOrder;
      } else {
        const newOrder: Order = { id: uuidv4(), cart: { [item.id]: item } };
        localStorage.setItem("order", JSON.stringify(newOrder));
        return newOrder;
      }
    });
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + item.price * item.quantity
    );
  };

  const removeItemFromCart = (id: string) => {
    if (order) {
      const updatedOrder: Order = { ...order };
      delete updatedOrder.cart[id];
      localStorage.setItem("order", JSON.stringify(updatedOrder));
      setOrder(updatedOrder);
      setTotalPrice(calculateTotalPrice(updatedOrder));
    } else {
      return setOrder(null);
    }
  };

  const clearCart = () => {
    setTotalPrice(0);
    setOrder(null);
    localStorage.removeItem("order");
  };

  return {
    order,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    totalPrice,
  };
};

export default useOrder;
