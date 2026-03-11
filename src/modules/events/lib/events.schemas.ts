import { z } from "zod";

import { EVENT_TYPES } from "./event.contracts";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titlul este obligatoriu.")
    .max(120, "Titlul poate avea maximum 120 de caractere."),
  eventType: z.enum(EVENT_TYPES, {
    error: () => ({ message: "Alege tipul evenimentului." })
  }),
  date: z
    .string()
    .trim()
    .min(1, "Data este obligatorie.")
    .regex(DATE_RE, "Data trebuie să fie în format YYYY-MM-DD."),
  time: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || TIME_RE.test(value),
      "Ora trebuie să fie în format HH:mm."
    ),
  notes: z
    .string()
    .trim()
    .max(1200, "Notițele pot avea maximum 1200 de caractere.")
});

export const eventRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(120),
  eventType: z.enum(EVENT_TYPES),
  date: z.string().regex(DATE_RE),
  time: z.string(),
  notes: z.string(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});

export const eventRecordListSchema = z.array(eventRecordSchema);