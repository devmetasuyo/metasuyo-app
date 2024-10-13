import React, { forwardRef, Ref } from "react";
import "./Spinner.scss";

interface Props extends React.HTMLProps<HTMLDivElement> {}

export const Spinner = forwardRef(function Loading(
  props: Props,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className={"loading-container"} {...props}>
      <div className="spinner"></div>
    </div>
  );
});
