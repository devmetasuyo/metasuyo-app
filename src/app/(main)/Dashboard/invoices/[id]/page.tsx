"use client";

import { useEffect, useState } from "react";
import { Banner, Degradado, Title } from "@/components";
import styles from "./invoiceDetail.module.css";
import { useParams } from "next/navigation";
import { Button } from "@/components/common/Button/Button";
import { PiCurrencyEthFill } from "react-icons/pi";

type Invoice = {
  id: string;
  fecha: Date;
  total: number;
  estado: string;
  cliente: {
    nombre: string;
    apellido: string;
    wallet: string;
    email: string;
    telefono: string;
  };
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Asegura que params no sea null ni undefined y tiene id
    if (!params || typeof params !== "object" || !("id" in params) || !params.id) {
      setIsLoading(false);
      return;
    }
    const safeParams = params as { id: string };
    async function fetchInvoiceDetail() {
      try {
        const response = await fetch(`/api/invoices/get/${safeParams.id}`);
        const data = await response.json();

        if (data.status === "success") {
          setInvoice(data.invoice);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvoiceDetail();
  }, [params]);

  const handleValidateSUNAT = async () => {
    // Asegura que params no sea null ni undefined y tiene id
    if (!params || typeof params !== "object" || !("id" in params) || !params.id) {
      alert("No se encontró el ID de la factura");
      return;
    }
    const safeParams = params as { id: string };
    try {
      const response = await fetch("/api/invoices/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceId: safeParams.id }),
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Factura validada correctamente por SUNAT");
        // Recargar los datos
        window.location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error validando factura:", error);
      alert("Error al validar la factura");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!invoice) {
    return <div>Factura no encontrada</div>;
  }

  return (
    <>
      <Banner
        title="Detalle de Factura"
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        subtitle=""
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <Title title={`Factura #${invoice.id}`} />

      <div className={styles.container}>
        <div className={styles.invoiceCard}>
          <div className={styles.header}>
            <div className={styles.mainInfo}>
              <span className={`${styles.status} ${styles[invoice.estado]}`}>
                {invoice.estado}
              </span>
              <p className={styles.date}>
                Fecha: {new Date(invoice.fecha).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.total}>
              <span>Total</span>
              <h3>${invoice.total}</h3>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información del Cliente</h3>
            <div className={styles.clientInfo}>
              <p>
                <strong>Nombre:</strong>{" "}
                {`${invoice.cliente.nombre} ${invoice.cliente.apellido}`}
              </p>
              <p>
                <strong>Email:</strong> {invoice.cliente.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {invoice.cliente.telefono}
              </p>
              <p className={styles.wallet}>
                <strong>Wallet:</strong> {invoice.cliente.wallet}
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Productos</h3>
            <div className={styles.productsTable}>
              <div className={styles.tableHeader}>
                <span>Producto</span>
                <span>Cantidad</span>
                <span>Precio</span>
                <span>Subtotal</span>
              </div>
              {invoice.productos.map((producto, index) => (
                <div key={index} className={styles.tableRow}>
                  <span>{producto.nombre}</span>
                  <span>{producto.cantidad}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "white",
                    }}
                  >
                    <PiCurrencyEthFill size={16} /> {producto.precio}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "white",
                    }}
                  >
                    <PiCurrencyEthFill size={16} />
                    {producto.cantidad * producto.precio}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
