"use client";

import { Banner, Degradado, Title } from "@/components";
import StatsCard from "./StatsCard";
import textos from "@/utils/text.json";
import { useEffect, useState } from "react";
import styles from "./AdminNft.module.scss"; // Asegúrate de crear este archivo de estilos
import NftItem from "./NftItem"; // Asegúrate de importar el nuevo componente
import { Card, CardContent, CardHeader } from "@/components/Common/Card"; // Importa el componente Card correctamente

const mockNfts = [
  {
    name: "NFT 1",
    rarity: 1, // Ordinario
    collectionId: 1,
    jsonData: "{}",
    imageUri: "/icon.png",
    price: 0.5,
    duplicates: 0,
  },
  {
    name: "NFT 2",
    rarity: 2, // Común
    collectionId: 2,
    jsonData: "{}",
    imageUri: "/icon.png",
    price: 1.0,
    duplicates: 0,
  },
  {
    name: "NFT 3",
    rarity: 3, // Raro
    collectionId: 3,
    jsonData: "{}",
    imageUri: "/icon.png",
    price: 2.5,
    duplicates: 1,
  },
  {
    name: "NFT 4",
    rarity: 4, // Legendario
    collectionId: 4,
    jsonData: "{}",
    imageUri: "/icon.png",
    price: 5.0,
    duplicates: 2,
  },
  {
    name: "NFT 5",
    rarity: 5, // Mítico
    collectionId: 5,
    jsonData: "{}",
    imageUri: "/icon.png",
    price: 10.0,
    duplicates: 0,
  },
];

const AdminNftPage = () => {
  const [nfts, setNfts] = useState(mockNfts);

  const stats = [
    {
      title: "Ventas totales",
      value: "7,364",
      icon: <span>🧪</span>,
      data: [60, 20, 30, 30, 100],
    },
    {
      title: "Volumen total",
      value: "28.244 ETH",
      icon: <span>💎</span>,
      data: [5, 15, 25, 35, 45],
    },
    {
      title: "Nfts Vendidos",
      value: "5,088",
      icon: <span>🐉</span>,
      data: [3, 12, 26, 32, 22],
    },
  ];

  return (
    <>
      <Banner
        title="Administrar NFTs"
        subtitle=""
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <Title title="Administrar Colección de NFTs" />

      <div className={styles.container}>
        <Card
          style={{
            width: "100%",
          }}
        >
          <CardContent>
            <h2 className={styles.cardTitle}>Estadísticas</h2>
            <div className={styles.statsContainer}>
              {stats.map((stat, index) => (
                <StatsCard
                  key={index} // Usa un índice o un identificador único
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  data={stat.data}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card
          style={{
            width: "100%",
          }}
        >
          <CardContent>
            <h2>Lista de NFTs</h2>
            <div className={styles.nftList}>
              {nfts.map((nft) => (
                <NftItem
                  key={nft.collectionId}
                  name={nft.name}
                  imageUri={nft.imageUri}
                  price={nft.price}
                  duplicates={nft.duplicates}
                  rarity={nft.rarity}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminNftPage;
