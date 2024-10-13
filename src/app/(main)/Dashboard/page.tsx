"use client";

import textos from "@/utils/text.json";
import { Banner, Degradado, CreateNFT } from "@/components";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Article() {
  const router = useRouter();
  const { address } = useAccount();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (address !== undefined) {
      if (address !== process.env.NEXT_PUBLIC_ADMIN_WALLET) {
        router.push("/");
      } else {
        setIsVerifying(false);
      }
    }
  }, [address, router]);

  return (
    <div style={{ background: "#040200" }}>
      <Banner
        title=""
        icon={false}
        session={false}
        style={{
          height: "350px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
        }}
        subtitle={textos.common.banner}
        imageUrl="/nft-fondo.jpg"
      />
      <Degradado />
      {isVerifying ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            color: "#FFD700",
            fontSize: "24px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Verificando...
        </div>
      ) : (
        <CreateNFT />
      )}
    </div>
  );
}
