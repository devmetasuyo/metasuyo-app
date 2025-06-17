import styles from "./styles.module.scss";

export const CardHeader = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.cardHeader}>{children}</div>;
};
