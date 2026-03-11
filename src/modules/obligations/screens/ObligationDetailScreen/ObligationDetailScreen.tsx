"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { actionLink } from "../../../../shared/components/layout/listScreen.css";
import { Badge, Button, EmptyState } from "../../../../shared/components/ui";
import type { BadgeTone } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { ObligationForm } from "../../components/ObligationForm";
import {
  deleteObligation,
  getObligationById,
  isApiRequestError
} from "../../lib/obligation.api";
import type {
  ObligationItem,
  ObligationPriority
} from "../../lib/obligation.contracts";
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
} from "./ObligationDetailScreen.css";

export type ObligationDetailScreenProps = {
  readonly obligationId: string;
};

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

function getPriorityTone(priority: ObligationPriority): BadgeTone {
  switch (priority) {
    case "low":
      return "neutral";
    case "medium":
      return "warning";
    case "high":
      return "danger";
  }
}

function formatObligationDate(dateValue: string): string {
  const formatter = new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return formatter.format(new Date(`${dateValue}T00:00:00`));
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

export function ObligationDetailScreen({
  obligationId
}: ObligationDetailScreenProps) {
  const router = useRouter();

  const [item, setItem] = useState<ObligationItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadObligation(): Promise<void> {
      if (!obligationId) {
        setItem(null);
        setErrorMessage("ID-ul obligației lipsește din rută.");
        setIsNotFound(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setDeleteError(null);
        setIsNotFound(false);

        const response = await getObligationById(obligationId);

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
            : "Nu am putut încărca obligația."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadObligation();

    return () => {
      isMounted = false;
    };
  }, [obligationId, reloadKey]);

  function handleRetry(): void {
    setReloadKey((currentValue) => currentValue + 1);
  }

  async function handleDelete(): Promise<void> {
    if (!item) {
      return;
    }

    const isConfirmed = window.confirm(
      `Ștergi definitiv obligația „${item.title}”?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteObligation(item.id);

      router.push(ROUTES.app.obligations);
      router.refresh();
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Nu am putut șterge obligația."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Obligații"
          title={item ? item.title : "Detalii obligație"}
          description="Aici poți vedea, actualiza sau șterge o obligație salvată în persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.obligations} className={actionLink}>
              Înapoi la listă
            </Link>
          }
        />

        {isLoading ? (
          <p className={subtle}>Se încarcă obligația...</p>
        ) : isNotFound ? (
          <EmptyState
            title="Obligația nu a fost găsită"
            description="ID-ul există în rută, dar nu mai avem o obligație validă pentru ea în baza de date."
            action={
              <Link href={ROUTES.app.obligations} className={actionLink}>
                Înapoi la listă
              </Link>
            }
          />
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca obligația"
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
            <section className={summary} aria-label="Rezumat obligație">
              <div className={actions}>
                <Badge tone={getPriorityTone(item.priority)}>
                  Prioritate: {getPriorityLabel(item.priority)}
                </Badge>
                <Badge>{item.isCompleted ? "Finalizată" : "În curs"}</Badge>
              </div>

              <dl className={metaList}>
                <div className={metaRow}>
                  <dt className={label}>Termen limită</dt>
                  <dd className={value}>{formatObligationDate(item.dueDate)}</dd>
                </div>

                <div className={metaRow}>
                  <dt className={label}>Creată la</dt>
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

            <section className={content} aria-label="Editare obligație">
              <ObligationForm
                mode="edit"
                obligationId={item.id}
                initialValues={{
                  title: item.title,
                  priority: item.priority,
                  dueDate: item.dueDate,
                  details: item.details,
                  isCompleted: item.isCompleted
                }}
                redirectTo={null}
                helperText="Modificările se salvează direct în baza locală SQLite a aplicației."
                onSuccess={setItem}
              />

              <div className={dangerZone}>
                <p className={subtle}>
                  Ștergerea este definitivă. După confirmare, obligația este eliminată din baza de date și vei fi redirecționat către lista de obligații.
                </p>

                <div className={actions}>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Șterge obligația
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