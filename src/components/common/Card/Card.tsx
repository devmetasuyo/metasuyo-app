import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx([props.className, styles.card])}
      {...props}
    />
  );
});

Card.displayName = "Card";
