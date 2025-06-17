import React from "react";
import { Button } from "../common";
import { FaTimes, FaCopy } from "react-icons/fa";

interface Props {
  uid: string;
  onRemove: () => void;
}

export default function UIDListItemSimple({ uid, onRemove }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(uid).then(() => {
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
