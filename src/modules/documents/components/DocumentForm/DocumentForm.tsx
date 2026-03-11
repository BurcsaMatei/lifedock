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
import { patchDocument, postDocument } from "../../lib/document.api";
import type { DocumentItem } from "../../lib/document.contracts";
import { documentFormSchema } from "../../lib/documents.schemas";
import type {
  DocumentCategory,
  DocumentFormValues
} from "../../lib/documents.types";
import { actions, form, helper } from "./DocumentForm.css";

type DocumentFormErrors = {
  readonly title?: string;
  readonly category?: string;
  readonly expiresAt?: string;
  readonly hasReminder?: string;
  readonly notes?: string;
};

const categoryOptions = [
  { label: "Identitate", value: "identity" },
  { label: "Auto", value: "vehicle" },
  { label: "Locuință", value: "home" },
  { label: "Studii", value: "education" },
  { label: "Companie", value: "company" }
] as const;

type DocumentFormState = {
  readonly title: string;
  readonly category: string;
  readonly expiresAt: string;
  readonly hasReminder: boolean;
  readonly notes: string;
};

type DocumentFormMode = "create" | "edit";

export type DocumentFormProps = {
  readonly mode?: DocumentFormMode;
  readonly documentId?: string;
  readonly initialValues?: Partial<DocumentFormState>;
  readonly submitLabel?: string;
  readonly helperText?: string;
  readonly redirectTo?: Route | null;
  readonly onSuccess?: (item: DocumentItem) => void;
};

function createInitialState(
  initialValues?: Partial<DocumentFormState>
): DocumentFormState {
  return {
    title: initialValues?.title ?? "",
    category: initialValues?.category ?? "",
    expiresAt: initialValues?.expiresAt ?? "",
    hasReminder: initialValues?.hasReminder ?? true,
    notes: initialValues?.notes ?? ""
  };
}

function mapValidationErrors(
  error: ZodError<DocumentFormState>
): DocumentFormErrors {
  const nextErrors: {
    title?: string;
    category?: string;
    expiresAt?: string;
    hasReminder?: string;
    notes?: string;
  } = {};

  for (const issue of error.issues) {
    const fieldName = String(issue.path[0] ?? "");

    if (fieldName === "title" && !nextErrors.title) {
      nextErrors.title = issue.message;
    }

    if (fieldName === "category" && !nextErrors.category) {
      nextErrors.category = "Alege categoria documentului.";
    }

    if (fieldName === "expiresAt" && !nextErrors.expiresAt) {
      nextErrors.expiresAt = issue.message;
    }

    if (fieldName === "notes" && !nextErrors.notes) {
      nextErrors.notes = issue.message;
    }
  }

  return nextErrors;
}

function getDefaultSubmitLabel(mode: DocumentFormMode): string {
  switch (mode) {
    case "create":
      return "Salvează document";
    case "edit":
      return "Actualizează documentul";
  }
}

function getDefaultHelperText(mode: DocumentFormMode): string {
  switch (mode) {
    case "create":
      return "În acest pas, documentul se salvează în persistența reală a aplicației, nu doar local în browser.";
    case "edit":
      return "În acest pas, modificările sunt scrise direct în persistența reală a aplicației.";
  }
}

function getRedirectTarget(
  mode: DocumentFormMode,
  savedItem: DocumentItem,
  redirectTo?: Route | null
): Route | null {
  if (typeof redirectTo !== "undefined") {
    return redirectTo;
  }

  if (mode === "create") {
    return ROUTES.app.documents;
  }

  return `${ROUTES.app.documents}/${savedItem.id}` as Route;
}

export function DocumentForm({
  mode = "create",
  documentId,
  initialValues,
  submitLabel,
  helperText,
  redirectTo,
  onSuccess
}: DocumentFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<DocumentFormState>(() =>
    createInitialState(initialValues)
  );
  const [errors, setErrors] = useState<DocumentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setValues(createInitialState(initialValues));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [initialValues]);

  function updateField<Key extends keyof DocumentFormState>(
    key: Key,
    value: DocumentFormState[Key]
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const parsedValues = documentFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(mapValidationErrors(parsedValues.error));
      setIsSubmitting(false);
      return;
    }

    if (mode === "edit" && !documentId) {
      setSubmitError("Lipsește identificatorul documentului.");
      setIsSubmitting(false);
      return;
    }

    const normalizedValues: DocumentFormValues = {
      title: parsedValues.data.title,
      category: parsedValues.data.category as DocumentCategory,
      expiresAt: parsedValues.data.expiresAt,
      hasReminder: parsedValues.data.hasReminder,
      notes: parsedValues.data.notes
    };

    try {
      const response =
        mode === "edit"
          ? await patchDocument(documentId as string, normalizedValues)
          : await postDocument(normalizedValues);

      const savedItem = response.item;

      setValues(createInitialState(savedItem));
      setSubmitSuccess(
        mode === "edit"
          ? "Documentul a fost actualizat."
          : "Documentul a fost salvat."
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
            ? "Nu am putut actualiza documentul."
            : "Nu am putut salva documentul."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Titlu document"
        name="title"
        placeholder="Ex. Carte de identitate"
        value={values.title}
        onChange={(event) => updateField("title", event.currentTarget.value)}
        {...(errors.title ? { error: errors.title } : {})}
      />

      <Select
        label="Categorie"
        name="category"
        options={categoryOptions}
        placeholder="Alege categoria"
        value={values.category}
        onChange={(event) => updateField("category", event.currentTarget.value)}
        {...(errors.category ? { error: errors.category } : {})}
      />

      <DateField
        label="Dată expirare"
        name="expiresAt"
        value={values.expiresAt}
        onChange={(event) => updateField("expiresAt", event.currentTarget.value)}
        {...(errors.expiresAt ? { error: errors.expiresAt } : {})}
      />

      <Checkbox
        label="Activează reminder"
        hint="Documentul va putea fi urmărit în tab-ul normal, nu în Fără reminder."
        checked={values.hasReminder}
        onChange={(event) => updateField("hasReminder", event.currentTarget.checked)}
      />

      <Textarea
        label="Notițe"
        name="notes"
        placeholder="Observații opționale"
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