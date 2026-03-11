import type { ReactNode } from "react";

import { root } from "./AppProviders.css";

type AppProvidersProps = {
  readonly children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <div className={root}>{children}</div>;
}