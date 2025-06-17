"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { ModalUser } from "./ModalUser";
import { CartItems } from "./CartItems";
import { Product } from "@/types/product";
import { Button, Input } from "@/components";
import { OrderCartItem } from "./OrderCartItem";
import { Client, ClientSearch } from "./ClientSearch";
import Big from "big.js";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";
import { set } from "zod";

export interface CartProduct extends Omit<Product, "image"> {
  image: string;
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const handleModal = () => {
    setIsOpen(!isOpen);
  };
  const [bigPrice, setBigPrice] = useState<Big>(new Big(0));

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setBigPrice(new Big(price));
    }
  }, []);

  const [client, setClient] = useState<Client>();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const { openModal } = useFeedbackModal();
  const [cart, setCart] = useState<Record<string, CartProduct>>({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [referencia, setReferencia] = useState<string>();

  const handleSendInvoice = async () => {
    if (!client) {
      openModal({
        type: "warning",
        title: "Error",
        message: "Debe seleccionar un cliente",
        cancelButton: undefined,
      });
      return;
    }

    const items = Object.values(cart).map((item) => ({
      id: item.id,
      quantity: item.cantidad,
    }));

    const response = await fetch("/api/invoices/pos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, referencia, client }),
    });

    const data = await response.json();

    if (data.status === "success") {
      openModal({
        type: "success",
        title: "Factura enviada",
        message: "Factura enviada con exito",
        cancelButton: undefined,
      });

      setCart({});
      setTotalPrice(0);
      setBigPrice(new Big(0));
      setClient(undefined);
      setReferencia("");
      setClientSearch("");
    }
  };

  const handleIncrementToCart = (product: CartProduct) => {
    if (!product.id) return;

    const quantity = (cart[product.id]?.cantidad || 0) + 1;
    const newCart = { ...cart };

    newCart[product.id] = {
      ...product,
      cantidad: quantity,
    };

    const totalPrice = Object.values(newCart).reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    setCart(newCart);
    setTotalPrice(totalPrice);
  };

  const handleDecrementFromCart = (productId?: number) => {
    if (!productId) return;

    const newCart = { ...cart };

    if (newCart[productId]?.cantidad === 1) {
      delete newCart[productId];
    } else {
      newCart[productId].cantidad--;
    }
    const totalPrice = Object.values(newCart).reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    setTotalPrice(totalPrice);
    setCart(newCart);
  };

  const handleRemoveFromCart = (productId?: number) => {
    if (!productId) return;

    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[productId];
      return newCart;
    });
  };

  return (
    <div className="pos-container">
      <main>
        <header>
          <input
            type="search"
            placeholder="Buscar ropa, accesorios, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>
        <section className="filters">
          <div className="filter-group">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Pantalones</option>
              <option value="dresses">Vestidos</option>
              <option value="outerwear">Abrigos</option>
            </select>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Todos los precios</option>
              <option value="under50">Menos de $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="over100">Más de $100</option>
            </select>
          </div>
        </section>
        <CartItems
          categoryFilter={categoryFilter}
          priceFilter={priceFilter}
          searchTerm={searchTerm}
          handleSelectItem={handleIncrementToCart}
          priceUsd={bigPrice.toNumber()}
        />
      </main>
      <aside className="cart-sidebar">
        <h3>Cliente {client?.name}</h3>
        <ClientSearch
          onSelectClient={(c: Client) => setClient(c)}
          value={clientSearch}
          onChange={setClientSearch}
          onAddClient={handleModal}
        />
        <div className="cart">
          <div className="order-type">
            <Button color="primary">Entrega</Button>
            <Button>Recoger</Button>
            <Button>En tienda</Button>
          </div>
          <div className="cart-items">
            {Object.values(cart).length === 0 ? (
              <p>La factura esta vacia</p>
            ) : null}
            {Object.values(cart).map((product) => (
              <OrderCartItem
                key={product.id}
                image={product.image ?? "/icon.png"}
                name={product.nombre}
                price={product.precio}
                priceUsd={bigPrice.toNumber()}
                quantity={product.cantidad}
                onDecrement={() => handleDecrementFromCart(product.id)}
                onIncrement={() => handleIncrementToCart(product)}
                onRemove={() => handleRemoveFromCart(product.id)}
              />
            ))}
          </div>
          <div className="order-summary">
            <div className="summary-item total">
              <span>MONEDA</span>
              <span style={{ textAlign: "left" }}>MONTO TOTAL</span>
            </div>
            <div className="summary-item total">
              <span>ETH</span>
              <span>{totalPrice.toFixed(14)}</span>
            </div>
            <div className="summary-item total">
              <span>USDC</span>
              <span>{bigPrice.mul(totalPrice).toFixed(14)}</span>
            </div>
          </div>
          <Input
            label="Referencia de pago"
            errors={""}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <button className="confirm-order" onClick={handleSendInvoice}>
            Confirmar Pedido
          </button>
        </div>
      </aside>
      <ModalUser isOpen={isOpen} handleModal={handleModal} />
    </div>
  );
}
