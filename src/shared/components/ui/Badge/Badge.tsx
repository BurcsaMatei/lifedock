import type { ReactNode } from "react";

import { base, tone } from "./Badge.css";

export type BadgeTone = keyof typeof tone;

type BadgeProps = {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
};

export function Badge({
  children,
  className,
  tone: badgeTone = "neutral"
}: BadgeProps) {
  const classes = [base, tone[badgeTone], className ?? ""].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}