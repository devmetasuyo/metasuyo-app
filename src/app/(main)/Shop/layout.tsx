"use client";

import { ButtonSignIn, Modal } from "@/components";
import { useEffect, useState } from "react";
import { usePrivySession } from "@/hooks/usePrivySession";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const { session, loading } = usePrivySession();

  useEffect(() => {
    if (!loading) setShowModal(!session);
  }, [session, loading]);

  return (
    <>
      {children}
      <Modal isOpen={showModal} handleModal={() => {}}>
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
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ¡Descubre nuestra colección exclusiva!
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Inicia sesión para explorar nuestra increíble colección y
            acceder al contenido premium.
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
            Únete a MetaSuyo
          </ButtonSignIn>
        </div>
      </Modal>
    </>
  );
}