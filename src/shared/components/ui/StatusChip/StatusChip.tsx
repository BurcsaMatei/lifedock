import type { ReactNode } from "react";

import { base, tone } from "./StatusChip.css";

export type StatusChipTone = keyof typeof tone;

type StatusChipProps = {
  readonly children: ReactNode;
  readonly tone?: StatusChipTone;
  readonly className?: string;
};

export function StatusChip({
  children,
  className,
  tone: chipTone = "neutral"
}: StatusChipProps) {
  const classes = [base, tone[chipTone], className ?? ""].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}