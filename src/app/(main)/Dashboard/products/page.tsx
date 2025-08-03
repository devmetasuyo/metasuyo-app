import { Banner, Button, Degradado, Text, Title } from "@/components";
import StatsCard from "./StatsCard";
import styles from "./AdminNft.module.scss";
import NftItem, { NftItemProps } from "./NftItem";
import { Card, CardContent } from "@/components/common/Card";
import { prisma } from "@/utils/prismaClient";
import ProductsClient from "./ProductsClient";

// Revalidar cada 30 segundos
export const revalidate = 30;

async function getProducts(): Promise<NftItemProps[]> {
  try {
    const products = await prisma.productos.findMany({
      orderBy: {
        id: 'desc', // Ordenar por ID descendente para mostrar los más nuevos primero
      },
    });
    
    return products.map((product: any) => ({
      id: product.id,
      image: product.image,
      category: product.categoria,
      name: product.nombre,
      price: Number(product.precio),
    }));
  } catch (error) {
    console.error("[Products] Error fetching products:", error);
    return [];
  }
}

export default async function AdminNftPage() {
  const products = await getProducts();

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
      <ProductsClient initialProducts={products} />
    </>
  );
}
