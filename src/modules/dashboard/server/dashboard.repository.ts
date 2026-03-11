import { db } from "../../../server/db/client";
import type {
  DashboardCounters,
  DashboardExpiringDocument,
  DashboardSummary,
  DashboardUnpaidBill,
  DashboardUpcomingEvent,
  DashboardUrgentObligation
} from "../lib/dashboard.contracts";

function getTodayString(): string {
  const iso = new Date().toISOString();
  return iso.split("T")[0] ?? "";
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  const iso = d.toISOString();
  return iso.split("T")[0] ?? dateStr;
}

function daysBetween(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const today = getTodayString();
  const next7Days = addDays(today, 7);
  const next90Days = addDays(today, 90);

  const [
    upcomingEventsRaw,
    expiringDocumentsRaw,
    unpaidBillsRaw,
    urgentObligationsRaw,
    totalEvents,
    totalDocuments,
    unpaidBillsCount,
    pendingObligationsCount
  ] = await Promise.all([
    db.event.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: 5
    }),
    db.document.findMany({
      where: { expiresAt: { lte: next90Days } },
      orderBy: { expiresAt: "asc" },
      take: 5
    }),
    db.bill.findMany({
      where: { isPaid: false },
      orderBy: { dueDate: "asc" },
      take: 5
    }),
    db.obligation.findMany({
      where: {
        isCompleted: false,
        OR: [{ priority: "high" }, { dueDate: { lte: next7Days } }]
      },
      orderBy: { dueDate: "asc" },
      take: 5
    }),
    db.event.count(),
    db.document.count(),
    db.bill.count({ where: { isPaid: false } }),
    db.obligation.count({ where: { isCompleted: false } })
  ]);

  const upcomingEvents: readonly DashboardUpcomingEvent[] = upcomingEventsRaw.map((e) => ({
    id: e.id,
    title: e.title,
    eventType: e.eventType as DashboardUpcomingEvent["eventType"],
    date: e.date,
    time: e.time
  }));

  const expiringDocuments: readonly DashboardExpiringDocument[] = expiringDocumentsRaw.map(
    (doc) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category as DashboardExpiringDocument["category"],
      expiresAt: doc.expiresAt,
      daysUntilExpiry: daysBetween(today, doc.expiresAt)
    })
  );

  const unpaidBills: readonly DashboardUnpaidBill[] = unpaidBillsRaw.map((bill) => ({
    id: bill.id,
    provider: bill.provider,
    amount: bill.amount,
    dueDate: bill.dueDate,
    isOverdue: bill.dueDate < today
  }));

  const urgentObligations: readonly DashboardUrgentObligation[] = urgentObligationsRaw.map(
    (o) => ({
      id: o.id,
      title: o.title,
      priority: o.priority as DashboardUrgentObligation["priority"],
      dueDate: o.dueDate,
      isOverdue: o.dueDate < today
    })
  );

  const counters: DashboardCounters = {
    totalEvents,
    totalDocuments,
    unpaidBills: unpaidBillsCount,
    pendingObligations: pendingObligationsCount
  };

  return {
    upcomingEvents,
    expiringDocuments,
    unpaidBills,
    urgentObligations,
    counters
  };
}
