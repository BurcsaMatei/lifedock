"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { actionLink } from "../../../../shared/components/layout/listScreen.css";
import { Badge, Button, EmptyState } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { EventForm } from "../../components/EventForm";
import { deleteEvent, getEventById, isApiRequestError } from "../../lib/event.api";
import type { EventItem, EventType } from "../../lib/event.contracts";
import {
  actions,
  content,
  dangerZone,
  label,
  metaList,
  metaRow,
  root,
  subtle,
  summary,
  textAction,
  value
} from "./EventDetailScreen.css";

export type EventDetailScreenProps = {
  readonly eventId: string;
};

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

function formatEventDate(dateValue: string): string {
  const formatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return formatter.format(new Date(`${dateValue}T00:00:00`));
}

function formatEventWhen(item: EventItem): string {
  const formattedDate = formatEventDate(item.date);

  if (!item.time) {
    return formattedDate;
  }

  return `${formattedDate}, ${item.time}`;
}

function formatAuditDate(dateValue: string): string {
  const formatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return formatter.format(new Date(dateValue));
}

export function EventDetailScreen({
  eventId
}: EventDetailScreenProps) {
  const router = useRouter();

  const [item, setItem] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadEvent(): Promise<void> {
      if (!eventId) {
        setItem(null);
        setErrorMessage("ID-ul evenimentului lipsește din rută.");
        setIsNotFound(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setDeleteError(null);
        setIsNotFound(false);

        const response = await getEventById(eventId);

        if (!isMounted) {
          return;
        }

        setItem(response.item);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        setItem(null);

        if (isApiRequestError(error) && error.status === 404) {
          setIsNotFound(true);
          setErrorMessage(null);
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Nu am putut încărca evenimentul."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId, reloadKey]);

  function handleRetry(): void {
    setReloadKey((currentValue) => currentValue + 1);
  }

  async function handleDelete(): Promise<void> {
    if (!item) {
      return;
    }

    const isConfirmed = window.confirm(
      `Ștergi definitiv evenimentul „${item.title}”?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteEvent(item.id);

      router.push(ROUTES.app.events);
      router.refresh();
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Nu am putut șterge evenimentul."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Evenimente"
          title={item ? item.title : "Detalii eveniment"}
          description="Aici poți vedea, actualiza sau șterge un eveniment salvat în persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.events} className={actionLink}>
              Înapoi la listă
            </Link>
          }
        />

        {isLoading ? (
          <p className={subtle}>Se încarcă evenimentul...</p>
        ) : isNotFound ? (
          <EmptyState
            title="Evenimentul nu a fost găsit"
            description="ID-ul există în rută, dar nu mai avem un eveniment valid pentru el în baza de date."
            action={
              <Link href={ROUTES.app.events} className={actionLink}>
                Înapoi la listă
              </Link>
            }
          />
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca evenimentul"
            description={errorMessage}
            action={
              <button
                type="button"
                className={textAction}
                onClick={handleRetry}
              >
                Reîncearcă
              </button>
            }
          />
        ) : item ? (
          <div className={content}>
            <section className={summary} aria-label="Rezumat eveniment">
              <div className={actions}>
                <Badge tone="accent">{getEventTypeLabel(item.eventType)}</Badge>
              </div>

              <dl className={metaList}>
                <div className={metaRow}>
                  <dt className={label}>Programat pentru</dt>
                  <dd className={value}>{formatEventWhen(item)}</dd>
                </div>

                <div className={metaRow}>
                  <dt className={label}>Creat la</dt>
                  <dd className={value}>{formatAuditDate(item.createdAt)}</dd>
                </div>

                <div className={metaRow}>
                  <dt className={label}>Ultima actualizare</dt>
                  <dd className={value}>{formatAuditDate(item.updatedAt)}</dd>
                </div>

                <div className={metaRow}>
                  <dt className={label}>ID intern</dt>
                  <dd className={value}>{item.id}</dd>
                </div>
              </dl>
            </section>

            <section className={content} aria-label="Editare eveniment">
              <EventForm
                mode="edit"
                eventId={item.id}
                initialValues={{
                  title: item.title,
                  eventType: item.eventType,
                  date: item.date,
                  time: item.time,
                  notes: item.notes
                }}
                redirectTo={null}
                helperText="Modificările se salvează direct în baza locală SQLite a aplicației."
                onSuccess={setItem}
              />

              <div className={dangerZone}>
                <p className={subtle}>
                  Ștergerea este definitivă. După confirmare, evenimentul este eliminat din baza de date și vei fi redirecționat către lista de evenimente.
                </p>

                <div className={actions}>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Șterge evenimentul
                  </Button>
                </div>

                {deleteError ? (
                  <p className={subtle} aria-live="polite">
                    {deleteError}
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </ScreenContainer>
  );
}