import { Card, CardContent, Text } from "@/components";

import styles from "./CartItem.module.scss";
import { Product } from "@/types/product";
import { CartProduct } from "./page";
interface CartItemProps {
  id: number;
  image: string;
  name: string;
  price: number;
  priceUsd: number;
  description: string;
  category: string;
  quantity: number;
  handleClick: (product: CartProduct) => void;
}

export const CartItem = ({
  id,
  image,
  name,
  price,
  category,
  description,
  quantity,
  priceUsd,
  handleClick,
}: CartItemProps) => {
  // price viene en USD, priceUsd es la tasa de conversión ETH->USD
  const ethPrice = priceUsd > 0 ? (price / priceUsd) : 0;

  return (
    <Card
      key={id}
      className={styles.dishCard}
      onClick={() =>
        handleClick({
          id,
          precio: price, // Guardar en USD
          image,
          nombre: name,
          descripcion: description,
          categoria: category,
          cantidad: 1,
        })
      }
    >
      <CardContent>
        <img src={image} alt={name} />
        <div className={styles.productName}>
          <Text as="h5">{name}</Text>
        </div>
        <Text as="span">Precio</Text>
        <Text as="p" className="price">
          ${price.toFixed(2)} USD
        </Text>
        <Text as="p" className="price">
          {ethPrice.toFixed(6)} ETH
        </Text>
        <div className="rating">
          {/* <span className="star">⭐</span>
          <Text as="span">4.5</Text> */}
        </div>
        {/* <Text className="sales">1360 Ventas Totales</Text> */}
      </CardContent>
    </Card>
  );
};
