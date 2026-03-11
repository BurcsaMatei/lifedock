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
import { getEvents } from "../../lib/event.api";
import type { EventItem } from "../../lib/event.contracts";
import type { EventType } from "../../lib/events.types";

type EventTab = "all" | "today" | "week" | "upcoming";

type EventListItem = {
  readonly id: string;
  readonly title: string;
  readonly eventTypeLabel: string;
  readonly whenLabel: string;
  readonly statusLabel: string;
  readonly statusTone: StatusChipTone;
  readonly bucket: Exclude<EventTab, "all">;
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

function getEventDate(dateValue: string): Date {
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

function getEventBucket(dateValue: string): Exclude<EventTab, "all"> {
  const today = getStartOfToday();
  const eventDate = getEventDate(dateValue);
  const differenceInDays = getDifferenceInDays(today, eventDate);

  if (differenceInDays <= 0) {
    return "today";
  }

  if (differenceInDays <= 7) {
    return "week";
  }

  return "upcoming";
}

function getStatusLabel(bucket: Exclude<EventTab, "all">): string {
  switch (bucket) {
    case "today":
      return "Astăzi";
    case "week":
      return "Săptămâna asta";
    case "upcoming":
      return "În curând";
  }
}

function getStatusTone(bucket: Exclude<EventTab, "all">): StatusChipTone {
  switch (bucket) {
    case "today":
      return "info";
    case "week":
      return "warning";
    case "upcoming":
      return "success";
  }
}

function getEventTypeLabel(eventType: EventType): string {
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

function getWhenLabel(item: EventItem): string {
  const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formattedDate = dateFormatter.format(getEventDate(item.date));

  if (!item.time) {
    return formattedDate;
  }

  return `${formattedDate}, ${item.time}`;
}

function getDescription(item: EventItem): string {
  if (item.notes.trim()) {
    return item.notes.trim();
  }

  return "Eveniment salvat în baza locală SQLite a aplicației.";
}

function mapEventToListItem(item: EventItem): EventListItem {
  const bucket = getEventBucket(item.date);

  return {
    id: item.id,
    title: item.title,
    eventTypeLabel: getEventTypeLabel(item.eventType),
    whenLabel: getWhenLabel(item),
    statusLabel: getStatusLabel(bucket),
    statusTone: getStatusTone(bucket),
    bucket,
    description: getDescription(item)
  };
}

function filterEvents(
  items: readonly EventListItem[],
  tab: EventTab
): readonly EventListItem[] {
  switch (tab) {
    case "all":
      return items;
    case "today":
      return items.filter((item) => item.bucket === "today");
    case "week":
      return items.filter((item) => item.bucket === "week");
    case "upcoming":
      return items.filter((item) => item.bucket === "upcoming");
  }
}

function buildEventDetailRoute(eventId: string): Route {
  return `${ROUTES.app.events}/${eventId}` as Route;
}

export function EventsListScreen() {
  const [activeTab, setActiveTab] = useState<EventTab>("all");
  const [events, setEvents] = useState<readonly EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getEvents();

        if (!isMounted) {
          return;
        }

        setEvents(response.items);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nu am putut încărca evenimentele."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const mappedEvents = useMemo(
    () => events.map((item) => mapEventToListItem(item)),
    [events]
  );

  const filteredItems = useMemo(
    () => filterEvents(mappedEvents, activeTab),
    [activeTab, mappedEvents]
  );

  const tabs: readonly TabsItem<EventTab>[] = [
    { label: "Toate", value: "all", badge: String(mappedEvents.length) },
    {
      label: "Astăzi",
      value: "today",
      badge: String(filterEvents(mappedEvents, "today").length)
    },
    {
      label: "Săptămâna asta",
      value: "week",
      badge: String(filterEvents(mappedEvents, "week").length)
    },
    {
      label: "În curând",
      value: "upcoming",
      badge: String(filterEvents(mappedEvents, "upcoming").length)
    }
  ] as const;

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Evenimente"
          title="Lista evenimentelor"
          description="Aici vezi evenimentele încărcate din persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.eventsNew} className={actionLink}>
              Adaugă eveniment
            </Link>
          }
        />

        <div className={toolbar}>
          <Tabs
            ariaLabel="Filtre evenimente"
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>

        {isLoading ? (
          <p className={subtle}>Se încarcă evenimentele...</p>
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca evenimentele"
            description={errorMessage}
            action={
              <Link href={ROUTES.app.eventsNew} className={actionLink}>
                Adaugă eveniment
              </Link>
            }
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="Nu există evenimente în acest tab"
            description="După migrarea completă a formularului, evenimentele noi vor apărea aici din baza de date."
            action={
              <Link href={ROUTES.app.eventsNew} className={actionLink}>
                Adaugă eveniment
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
                  <Badge tone="accent">{item.eventTypeLabel}</Badge>
                </div>

                <p className={subtle}>Programat pentru: {item.whenLabel}</p>

                <Link
                  href={buildEventDetailRoute(item.id)}
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