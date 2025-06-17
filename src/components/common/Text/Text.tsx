import React from "react";
import styles from "./Text.module.scss";

type TextProps = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span";
  variant?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  className?: string;
};

export function Text({
  children,
  as = "p",
  variant,
  className = "",
}: TextProps) {
  const Element = as;

  const classNames = [
    styles.text,
    styles[as],
    variant && styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Element className={classNames}>{children}</Element>;
}
