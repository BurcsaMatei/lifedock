import type { ReactNode } from "react";

import { AppShell } from "../../shared/components/layout/AppShell";
import { TopBar } from "../../shared/components/layout/TopBar";

type AppLayoutProps = {
  readonly children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <TopBar title="Spațiul tău activ" />
      <AppShell>{children}</AppShell>
    </>
  );
}