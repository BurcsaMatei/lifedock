"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { actionLink } from "../../../../shared/components/layout/listScreen.css";
import { Badge, Button, EmptyState } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { DocumentForm } from "../../components/DocumentForm";
import {
  deleteDocument,
  getDocumentById,
  isApiRequestError
} from "../../lib/document.api";
import type {
  DocumentCategory,
  DocumentItem
} from "../../lib/document.contracts";
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
} from "./DocumentDetailScreen.css";

export type DocumentDetailScreenProps = {
  readonly documentId: string;
};

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

function formatDocumentDate(dateValue: string): string {
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

export function DocumentDetailScreen({
  documentId
}: DocumentDetailScreenProps) {
  const router = useRouter();

  const [item, setItem] = useState<DocumentItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDocument(): Promise<void> {
      if (!documentId) {
        setItem(null);
        setErrorMessage("ID-ul documentului lipsește din rută.");
        setIsNotFound(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setDeleteError(null);
        setIsNotFound(false);

        const response = await getDocumentById(documentId);

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
            : "Nu am putut încărca documentul."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDocument();

    return () => {
      isMounted = false;
    };
  }, [documentId, reloadKey]);

  function handleRetry(): void {
    setReloadKey((currentValue) => currentValue + 1);
  }

  async function handleDelete(): Promise<void> {
    if (!item) {
      return;
    }

    const isConfirmed = window.confirm(
      `Ștergi definitiv documentul „${item.title}”?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteDocument(item.id);

      router.push(ROUTES.app.documents);
      router.refresh();
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Nu am putut șterge documentul."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Documente"
          title={item ? item.title : "Detalii document"}
          description="Aici poți vedea, actualiza sau șterge un document salvat în persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.documents} className={actionLink}>
              Înapoi la listă
            </Link>
          }
        />

        {isLoading ? (
          <p className={subtle}>Se încarcă documentul...</p>
        ) : isNotFound ? (
          <EmptyState
            title="Documentul nu a fost găsit"
            description="ID-ul există în rută, dar nu mai avem un document valid pentru el în baza de date."
            action={
              <Link href={ROUTES.app.documents} className={actionLink}>
                Înapoi la listă
              </Link>
            }
          />
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca documentul"
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
            <section className={summary} aria-label="Rezumat document">
              <div className={actions}>
                <Badge tone="accent">{getCategoryLabel(item.category)}</Badge>
                <Badge>{item.hasReminder ? "Reminder activ" : "Fără reminder"}</Badge>
              </div>

              <dl className={metaList}>
                <div className={metaRow}>
                  <dt className={label}>Expiră la</dt>
                  <dd className={value}>{formatDocumentDate(item.expiresAt)}</dd>
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

            <section className={content} aria-label="Editare document">
              <DocumentForm
                mode="edit"
                documentId={item.id}
                initialValues={{
                  title: item.title,
                  category: item.category,
                  expiresAt: item.expiresAt,
                  hasReminder: item.hasReminder,
                  notes: item.notes
                }}
                redirectTo={null}
                helperText="Modificările se salvează direct în baza locală SQLite a aplicației."
                onSuccess={setItem}
              />

              <div className={dangerZone}>
                <p className={subtle}>
                  Ștergerea este definitivă. După confirmare, documentul este eliminat din baza de date și vei fi redirecționat către lista de documente.
                </p>

                <div className={actions}>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Șterge documentul
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