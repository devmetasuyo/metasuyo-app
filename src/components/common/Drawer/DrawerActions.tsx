import styles from "./Drawer.module.scss";

interface DrawerActionsProps {
  children: React.ReactNode;
}

export const DrawerActions: React.FC<DrawerActionsProps> = ({ children }) => {
  return <div className={styles.drawerActions}>{children}</div>;
};
