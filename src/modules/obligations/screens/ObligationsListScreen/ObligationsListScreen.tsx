"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import {
  actionLink,
  card,
  cardHeading,
  cardTop,
  description,
  list,
  metaRow,
  root,
  subtle,
  title,
  toolbar
} from "../../../../shared/components/layout/listScreen.css";
import { Badge, EmptyState, StatusChip, Tabs } from "../../../../shared/components/ui";
import type {
  BadgeTone,
  StatusChipTone,
  TabsItem
} from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { getObligations } from "../../lib/obligation.api";
import type {
  ObligationPriority,
  ObligationRecord
} from "../../lib/obligations.types";

type ObligationTab = "all" | "urgent" | "active" | "done";

type ObligationListItem = {
  readonly id: string;
  readonly title: string;
  readonly priorityLabel: string;
  readonly priorityTone: BadgeTone;
  readonly dueDateLabel: string;
  readonly statusLabel: string;
  readonly statusTone: StatusChipTone;
  readonly bucket: Exclude<ObligationTab, "all">;
  readonly description: string;
};

function getStartOfToday(): Date {
  const currentDate = new Date();

  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
}

function getObligationDate(dateValue: string): Date {
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate()
  );
}

function getDifferenceInDays(fromDate: Date, toDate: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const difference = toDate.getTime() - fromDate.getTime();

  return Math.floor(difference / millisecondsPerDay);
}

function formatDueDate(dateValue: string): string {
  const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return dateFormatter.format(getObligationDate(dateValue));
}

function getPriorityLabel(priority: ObligationPriority): string {
  switch (priority) {
    case "low":
      return "Mică";
    case "medium":
      return "Medie";
    case "high":
      return "Ridicată";
  }
}

function getPriorityBadgeTone(priority: ObligationPriority): BadgeTone {
  switch (priority) {
    case "low":
      return "neutral";
    case "medium":
      return "warning";
    case "high":
      return "danger";
  }
}

function getObligationBucket(
  item: ObligationRecord
): Exclude<ObligationTab, "all"> {
  if (item.isCompleted) {
    return "done";
  }

  const today = getStartOfToday();
  const dueDate = getObligationDate(item.dueDate);
  const differenceInDays = getDifferenceInDays(today, dueDate);

  if (differenceInDays <= 1) {
    return "urgent";
  }

  return "active";
}

function getStatusLabel(bucket: Exclude<ObligationTab, "all">): string {
  switch (bucket) {
    case "urgent":
      return "Urgentă";
    case "active":
      return "În curs";
    case "done":
      return "Finalizată";
  }
}

function getStatusTone(bucket: Exclude<ObligationTab, "all">): StatusChipTone {
  switch (bucket) {
    case "urgent":
      return "danger";
    case "active":
      return "warning";
    case "done":
      return "success";
  }
}

function getDescription(item: ObligationRecord): string {
  if (item.details.trim()) {
    return item.details.trim();
  }

  return "Obligație salvată în baza locală SQLite a aplicației.";
}

function mapObligationToListItem(item: ObligationRecord): ObligationListItem {
  const bucket = getObligationBucket(item);

  return {
    id: item.id,
    title: item.title,
    priorityLabel: getPriorityLabel(item.priority),
    priorityTone: getPriorityBadgeTone(item.priority),
    dueDateLabel: formatDueDate(item.dueDate),
    statusLabel: getStatusLabel(bucket),
    statusTone: getStatusTone(bucket),
    bucket,
    description: getDescription(item)
  };
}

function filterObligations(
  items: readonly ObligationListItem[],
  tab: ObligationTab
): readonly ObligationListItem[] {
  switch (tab) {
    case "all":
      return items;
    case "urgent":
      return items.filter((item) => item.bucket === "urgent");
    case "active":
      return items.filter((item) => item.bucket === "active");
    case "done":
      return items.filter((item) => item.bucket === "done");
  }
}

function buildObligationDetailRoute(obligationId: string): Route {
  return `${ROUTES.app.obligations}/${obligationId}` as Route;
}

export function ObligationsListScreen() {
  const [activeTab, setActiveTab] = useState<ObligationTab>("all");
  const [obligations, setObligations] = useState<readonly ObligationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadObligations(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getObligations();

        if (!isMounted) {
          return;
        }

        setObligations(response.items);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nu am putut încărca obligațiile."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadObligations();

    return () => {
      isMounted = false;
    };
  }, []);

  const mappedObligations = useMemo(
    () => obligations.map((item) => mapObligationToListItem(item)),
    [obligations]
  );

  const filteredItems = useMemo(
    () => filterObligations(mappedObligations, activeTab),
    [activeTab, mappedObligations]
  );

  const tabs: readonly TabsItem<ObligationTab>[] = [
    { label: "Toate", value: "all", badge: String(mappedObligations.length) },
    {
      label: "Urgente",
      value: "urgent",
      badge: String(filterObligations(mappedObligations, "urgent").length)
    },
    {
      label: "Active",
      value: "active",
      badge: String(filterObligations(mappedObligations, "active").length)
    },
    {
      label: "Finalizate",
      value: "done",
      badge: String(filterObligations(mappedObligations, "done").length)
    }
  ] as const;

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Obligații"
          title="Lista obligațiilor"
          description="Aici vezi obligațiile încărcate din persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.obligationsNew} className={actionLink}>
              Adaugă obligație
            </Link>
          }
        />

        <div className={toolbar}>
          <Tabs
            ariaLabel="Filtre obligații"
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>

        {isLoading ? (
          <p className={subtle}>Se încarcă obligațiile...</p>
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca obligațiile"
            description={errorMessage}
            action={
              <Link href={ROUTES.app.obligationsNew} className={actionLink}>
                Adaugă obligație
              </Link>
            }
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Nu există obligații în acest tab"
            description="După salvare, obligațiile noi vor apărea aici din baza de date."
            action={
              <Link href={ROUTES.app.obligationsNew} className={actionLink}>
                Adaugă obligație
              </Link>
            }
          />
        ) : (
          <div className={list}>
            {filteredItems.map((item) => (
              <article key={item.id} className={card}>
                <div className={cardTop}>
                  <div className={cardHeading}>
                    <h2 className={title}>{item.title}</h2>
                    <p className={description}>{item.description}</p>
                  </div>

                  <StatusChip tone={item.statusTone}>{item.statusLabel}</StatusChip>
                </div>

                <div className={metaRow}>
                  <Badge tone={item.priorityTone}>
                    Prioritate: {item.priorityLabel}
                  </Badge>
                </div>

                <p className={subtle}>Termen: {item.dueDateLabel}</p>

                <Link
                  href={buildObligationDetailRoute(item.id)}
                  className={actionLink}
                >
                  Vezi și editează
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}