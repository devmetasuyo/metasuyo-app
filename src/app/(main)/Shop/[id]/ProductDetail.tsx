"use client";

import { useState, useEffect } from "react";
import { Button, Text, Card, CardContent } from "@/components";
import { PiCurrencyDollar, PiCurrencyEthFill } from "react-icons/pi";
import { FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import useOrder from "@/hooks/useOrder";
import { CartProduct } from "../../Dashboard/pos/page";
import styles from "./ProductDetail.module.scss";

interface ProductDetailProps {
  product: CartProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  
  const {
    addItemToCart,
    order,
    checkItemsInCart,
  } = useOrder();

  useEffect(() => {
    const ethPrice = localStorage.getItem("price");
    if (ethPrice) {
      setPrice(Number(ethPrice));
    }
  }, []);

  useEffect(() => {
    if (order) {
      checkItemsInCart([product]);
    }
  }, [order, product, checkItemsInCart]);

  const handleQuantityChange = (action: "increment" | "decrement") => {
    if (action === "increment") {
      setQuantity(prev => Math.min(prev + 1, product.cantidad));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = () => {
    if (!product.id) return;
    
    addItemToCart({
      id: product.id.toString(),
      imageSrc: product.image,
      name: product.nombre,
      quantity: quantity,
      price: Number(product.precio),
    });
  };

  const formatUsdPrice = (price: number) => {
    return Intl.NumberFormat("es-ES", {
      maximumSignificantDigits: 2,
      maximumFractionDigits: 2,
      roundingPriority: "morePrecision",
    }).format(price);
  };

  const formatEthPrice = (price: number) => {
    return price.toFixed(6);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <Button 
          size="xs" 
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          <FaArrowLeft size={16} />
          Volver
        </Button>
      </div>

      <div className={styles.productDetail}>
        <div className={styles.imageSection}>
          <img 
            src={product.image} 
            alt={product.nombre} 
            className={styles.productImage}
          />
        </div>

        <div className={styles.infoSection}>
          <Card className={styles.productCard}>
            <CardContent>
              <div className={styles.productHeader}>
                <Text as="h1" className={styles.productTitle}>
                  {product.nombre}
                </Text>
                <Text className={styles.productCategory}>
                  {product.categoria}
                </Text>
              </div>

              <div className={styles.productDescription}>
                <Text as="p" className={styles.description}>
                  {product.descripcion}
                </Text>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.priceItem}>
                  <PiCurrencyDollar size={20} />
                  <Text className={styles.price}>
                    ${formatUsdPrice(Number(product.precio) * price)}
                  </Text>
                </div>
                <div className={styles.priceItem}>
                  <PiCurrencyEthFill size={20} />
                  <Text className={styles.price}>
                    {formatEthPrice(Number(product.precio))} ETH
                  </Text>
                </div>
              </div>

              <div className={styles.stockInfo}>
                <Text className={styles.stockText}>
                  Stock disponible: <span className={styles.stockNumber}>{product.cantidad}</span>
                </Text>
              </div>

              <div className={styles.quantitySection}>
                <Text className={styles.quantityLabel}>Cantidad:</Text>
                <div className={styles.quantityControls}>
                  <Button 
                    size="xs" 
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                  >
                    <FaMinus size={12} />
                  </Button>
                  <Text className={styles.quantity}>{quantity}</Text>
                  <Button 
                    size="xs" 
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= product.cantidad}
                  >
                    <FaPlus size={12} />
                  </Button>
                </div>
              </div>

              <div className={styles.actions}>
                <Button 
                  size="full" 
                  onClick={handleAddToCart}
                  disabled={product.cantidad === 0}
                  className={styles.addToCartBtn}
                >
                  {product.cantidad === 0 ? "Sin stock" : "Agregar al carrito"}
                </Button>
              </div>

              {product.cantidad === 0 && (
                <Text className={styles.outOfStock}>
                  Este producto no está disponible actualmente
                </Text>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 