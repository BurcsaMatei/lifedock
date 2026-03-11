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
import type { StatusChipTone, TabsItem } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { getBills } from "../../lib/bill.api";
import type { BillFrequency, BillRecord } from "../../lib/bills.types";

type BillTab = "all" | "due" | "paid" | "late";

type BillListItem = {
  readonly id: string;
  readonly provider: string;
  readonly amount: string;
  readonly frequencyLabel: string;
  readonly dueDateLabel: string;
  readonly statusLabel: string;
  readonly statusTone: StatusChipTone;
  readonly bucket: Exclude<BillTab, "all">;
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

function getBillDate(dateValue: string): Date {
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate()
  );
}

function formatDueDate(dateValue: string): string {
  const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return dateFormatter.format(getBillDate(dateValue));
}

function getFrequencyLabel(frequency: BillFrequency): string {
  switch (frequency) {
    case "monthly":
      return "Lunar";
    case "quarterly":
      return "Trimestrial";
    case "yearly":
      return "Anual";
    case "once":
      return "Unică";
  }
}

function getBillBucket(item: BillRecord): Exclude<BillTab, "all"> {
  if (item.isPaid) {
    return "paid";
  }

  const today = getStartOfToday();
  const dueDate = getBillDate(item.dueDate);

  if (dueDate.getTime() < today.getTime()) {
    return "late";
  }

  return "due";
}

function getStatusLabel(bucket: Exclude<BillTab, "all">): string {
  switch (bucket) {
    case "due":
      return "De plată";
    case "paid":
      return "Plătită";
    case "late":
      return "Întârziată";
  }
}

function getStatusTone(bucket: Exclude<BillTab, "all">): StatusChipTone {
  switch (bucket) {
    case "due":
      return "warning";
    case "paid":
      return "success";
    case "late":
      return "danger";
  }
}

function getDescription(item: BillRecord): string {
  if (item.notes.trim()) {
    return item.notes.trim();
  }

  return "Factură salvată în baza locală SQLite a aplicației.";
}

function mapBillToListItem(item: BillRecord): BillListItem {
  const bucket = getBillBucket(item);

  return {
    id: item.id,
    provider: item.provider,
    amount: item.amount,
    frequencyLabel: getFrequencyLabel(item.frequency),
    dueDateLabel: formatDueDate(item.dueDate),
    statusLabel: getStatusLabel(bucket),
    statusTone: getStatusTone(bucket),
    bucket,
    description: getDescription(item)
  };
}

function filterBills(
  items: readonly BillListItem[],
  tab: BillTab
): readonly BillListItem[] {
  switch (tab) {
    case "all":
      return items;
    case "due":
      return items.filter((item) => item.bucket === "due");
    case "paid":
      return items.filter((item) => item.bucket === "paid");
    case "late":
      return items.filter((item) => item.bucket === "late");
  }
}

function buildBillDetailRoute(billId: string): Route {
  return `${ROUTES.app.bills}/${billId}` as Route;
}

export function BillsListScreen() {
  const [activeTab, setActiveTab] = useState<BillTab>("all");
  const [bills, setBills] = useState<readonly BillRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBills(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getBills();

        if (!isMounted) {
          return;
        }

        setBills(response.items);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : "Nu am putut încărca facturile."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBills();

    return () => {
      isMounted = false;
    };
  }, []);

  const mappedBills = useMemo(
    () => bills.map((item) => mapBillToListItem(item)),
    [bills]
  );

  const filteredItems = useMemo(
    () => filterBills(mappedBills, activeTab),
    [activeTab, mappedBills]
  );

  const tabs: readonly TabsItem<BillTab>[] = [
    { label: "Toate", value: "all", badge: String(mappedBills.length) },
    {
      label: "De plată",
      value: "due",
      badge: String(filterBills(mappedBills, "due").length)
    },
    {
      label: "Plătite",
      value: "paid",
      badge: String(filterBills(mappedBills, "paid").length)
    },
    {
      label: "Întârziate",
      value: "late",
      badge: String(filterBills(mappedBills, "late").length)
    }
  ] as const;

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Facturi"
          title="Lista facturilor"
          description="Aici vezi facturile încărcate din persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.billsNew} className={actionLink}>
              Adaugă factură
            </Link>
          }
        />

        <div className={toolbar}>
          <Tabs
            ariaLabel="Filtre facturi"
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>

        {isLoading ? (
          <p className={subtle}>Se încarcă facturile...</p>
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca facturile"
            description={errorMessage}
            action={
              <Link href={ROUTES.app.billsNew} className={actionLink}>
                Adaugă factură
              </Link>
            }
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Nu există facturi în acest tab"
            description="După salvare, facturile noi vor apărea aici din baza de date."
            action={
              <Link href={ROUTES.app.billsNew} className={actionLink}>
                Adaugă factură
              </Link>
            }
          />
        ) : (
          <div className={list}>
            {filteredItems.map((item) => (
              <article key={item.id} className={card}>
                <div className={cardTop}>
                  <div className={cardHeading}>
                    <h2 className={title}>{item.provider}</h2>
                    <p className={description}>{item.description}</p>
                  </div>

                  <StatusChip tone={item.statusTone}>{item.statusLabel}</StatusChip>
                </div>

                <div className={metaRow}>
                  <Badge tone="accent">{item.frequencyLabel}</Badge>
                  <Badge>{item.amount}</Badge>
                </div>

                <p className={subtle}>Scadență: {item.dueDateLabel}</p>

                <Link href={buildBillDetailRoute(item.id)} className={actionLink}>
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