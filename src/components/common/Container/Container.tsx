import styles from "./styles.module.scss";

export function Container({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className={styles.metasuyoContainer} id={id}>
      {children}
    </div>
  );
}
