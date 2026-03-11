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
import { getDocuments } from "../../lib/document.api";
import type { DocumentRecord, DocumentCategory } from "../../lib/documents.types";

type DocumentTab = "all" | "expiring" | "expired" | "missingReminder";

type DocumentListItem = {
  readonly id: string;
  readonly title: string;
  readonly categoryLabel: string;
  readonly expiresAtLabel: string;
  readonly statusLabel: string;
  readonly statusTone: StatusChipTone;
  readonly isExpiring: boolean;
  readonly isExpired: boolean;
  readonly hasReminder: boolean;
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

function getDocumentDate(dateValue: string): Date {
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

function getCategoryLabel(category: DocumentCategory): string {
  switch (category) {
    case "identity":
      return "Identitate";
    case "vehicle":
      return "Auto";
    case "home":
      return "Locuință";
    case "education":
      return "Studii";
    case "company":
      return "Companie";
  }
}

function formatExpiresAt(dateValue: string): string {
  const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return dateFormatter.format(getDocumentDate(dateValue));
}

function getDocumentStatus(item: DocumentRecord): {
  readonly label: string;
  readonly tone: StatusChipTone;
  readonly isExpiring: boolean;
  readonly isExpired: boolean;
} {
  const today = getStartOfToday();
  const expiresAt = getDocumentDate(item.expiresAt);
  const differenceInDays = getDifferenceInDays(today, expiresAt);

  if (differenceInDays < 0) {
    return {
      label: "Expirat",
      tone: "danger",
      isExpiring: false,
      isExpired: true
    };
  }

  if (differenceInDays <= 30) {
    return {
      label: "Expiră curând",
      tone: "warning",
      isExpiring: true,
      isExpired: false
    };
  }

  if (!item.hasReminder) {
    return {
      label: "Fără reminder",
      tone: "neutral",
      isExpiring: false,
      isExpired: false
    };
  }

  return {
    label: "Valid",
    tone: "success",
    isExpiring: false,
    isExpired: false
  };
}

function getDescription(item: DocumentRecord): string {
  if (item.notes.trim()) {
    return item.notes.trim();
  }

  return "Document salvat în baza locală SQLite a aplicației.";
}

function mapDocumentToListItem(item: DocumentRecord): DocumentListItem {
  const status = getDocumentStatus(item);

  return {
    id: item.id,
    title: item.title,
    categoryLabel: getCategoryLabel(item.category),
    expiresAtLabel: formatExpiresAt(item.expiresAt),
    statusLabel: status.label,
    statusTone: status.tone,
    isExpiring: status.isExpiring,
    isExpired: status.isExpired,
    hasReminder: item.hasReminder,
    description: getDescription(item)
  };
}

function filterDocuments(
  items: readonly DocumentListItem[],
  tab: DocumentTab
): readonly DocumentListItem[] {
  switch (tab) {
    case "all":
      return items;
    case "expiring":
      return items.filter((item) => item.isExpiring);
    case "expired":
      return items.filter((item) => item.isExpired);
    case "missingReminder":
      return items.filter((item) => !item.hasReminder);
  }
}

function buildDocumentDetailRoute(documentId: string): Route {
  return `${ROUTES.app.documents}/${documentId}` as Route;
}

export function DocumentsListScreen() {
  const [activeTab, setActiveTab] = useState<DocumentTab>("all");
  const [documents, setDocuments] = useState<readonly DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getDocuments();

        if (!isMounted) {
          return;
        }

        setDocuments(response.items);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nu am putut încărca documentele."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const mappedDocuments = useMemo(
    () => documents.map((item) => mapDocumentToListItem(item)),
    [documents]
  );

  const filteredItems = useMemo(
    () => filterDocuments(mappedDocuments, activeTab),
    [activeTab, mappedDocuments]
  );

  const tabs: readonly TabsItem<DocumentTab>[] = [
    { label: "Toate", value: "all", badge: String(mappedDocuments.length) },
    {
      label: "Expiră curând",
      value: "expiring",
      badge: String(filterDocuments(mappedDocuments, "expiring").length)
    },
    {
      label: "Expirate",
      value: "expired",
      badge: String(filterDocuments(mappedDocuments, "expired").length)
    },
    {
      label: "Fără reminder",
      value: "missingReminder",
      badge: String(filterDocuments(mappedDocuments, "missingReminder").length)
    }
  ] as const;

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Documente"
          title="Lista documentelor"
          description="Aici vezi documentele încărcate din persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.documentsNew} className={actionLink}>
              Adaugă document
            </Link>
          }
        />

        <div className={toolbar}>
          <Tabs
            ariaLabel="Filtre documente"
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>

        {isLoading ? (
          <p className={subtle}>Se încarcă documentele...</p>
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca documentele"
            description={errorMessage}
            action={
              <Link href={ROUTES.app.documentsNew} className={actionLink}>
                Adaugă document
              </Link>
            }
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Nu există documente în acest tab"
            description="După salvare, documentele noi vor apărea aici din baza de date."
            action={
              <Link href={ROUTES.app.documentsNew} className={actionLink}>
                Adaugă document
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
                  <Badge tone="accent">{item.categoryLabel}</Badge>
                  <Badge>{item.hasReminder ? "Reminder activ" : "Fără reminder"}</Badge>
                </div>

                <p className={subtle}>Expiră la: {item.expiresAtLabel}</p>

                <Link
                  href={buildDocumentDetailRoute(item.id)}
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