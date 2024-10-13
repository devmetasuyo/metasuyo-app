"use client";

import { Banner, Degradado, GridNfts, Profile, Title } from "@/components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Article({ params }: any) {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address === null || !params.id) {
      router.replace("/");
    }
  }, [params.id, router]);

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
        subtitle="Perfil de usuario"
        imageUrl="/nft-fondo.jpg"
        title={""}
      />
      <Degradado />
      <Profile />
      <Title title="Mis NFTS" />
      <GridNfts />
    </div>
  );
}
