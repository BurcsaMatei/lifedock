import type { ReactNode } from "react";

import { action, description, root, title } from "./EmptyState.css";

type EmptyStateProps = {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
};

export function EmptyState({
  action: actionNode,
  description: descriptionText,
  title: titleText
}: EmptyStateProps) {
  return (
    <section className={root} aria-live="polite">
      <h2 className={title}>{titleText}</h2>

      {descriptionText ? <p className={description}>{descriptionText}</p> : null}

      {actionNode ? <div className={action}>{actionNode}</div> : null}
    </section>
  );
}