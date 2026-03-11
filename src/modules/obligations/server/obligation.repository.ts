import type { Prisma } from "../../../generated/prisma/client";

import { notFound } from "../../../server/http/api";
import { db } from "../../../server/db/client";
import type {
  CreateObligationInput,
  ObligationItem,
  UpdateObligationInput
} from "../lib/obligation.contracts";
import { mapPrismaObligationToObligationItem } from "./obligation.mappers";

const DEFAULT_ORDER_BY: Prisma.ObligationOrderByWithRelationInput[] = [
  { dueDate: "asc" },
  { createdAt: "desc" }
];

async function findObligationOrThrow(obligationId: string) {
  const obligation = await db.obligation.findUnique({
    where: {
      id: obligationId
    }
  });

  if (!obligation) {
    notFound("Obligația nu a fost găsită.");
  }

  return obligation;
}

function buildObligationUpdateData(
  input: UpdateObligationInput
): Prisma.ObligationUpdateInput {
  const data: Prisma.ObligationUpdateInput = {};

  if (typeof input.title !== "undefined") {
    data.title = input.title;
  }

  if (typeof input.priority !== "undefined") {
    data.priority = input.priority;
  }

  if (typeof input.dueDate !== "undefined") {
    data.dueDate = input.dueDate;
  }

  if (typeof input.details !== "undefined") {
    data.details = input.details;
  }

  if (typeof input.isCompleted !== "undefined") {
    data.isCompleted = input.isCompleted;
  }

  return data;
}

export async function listObligations(): Promise<readonly ObligationItem[]> {
  const obligations = await db.obligation.findMany({
    orderBy: DEFAULT_ORDER_BY
  });

  return obligations.map(mapPrismaObligationToObligationItem);
}

export async function getObligationById(
  obligationId: string
): Promise<ObligationItem> {
  const obligation = await findObligationOrThrow(obligationId);

  return mapPrismaObligationToObligationItem(obligation);
}

export async function createObligation(
  input: CreateObligationInput
): Promise<ObligationItem> {
  const obligation = await db.obligation.create({
    data: {
      title: input.title,
      priority: input.priority,
      dueDate: input.dueDate,
      details: input.details,
      isCompleted: input.isCompleted
    }
  });

  return mapPrismaObligationToObligationItem(obligation);
}

export async function updateObligation(
  obligationId: string,
  input: UpdateObligationInput
): Promise<ObligationItem> {
  await findObligationOrThrow(obligationId);

  const obligation = await db.obligation.update({
    where: {
      id: obligationId
    },
    data: buildObligationUpdateData(input)
  });

  return mapPrismaObligationToObligationItem(obligation);
}

export async function deleteObligation(obligationId: string): Promise<void> {
  await findObligationOrThrow(obligationId);

  await db.obligation.delete({
    where: {
      id: obligationId
    }
  });
}