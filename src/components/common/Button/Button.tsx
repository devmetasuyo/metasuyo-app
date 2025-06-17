"use client";

import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "full";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          styles.button,
          styles[`button-${props.color ?? "primary"}`],
          styles[`button-${props.size ?? "md"}`]
        )}
      >
        {children}
      </button>
    );
  }
);
