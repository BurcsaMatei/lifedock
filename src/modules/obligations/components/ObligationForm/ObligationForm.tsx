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
import { patchObligation, postObligation } from "../../lib/obligation.api";
import type { ObligationItem } from "../../lib/obligation.contracts";
import { obligationFormSchema } from "../../lib/obligations.schemas";
import type {
  ObligationFormValues,
  ObligationPriority
} from "../../lib/obligations.types";
import { actions, form, helper } from "./ObligationForm.css";

type ObligationFormErrors = {
  readonly title?: string;
  readonly priority?: string;
  readonly dueDate?: string;
  readonly details?: string;
  readonly isCompleted?: string;
};

const priorityOptions = [
  { label: "Mică", value: "low" },
  { label: "Medie", value: "medium" },
  { label: "Ridicată", value: "high" }
] as const;

type ObligationFormState = {
  readonly title: string;
  readonly priority: string;
  readonly dueDate: string;
  readonly details: string;
  readonly isCompleted: boolean;
};

type ObligationFormMode = "create" | "edit";

export type ObligationFormProps = {
  readonly mode?: ObligationFormMode;
  readonly obligationId?: string;
  readonly initialValues?: Partial<ObligationFormState>;
  readonly submitLabel?: string;
  readonly helperText?: string;
  readonly redirectTo?: Route | null;
  readonly onSuccess?: (item: ObligationItem) => void;
};

function createInitialState(
  initialValues?: Partial<ObligationFormState>
): ObligationFormState {
  return {
    title: initialValues?.title ?? "",
    priority: initialValues?.priority ?? "",
    dueDate: initialValues?.dueDate ?? "",
    details: initialValues?.details ?? "",
    isCompleted: initialValues?.isCompleted ?? false
  };
}

function mapValidationErrors(
  error: ZodError<ObligationFormState>
): ObligationFormErrors {
  const nextErrors: {
    title?: string;
    priority?: string;
    dueDate?: string;
    details?: string;
    isCompleted?: string;
  } = {};

  for (const issue of error.issues) {
    const fieldName = String(issue.path[0] ?? "");

    if (fieldName === "title" && !nextErrors.title) {
      nextErrors.title = issue.message;
    }

    if (fieldName === "priority" && !nextErrors.priority) {
      nextErrors.priority = "Alege prioritatea.";
    }

    if (fieldName === "dueDate" && !nextErrors.dueDate) {
      nextErrors.dueDate = issue.message;
    }

    if (fieldName === "details" && !nextErrors.details) {
      nextErrors.details = issue.message;
    }
  }

  return nextErrors;
}

function getDefaultSubmitLabel(mode: ObligationFormMode): string {
  switch (mode) {
    case "create":
      return "Salvează obligația";
    case "edit":
      return "Actualizează obligația";
  }
}

function getDefaultHelperText(mode: ObligationFormMode): string {
  switch (mode) {
    case "create":
      return "În acest pas, obligația se salvează în persistența reală a aplicației, nu doar local în browser.";
    case "edit":
      return "În acest pas, modificările sunt scrise direct în persistența reală a aplicației.";
  }
}

function getRedirectTarget(
  mode: ObligationFormMode,
  savedItem: ObligationItem,
  redirectTo?: Route | null
): Route | null {
  if (typeof redirectTo !== "undefined") {
    return redirectTo;
  }

  if (mode === "create") {
    return ROUTES.app.obligations;
  }

  return `${ROUTES.app.obligations}/${savedItem.id}` as Route;
}

export function ObligationForm({
  mode = "create",
  obligationId,
  initialValues,
  submitLabel,
  helperText,
  redirectTo,
  onSuccess
}: ObligationFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<ObligationFormState>(() =>
    createInitialState(initialValues)
  );
  const [errors, setErrors] = useState<ObligationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setValues(createInitialState(initialValues));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [initialValues]);

  function updateField<Key extends keyof ObligationFormState>(
    key: Key,
    value: ObligationFormState[Key]
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

    const parsedValues = obligationFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(mapValidationErrors(parsedValues.error));
      setIsSubmitting(false);
      return;
    }

    if (mode === "edit" && !obligationId) {
      setSubmitError("Lipsește identificatorul obligației.");
      setIsSubmitting(false);
      return;
    }

    const normalizedValues: ObligationFormValues = {
      title: parsedValues.data.title,
      priority: parsedValues.data.priority as ObligationPriority,
      dueDate: parsedValues.data.dueDate,
      details: parsedValues.data.details,
      isCompleted: parsedValues.data.isCompleted
    };

    try {
      const response =
        mode === "edit"
          ? await patchObligation(obligationId as string, normalizedValues)
          : await postObligation(normalizedValues);

      const savedItem = response.item;

      setValues(createInitialState(savedItem));
      setSubmitSuccess(
        mode === "edit"
          ? "Obligația a fost actualizată."
          : "Obligația a fost salvată."
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
            ? "Nu am putut actualiza obligația."
            : "Nu am putut salva obligația."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Titlu obligație"
        name="title"
        placeholder="Ex. Ridicare document înregistrare firmă"
        value={values.title}
        onChange={(event) => updateField("title", event.currentTarget.value)}
        {...(errors.title ? { error: errors.title } : {})}
      />

      <Select
        label="Prioritate"
        name="priority"
        options={priorityOptions}
        placeholder="Alege prioritatea"
        value={values.priority}
        onChange={(event) => updateField("priority", event.currentTarget.value)}
        {...(errors.priority ? { error: errors.priority } : {})}
      />

      <DateField
        label="Termen limită"
        name="dueDate"
        value={values.dueDate}
        onChange={(event) => updateField("dueDate", event.currentTarget.value)}
        {...(errors.dueDate ? { error: errors.dueDate } : {})}
      />

      <Textarea
        label="Detalii"
        name="details"
        placeholder="Context sau pași utili"
        value={values.details}
        onChange={(event) => updateField("details", event.currentTarget.value)}
        {...(errors.details ? { error: errors.details } : {})}
      />

      <Checkbox
        label="Marchează deja ca finalizată"
        hint="Dacă bifezi, obligația va intra direct în tab-ul Finalizate."
        checked={values.isCompleted}
        onChange={(event) => updateField("isCompleted", event.currentTarget.checked)}
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