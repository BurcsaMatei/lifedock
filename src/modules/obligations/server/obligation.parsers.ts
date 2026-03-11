import { badRequest } from "../../../server/http/api";
import {
  assertHasAtLeastOneDefinedValue,
  ensureInputRecord,
  readBoolean,
  readOptionalBoolean,
  readOptionalEnum,
  readOptionalString,
  readOptionalStringField,
  readRequiredEnum,
  readRequiredString,
  validateIsoDate
} from "../../../server/validation/input";
import {
  OBLIGATION_PRIORITIES,
  type CreateObligationInput,
  type UpdateObligationInput
} from "../lib/obligation.contracts";

export function parseCreateObligationInput(
  value: unknown
): CreateObligationInput {
  const source = ensureInputRecord(value);

  const title = readRequiredString(source, "title", "Titlul", 120);
  const priority = readRequiredEnum(
    source,
    "priority",
    "Prioritatea",
    OBLIGATION_PRIORITIES
  );
  const dueDate = validateIsoDate(
    readRequiredString(source, "dueDate", "Termenul", 10),
    "Termenul"
  );
  const details = readOptionalString(source, "details", "Detaliile", 1200);
  const isCompleted = readBoolean(
    source,
    "isCompleted",
    "Statusul de finalizare",
    false
  );

  return {
    title,
    priority,
    dueDate,
    details,
    isCompleted
  };
}

export function parseUpdateObligationInput(
  value: unknown
): UpdateObligationInput {
  const source = ensureInputRecord(value);

  assertHasAtLeastOneDefinedValue(source, [
    "title",
    "priority",
    "dueDate",
    "details",
    "isCompleted"
  ]);

  const title = readOptionalStringField(source, "title", "Titlul", 120);

  if (typeof title !== "undefined" && !title) {
    badRequest("Titlul este obligatoriu.");
  }

  const priority = readOptionalEnum(
    source,
    "priority",
    "Prioritatea",
    OBLIGATION_PRIORITIES
  );

  const dueDateValue = readOptionalStringField(source, "dueDate", "Termenul", 10);
  const dueDate =
    typeof dueDateValue === "undefined"
      ? undefined
      : (() => {
          if (!dueDateValue) {
            badRequest("Termenul este obligatoriu.");
          }

          return validateIsoDate(dueDateValue, "Termenul");
        })();

  const details = readOptionalStringField(source, "details", "Detaliile", 1200);
  const isCompleted = readOptionalBoolean(
    source,
    "isCompleted",
    "Statusul de finalizare"
  );

  return {
    ...(typeof title !== "undefined" ? { title } : {}),
    ...(typeof priority !== "undefined" ? { priority } : {}),
    ...(typeof dueDate !== "undefined" ? { dueDate } : {}),
    ...(typeof details !== "undefined" ? { details } : {}),
    ...(typeof isCompleted !== "undefined" ? { isCompleted } : {})
  };
}