import type { TextareaHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

import { control, controlError, error, field, hint, label } from "./Textarea.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error: errorText, hint: hintText, id, label: labelText, name, ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id ?? name ?? generatedId;
  const hintId = hintText ? `${textareaId}-hint` : undefined;
  const errorId = errorText ? `${textareaId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const classes = [control, errorText ? controlError : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={field}>
      {labelText ? <label className={label} htmlFor={textareaId}>{labelText}</label> : null}

      <textarea
        ref={ref}
        id={textareaId}
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