import clsx from "clsx";
import styles from "./styles.module.scss";
import { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx([styles.cardContent, props.className])}
      style={props.style}
    >
      {props.children}
    </div>
  );
});

CardContent.displayName = "CardContent";
