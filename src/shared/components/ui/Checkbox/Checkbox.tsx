import type { InputHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { control, error, field, hint, label, labelBlock, row } from "./Checkbox.css";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { error: errorText, hint: hintText, id, label: labelText, name, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const hintId = hintText ? `${inputId}-hint` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={field}>
      <label htmlFor={inputId} className={row}>
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          className={control}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />

        <span className={labelBlock}>
          <span className={label}>{labelText}</span>
          {hintText ? (
            <span id={hintId} className={hint}>
              {hintText}
            </span>
          ) : null}
        </span>
      </label>

      {errorText ? (
        <p id={errorId} className={error}>
          {errorText}
        </p>
      ) : null}
    </div>
  );
});