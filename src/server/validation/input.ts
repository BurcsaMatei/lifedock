import { badRequest } from "../http/api";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type InputRecord = Record<string, unknown>;

export function ensureInputRecord(value: unknown): InputRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    badRequest("Payload invalid.");
  }

  return value as InputRecord;
}

export function assertHasAtLeastOneDefinedValue(
  source: InputRecord,
  keys: readonly string[]
): void {
  const hasAtLeastOneField = keys.some((key) =>
    Object.prototype.hasOwnProperty.call(source, key)
  );

  if (!hasAtLeastOneField) {
    badRequest("Nu există câmpuri de actualizat.");
  }
}

export function readRequiredString(
  source: InputRecord,
  key: string,
  label: string,
  maxLength: number
): string {
  const rawValue = source[key];

  if (typeof rawValue !== "string") {
    badRequest(`${label} este obligatoriu.`);
  }

  const value = rawValue.trim();

  if (!value) {
    badRequest(`${label} este obligatoriu.`);
  }

  if (value.length > maxLength) {
    badRequest(`${label} depășește limita de ${maxLength} caractere.`);
  }

  return value;
}

export function readOptionalString(
  source: InputRecord,
  key: string,
  label: string,
  maxLength: number
): string {
  const rawValue = source[key];

  if (typeof rawValue === "undefined" || rawValue === null) {
    return "";
  }

  if (typeof rawValue !== "string") {
    badRequest(`${label} trebuie să fie text.`);
  }

  const value = rawValue.trim();

  if (value.length > maxLength) {
    badRequest(`${label} depășește limita de ${maxLength} caractere.`);
  }

  return value;
}

export function readOptionalStringField(
  source: InputRecord,
  key: string,
  label: string,
  maxLength: number
): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(source, key)) {
    return undefined;
  }

  const rawValue = source[key];

  if (typeof rawValue === "undefined" || rawValue === null) {
    return undefined;
  }

  if (typeof rawValue !== "string") {
    badRequest(`${label} trebuie să fie text.`);
  }

  const value = rawValue.trim();

  if (value.length > maxLength) {
    badRequest(`${label} depășește limita de ${maxLength} caractere.`);
  }

  return value;
}

export function readRequiredEnum<T extends string>(
  source: InputRecord,
  key: string,
  label: string,
  values: readonly T[]
): T {
  const rawValue = source[key];

  if (typeof rawValue !== "string" || !values.includes(rawValue as T)) {
    badRequest(`${label} nu este valid.`);
  }

  return rawValue as T;
}

export function readOptionalEnum<T extends string>(
  source: InputRecord,
  key: string,
  label: string,
  values: readonly T[]
): T | undefined {
  if (!Object.prototype.hasOwnProperty.call(source, key)) {
    return undefined;
  }

  const rawValue = source[key];

  if (typeof rawValue !== "string" || !values.includes(rawValue as T)) {
    badRequest(`${label} nu este valid.`);
  }

  return rawValue as T;
}

export function readBoolean(
  source: InputRecord,
  key: string,
  label: string,
  fallbackValue: boolean
): boolean {
  const rawValue = source[key];

  if (typeof rawValue === "undefined" || rawValue === null) {
    return fallbackValue;
  }

  if (typeof rawValue !== "boolean") {
    badRequest(`${label} trebuie să fie boolean.`);
  }

  return rawValue;
}

export function readOptionalBoolean(
  source: InputRecord,
  key: string,
  label: string
): boolean | undefined {
  if (!Object.prototype.hasOwnProperty.call(source, key)) {
    return undefined;
  }

  const rawValue = source[key];

  if (typeof rawValue !== "boolean") {
    badRequest(`${label} trebuie să fie boolean.`);
  }

  return rawValue;
}

export function validateIsoDate(value: string, label: string): string {
  if (!DATE_RE.test(value)) {
    badRequest(`${label} trebuie să fie în format YYYY-MM-DD.`);
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    badRequest(`${label} nu este validă.`);
  }

  if (parsedDate.toISOString().slice(0, 10) !== value) {
    badRequest(`${label} nu este validă.`);
  }

  return value;
}