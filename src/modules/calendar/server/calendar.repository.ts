import { db } from "../../../server/db/client";
import type { CalendarDayItem } from "../lib/calendar.contracts";

function getMonthBounds(month: string): { readonly start: string; readonly end: string } {
  const parts = month.split("-");
  const yearStr = parts[0] ?? "2000";
  const monthStr = parts[1] ?? "01";

  const year = parseInt(yearStr, 10);
  const mon = parseInt(monthStr, 10);

  const start = `${String(year)}-${String(mon).padStart(2, "0")}-01`;

  const lastDay = new Date(year, mon, 0).getDate();
  const end = `${String(year)}-${String(mon).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { start, end };
}

export async function getCalendarItems(month: string): Promise<readonly CalendarDayItem[]> {
  const { start, end } = getMonthBounds(month);

  const [events, bills, obligations, documents] = await Promise.all([
    db.event.findMany({
      where: { date: { gte: start, lte: end } },
      select: { id: true, title: true, date: true },
      orderBy: { date: "asc" }
    }),
    db.bill.findMany({
      where: { dueDate: { gte: start, lte: end } },
      select: { id: true, provider: true, dueDate: true },
      orderBy: { dueDate: "asc" }
    }),
    db.obligation.findMany({
      where: { dueDate: { gte: start, lte: end } },
      select: { id: true, title: true, dueDate: true },
      orderBy: { dueDate: "asc" }
    }),
    db.document.findMany({
      where: { expiresAt: { gte: start, lte: end } },
      select: { id: true, title: true, expiresAt: true },
      orderBy: { expiresAt: "asc" }
    })
  ]);

  const items: CalendarDayItem[] = [
    ...events.map((e) => ({
      id: e.id,
      type: "event" as const,
      title: e.title,
      date: e.date,
      href: `/events/${e.id}`
    })),
    ...bills.map((b) => ({
      id: b.id,
      type: "bill" as const,
      title: b.provider,
      date: b.dueDate,
      href: `/bills/${b.id}`
    })),
    ...obligations.map((o) => ({
      id: o.id,
      type: "obligation" as const,
      title: o.title,
      date: o.dueDate,
      href: `/obligations/${o.id}`
    })),
    ...documents.map((d) => ({
      id: d.id,
      type: "document" as const,
      title: d.title,
      date: d.expiresAt,
      href: `/documents/${d.id}`
    }))
  ];

  return items.sort((a, b) => a.date.localeCompare(b.date));
}
