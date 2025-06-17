import styles from "./Drawer.module.scss";
interface DrawerHeaderProps {
  children: React.ReactNode;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ children }) => {
  return <div className={styles.drawerHeader}>{children}</div>;
};
