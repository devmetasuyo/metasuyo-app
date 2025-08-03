"use client";
import { useState, useEffect } from "react";
import { Degradado, Banner, CardNft, Title } from "@/components";
import { CarouselMainWallet } from "@/components";
import textos from "@/utils/text.json";
import { useFeedbackModal } from "@/components/Modals/FeedbackModal";
import { usePrivySession } from "@/hooks/usePrivySession";

export default function Article({ params }: { params: { id: string } }) {
  const { session, login } = usePrivySession();
  const { openModal } = useFeedbackModal();

  useEffect(() => {
    if (!session?.wallet) {
      openModal({
        title: "Iniciar sesión requerido",
        message:
          "Por favor, inicia sesión con Privy para poder cobrar tu premio.",
        type: "warning",
        confirmButton: "Iniciar sesión",
        onConfirm: login,
      });
    }
  }, [session?.wallet, openModal, login]);

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
      <CardNft id={+params.id} />
      <Title title="Collections" />
      <CarouselMainWallet />
    </div>
  );
}
