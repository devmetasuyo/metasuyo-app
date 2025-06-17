import React from "react";
import { Button } from "../common";
import {
  FaTimes,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaCopy,
} from "react-icons/fa";
import { useCreateUID } from "@/hooks/useCreateUID";

interface Props {
  uid: string;
  onRemove: () => void;
}

const addressContract = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function UIDListItem({ uid, onRemove }: Props) {
  const {
    executeGenerateUID,
    transactionStatus,
    isGenerateUIDLoading,
    isGenerateUIDSuccess,
    error: errorGenerateUID,
  } = useCreateUID(addressContract);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uid).then(() => {
      // Opcionalmente, puedes mostrar una notificación de que se ha copiado
      alert("UID copiado al portapapeles");
    });
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <span
        style={{
          flexGrow: 1,
          fontWeight: "bold",
          fontSize: "16px",
          color: "#333",
          display: "flex",
          alignItems: "center",
        }}
      >
        {uid}
        <Button
          type="button"
          onClick={copyToClipboard}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "5px",
            marginLeft: "10px",
          }}
        >
          <FaCopy style={{ color: "#666", fontSize: "14px" }} />
        </Button>
      </span>

      {(transactionStatus !== "pending" && transactionStatus !== "success") ||
        (!isGenerateUIDSuccess && (
          <Button
            type="button"
            onClick={() => executeGenerateUID(uid)}
            disabled={isGenerateUIDLoading}
            style={{
              backgroundColor: isGenerateUIDLoading ? "#cccccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              marginRight: "10px",
              cursor: isGenerateUIDLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
          >
            Generar
          </Button>
        ))}

      {/* Estado de carga de generación de UID */}
      {isGenerateUIDLoading && (
        <span
          style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          <FaSpinner
            style={{
              color: "#007bff",
              animation: "spin 1s linear infinite",
              marginRight: "5px",
            }}
          />
          <span style={{ fontSize: "14px", color: "#666" }}>
            Generando UID...
          </span>
        </span>
      )}

      {/* Estado de la transacción */}
      {transactionStatus && isGenerateUIDSuccess && (
        <span
          style={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          {transactionStatus === "pending" && (
            <>
              <span style={{ fontSize: "14px", color: "#666" }}>
                Transacción pendiente
              </span>
            </>
          )}
          {transactionStatus === "success" && (
            <>
              <FaCheck style={{ color: "#28a745", marginRight: "5px" }} />
              <span style={{ fontSize: "14px", color: "#28a745" }}>
                Transacción exitosa
              </span>
            </>
          )}
          {transactionStatus === "error" && (
            <>
              <FaExclamationTriangle
                style={{ color: "#dc3545", marginRight: "5px" }}
              />
              <span style={{ fontSize: "14px", color: "#dc3545" }}>
                Error en la transacción
              </span>
            </>
          )}
        </span>
      )}

      {/* Botón de eliminar */}
      <Button
        type="button"
        onClick={onRemove}
        style={{
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          fontSize: "12px",
        }}
      >
        <FaTimes />
      </Button>
    </li>
  );
}
