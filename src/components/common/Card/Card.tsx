import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "white"
    | "gray"
    | "light"; // Definido para los colores
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const { backgroundColor = "light", className, ...rest } = props;

    return (
      <div
        ref={ref}
        className={clsx(
          className,
          styles.card,
          backgroundColor ? styles[`card-${backgroundColor}`] : ""
        )}
        {...rest}
      />
    );
  }
);

Card.displayName = "Card";
