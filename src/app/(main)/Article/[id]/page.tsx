"use client";

import { useState, useEffect } from "react";
import {
  Degradado,
  Banner,
  CardNft,
  Title,
  Button,
  ButtonSignIn,
} from "@/components";
import { CarouselMainWallet } from "@/components";
import textos from "@/utils/text.json";
import { useAccount } from "wagmi";
import { Modal } from "@/components/Common/Modal";

export default function Article({ params }: { params: { id: string } }) {
  const { address } = useAccount();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(!address);
  }, [address]);

  return (
    <div style={{ background: "#040200" }}>
      <Banner
        icon={false}
        session={false}
        style={{
          height: "350px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
        }}
        subtitle={textos.common.banner}
        imageUrl="/nft-fondo.jpg"
        title={""}
      />
      <Degradado />
      {<CardNft id={+params.id} />}
      <Title title="Collections" />
      <CarouselMainWallet />

      <Modal isOpen={showModal} handleModal={() => {}}>
        <div
          style={{
            width: "90%",
            maxWidth: "400px",
            background: "#f5f5f5", // Fondo gris neutro
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#333", // Color de texto oscuro para contraste
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
            Inicia sesión para explorar nuestra increíble colección de NFTs y
            acceder al contenido premium.
          </p>
          <ButtonSignIn
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#f5a602", // Color primario para el botón
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
    </div>
  );
}
