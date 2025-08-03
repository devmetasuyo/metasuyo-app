import { Banner, Degradado } from "@/components";
import textos from "@/utils/text.json";
import { prisma } from "@/utils/prismaClient";
import { CartProduct } from "../Dashboard/pos/page";
import ShopClient from "./ShopClient";

// Revalidar cada 30 segundos
export const revalidate = 30;

// Tipo específico para productos del Shop con ID string (UUID)
interface ShopProduct extends Omit<CartProduct, 'id'> {
  id: string;
}

async function getProducts(): Promise<ShopProduct[]> {
  try {
    const products = await prisma.productos.findMany({
      where: {
        cantidad: {
          gt: 0, // Solo productos con stock disponible
        },
      },
      orderBy: {
        id: 'desc', // Ordenar por ID descendente para mostrar los más nuevos primero
      },
    });
    
    // Convertir los productos para que sean compatibles con CartProduct
    return products.map((product: any) => ({
      ...product,
      id: product.id, // Mantener el ID como string UUID
      precio: Number(product.precio), // Convertir Decimal a number
    }));
  } catch (error) {
    console.error("[Shop] Error fetching products:", error);
    return [];
  }
}

export default async function EcommercePage() {
  const products = await getProducts();

  return (
    <>
      <Banner
        title={textos.ecommerce.banner.title}
        subtitle={""}
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
      <ShopClient initialProducts={products} />
    </>
  );
}
