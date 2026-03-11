import { z } from "zod";

import { OBLIGATION_PRIORITIES } from "./obligation.contracts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const obligationFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titlul obligației este obligatoriu.")
    .max(120, "Titlul poate avea maximum 120 de caractere."),
  priority: z.enum(OBLIGATION_PRIORITIES, {
    error: () => ({ message: "Alege prioritatea." })
  }),
  dueDate: z
    .string()
    .trim()
    .min(1, "Termenul este obligatoriu.")
    .regex(DATE_RE, "Data trebuie să fie în format YYYY-MM-DD."),
  details: z
    .string()
    .trim()
    .max(1200, "Detaliile pot avea maximum 1200 de caractere."),
  isCompleted: z.boolean()
});

export const obligationRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  priority: z.enum(OBLIGATION_PRIORITIES),
  dueDate: z.string().regex(DATE_RE),
  details: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

export const obligationRecordListSchema = z.array(obligationRecordSchema);