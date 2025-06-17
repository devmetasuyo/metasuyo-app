import textos from "@/utils/text.json";
import "./page.scss";
import { Banner, Degradado, CreateNFT, Card } from "@/components";
import Link from "next/link";

export default function Page() {
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
        subtitle={textos.common.banner.toString()}
        imageUrl="/nft-fondo.jpg"
      />
      <Degradado />
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",

          alignItems: "center",
          maxWidth: "600px",
          margin: "2rem auto",
        }}
      >
        <ul className="menu2">
          <li>
            <Link href="/Dashboard/products">PRODUCTOS</Link>
          </li>
          <li>
            <Link href="/Dashboard/invoices">FACTURAS</Link>
          </li>
          <li>
            <Link href="/Dashboard/clients">CLIENTES</Link>
          </li>
          <li>
            <Link href="/Dashboard/stats">ESTADÍSTICAS</Link>
          </li>
          <li>
            <Link href="/Dashboard/pos">POS</Link>
          </li>
        </ul>
      </Card>
      <CreateNFT />
    </div>
  );
}
