"use client";

import { useEffect, useState } from "react";
import { Banner, Degradado, Title } from "@/components";
import styles from "./clientDetail.module.css";
import { useParams } from "next/navigation";

type Invoice = {
  id: string;
  fecha: Date;
  total: number;
  estado: string;
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
};

type ClientDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet?: string;
  facturas: Invoice[];
};

export default function ClientDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Asegura que params no sea null ni undefined y tiene id
    if (!params || typeof params !== "object" || !("id" in params) || !params.id) {
      setIsLoading(false);
      return;
    }
    const safeParams = params as { id: string };
    async function fetchClientDetail() {
      try {
        const response = await fetch(`/api/customers/${safeParams.id}`);
        const data = await response.json();

        if (data.status === "success") {
          const clientData = {
            id: data.customer.id,
            name: `${data.customer.nombre} ${data.customer.apellido}`,
            email: data.customer.correo,
            phone: data.customer.telefono,
            wallet: data.customer.wallet,
            facturas: data.customer.facturas,
          };
          setClient(clientData);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClientDetail();
  }, [params]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <>
      <Banner
        title="Detalle del Cliente"
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
      <Title title="Información del Cliente" />
      
      <div className={styles.container}>
        <div className={styles.clientInfo}>
          <h2 className={styles.name}>{client.name}</h2>
          <div className={styles.details}>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Teléfono:</strong> {client.phone}</p>
            <p><strong>Wallet:</strong> {client.wallet}</p>
          </div>
        </div>

        <div className={styles.invoicesSection}>
          <h3 className={styles.subtitle}>Historial de Facturas</h3>
          <div className={styles.invoicesList}>
            {client.facturas.length === 0 ? (
              <p className={styles.noInvoices}>No hay facturas disponibles</p>
            ) : (
              client.facturas.map((factura) => (
                <div key={factura.id} className={styles.invoiceCard}>
                  <div className={styles.invoiceHeader}>
                    <span className={styles.invoiceId}>#{factura.id}</span>
                    <span className={`${styles.status} ${styles[factura.estado]}`}>
                      {factura.estado}
                    </span>
                  </div>
                  <div className={styles.invoiceDetails}>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(factura.fecha).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total:</strong> ${factura.total.toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.productsList}>
                    {factura.productos.map((producto, index) => (
                      <div key={index} className={styles.productItem}>
                        <span>{producto.nombre}</span>
                        <span>
                          {producto.cantidad} x ${producto.precio.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
