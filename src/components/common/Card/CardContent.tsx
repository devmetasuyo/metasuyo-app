import styles from "./styles.module.scss";
import { forwardRef } from "react";

interface Props extends React.PropsWithChildren {
  style?: React.CSSProperties;
}

export const CardContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div ref={ref} className={styles.cardContent} style={props.style}>
      {props.children}
    </div>
  );
});

CardContent.displayName = "CardContent";
