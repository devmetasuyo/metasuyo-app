"use client";

import { Button, Text } from "@/components";
import { Card, CardContent } from "@/components/common/Card";
import { useRouter } from "next/navigation";
import NftItem, { NftItemProps } from "./NftItem";
import styles from "./AdminNft.module.scss";

interface ProductsClientProps {
  initialProducts: NftItemProps[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();

  return (
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
            {initialProducts.map((nft) => (
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
  );
} 