import { z } from "zod";

import { DOCUMENT_CATEGORIES } from "./document.contracts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const documentFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titlul documentului este obligatoriu.")
    .max(120, "Titlul poate avea maximum 120 de caractere."),
  category: z.enum(DOCUMENT_CATEGORIES, {
    error: () => ({ message: "Alege categoria documentului." })
  }),
  expiresAt: z
    .string()
    .trim()
    .min(1, "Data de expirare este obligatorie.")
    .regex(DATE_RE, "Data trebuie să fie în format YYYY-MM-DD."),
  hasReminder: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(1200, "Notițele pot avea maximum 1200 de caractere.")
});

export const documentRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  category: z.enum(DOCUMENT_CATEGORIES),
  expiresAt: z.string().regex(DATE_RE),
  hasReminder: z.boolean(),
  notes: z.string(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

export const documentRecordListSchema = z.array(documentRecordSchema);