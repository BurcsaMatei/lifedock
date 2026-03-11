import type { Obligation as PrismaObligation } from "../../../generated/prisma/client";

import { OBLIGATION_PRIORITIES } from "../lib/obligation.contracts";
import type {
  ObligationItem,
  ObligationPriority
} from "../lib/obligation.contracts";

function normalizeObligationPriority(value: string): ObligationPriority {
  if (OBLIGATION_PRIORITIES.includes(value as ObligationPriority)) {
    return value as ObligationPriority;
  }

  return "medium";
}

export function mapPrismaObligationToObligationItem(
  obligation: PrismaObligation
): ObligationItem {
  return {
    id: obligation.id,
    title: obligation.title,
    priority: normalizeObligationPriority(obligation.priority),
    dueDate: obligation.dueDate,
    details: obligation.details,
    isCompleted: obligation.isCompleted,
    createdAt: obligation.createdAt.toISOString(),
    updatedAt: obligation.updatedAt.toISOString()
  };
}