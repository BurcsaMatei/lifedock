import type { ReactNode } from "react";

import { AppShell } from "../../shared/components/layout/AppShell";
import { TopBar } from "../../shared/components/layout/TopBar";

type OnboardingLayoutProps = {
  readonly children: ReactNode;
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <>
      <TopBar title="Onboarding" />
      <AppShell showBottomNav={false}>{children}</AppShell>
    </>
  );
}