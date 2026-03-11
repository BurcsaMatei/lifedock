import type { Bill as PrismaBill } from "../../../generated/prisma/client";

import { BILL_FREQUENCIES } from "../lib/bill.contracts";
import type { BillFrequency, BillItem } from "../lib/bill.contracts";

function normalizeBillFrequency(value: string): BillFrequency {
  if (BILL_FREQUENCIES.includes(value as BillFrequency)) {
    return value as BillFrequency;
  }

  return "monthly";
}

export function mapPrismaBillToBillItem(bill: PrismaBill): BillItem {
  return {
    id: bill.id,
    provider: bill.provider,
    amount: bill.amount,
    dueDate: bill.dueDate,
    frequency: normalizeBillFrequency(bill.frequency),
    isPaid: bill.isPaid,
    notes: bill.notes,
    createdAt: bill.createdAt.toISOString(),
    updatedAt: bill.updatedAt.toISOString()
  };
}