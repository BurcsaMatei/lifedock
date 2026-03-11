import type { ReactNode } from "react";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { content, footer, root, surface } from "./AuthShell.css";

type AuthShellProps = {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
};

export function AuthShell({
  children,
  description,
  footer: footerNode,
  title
}: AuthShellProps) {
  return (
    <ScreenContainer>
      <section className={root}>
        <PageHeader
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