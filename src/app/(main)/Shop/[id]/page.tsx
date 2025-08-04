import { Banner, Degradado, Spinner } from "@/components";
import { prisma } from "@/utils/prismaClient";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";

// Revalidar cada 30 segundos
export const revalidate = 30;

async function getProduct(id: string) {
  try {
    const product = await prisma.productos.findUnique({
      where: {
        id: id, // El ID en la base de datos es un UUID string
      },
    });
    
    if (!product) {
      return null;
    }

    // Convertir para compatibilidad manteniendo ID como string para navegación
    return {
      ...product,
      id: product.id, // Mantener como string para consistencia
      precio: Number(product.precio),
    };
  } catch (error) {
    console.error("[ProductDetail] Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Banner
        title={product.nombre}
        subtitle={product.categoria}
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        style={{
          height: "300px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <ProductDetail product={product} />
    </>
  );
} 