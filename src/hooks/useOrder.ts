import { CartProduct } from "@/app/(main)/Dashboard/pos/page";
import { CartItem } from "@/types/cartItem";
import { Order } from "@/types/order";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

export const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const storedOrder = localStorage.getItem("order");
    if (storedOrder) {
      const storedOrderData: Order = JSON.parse(storedOrder);
      setOrder(storedOrderData);
      setTotalPrice(calculateTotalPrice(storedOrderData));
    }
  }, []);

  function calculateTotalItems(order: Order) {
    if (order) {
      return Object.values(order.cart).reduce(
        (total, item) => total + item.quantity,
        0
      );
    } else {
      return 0;
    }
  }

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

  const updateOrder = (order: Order) => {
    localStorage.setItem("order", JSON.stringify(order));
    setTotalItems(calculateTotalItems(order));
    setTotalPrice(calculateTotalPrice(order));
    setOrder(order);
  };

  const addItemToCart = (item: CartItem) => {
    const updatedOrder = order ? { ...order } : { id: uuidv4(), cart: {} };
    if (updatedOrder.cart[item.id]) {
      updatedOrder.cart[item.id].quantity += 1;
    } else {
      item.price = Number(item.price);
      updatedOrder.cart[item.id] = item;
    }
    updateOrder(updatedOrder);
  };

  const removeItemFromCart = (item: CartItem) => {
    const { id } = item;
    const updatedOrder = order ? { ...order } : { id: uuidv4(), cart: {} };
    const { [id]: itemToRemove, ...rest } = updatedOrder.cart;
    updatedOrder.cart = rest;
    if (itemToRemove?.quantity > 1) {
      updatedOrder.cart[id] = {
        ...itemToRemove,
        quantity: itemToRemove.quantity - 1,
      };
    }
    updateOrder(updatedOrder);
  };

  const checkItemsInCart = useCallback(
    async (CartProducts: CartProduct[]) => {
      if (order) {
        const updatedOrder = { ...order };
        const cartItems = Object.values(order.cart);

        for (const cartItem of cartItems) {
          const productInCart = CartProducts.find(
            (item) => `${item.id}` === `${cartItem.id}`
          );

          if (!productInCart || productInCart.cantidad <= 0) {
            alert("El producto " + cartItem.name + " no esta disponible");
            delete updatedOrder.cart[cartItem.id];
          }

          if (productInCart) {
            if (cartItem.quantity > productInCart.cantidad) {
              alert(
                "El producto " + cartItem.name + " no tiene suficiente stock"
              );
              updatedOrder.cart[cartItem.id].quantity = productInCart.cantidad;
            }

            if (productInCart.precio !== cartItem.price) {
              updatedOrder.cart[cartItem.id].price = Number(
                productInCart.precio
              );
            }
          }
        }

        updateOrder(order);
      }
    },
    [order]
  );

  const clearCart = () => {
    setTotalPrice(0);
    setOrder(null);
    localStorage.removeItem("order");
  };

  return {
    order,
    checkItemsInCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    totalPrice,
    totalItems,
  };
};

export default useOrder;
