import { Banner, Degradado, Button, Text } from "@/components";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <>
      <Banner
        title="Producto no encontrado"
        subtitle="El producto que buscas no existe o ha sido removido"
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
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <FaExclamationTriangle size={64} />
          </div>
          <Text as="h1" className={styles.errorTitle}>
            Producto no encontrado
          </Text>
          <Text className={styles.errorMessage}>
            Lo sentimos, el producto que buscas no existe o ha sido removido de nuestro catálogo.
          </Text>
          <div className={styles.actions}>
            <Link href="/Shop">
              <Button size="lg" className={styles.homeButton}>
                <FaHome size={16} />
                Volver al Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 