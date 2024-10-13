import styles from "./styles.module.scss";

interface Props extends React.PropsWithChildren {
  style?: React.CSSProperties;
}

export const CardContent = ({ children, style }: Props) => {
  return (
    <div className={styles.cardContent} style={style}>
      {children}
    </div>
  );
};
