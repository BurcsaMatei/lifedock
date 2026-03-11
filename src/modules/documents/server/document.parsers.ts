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
  DOCUMENT_CATEGORIES,
  type CreateDocumentInput,
  type UpdateDocumentInput
} from "../lib/document.contracts";

export function parseCreateDocumentInput(value: unknown): CreateDocumentInput {
  const source = ensureInputRecord(value);

  const title = readRequiredString(source, "title", "Titlul", 120);
  const category = readRequiredEnum(
    source,
    "category",
    "Categoria documentului",
    DOCUMENT_CATEGORIES
  );
  const expiresAt = validateIsoDate(
    readRequiredString(source, "expiresAt", "Data de expirare", 10),
    "Data de expirare"
  );
  const hasReminder = readBoolean(source, "hasReminder", "Reminder", true);
  const notes = readOptionalString(source, "notes", "Notițe", 1200);

  return {
    title,
    category,
    expiresAt,
    hasReminder,
    notes
  };
}

export function parseUpdateDocumentInput(value: unknown): UpdateDocumentInput {
  const source = ensureInputRecord(value);

  assertHasAtLeastOneDefinedValue(source, [
    "title",
    "category",
    "expiresAt",
    "hasReminder",
    "notes"
  ]);

  const title = readOptionalStringField(source, "title", "Titlul", 120);

  if (typeof title !== "undefined" && !title) {
    badRequest("Titlul este obligatoriu.");
  }

  const category = readOptionalEnum(
    source,
    "category",
    "Categoria documentului",
    DOCUMENT_CATEGORIES
  );

  const expiresAtValue = readOptionalStringField(
    source,
    "expiresAt",
    "Data de expirare",
    10
  );
  const expiresAt =
    typeof expiresAtValue === "undefined"
      ? undefined
      : (() => {
          if (!expiresAtValue) {
            badRequest("Data de expirare este obligatorie.");
          }

          return validateIsoDate(expiresAtValue, "Data de expirare");
        })();

  const hasReminder = readOptionalBoolean(source, "hasReminder", "Reminder");
  const notes = readOptionalStringField(source, "notes", "Notițe", 1200);

  return {
    ...(typeof title !== "undefined" ? { title } : {}),
    ...(typeof category !== "undefined" ? { category } : {}),
    ...(typeof expiresAt !== "undefined" ? { expiresAt } : {}),
    ...(typeof hasReminder !== "undefined" ? { hasReminder } : {}),
    ...(typeof notes !== "undefined" ? { notes } : {})
  };
}