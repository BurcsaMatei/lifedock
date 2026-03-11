import type { SelectHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { control, controlError, error, field, hint, label } from "./Select.css";

export type SelectOption = {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    error: errorText,
    hint: hintText,
    id,
    label: labelText,
    name,
    options,
    placeholder,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;
  const hintId = hintText ? `${selectId}-hint` : undefined;
  const errorId = errorText ? `${selectId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const classes = [control, errorText ? controlError : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={field}>
      {labelText ? <label className={label} htmlFor={selectId}>{labelText}</label> : null}

      <select
        ref={ref}
        id={selectId}
        name={name}
        className={classes}
        aria-invalid={errorText ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}

        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

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