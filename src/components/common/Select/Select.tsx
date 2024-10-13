import { forwardRef, InputHTMLAttributes, Ref } from "react";
import styles from "../Input/styles.module.scss";

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  errors?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  (props, ref: Ref<HTMLSelectElement>) => {
    const { label, errors, children } = props;

    return (
      <div className={styles.inputSelectContainer}>
        <label htmlFor={props.id}>{label}</label>
        <select ref={ref} {...props}>
          {children}
        </select>
        {errors && <p className={styles.errorForm}>{errors}</p>}
      </div>
    );
  }
);
