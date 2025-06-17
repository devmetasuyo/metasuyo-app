"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./clients.module.css";
import { Banner, Degradado, Title } from "@/components";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet?: string;
};

const initialClients: Client[] = [];

type SearchType = "name" | "wallet";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [isLoading, setIsLoading] = useState(false);

  // Función para buscar clientes
  const searchClients = useCallback(
    async (search: string, type: SearchType) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/customers/all?search=${search}&type=${type}`
        );
        const data = await response.json();

        if (data.status === "success") {
          const mapsClients = data.customers.map(
            (item: {
              id: string;
              nombre: string;
              apellido: string;
              correo: string;
              telefono?: string;
              wallet?: string;
            }) => ({
              id: item.id,
              name: `${item.nombre} ${item.apellido}`,
              email: item.correo,
              phone: item.telefono,
              wallet: item.wallet,
            })
          );
          setClients(mapsClients);
        }
      } catch (error) {
        console.error("Error buscando clientes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Efecto para el debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchClients(searchTerm, searchType);
      } else {
        // Si no hay término de búsqueda, cargar todos los clientes
        searchClients("", searchType);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timer);
  }, [searchTerm, searchType, searchClients]);

  return (
    <>
      <Banner
        title="Administrador de clientes"
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
      <Title title="Lista de Clientes" />
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as SearchType)}
            className={styles.searchSelect}
          >
            <option value="name">Buscar por nombre</option>
            <option value="wallet">Buscar por wallet</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${
              searchType === "name" ? "nombre" : "wallet"
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.clientList}>
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className={styles.clientCard}
                onClick={() => {
                  router.push("/Dashboard/clients/" + client.id);
                }}
              >
                <div className={styles.clientInfo}>
                  <h2 className={styles.clientName}>{client.name}</h2>
                  <p className={styles.clientDetails}>Email: {client.email}</p>
                  <p className={styles.clientDetails}>
                    Teléfono: {client.phone}
                  </p>
                  <p className={styles.clientDetails}>
                    Wallet: {client.wallet}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
