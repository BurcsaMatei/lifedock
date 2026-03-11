"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { actionLink } from "../../../../shared/components/layout/listScreen.css";
import { Badge, Button, EmptyState } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { BillForm } from "../../components/BillForm";
import { deleteBill, getBillById, isApiRequestError } from "../../lib/bill.api";
import type { BillFrequency, BillItem } from "../../lib/bill.contracts";
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
} from "./BillDetailScreen.css";

export type BillDetailScreenProps = {
  readonly billId: string;
};

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

function formatBillDate(dateValue: string): string {
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

export function BillDetailScreen({ billId }: BillDetailScreenProps) {
  const router = useRouter();

  const [item, setItem] = useState<BillItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBill(): Promise<void> {
      if (!billId) {
        setItem(null);
        setErrorMessage("ID-ul facturii lipsește din rută.");
        setIsNotFound(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setDeleteError(null);
        setIsNotFound(false);

        const response = await getBillById(billId);

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
            : "Nu am putut încărca factura."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBill();

    return () => {
      isMounted = false;
    };
  }, [billId, reloadKey]);

  function handleRetry(): void {
    setReloadKey((currentValue) => currentValue + 1);
  }

  async function handleDelete(): Promise<void> {
    if (!item) {
      return;
    }

    const isConfirmed = window.confirm(
      `Ștergi definitiv factura „${item.provider}”?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteBill(item.id);

      router.push(ROUTES.app.bills);
      router.refresh();
    } catch (error: unknown) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Nu am putut șterge factura."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Facturi"
          title={item ? item.provider : "Detalii factură"}
          description="Aici poți vedea, actualiza sau șterge o factură salvată în persistența reală a aplicației."
          actions={
            <Link href={ROUTES.app.bills} className={actionLink}>
              Înapoi la listă
            </Link>
          }
        />

        {isLoading ? (
          <p className={subtle}>Se încarcă factura...</p>
        ) : isNotFound ? (
          <EmptyState
            title="Factura nu a fost găsită"
            description="ID-ul există în rută, dar nu mai avem o factură validă pentru el în baza de date."
            action={
              <Link href={ROUTES.app.bills} className={actionLink}>
                Înapoi la listă
              </Link>
            }
          />
        ) : errorMessage ? (
          <EmptyState
            title="Nu am putut încărca factura"
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
            <section className={summary} aria-label="Rezumat factură">
              <div className={actions}>
                <Badge tone="accent">{getFrequencyLabel(item.frequency)}</Badge>
                <Badge>{item.isPaid ? "Plătită" : "De plată"}</Badge>
                <Badge>{item.amount}</Badge>
              </div>

              <dl className={metaList}>
                <div className={metaRow}>
                  <dt className={label}>Scadență</dt>
                  <dd className={value}>{formatBillDate(item.dueDate)}</dd>
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

            <section className={content} aria-label="Editare factură">
              <BillForm
                mode="edit"
                billId={item.id}
                initialValues={{
                  provider: item.provider,
                  amount: item.amount,
                  dueDate: item.dueDate,
                  frequency: item.frequency,
                  isPaid: item.isPaid,
                  notes: item.notes
                }}
                redirectTo={null}
                helperText="Modificările se salvează direct în baza locală SQLite a aplicației."
                onSuccess={setItem}
              />

              <div className={dangerZone}>
                <p className={subtle}>
                  Ștergerea este definitivă. După confirmare, factura este eliminată din baza de date și vei fi redirecționat către lista de facturi.
                </p>

                <div className={actions}>
                  <Button
                    type="button"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Șterge factura
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