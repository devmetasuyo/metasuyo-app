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
    console.log("🔄 updateOrder - Inicio");
    console.log("🔄 Order a guardar:", order);
    
    localStorage.setItem("order", JSON.stringify(order));
    console.log("✅ Guardado en localStorage");
    
    const totalItems = calculateTotalItems(order);
    const totalPrice = calculateTotalPrice(order);
    console.log("🔄 Totales calculados - Items:", totalItems, "Precio:", totalPrice);
    
    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
    setOrder(order);
    console.log("✅ Estados actualizados");
  };

  const addItemToCart = (item: CartItem) => {
    console.log("🛒 addItemToCart - Inicio");
    console.log("🛒 Item recibido:", item);
    console.log("🛒 Order actual:", order);
    
    const updatedOrder = order ? { ...order } : { id: uuidv4(), cart: {} };
    console.log("🛒 Order que se va a actualizar:", updatedOrder);
    
    if (updatedOrder.cart[item.id]) {
      updatedOrder.cart[item.id].quantity += 1;
      console.log("✅ Producto existente, cantidad incrementada a:", updatedOrder.cart[item.id].quantity);
    } else {
      item.price = Number(item.price);
      updatedOrder.cart[item.id] = item;
      console.log("✅ Nuevo producto agregado. Carrito ahora tiene:", Object.keys(updatedOrder.cart).length, "items");
    }
    
    console.log("🛒 Carrito completo antes de updateOrder:", updatedOrder.cart);
    updateOrder(updatedOrder);
    console.log("🛒 updateOrder ejecutado");
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
      console.log("🔍 checkItemsInCart - Inicio");
      console.log("🔍 CartProducts recibidos:", CartProducts);
      console.log("🔍 Order actual:", order);
      
      if (order && CartProducts.length > 0) {
        const updatedOrder = { ...order };
        const cartItems = Object.values(order.cart);
        console.log("🔍 Items en carrito:", cartItems);

        for (const cartItem of cartItems) {
          console.log("🔍 Buscando producto para item del carrito:", cartItem.id, cartItem.name);
          console.log("🔍 IDs de productos disponibles:", CartProducts.map(p => ({ id: p.id, name: p.nombre })));
          
          const productInCart = CartProducts.find(
            (item) => `${item.id}` === `${cartItem.id}`
          );
          
          console.log("🔍 Producto encontrado:", productInCart);

          if (!productInCart || productInCart.cantidad <= 0) {
            console.log("❌ Producto no encontrado o sin stock, eliminando del carrito");
            alert("El producto " + cartItem.name + " no esta disponible");
            delete updatedOrder.cart[cartItem.id];
          } else {
            console.log("✅ Producto válido en carrito");
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

        updateOrder(updatedOrder);
      }
    },
    [order, updateOrder]
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
