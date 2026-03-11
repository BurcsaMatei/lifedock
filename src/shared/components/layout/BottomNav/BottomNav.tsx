"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BOTTOM_NAV_ITEMS } from "../../../config/routes";
import { link, linkActive, nav } from "./BottomNav.css";

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href;
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigație principală" className={nav}>
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${link} ${isActive ? linkActive : ""}`.trim()}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}