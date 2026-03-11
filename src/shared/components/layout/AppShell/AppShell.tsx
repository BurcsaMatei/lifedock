import type { ReactNode } from "react";

import { BottomNav } from "../BottomNav";
import { content, shell } from "./AppShell.css";

type AppShellProps = {
  readonly children: ReactNode;
  readonly showBottomNav?: boolean;
};

export function AppShell({
  children,
  showBottomNav = true
}: AppShellProps) {
  return (
    <div className={shell}>
      <main className={content}>{children}</main>
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}