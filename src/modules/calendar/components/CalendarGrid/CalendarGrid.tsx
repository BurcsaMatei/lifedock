"use client";

import Calendar from "react-calendar";
import type { OnArgs, TileArgs } from "react-calendar";
import type { CSSProperties, ReactNode } from "react";

import type { CalendarDayItem, CalendarItemType } from "../../lib/calendar.contracts";
import { chipContainer, wrapper } from "./CalendarGrid.css";

type Props = {
  readonly items: readonly CalendarDayItem[];
  readonly selectedDate: string | null;
  readonly onDateSelect: (date: string) => void;
  readonly activeMonth: string;
  readonly onMonthChange: (month: string) => void;
};

function dateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${String(y)}-${m}-${d}`;
}

const CHIP_BASE: CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 500,
  lineHeight: 1.3,
  padding: "1px 5px",
  borderRadius: "0.375rem",
  color: "#ffffff",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  display: "block"
};

const CHIP_COLORS: Record<CalendarItemType, string> = {
  event: "#0ea5e9",
  bill: "#f04438",
  obligation: "#f79009",
  document: "#12b76a"
};

const CHIP_OVERFLOW: CSSProperties = {
  ...CHIP_BASE,
  color: "#667085",
  backgroundColor: "#e3e8f2"
};

function chipStyle(type: CalendarItemType): CSSProperties {
  return { ...CHIP_BASE, backgroundColor: CHIP_COLORS[type] };
}

const MAX_CHIPS = 3;

export function CalendarGrid({
  items,
  selectedDate,
  onDateSelect,
  activeMonth,
  onMonthChange
}: Props) {
  const parts = activeMonth.split("-");
  const year = parseInt(parts[0] ?? "2000", 10);
  const mon = parseInt(parts[1] ?? "1", 10);
  const activeStartDate = new Date(year, mon - 1, 1);

  function tileContent({ date, view }: TileArgs): ReactNode {
    if (view !== "month") return null;

    const dayStr = dateToString(date);
    const dayItems = items.filter((item) => item.date === dayStr);

    if (dayItems.length === 0) return null;

    const visible = dayItems.slice(0, MAX_CHIPS);
    const overflow = dayItems.length - MAX_CHIPS;

    return (
      <div className={chipContainer}>
        {visible.map((item) => (
          <div key={item.id} style={chipStyle(item.type)} title={item.title}>
            {item.title.length > 14 ? `${item.title.slice(0, 12)}…` : item.title}
          </div>
        ))}
        {overflow > 0 && (
          <div style={CHIP_OVERFLOW}>+{String(overflow)}</div>
        )}
      </div>
    );
  }

  function handleChange(value: Date | null | [Date | null, Date | null]): void {
    if (value instanceof Date) {
      onDateSelect(dateToString(value));
    }
  }

  function handleActiveStartDateChange({ activeStartDate: newStart }: OnArgs): void {
    if (newStart === null) return;

    const y = newStart.getFullYear();
    const m = String(newStart.getMonth() + 1).padStart(2, "0");

    onMonthChange(`${String(y)}-${m}`);
  }

  const selectedValue: Date | null = selectedDate !== null
    ? new Date(`${selectedDate}T00:00:00`)
    : null;

  return (
    <div className={wrapper}>
      <Calendar
        value={selectedValue}
        onChange={handleChange}
        tileContent={tileContent}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={handleActiveStartDateChange}
        maxDetail="month"
        minDetail="month"
        locale="ro-RO"
        showNeighboringMonth
      />
    </div>
  );
}
