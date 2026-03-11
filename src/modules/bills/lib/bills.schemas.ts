import { z } from "zod";

import { BILL_FREQUENCIES } from "./bill.contracts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const billFormSchema = z.object({
  provider: z
    .string()
    .trim()
    .min(1, "Furnizorul este obligatoriu.")
    .max(120, "Furnizorul poate avea maximum 120 de caractere."),
  amount: z
    .string()
    .trim()
    .min(1, "Suma este obligatorie.")
    .max(40, "Suma poate avea maximum 40 de caractere."),
  dueDate: z
    .string()
    .trim()
    .min(1, "Scadența este obligatorie.")
    .regex(DATE_RE, "Data trebuie să fie în format YYYY-MM-DD."),
  frequency: z.enum(BILL_FREQUENCIES, {
    error: () => ({ message: "Alege frecvența facturii." })
  }),
  isPaid: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(1200, "Notițele pot avea maximum 1200 de caractere.")
});

export const billRecordSchema = z.object({
  id: z.string().min(1),
  provider: z.string().trim().min(1).max(120),
  amount: z.string().trim().min(1).max(40),
  dueDate: z.string().regex(DATE_RE),
  frequency: z.enum(BILL_FREQUENCIES),
  isPaid: z.boolean(),
  notes: z.string(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

export const billRecordListSchema = z.array(billRecordSchema);