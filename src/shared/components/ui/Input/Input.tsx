import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { control, controlError, error, field, hint, label } from "./Input.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error: errorText, hint: hintText, id, label: labelText, name, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const hintId = hintText ? `${inputId}-hint` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const classes = [control, errorText ? controlError : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={field}>
      {labelText ? <label className={label} htmlFor={inputId}>{labelText}</label> : null}

      <input
        ref={ref}
        id={inputId}
        name={name}
        className={classes}
        aria-invalid={errorText ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />

      {hintText ? (
        <p id={hintId} className={hint}>
          {hintText}
        </p>
      ) : null}

      {errorText ? (
        <p id={errorId} className={error}>
          {errorText}
        </p>
      ) : null}
    </div>
  );
});