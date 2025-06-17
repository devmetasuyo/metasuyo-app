import styles from "./OrderCartItem.module.scss";

export type CartItemProps = {
  image?: string;
  name?: string;
  price?: number;
  priceUsd: number;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
};

export function OrderCartItem({
  image = "/placeholder.svg?height=50&width=50",
  name = "Producto",
  price = 0,
  priceUsd = 0,
  quantity = 1,
  onIncrement = () => {},
  onDecrement = () => {},
  onRemove = () => {},
}: CartItemProps) {
  return (
    <div className={styles.cartItem}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div className={styles.controls}>
          <button className={styles.quantityBtn} onClick={onIncrement}>
            +
          </button>
          <span>{quantity}</span>
          <button className={styles.quantityBtn} onClick={onDecrement}>
            -
          </button>
        </div>
        <img src={image} alt={name} className={styles.image} />
      </div>

      <div className={styles.details}>
        <h4>{name}</h4>

        <div className={styles.subtotal}>
          eth {(price * quantity).toFixed(10)}
        </div>
        <div className={styles.subtotal}>
          $ {(price * priceUsd * quantity).toFixed(14)}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.remove} onClick={onRemove}>
          🗑️
        </button>
      </div>
    </div>
  );
}
