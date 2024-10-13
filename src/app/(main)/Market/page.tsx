import { Banner, Degradado } from "@/components";
import { CarouselMainWalletFull } from "@/components";

export default function Page() {
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
        title="Marketplace"
        subtitle="Coleccionable de los Mundos de Metasuyo"
        imageUrl="/fondo.jpg"
      />
      <Degradado />
      <CarouselMainWalletFull />
    </div>
  );
}
