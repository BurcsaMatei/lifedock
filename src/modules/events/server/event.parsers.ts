import { badRequest } from "../../../server/http/api";
import {
  assertHasAtLeastOneDefinedValue,
  ensureInputRecord,
  readOptionalEnum,
  readOptionalString,
  readOptionalStringField,
  readRequiredEnum,
  readRequiredString,
  validateIsoDate
} from "../../../server/validation/input";
import {
  EVENT_TYPES,
  type CreateEventInput,
  type UpdateEventInput
} from "../lib/event.contracts";

const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function validateOptionalTime(value: string, label: string): string {
  if (!value) {
    return "";
  }

  if (!TIME_RE.test(value)) {
    badRequest(`${label} trebuie să fie în format HH:mm.`);
  }

  return value;
}

export function parseCreateEventInput(value: unknown): CreateEventInput {
  const source = ensureInputRecord(value);

  const title = readRequiredString(source, "title", "Titlul", 120);
  const eventType = readRequiredEnum(
    source,
    "eventType",
    "Tipul evenimentului",
    EVENT_TYPES
  );
  const date = validateIsoDate(
    readRequiredString(source, "date", "Data", 10),
    "Data"
  );
  const time = validateOptionalTime(
    readOptionalString(source, "time", "Ora", 5),
    "Ora"
  );
  const notes = readOptionalString(source, "notes", "Notițe", 1200);

  return {
    title,
    eventType,
    date,
    time,
    notes
  };
}

export function parseUpdateEventInput(value: unknown): UpdateEventInput {
  const source = ensureInputRecord(value);

  assertHasAtLeastOneDefinedValue(source, [
    "title",
    "eventType",
    "date",
    "time",
    "notes"
  ]);

  const title = readOptionalStringField(source, "title", "Titlul", 120);

  if (typeof title !== "undefined" && !title) {
    badRequest("Titlul este obligatoriu.");
  }

  const eventType = readOptionalEnum(
    source,
    "eventType",
    "Tipul evenimentului",
    EVENT_TYPES
  );

  const dateValue = readOptionalStringField(source, "date", "Data", 10);
  const date =
    typeof dateValue === "undefined"
      ? undefined
      : (() => {
          if (!dateValue) {
            badRequest("Data este obligatorie.");
          }

          return validateIsoDate(dateValue, "Data");
        })();

  const timeValue = readOptionalStringField(source, "time", "Ora", 5);
  const time =
    typeof timeValue === "undefined"
      ? undefined
      : validateOptionalTime(timeValue, "Ora");

  const notes = readOptionalStringField(source, "notes", "Notițe", 1200);

  return {
    ...(typeof title !== "undefined" ? { title } : {}),
    ...(typeof eventType !== "undefined" ? { eventType } : {}),
    ...(typeof date !== "undefined" ? { date } : {}),
    ...(typeof time !== "undefined" ? { time } : {}),
    ...(typeof notes !== "undefined" ? { notes } : {})
  };
}