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
  BILL_FREQUENCIES,
  type CreateBillInput,
  type UpdateBillInput
} from "../lib/bill.contracts";

export function parseCreateBillInput(value: unknown): CreateBillInput {
  const source = ensureInputRecord(value);

  const provider = readRequiredString(source, "provider", "Furnizorul", 120);
  const amount = readRequiredString(source, "amount", "Suma", 40);
  const dueDate = validateIsoDate(
    readRequiredString(source, "dueDate", "Scadența", 10),
    "Scadența"
  );
  const frequency = readRequiredEnum(
    source,
    "frequency",
    "Frecvența facturii",
    BILL_FREQUENCIES
  );
  const isPaid = readBoolean(source, "isPaid", "Statusul de plată", false);
  const notes = readOptionalString(source, "notes", "Notițe", 1200);

  return {
    provider,
    amount,
    dueDate,
    frequency,
    isPaid,
    notes
  };
}

export function parseUpdateBillInput(value: unknown): UpdateBillInput {
  const source = ensureInputRecord(value);

  assertHasAtLeastOneDefinedValue(source, [
    "provider",
    "amount",
    "dueDate",
    "frequency",
    "isPaid",
    "notes"
  ]);

  const provider = readOptionalStringField(source, "provider", "Furnizorul", 120);

  if (typeof provider !== "undefined" && !provider) {
    badRequest("Furnizorul este obligatoriu.");
  }

  const amount = readOptionalStringField(source, "amount", "Suma", 40);

  if (typeof amount !== "undefined" && !amount) {
    badRequest("Suma este obligatorie.");
  }

  const dueDateValue = readOptionalStringField(source, "dueDate", "Scadența", 10);
  const dueDate =
    typeof dueDateValue === "undefined"
      ? undefined
      : (() => {
          if (!dueDateValue) {
            badRequest("Scadența este obligatorie.");
          }

          return validateIsoDate(dueDateValue, "Scadența");
        })();

  const frequency = readOptionalEnum(
    source,
    "frequency",
    "Frecvența facturii",
    BILL_FREQUENCIES
  );
  const isPaid = readOptionalBoolean(source, "isPaid", "Statusul de plată");
  const notes = readOptionalStringField(source, "notes", "Notițe", 1200);

  return {
    ...(typeof provider !== "undefined" ? { provider } : {}),
    ...(typeof amount !== "undefined" ? { amount } : {}),
    ...(typeof dueDate !== "undefined" ? { dueDate } : {}),
    ...(typeof frequency !== "undefined" ? { frequency } : {}),
    ...(typeof isPaid !== "undefined" ? { isPaid } : {}),
    ...(typeof notes !== "undefined" ? { notes } : {})
  };
}