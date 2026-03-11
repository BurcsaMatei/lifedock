import type { ReactNode } from "react";

import { AppShell } from "../../shared/components/layout/AppShell";
import { TopBar } from "../../shared/components/layout/TopBar";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <TopBar title="Cont" />
      <AppShell showBottomNav={false}>{children}</AppShell>
    </>
  );
}