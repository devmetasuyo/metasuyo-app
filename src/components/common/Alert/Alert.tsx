import React, { ReactNode } from "react";
import styles from "./Alert.module.scss";

type AlertType = "info" | "success" | "error";

interface AlertProps {
  type: AlertType;
  children: ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, children }) => {
  return <div className={`${styles.alert} ${styles[type]}`}>{children}</div>;
};
