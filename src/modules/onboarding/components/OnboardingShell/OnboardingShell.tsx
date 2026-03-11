import type { ReactNode } from "react";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { content, footer, root, surface } from "./OnboardingShell.css";

type OnboardingShellProps = {
  readonly step: string;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
};

export function OnboardingShell({
  children,
  description,
  footer: footerNode,
  step,
  title
}: OnboardingShellProps) {
  return (
    <ScreenContainer>
      <section className={root}>
        <PageHeader
          eyebrow={step}
          title={title}
          {...(description ? { description } : {})}
        />
        <div className={surface}>
          <div className={content}>{children}</div>
          {footerNode ? <div className={footer}>{footerNode}</div> : null}
        </div>
      </section>
    </ScreenContainer>
  );
}