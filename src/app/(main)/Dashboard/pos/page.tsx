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
    const fetchEthPrice = async () => {
      try {
        // Obtener precio de ETH desde CoinGecko
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;
        
        setBigPrice(new Big(ethPrice));
        localStorage.setItem("price", ethPrice.toString());
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Usar precio guardado o fallback
        const savedPrice = localStorage.getItem("price");
        setBigPrice(new Big(savedPrice || "3000"));
      }
    };

    fetchEthPrice();
  }, []);

  const [client, setClient] = useState<Client>();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const { openModal } = useFeedbackModal();
  const [cart, setCart] = useState<Record<string, CartProduct>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [referencia, setReferencia] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendInvoice = async () => {
    console.log("🔍 handleSendInvoice ejecutándose");
    console.log("Cliente:", client);
    console.log("Carrito:", cart);
    console.log("Referencia:", referencia);
    console.log("Método de pago:", paymentMethod);
    
    if (!client) {
      openModal({
        type: "warning",
        title: "Error",
        message: "Debe seleccionar un cliente",
        cancelButton: undefined,
      });
      return;
    }

    if (Object.keys(cart).length === 0) {
      openModal({
        type: "warning",
        title: "Error",
        message: "El carrito está vacío",
        cancelButton: undefined,
      });
      return;
    }

    if (!referencia.trim() && paymentMethod !== "EFECTIVO") {
      openModal({
        type: "warning",
        title: "Error",
        message: "Debe ingresar una referencia de pago",
        cancelButton: undefined,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const items = Object.values(cart).map((item) => ({
        id: item.id,
        quantity: item.cantidad,
      }));

      console.log("Enviando datos:", { items, referencia, client, paymentMethod });

      const response = await fetch("/api/invoices/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items, 
          referencia: referencia || `EFECTIVO-${Date.now()}`, 
          client, 
          paymentMethod 
        }),
      });

      console.log("Respuesta status:", response.status);
      const data = await response.json();
      console.log("Respuesta datos:", data);

      if (data.status === "success") {
        openModal({
          type: "success",
          title: "¡Factura creada exitosamente!",
          message: `Factura ${data.details.facturaId.slice(0, 8)}... creada por ${data.details.totalUSD.toFixed(2)} USD para ${data.details.cliente}`,
          confirmButton: "Ver Factura",
          cancelButton: "Cerrar",
          onConfirm: () => {
            window.open(`/Dashboard/invoices/${data.details.facturaId}`, '_blank');
          },
        });

        // Limpiar el carrito
        setCart({});
        setTotalPrice(0);
        setClient(undefined);
        setReferencia("");
        setClientSearch("");
        setPaymentMethod("EFECTIVO");
      } else {
        openModal({
          type: "warning",
          title: "Error al crear factura",
          message: data.message || "Error desconocido",
          cancelButton: undefined,
        });
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      openModal({
        type: "warning",
        title: "Error de conexión",
        message: "No se pudo conectar con el servidor",
        cancelButton: undefined,
      });
    } finally {
      setIsProcessing(false);
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
        <h3>Cliente: {client?.name || "No seleccionado"}</h3>
        <ClientSearch
          onSelectClient={(c: Client) => {
            console.log("Cliente seleccionado:", c);
            setClient(c);
          }}
          value={clientSearch}
          onChange={setClientSearch}
          onAddClient={handleModal}
          placeholder="Busca un cliente (ej: Goku)"
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
              <span>USD</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>ETH</span>
              <span>{bigPrice.toNumber() > 0 ? (totalPrice / bigPrice.toNumber()).toFixed(6) : '0.000000'}</span>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
              Método de Pago:
            </label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="YAPE">YAPE</option>
              <option value="PLIN">PLIN</option>
            </select>
          </div>
          
          {paymentMethod !== "EFECTIVO" && (
            <Input
              label="Referencia de pago"
              errors={""}
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder={`Número de ${paymentMethod.toLowerCase()}`}
            />
          )}
          
          <button 
            className="confirm-order" 
            onClick={() => {
              console.log("🔴 Botón clickeado!");
              handleSendInvoice();
            }}
            disabled={isProcessing}
            style={{
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? "not-allowed" : "pointer"
            }}
          >
            {isProcessing ? "Procesando..." : "Crear Factura"}
          </button>
        </div>
      </aside>
      <ModalUser isOpen={isOpen} handleModal={handleModal} />
    </div>
  );
}
