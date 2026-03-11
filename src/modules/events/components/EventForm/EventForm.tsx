"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ZodError } from "zod";

import {
  Button,
  DateField,
  Input,
  Select,
  Textarea,
  TimeField
} from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import { patchEvent, postEvent } from "../../lib/event.api";
import type { EventItem } from "../../lib/event.contracts";
import { eventFormSchema } from "../../lib/events.schemas";
import type { EventFormValues, EventType } from "../../lib/events.types";
import { actions, form, helper } from "./EventForm.css";

type EventFormErrors = {
  readonly title?: string;
  readonly eventType?: string;
  readonly date?: string;
  readonly time?: string;
  readonly notes?: string;
};

const eventTypeOptions = [
  { label: "Întâlnire", value: "meeting" },
  { label: "Examen", value: "exam" },
  { label: "Zi de naștere", value: "birthday" },
  { label: "Deadline", value: "deadline" }
] as const;

type EventFormState = {
  readonly title: string;
  readonly eventType: string;
  readonly date: string;
  readonly time: string;
  readonly notes: string;
};

type EventFormMode = "create" | "edit";

export type EventFormProps = {
  readonly mode?: EventFormMode;
  readonly eventId?: string;
  readonly initialValues?: Partial<EventFormState>;
  readonly submitLabel?: string;
  readonly helperText?: string;
  readonly redirectTo?: Route | null;
  readonly onSuccess?: (item: EventItem) => void;
};

function createInitialState(
  initialValues?: Partial<EventFormState>
): EventFormState {
  return {
    title: initialValues?.title ?? "",
    eventType: initialValues?.eventType ?? "",
    date: initialValues?.date ?? "",
    time: initialValues?.time ?? "",
    notes: initialValues?.notes ?? ""
  };
}

function mapValidationErrors(error: ZodError<EventFormState>): EventFormErrors {
  const nextErrors: {
    title?: string;
    eventType?: string;
    date?: string;
    time?: string;
    notes?: string;
  } = {};

  for (const issue of error.issues) {
    const fieldName = String(issue.path[0] ?? "");

    if (fieldName === "title" && !nextErrors.title) {
      nextErrors.title = issue.message;
    }

    if (fieldName === "eventType" && !nextErrors.eventType) {
      nextErrors.eventType = "Alege tipul evenimentului.";
    }

    if (fieldName === "date" && !nextErrors.date) {
      nextErrors.date = issue.message;
    }

    if (fieldName === "time" && !nextErrors.time) {
      nextErrors.time = issue.message;
    }

    if (fieldName === "notes" && !nextErrors.notes) {
      nextErrors.notes = issue.message;
    }
  }

  return nextErrors;
}

function getDefaultSubmitLabel(mode: EventFormMode): string {
  switch (mode) {
    case "create":
      return "Salvează eveniment";
    case "edit":
      return "Actualizează evenimentul";
  }
}

function getDefaultHelperText(mode: EventFormMode): string {
  switch (mode) {
    case "create":
      return "În acest pas, evenimentul se salvează în persistența reală a aplicației, nu doar local în browser.";
    case "edit":
      return "În acest pas, modificările sunt scrise direct în persistența reală a aplicației.";
  }
}

function getRedirectTarget(
  mode: EventFormMode,
  savedItem: EventItem,
  redirectTo?: Route | null
): Route | null {
  if (typeof redirectTo !== "undefined") {
    return redirectTo;
  }

  if (mode === "create") {
    return ROUTES.app.events;
  }

  return `${ROUTES.app.events}/${savedItem.id}` as Route;
}

export function EventForm({
  mode = "create",
  eventId,
  initialValues,
  submitLabel,
  helperText,
  redirectTo,
  onSuccess
}: EventFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<EventFormState>(() =>
    createInitialState(initialValues)
  );
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setValues(createInitialState(initialValues));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [initialValues]);

  function updateField<Key extends keyof EventFormState>(
    key: Key,
    value: EventFormState[Key]
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

    const parsedValues = eventFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(mapValidationErrors(parsedValues.error));
      setIsSubmitting(false);
      return;
    }

    if (mode === "edit" && !eventId) {
      setSubmitError("Lipsește identificatorul evenimentului.");
      setIsSubmitting(false);
      return;
    }

    const normalizedValues: EventFormValues = {
      title: parsedValues.data.title,
      eventType: parsedValues.data.eventType as EventType,
      date: parsedValues.data.date,
      time: parsedValues.data.time,
      notes: parsedValues.data.notes
    };

    try {
      const response =
        mode === "edit"
          ? await patchEvent(eventId as string, normalizedValues)
          : await postEvent(normalizedValues);

      const savedItem = response.item;

      setValues(createInitialState(savedItem));
      setSubmitSuccess(
        mode === "edit"
          ? "Evenimentul a fost actualizat."
          : "Evenimentul a fost salvat."
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
            ? "Nu am putut actualiza evenimentul."
            : "Nu am putut salva evenimentul."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={form} onSubmit={handleSubmit} noValidate>
      <Input
        label="Titlu eveniment"
        name="title"
        placeholder="Ex. Examen la drept comercial"
        value={values.title}
        onChange={(event) => updateField("title", event.currentTarget.value)}
        {...(errors.title ? { error: errors.title } : {})}
      />

      <Select
        label="Tip eveniment"
        name="eventType"
        options={eventTypeOptions}
        placeholder="Alege tipul"
        value={values.eventType}
        onChange={(event) => updateField("eventType", event.currentTarget.value)}
        {...(errors.eventType ? { error: errors.eventType } : {})}
      />

      <DateField
        label="Data"
        name="date"
        value={values.date}
        onChange={(event) => updateField("date", event.currentTarget.value)}
        {...(errors.date ? { error: errors.date } : {})}
      />

      <TimeField
        label="Ora"
        name="time"
        value={values.time}
        onChange={(event) => updateField("time", event.currentTarget.value)}
        hint="Poți lăsa gol dacă evenimentul nu are oră fixă."
        {...(errors.time ? { error: errors.time } : {})}
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