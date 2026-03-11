import type { ReactNode } from "react";

import { actions, description, eyebrow, root, title } from "./PageHeader.css";

type PageHeaderProps = {
  readonly title: string;
  readonly description?: string | undefined;
  readonly eyebrow?: string | undefined;
  readonly actions?: ReactNode | undefined;
};

export function PageHeader({
  actions: actionsNode,
  description: descriptionText,
  eyebrow: eyebrowText,
  title: titleText
}: PageHeaderProps) {
  return (
    <header className={root}>
      {eyebrowText ? <p className={eyebrow}>{eyebrowText}</p> : null}
      <h1 className={title}>{titleText}</h1>
      {descriptionText ? <p className={description}>{descriptionText}</p> : null}
      {actionsNode ? <div className={actions}>{actionsNode}</div> : null}
    </header>
  );
}