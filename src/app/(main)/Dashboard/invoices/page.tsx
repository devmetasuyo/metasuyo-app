"use client";

import { useEffect, useState, useCallback } from "react";
import { Banner, Degradado, Title } from "@/components";
import styles from "./invoices.module.css";
import { useRouter } from "next/navigation";
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
  };
  productos: {
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  estado_sunat: string;
};

type SearchType = "wallet" | "user" | "invoice";

const InvoiceCard = ({ invoice }: { invoice: Invoice }) => {
  const router = useRouter();
  const handleValidateSUNAT = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar navegación al hacer clic en el botón

    try {
      const response = await fetch("/api/invoices/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Podrías mostrar un toast o alguna notificación
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

  return (
    <div
      key={invoice.id}
      className={styles.invoiceCard}
      onClick={() => router.push(`/Dashboard/invoices/${invoice.id}`)}
    >
      <div className={styles.mainInfo}>
        <span className={styles.invoiceId}>#{invoice.estado_sunat}</span>
        <span className={styles.clientName}>
          {`${invoice.cliente.nombre} ${invoice.cliente.apellido}`}
        </span>
        <span className={styles.wallet}>{invoice.cliente.wallet}</span>
      </div>

      <div className={styles.details}>
        <span className={styles.date}>
          {new Date(invoice.fecha).toLocaleDateString()}
        </span>
        <span className={styles.total}>
          <PiCurrencyEthFill size={16} /> {invoice.total}
        </span>
      </div>

      <div className={styles.actions}>
        <span className={`${styles.status} ${styles[invoice.estado]}`}>
          {invoice.estado}
        </span>
        {invoice.estado_sunat === "pendiente" && (
          <Button color="primary" size="xs" onClick={handleValidateSUNAT}>
            Validar SUNAT
          </Button>
        )}
        {invoice.estado_sunat === "validado" && (
          <span className={styles.sunatBadge}>✓ Validado SUNAT</span>
        )}
      </div>
    </div>
  );
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("user");

  const searchInvoices = useCallback(
    async (search: string, type: SearchType) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/invoices/all?search=${search}&type=${type}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setInvoices(data.invoices);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      searchInvoices(searchTerm, searchType);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchType, searchInvoices]);

  const handleRectifyInvoices = async () => {
    try {
      const response = await fetch("/api/invoices/rectify", {
        method: "POST",
      });

      const data = await response.json();

      if (data.status === "success") {
        alert("Proceso de validación completado");
        // Recargar la lista de facturas
        searchInvoices(searchTerm, searchType);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error validando facturas:", error);
      alert("Error al validar las facturas");
    }
  };

  return (
    <>
      <Banner
        title="Administrador de Facturas"
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
      <Title title="Lista de Facturas" />

      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className={styles.searchSelect}
          >
            <option value="user">Buscar por usuario</option>
            <option value="wallet">Buscar por wallet</option>
            <option value="invoice">Buscar por ID de factura</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${
              searchType === "user"
                ? "nombre de usuario"
                : searchType === "wallet"
                  ? "wallet"
                  : "ID de factura"
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Button color="primary" onClick={handleRectifyInvoices}>
            Rectificar Facturas
          </Button>
        </div>

        <div className={styles.invoicesList}>
          <div className={styles.listHeader}>
            <div className={styles.mainInfo}>
              <span>Factura / Cliente</span>
            </div>
            <div className={styles.details}>
              <span>Fecha / Total</span>
            </div>
            <div className={styles.statusHeader}>
              <span>Estado</span>
            </div>
          </div>

          {isLoading ? (
            <p className={styles.loading}>Cargando...</p>
          ) : (
            invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
