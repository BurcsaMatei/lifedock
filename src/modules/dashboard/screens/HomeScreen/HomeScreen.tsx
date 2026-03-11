"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { EmptyState, StatCard, StatusChip } from "../../../../shared/components/ui";
import type { StatusChipTone } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { getDashboardSummary } from "../../lib/dashboard.api";
import type {
  DashboardExpiringDocument,
  DashboardSummary,
  DashboardUnpaidBill,
  DashboardUpcomingEvent,
  DashboardUrgentObligation
} from "../../lib/dashboard.contracts";
import { QuickAddBar } from "../../components/QuickAddBar";
import {
  item,
  itemDetailLink,
  itemHeader,
  itemList,
  itemMeta,
  itemTitle,
  loadingText,
  root,
  section,
  sectionHeaderRow,
  sectionHeading,
  statsGrid,
  viewAllLink
} from "./HomeScreen.css";

function formatDate(dateStr: string): string {
  if (!dateStr) {
    return "—";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateStr}T00:00:00`));
}

function formatDaysLabel(days: number): string {
  if (days < -1) {
    return `Expirat acum ${String(Math.abs(days))} zile`;
  }

  if (days === -1) {
    return "Expirat ieri";
  }

  if (days === 0) {
    return "Expiră azi";
  }

  if (days === 1) {
    return "Expiră mâine";
  }

  return `Expiră în ${String(days)} zile`;
}

function getDaysExpiryTone(days: number): StatusChipTone {
  if (days <= 0) {
    return "danger";
  }

  if (days <= 14) {
    return "warning";
  }

  return "neutral";
}

function getEventTypeLabel(eventType: DashboardUpcomingEvent["eventType"]): string {
  switch (eventType) {
    case "meeting":
      return "Întâlnire";
    case "exam":
      return "Examen";
    case "birthday":
      return "Zi de naștere";
    case "deadline":
      return "Deadline";
  }
}

function getDocumentCategoryLabel(category: DashboardExpiringDocument["category"]): string {
  switch (category) {
    case "identity":
      return "Identitate";
    case "vehicle":
      return "Vehicul";
    case "home":
      return "Locuință";
    case "education":
      return "Educație";
    case "company":
      return "Companie";
  }
}

function getPriorityLabel(priority: DashboardUrgentObligation["priority"]): string {
  switch (priority) {
    case "high":
      return "Urgentă";
    case "medium":
      return "Medie";
    case "low":
      return "Scăzută";
  }
}

function getPriorityTone(priority: DashboardUrgentObligation["priority"]): StatusChipTone {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "neutral";
  }
}

function buildEventDetailRoute(eventId: string): Route {
  return `${ROUTES.app.events}/${eventId}` as Route;
}

function buildDocumentDetailRoute(documentId: string): Route {
  return `${ROUTES.app.documents}/${documentId}` as Route;
}

function buildBillDetailRoute(billId: string): Route {
  return `${ROUTES.app.bills}/${billId}` as Route;
}

function buildObligationDetailRoute(obligationId: string): Route {
  return `${ROUTES.app.obligations}/${obligationId}` as Route;
}

type SectionProps = {
  readonly title: string;
  readonly count: number;
  readonly viewAllHref: Route;
  readonly children: ReactNode;
};

function Section({ title, count, viewAllHref, children }: SectionProps) {
  return (
    <section className={section} aria-label={title}>
      <div className={sectionHeaderRow}>
        <h2 className={sectionHeading}>
          {title} ({String(count)})
        </h2>
        <Link href={viewAllHref} className={viewAllLink}>
          Vezi toate
        </Link>
      </div>
      <div className={itemList}>{children}</div>
    </section>
  );
}

function UpcomingEventItem({ eventItem }: { readonly eventItem: DashboardUpcomingEvent }) {
  const timeLabel = eventItem.time
    ? `${formatDate(eventItem.date)}, ${eventItem.time}`
    : formatDate(eventItem.date);

  return (
    <article className={item}>
      <div className={itemHeader}>
        <span className={itemTitle}>{eventItem.title}</span>
        <StatusChip tone="info">{getEventTypeLabel(eventItem.eventType)}</StatusChip>
      </div>
      <p className={itemMeta}>{timeLabel}</p>
      <Link href={buildEventDetailRoute(eventItem.id)} className={itemDetailLink}>
        Vezi detalii
      </Link>
    </article>
  );
}

function ExpiringDocumentItem({ doc }: { readonly doc: DashboardExpiringDocument }) {
  const tone = getDaysExpiryTone(doc.daysUntilExpiry);

  return (
    <article className={item}>
      <div className={itemHeader}>
        <span className={itemTitle}>{doc.title}</span>
        <StatusChip tone={tone}>{formatDaysLabel(doc.daysUntilExpiry)}</StatusChip>
      </div>
      <p className={itemMeta}>{getDocumentCategoryLabel(doc.category)}</p>
      <Link href={buildDocumentDetailRoute(doc.id)} className={itemDetailLink}>
        Vezi detalii
      </Link>
    </article>
  );
}

function UnpaidBillItem({ bill }: { readonly bill: DashboardUnpaidBill }) {
  const tone: StatusChipTone = bill.isOverdue ? "danger" : "warning";
  const statusLabel = bill.isOverdue ? "Restantă" : "De plătit";

  return (
    <article className={item}>
      <div className={itemHeader}>
        <span className={itemTitle}>{bill.provider}</span>
        <StatusChip tone={tone}>{statusLabel}</StatusChip>
      </div>
      <p className={itemMeta}>
        {bill.amount} · Scadent: {formatDate(bill.dueDate)}
      </p>
      <Link href={buildBillDetailRoute(bill.id)} className={itemDetailLink}>
        Vezi detalii
      </Link>
    </article>
  );
}

function UrgentObligationItem({ obligation }: { readonly obligation: DashboardUrgentObligation }) {
  const tone = obligation.isOverdue ? "danger" : getPriorityTone(obligation.priority);
  const statusLabel = obligation.isOverdue ? "Restantă" : getPriorityLabel(obligation.priority);

  return (
    <article className={item}>
      <div className={itemHeader}>
        <span className={itemTitle}>{obligation.title}</span>
        <StatusChip tone={tone}>{statusLabel}</StatusChip>
      </div>
      <p className={itemMeta}>Termen: {formatDate(obligation.dueDate)}</p>
      <Link href={buildObligationDetailRoute(obligation.id)} className={itemDetailLink}>
        Vezi detalii
      </Link>
    </article>
  );
}

function DashboardContent({ summary }: { readonly summary: DashboardSummary }) {
  const { counters, upcomingEvents, expiringDocuments, unpaidBills, urgentObligations } = summary;

  const hasDashboardData =
    upcomingEvents.length > 0 ||
    expiringDocuments.length > 0 ||
    unpaidBills.length > 0 ||
    urgentObligations.length > 0;

  return (
    <>
      <section className={section} aria-label="Statistici rapide">
        <div className={statsGrid}>
          <StatCard
            label="Evenimente"
            value={String(counters.totalEvents)}
            {...(counters.totalEvents === 0 ? { helper: "Nimic programat" } : {})}
          />
          <StatCard
            label="Documente"
            value={String(counters.totalDocuments)}
            {...(counters.totalDocuments === 0 ? { helper: "Niciun document" } : {})}
          />
          <StatCard
            label="Facturi de plată"
            value={String(counters.unpaidBills)}
            {...(counters.unpaidBills === 0 ? { helper: "Totul achitat" } : {})}
          />
          <StatCard
            label="Obligații active"
            value={String(counters.pendingObligations)}
            {...(counters.pendingObligations === 0 ? { helper: "Totul rezolvat" } : {})}
          />
        </div>
      </section>

      {!hasDashboardData ? (
        <section className={section}>
          <EmptyState
            title="Totul este sub control"
            description="Nu există evenimente viitoare, documente care expiră, facturi de plată sau obligații urgente."
            action={<QuickAddBar />}
          />
        </section>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <Section
              title="Urmează curând"
              count={upcomingEvents.length}
              viewAllHref={ROUTES.app.events}
            >
              {upcomingEvents.map((eventItem) => (
                <UpcomingEventItem key={eventItem.id} eventItem={eventItem} />
              ))}
            </Section>
          )}

          {expiringDocuments.length > 0 && (
            <Section
              title="Documente care expiră"
              count={expiringDocuments.length}
              viewAllHref={ROUTES.app.documents}
            >
              {expiringDocuments.map((doc) => (
                <ExpiringDocumentItem key={doc.id} doc={doc} />
              ))}
            </Section>
          )}

          {unpaidBills.length > 0 && (
            <Section
              title="Facturi de plată"
              count={unpaidBills.length}
              viewAllHref={ROUTES.app.bills}
            >
              {unpaidBills.map((bill) => (
                <UnpaidBillItem key={bill.id} bill={bill} />
              ))}
            </Section>
          )}

          {urgentObligations.length > 0 && (
            <Section
              title="Obligații urgente"
              count={urgentObligations.length}
              viewAllHref={ROUTES.app.obligations}
            >
              {urgentObligations.map((obligation) => (
                <UrgentObligationItem key={obligation.id} obligation={obligation} />
              ))}
            </Section>
          )}
        </>
      )}
    </>
  );
}

export function HomeScreen() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getDashboardSummary();

        if (!isMounted) {
          return;
        }

        setSummary(response.summary);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Nu am putut încărca dashboard-ul."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Acasă"
          title="Bine ai revenit în LifeDock"
          description="Ce ai de făcut azi, ce expiră, ce e de plătit — totul într-un singur loc."
          actions={<QuickAddBar />}
        />

        {isLoading ? (
          <p className={loadingText}>Se încarcă datele...</p>
        ) : errorMessage !== null ? (
          <EmptyState
            title="Nu am putut încărca dashboard-ul"
            description={errorMessage}
            action={<QuickAddBar />}
          />
        ) : summary !== null ? (
          <DashboardContent summary={summary} />
        ) : null}
      </div>
    </ScreenContainer>
  );
}
