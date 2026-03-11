"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ZodError } from "zod";

import {
  Button,
  Checkbox,
  DateField,
  Input,
  Select,
  Textarea
} from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { patchBill, postBill } from "../../lib/bill.api";
import type { BillItem } from "../../lib/bill.contracts";
import { billFormSchema } from "../../lib/bills.schemas";
import type { BillFormValues, BillFrequency } from "../../lib/bills.types";
import { actions, form, helper } from "./BillForm.css";

type BillFormErrors = {
  readonly provider?: string;
  readonly amount?: string;
  readonly dueDate?: string;
  readonly frequency?: string;
  readonly isPaid?: string;
  readonly notes?: string;
};

const frequencyOptions = [
  { label: "Lunar", value: "monthly" },
  { label: "Trimestrial", value: "quarterly" },
  { label: "Anual", value: "yearly" },
  { label: "Unică", value: "once" }
] as const;

type BillFormState = {
  readonly provider: string;
  readonly amount: string;
  readonly dueDate: string;
  readonly frequency: string;
  readonly isPaid: boolean;
  readonly notes: string;
};

type BillFormMode = "create" | "edit";

export type BillFormProps = {
  readonly mode?: BillFormMode;
  readonly billId?: string;
  readonly initialValues?: Partial<BillFormState>;
  readonly submitLabel?: string;
  readonly helperText?: string;
  readonly redirectTo?: Route | null;
  readonly onSuccess?: (item: BillItem) => void;
};

function createInitialState(
  initialValues?: Partial<BillFormState>
): BillFormState {
  return {
    provider: initialValues?.provider ?? "",
    amount: initialValues?.amount ?? "",
    dueDate: initialValues?.dueDate ?? "",
    frequency: initialValues?.frequency ?? "",
    isPaid: initialValues?.isPaid ?? false,
    notes: initialValues?.notes ?? ""
  };
}

function mapValidationErrors(error: ZodError<BillFormState>): BillFormErrors {
  const nextErrors: {
    provider?: string;
    amount?: string;
    dueDate?: string;
    frequency?: string;
    isPaid?: string;
    notes?: string;
  } = {};

  for (const issue of error.issues) {
    const fieldName = String(issue.path[0] ?? "");

    if (fieldName === "provider" && !nextErrors.provider) {
      nextErrors.provider = issue.message;
    }

    if (fieldName === "amount" && !nextErrors.amount) {
      nextErrors.amount = issue.message;
    }

    if (fieldName === "dueDate" && !nextErrors.dueDate) {
      nextErrors.dueDate = issue.message;
    }

    if (fieldName === "frequency" && !nextErrors.frequency) {
      nextErrors.frequency = "Alege frecvența facturii.";
    }

    if (fieldName === "notes" && !nextErrors.notes) {
      nextErrors.notes = issue.message;
    }
  }

  return nextErrors;
}

function getDefaultSubmitLabel(mode: BillFormMode): string {
  switch (mode) {
    case "create":
      return "Salvează factura";
    case "edit":
      return "Actualizează factura";
  }
}

function getDefaultHelperText(mode: BillFormMode): string {
  switch (mode) {
    case "create":
      return "În acest pas, factura se salvează în persistența reală a aplicației, nu doar local în browser.";
    case "edit":
      return "În acest pas, modificările sunt scrise direct în persistența reală a aplicației.";
  }
}

function getRedirectTarget(
  mode: BillFormMode,
  savedItem: BillItem,
  redirectTo?: Route | null
): Route | null {
  if (typeof redirectTo !== "undefined") {
    return redirectTo;
  }

  if (mode === "create") {
    return ROUTES.app.bills;
  }

  return `${ROUTES.app.bills}/${savedItem.id}` as Route;
}

export function BillForm({
  mode = "create",
  billId,
  initialValues,
  submitLabel,
  helperText,
  redirectTo,
  onSuccess
}: BillFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<BillFormState>(() =>
    createInitialState(initialValues)
  );
  const [errors, setErrors] = useState<BillFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setValues(createInitialState(initialValues));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [initialValues]);

  function updateField<Key extends keyof BillFormState>(
    key: Key,
    value: BillFormState[Key]
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined
    }));

    setSubmitError(null);
    setSubmitSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const parsedValues = billFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(mapValidationErrors(parsedValues.error));
      setIsSubmitting(false);
      return;
    }

    if (mode === "edit" && !billId) {
      setSubmitError("Lipsește identificatorul facturii.");
      setIsSubmitting(false);
      return;
    }

    const normalizedValues: BillFormValues = {
      provider: parsedValues.data.provider,
      amount: parsedValues.data.amount,
      dueDate: parsedValues.data.dueDate,
      frequency: parsedValues.data.frequency as BillFrequency,
      isPaid: parsedValues.data.isPaid,
      notes: parsedValues.data.notes
    };

    try {
      const response =
        mode === "edit"
          ? await patchBill(billId as string, normalizedValues)
          : await postBill(normalizedValues);

      const savedItem = response.item;

      setValues(createInitialState(savedItem));
      setSubmitSuccess(
        mode === "edit"
          ? "Factura a fost actualizată."
          : "Factura a fost salvată."
      );

      onSuccess?.(savedItem);

      const nextRedirectTarget = getRedirectTarget(mode, savedItem, redirectTo);

      if (nextRedirectTarget) {
        router.push(nextRedirectTarget);
      }

      router.refresh();
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "Nu am putut actualiza factura."
            : "Nu am putut salva factura."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Furnizor"
        name="provider"
        placeholder="Ex. Digi, Electrica, Netflix"
        value={values.provider}
        onChange={(event) => updateField("provider", event.currentTarget.value)}
        {...(errors.provider ? { error: errors.provider } : {})}
      />

      <Input
        label="Sumă"
        name="amount"
        inputMode="decimal"
        placeholder="Ex. 45 RON"
        value={values.amount}
        onChange={(event) => updateField("amount", event.currentTarget.value)}
        {...(errors.amount ? { error: errors.amount } : {})}
      />

      <DateField
        label="Scadență"
        name="dueDate"
        value={values.dueDate}
        onChange={(event) => updateField("dueDate", event.currentTarget.value)}
        {...(errors.dueDate ? { error: errors.dueDate } : {})}
      />

      <Select
        label="Frecvență"
        name="frequency"
        options={frequencyOptions}
        placeholder="Alege frecvența"
        value={values.frequency}
        onChange={(event) => updateField("frequency", event.currentTarget.value)}
        {...(errors.frequency ? { error: errors.frequency } : {})}
      />

      <Checkbox
        label="Marchează deja ca plătită"
        hint="Dacă bifezi, factura va intra direct în tab-ul Plătite."
        checked={values.isPaid}
        onChange={(event) => updateField("isPaid", event.currentTarget.checked)}
      />

      <Textarea
        label="Notițe"
        name="notes"
        placeholder="Detalii opționale"
        value={values.notes}
        onChange={(event) => updateField("notes", event.currentTarget.value)}
        {...(errors.notes ? { error: errors.notes } : {})}
      />

      <p className={helper} aria-live="polite">
        {submitError ?? submitSuccess ?? helperText ?? getDefaultHelperText(mode)}
      </p>

      <div className={actions}>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel ?? getDefaultSubmitLabel(mode)}
        </Button>
      </div>
    </form>
  );
}