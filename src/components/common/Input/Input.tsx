import { forwardRef, InputHTMLAttributes, Ref } from "react";
import styles from "./styles.module.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (props, ref: Ref<HTMLInputElement>) => {
    const { label, errors } = props;

    return (
      <div className={styles.inputSelectContainer}>
        <label htmlFor={props.id}>{label}</label>
        <input ref={ref} {...props} />
        {errors && <p className={styles.errorForm}>{errors}</p>}
      </div>
    );
  }
);
