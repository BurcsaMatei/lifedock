import type { ButtonHTMLAttributes, ReactNode } from "react";

import { base, fullWidth, label, loading, size, variant } from "./Button.css";

export type ButtonVariant = keyof typeof variant;
export type ButtonSize = keyof typeof size;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly isLoading?: boolean;
};

export function Button({
  children,
  className,
  disabled,
  fullWidth: isFullWidth = false,
  isLoading = false,
  size: buttonSize = "md",
  type = "button",
  variant: buttonVariant = "primary",
  ...rest
}: ButtonProps) {
  const classes = [
    base,
    variant[buttonVariant],
    size[buttonSize],
    isFullWidth ? fullWidth : "",
    isLoading ? loading : "",
    className ?? ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      <span className={label}>{children}</span>
    </button>
  );
}