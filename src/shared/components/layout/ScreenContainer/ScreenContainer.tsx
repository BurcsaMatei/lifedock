import type { ReactNode } from "react";

import { root } from "./ScreenContainer.css";

type ScreenContainerProps = {
  readonly children: ReactNode;
  readonly as?: "div" | "section" | "main";
};

export function ScreenContainer({
  children,
  as = "section"
}: ScreenContainerProps) {
  const Component = as;

  return <Component className={root}>{children}</Component>;
}