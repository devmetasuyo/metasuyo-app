"use client";
import "./Profile.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useBasename } from "@/hooks/useBasename";
import { Button } from "../common";
import { usePrivySession } from "@/hooks/usePrivySession";

interface ClienteData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  tipo_documento: "DNI" | "RUC";
  documento: string;
}

export function Profile({ wallet }: { wallet: string }) {
  const { data } = useBasename(wallet as `0x${string}`);
  const route = useRouter();
  const [showModal, setShowModal] = useState(false);

  // Estado para controlar si el usuario está logueado (solo para edición)
  const { session, loading } = usePrivySession();

  const [clienteData, setClienteData] = useState<ClienteData>({
    nombre: " ",
    apellido: " ",
    correo: " ",
    telefono: " ",
    direccion: " ",
    tipo_documento: "DNI",
    documento: " ",
  });

  useEffect(() => {
    if (!wallet) {
      route.replace("/");
    } else {
      fetchClienteData(wallet);
      const params = new URLSearchParams(window.location.search);
      const showModal = params.get("showModal");
      if (showModal === "true") {
        setShowModal(true);
      }
    }
  }, [wallet]);

  // Modifica fetchClienteData para recibir el wallet
  const fetchClienteData = async (wallet: string) => {
    try {
      console.log("[Profile] fetchClienteData para wallet:", wallet);
      const response = await fetch(`/api/profile/${wallet}`);
      const data = await response.json();
      if (data.status === "success") {
        setClienteData({
          nombre: data.cliente.nombre ?? "",
          apellido: data.cliente.apellido ?? "",
          correo: data.cliente.correo ?? "",
          telefono: data.cliente.telefono ?? "",
          direccion: data.cliente.direccion ?? "",
          tipo_documento: data.cliente.tipo_documento ?? "DNI",
          documento: data.cliente.documento ?? "",
        });
        console.log("[Profile] Datos de cliente cargados:", data.cliente);
      } else {
        console.log("[Profile] Error al cargar datos de cliente:", data);
      }
    } catch (error) {
      console.error("[Profile] Error fetching cliente data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClienteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: session?.wallet,
          ...clienteData,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Perfil actualizado correctamente");
        setShowModal(false);
        fetchClienteData(session?.wallet || ""); 
      } else {
        alert(data.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    }
  };

  // Al intentar editar, verifica si hay sesión Privy
  const handleEditProfile = () => {
    if (!session) {
      alert("Debes iniciar sesión para editar tu perfil.");
      // Aquí podrías abrir un modal de login Privy si tienes uno
      return;
    }
    setShowModal(true);
  };

  if (loading || !wallet) return null;

  return (
    <main>
      <div className="profile">
        <div className="container-profile">
          <div className="circle-profile">
            <img src={data?.avatar} alt="Perfil" defaultValue={"/icon.png"} />
          </div>
          <div className="name-profile">
            <span>
              Nombre: {clienteData?.nombre ?? "Usuario"} {clienteData?.apellido}
            </span>
            <br />
            <span>Email: {clienteData?.correo ?? "No disponible"}</span>
            <br />
            <span>Teléfono: {clienteData?.telefono ?? "No disponible"}</span>
            <br />
            <span>Dirección: {clienteData?.direccion ?? "No disponible"}</span>
            <br />
            {clienteData?.tipo_documento && (
              <span>
                {clienteData.tipo_documento}:{" "}
                {clienteData?.documento ?? "No disponible"}
              </span>
            )}
            <br />
            <span className="wallet-text">Wallet: {wallet}</span>
            <br />
            <Button onClick={handleEditProfile}>Editar Perfil</Button>
          </div>
        </div>

        {showModal && session && (
          <div className="modal">
            <div className="modal-body">
              <h2>Editar Perfil</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="nombre"
                    value={clienteData.nombre ?? ""}
                    onChange={handleInputChange}
                    placeholder="Nombre (obligatorio)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="apellido"
                    value={clienteData.apellido ?? ""}
                    onChange={handleInputChange}
                    placeholder="Apellido (obligatorio)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="correo"
                    value={clienteData.correo ?? ""}
                    onChange={handleInputChange}
                    placeholder="Correo electrónico (obligatorio)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="telefono"
                    value={clienteData.telefono ?? ""}
                    onChange={handleInputChange}
                    placeholder="Teléfono (obligatorio)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="direccion"
                    value={clienteData.direccion ?? ""}
                    onChange={handleInputChange}
                    placeholder="Dirección (obligatorio)"
                  />
                </div>
                <div className="form-group">
                  <select
                    name="tipo_documento"
                    value={clienteData.tipo_documento ?? "DNI"}
                    onChange={handleInputChange}
                  >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="documento"
                    value={clienteData.documento ?? ""}
                    onChange={handleInputChange}
                    placeholder="Número de documento (obligatorio)"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="button-primary">
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
