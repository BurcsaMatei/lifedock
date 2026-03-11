import type { DocumentCategory } from "../../documents/lib/document.contracts";
import type { EventType } from "../../events/lib/event.contracts";
import type { ObligationPriority } from "../../obligations/lib/obligation.contracts";

export type DashboardUpcomingEvent = {
  readonly id: string;
  readonly title: string;
  readonly eventType: EventType;
  readonly date: string;
  readonly time: string;
};

export type DashboardExpiringDocument = {
  readonly id: string;
  readonly title: string;
  readonly category: DocumentCategory;
  readonly expiresAt: string;
  readonly daysUntilExpiry: number;
};

export type DashboardUnpaidBill = {
  readonly id: string;
  readonly provider: string;
  readonly amount: string;
  readonly dueDate: string;
  readonly isOverdue: boolean;
};

export type DashboardUrgentObligation = {
  readonly id: string;
  readonly title: string;
  readonly priority: ObligationPriority;
  readonly dueDate: string;
  readonly isOverdue: boolean;
};

export type DashboardCounters = {
  readonly totalEvents: number;
  readonly totalDocuments: number;
  readonly unpaidBills: number;
  readonly pendingObligations: number;
};

export type DashboardSummary = {
  readonly upcomingEvents: readonly DashboardUpcomingEvent[];
  readonly expiringDocuments: readonly DashboardExpiringDocument[];
  readonly unpaidBills: readonly DashboardUnpaidBill[];
  readonly urgentObligations: readonly DashboardUrgentObligation[];
  readonly counters: DashboardCounters;
};

export type DashboardSummaryResponse = {
  readonly summary: DashboardSummary;
};
