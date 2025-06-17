"use client";

import { Banner, Button, Degradado, Text, Title } from "@/components";
import StatsCard from "./StatsCard";
import { useEffect, useState } from "react";
import styles from "./AdminNft.module.scss";
import NftItem, { NftItemProps } from "./NftItem";
import { Card, CardContent } from "@/components/common/Card";
import { useRouter } from "next/navigation";

const AdminNftPage = () => {
  const router = useRouter();
  const [nfts, setNfts] = useState<NftItemProps[]>([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("/api/products/all");
      const data = await response.json();

      if (data.products) {
        const parsedProducts: NftItemProps[] = data.products.map(
          (product: any) => {
            return {
              id: product.id,
              image: product.image,
              category: product.categoria,
              name: product.nombre,
              price: +product.precio,
            };
          }
        );

        setNfts(parsedProducts);
      }
    }
    getProducts();
  }, []);

  return (
    <>
      <Banner
        title="Administrar productos"
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
      <Title title="Administrar productos" />

      <div className={styles.container}>
        <Card
          style={{
            width: "100%",
          }}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: " 0 0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Text as="h2">Productos</Text>
              <Button
                color="primary"
                onClick={() => router.push("/Dashboard/products/new")}
              >
                Agregar
              </Button>
            </div>
            <div className={styles.nftList}>
              {nfts.map((nft) => (
                <NftItem
                  key={nft.id}
                  name={nft.name}
                  image={nft.image}
                  price={nft.price}
                  category={nft.category}
                  id={nft.id}
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
