"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ButtonSignIn } from "@/components/Buttons/ButtonSigin/ButtonSignIn";
import { ModalClaimed } from "./modalClaimed";
import { getPoapHashes, addPoapHashes, usePoapHash, removePoapHash } from "@/utils/poapHashes";
import QRCode from "react-qr-code";
import { usePrivySession } from "@/hooks/usePrivySession";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";
import { Modal } from "@/components";
type PoapData = {
  event: {
    name: string;
    description: string;
    image_url: string;
    city?: string;
    country?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export default function PoapsPage() {
  const { address } = useAccount();
  const { session } = usePrivySession();
  const { openModal } = useFeedbackModal();
  const [poapData, setPoapData] = useState<PoapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [claimedData, setClaimedData] = useState<{ tokenId: string; wallet: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [codesAvailable, setCodesAvailable] = useState(false);
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Al montar, si no hay hashes en cookie, los pide al backend y los guarda
  useEffect(() => {
    async function fetchAndStoreHashes() {
      if (getPoapHashes().length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/poap/hashes");
          const data = await res.json();
          if (data.hashes && Array.isArray(data.hashes) && data.hashes.length > 0) {
            addPoapHashes(data.hashes);
            setCurrentHash(data.hashes[0]);
          } else {
            setError("No links disponibles para reclamar.");
          }
        } catch (err: any) {
          setError("Error al obtener los hashes: " + err.message);
        }
        setLoading(false);
      } else {
        setCurrentHash(usePoapHash());
      }
    }
    fetchAndStoreHashes();
  }, []);

  // Obtiene la info del POAP al cambiar el hash
  useEffect(() => {
    async function fetchPoapInfo() {
      setError(null);
      setPoapData(null);
      setCodesAvailable(false);
      if (!currentHash) {
        setError("No se configuró el POAP a reclamar.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/poap/info?qr_hash=${currentHash}`);
        const data = await res.json();
        setPoapData(data.poapData);
        setCodesAvailable(data.codesAvailable);
      } catch (err: any) {
        setError(err.message || "Error al obtener el POAP.");
      }
      setLoading(false);
    }
    if (currentHash) fetchPoapInfo();
  }, [currentHash]);

  // Reclamar POAP (solo vía backend)
  async function handleClaimPoap() {
    setError(null);
    setClaiming(true);
    if (!session?.nombre || !session?.correo) {
      openModal({
        type: "warning",
        title: "Perfil incompleto",
        message: "Debes iniciar sesión y completar tu perfil antes de reclamar tu POAP.",
        confirmButton: "Completar perfil",
        onConfirm: (confirm) => {
          if (confirm) {
            window.location.href = `/Perfil/${address}?showModal=true`;
          }
        },
      });
      setClaiming(false);
      return;
    }
    if (!currentHash) {
      setError("No se configuró el POAP a reclamar.");
      setClaiming(false);
      return;
    }
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError("Conecta tu wallet para reclamar.");
      setClaiming(false);
      return;
    }
    try {
      const claimRes = await fetch("/api/poap/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_hash: currentHash, address }),
      });
      if (!claimRes.ok) {
        const errData = await claimRes.json();
        throw new Error(errData?.error || JSON.stringify(errData) || "Error al reclamar el POAP.");
      }
      const claimData = await claimRes.json();
      setClaimedData({ tokenId: claimData.tokenId, wallet: address });
      setModalOpen(true);
      removePoapHash(currentHash);
      setCurrentHash(usePoapHash());
    } catch (err: any) {
      setError(err.message || "Error al reclamar el POAP.");
    }
    setClaiming(false);
  }

  // 1. Si no hay wallet conectada, muestra modal de login
  if (!address) {
    return (
      <Modal isOpen={true} handleModal={() => {}}>
        <div
          style={{
            width: "90%",
            maxWidth: "400px",
            background: "#f5f5f5",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#333",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center", fontWeight: "bold" }}>
            ¡Reclama tu POAP!
          </h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Inicia sesión para reclamar tu POAP exclusivo.
          </p>
          <ButtonSignIn
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#f5a602",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              fontWeight: "bold",
            }}
          >
            Iniciar sesión
          </ButtonSignIn>
        </div>
      </Modal>
    );
  }

  // 2. Si falta info de perfil, muestra modal y opción de ir a perfil
  if (!session?.nombre || !session?.correo) {
    return (
      <Modal isOpen={true} handleModal={() => {}}>
        <div
          style={{
            width: "90%",
            maxWidth: "400px",
            background: "#fffbe6",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#333",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", textAlign: "center", fontWeight: "bold", color: "#f5a602" }}>
            Perfil incompleto
          </h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Debes completar tu perfil antes de reclamar tu POAP.
          </p>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#f5a602",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
              fontWeight: "bold",
            }}
            onClick={() => {
              window.location.href = `/Perfil/${address}?showModal=true`;
            }}
          >
            Completar perfil
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "url('/fondo.jpg') center/cover no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.93)",
          borderRadius: "18px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
          padding: "1.5rem 1.2rem",
          maxWidth: 340,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "var(--primary-color)", marginBottom: "1.2rem", fontSize: "1.2rem" }}>
          Reclama tu POAP
        </h1>
        {loading && <div style={{ marginBottom: 8 }}>Cargando POAP...</div>}
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        {poapData && (
          <>
            <img
              src={poapData?.event?.image_url || "/placeholder.png"}
              alt="POAP"
              style={{
                width: 120,
                borderRadius: "50%",
                marginBottom: 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                border: "3px solid var(--primary-color)",
              }}
            />
            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: "1.1em", color: "var(--primary-color)" }}>
              {poapData.event.name}
            </div>
            <div style={{ fontSize: "1em", marginBottom: 8, color: "#444" }}>{poapData.event.description}</div>
            {poapData.event.city && (
              <div style={{ fontSize: "0.95em", color: "#666", marginBottom: 8 }}>
                {poapData.event.city}, {poapData.event.country}
              </div>
            )}
            {codesAvailable && (
              <div style={{ margin: "18px 0", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {!showQR ? (
                  <button
                    style={{
                      background: "var(--primary-color)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1.2rem",
                      fontWeight: 600,
                      fontSize: "1rem",
                      cursor: "pointer",
                      marginBottom: 10,
                      width: "80%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      transition: "background 0.2s",
                    }}
                    onClick={() => setShowQR(true)}
                  >
                    Revelar QR
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <QRCode value={`https://poap.xyz/claim/${currentHash}`} size={180} />
                    <div
                      style={{
                        fontSize: 13,
                        marginTop: 8,
                        wordBreak: "break-all",
                        color: "#888",
                        textAlign: "center",
                        background: "#f5f5f5",
                        borderRadius: 6,
                        padding: "6px 8px",
                        marginBottom: 8,
                        maxWidth: 220,
                      }}
                    >
                      {`https://poap.xyz/claim/${currentHash}`}
                    </div>
                  </div>
                )}
              </div>
            )}
            {codesAvailable ? (
              !address ? (
                <ButtonSignIn style={{ width: "100%", marginTop: 10 }}>
                  Conectar wallet para reclamar
                </ButtonSignIn>
              ) : (
                <button
                  style={{
                    background: "var(--primary-color)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1.2rem",
                    fontWeight: 600,
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: "1rem",
                    width: "100%",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "background 0.2s",
                  }}
                  onClick={handleClaimPoap}
                  disabled={claiming}
                >
                  {claiming ? "Reclamando..." : "Reclamar POAP"}
                </button>
              )
            ) : (
              <div style={{ color: "#888", marginTop: 16, textAlign: "center" }}>
                No hay POAPs disponibles para reclamar.
              </div>
            )}
          </>
        )}
        <ModalClaimed
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          tokenId={claimedData?.tokenId || ""}
          wallet={claimedData?.wallet || ""}
          imageUrl={poapData?.event?.image_url}
          eventName={poapData?.event?.name}
        />
      </div>
    </div>
  );
}