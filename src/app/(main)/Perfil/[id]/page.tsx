"use client";
import { Banner, Degradado, GridNfts, Profile } from "@/components";
//import { ZoraList } from "./zoraList";
import { usePrivySession } from "@/hooks/usePrivySession";

export default function PerfilPage() {
  const { session, loading } = usePrivySession();

  if (loading) return null;
  if (!session) return null;
  
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
      <Profile wallet={session?.wallet as string}/>
      <GridNfts />
      {/*<ZoraList address={session?.wallet as string} />*/}
    </div>
  );
} 
