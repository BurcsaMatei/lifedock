"use client";

import Link from "next/link";
import type { Route } from "next";

import type { CalendarDayItem, CalendarItemType } from "../../lib/calendar.contracts";
import {
  closeButton,
  emptyText,
  itemBadge,
  itemBadgeBill,
  itemBadgeDocument,
  itemBadgeEvent,
  itemBadgeObligation,
  itemLink,
  itemList,
  itemTitle,
  panel,
  panelHeader,
  panelTitle
} from "./DayPanel.css";

type Props = {
  readonly date: string;
  readonly items: readonly CalendarDayItem[];
  readonly onClose: () => void;
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${dateStr}T00:00:00`));
}

function typeLabel(type: CalendarItemType): string {
  switch (type) {
    case "event":
      return "Eveniment";
    case "bill":
      return "Factură";
    case "obligation":
      return "Obligație";
    case "document":
      return "Document";
  }
}

function badgeClass(type: CalendarItemType): string {
  switch (type) {
    case "event":
      return `${itemBadge} ${itemBadgeEvent}`;
    case "bill":
      return `${itemBadge} ${itemBadgeBill}`;
    case "obligation":
      return `${itemBadge} ${itemBadgeObligation}`;
    case "document":
      return `${itemBadge} ${itemBadgeDocument}`;
  }
}

export function DayPanel({ date, items, onClose }: Props) {
  return (
    <aside className={panel}>
      <div className={panelHeader}>
        <h2 className={panelTitle}>{formatDate(date)}</h2>
        <button type="button" className={closeButton} onClick={onClose} aria-label="Închide panoul">
          ✕
        </button>
      </div>

      {items.length === 0 ? (
        <p className={emptyText}>Nicio activitate în această zi.</p>
      ) : (
        <ul className={itemList}>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href as Route} className={itemLink}>
                <span className={badgeClass(item.type)}>{typeLabel(item.type)}</span>
                <span className={itemTitle}>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
