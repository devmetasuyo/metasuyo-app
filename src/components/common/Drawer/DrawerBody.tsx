import styles from "./Drawer.module.scss";
interface DrawerBodyProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const DrawerBody: React.FC<DrawerBodyProps> = ({ children, style }) => {
  return (
    <div className={styles.drawerBody} style={{ overflowY: "auto", ...style }}>
      {children}
    </div>
  );
};
