import React from "react";
import styles from "./styles.module.scss";

export const TextBody = ({ children }: { children: React.ReactNode }) => {
  return <p className={styles.textBody}>{children}</p>;
};
