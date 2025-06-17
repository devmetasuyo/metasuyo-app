import React from "react";

interface ModalClaimedProps {
  open: boolean;
  onClose: () => void;
  tokenId: string;
  wallet: string;
  imageUrl?: string;
  eventName?: string;
}

export function ModalClaimed({ open, onClose, tokenId, wallet, imageUrl, eventName }: ModalClaimedProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "2.2rem 2rem 2rem 2rem",
          minWidth: "320px",
          maxWidth: 340,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          textAlign: "center",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl || "/placeholder.png"}
          alt="POAP"
          style={{
            width: 90,
            borderRadius: "50%",
            marginBottom: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            border: "2.5px solid var(--primary-color)",
            background: "#fff",
            display: "block",
            margin: "0 auto 12px auto",
          }}
        />
        <h2 style={{ color: "var(--primary-color)", marginBottom: 8 }}>¡Felicidades!</h2>
        <div style={{ fontWeight: 700, fontSize: "1.1em", marginBottom: 6 }}>
          {eventName || "POAP reclamado"}
        </div>
        <p style={{ marginBottom: 18, color: "#444" }}>Has reclamado tu POAP exitosamente.</p>
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 8,
            padding: "1rem 0.7rem",
            marginBottom: 18,
            fontSize: 15,
            color: "#333",
            wordBreak: "break-all",
          }}
        >
          <strong>Token ID:</strong> <span>{tokenId}</span>
          <br />
          <strong>Wallet:</strong> <span>{wallet}</span>
        </div>
        <button
          style={{
            background: "var(--primary-color)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}