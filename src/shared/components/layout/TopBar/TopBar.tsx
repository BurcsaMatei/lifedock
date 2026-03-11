import type { ReactNode } from "react";
import Link from "next/link";

import { ROUTES } from "../../../config/routes";
import { brand, inner, meta, root, title, trailing } from "./TopBar.css";

type TopBarProps = {
  readonly title?: string;
  readonly trailing?: ReactNode;
};

export function TopBar({ title: titleText, trailing: trailingNode }: TopBarProps) {
  return (
    <header className={root}>
      <div className={inner}>
        <div className={meta}>
          <Link href={ROUTES.public.root} className={brand}>
            LifeDock
          </Link>
          {titleText ? <p className={title}>{titleText}</p> : null}
        </div>

        {trailingNode ? <div className={trailing}>{trailingNode}</div> : null}
      </div>
    </header>
  );
}