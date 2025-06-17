import { forwardRef, InputHTMLAttributes, Ref } from "react";
import styles from "./Textarea.module.scss";

interface Props extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errors?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { label, errors } = props;

  return (
    <div className={styles.inputSelectContainer}>
      <label htmlFor={props.id}>{label}</label>
      <textarea ref={ref} {...props} />
      {errors && <p className={styles.errorForm}>{errors}</p>}
    </div>
  );
});
