import type { Prisma } from "../../../generated/prisma/client";

import { notFound } from "../../../server/http/api";
import { db } from "../../../server/db/client";
import type {
  BillItem,
  CreateBillInput,
  UpdateBillInput
} from "../lib/bill.contracts";
import { mapPrismaBillToBillItem } from "./bill.mappers";

const DEFAULT_ORDER_BY: Prisma.BillOrderByWithRelationInput[] = [
  { dueDate: "asc" },
  { createdAt: "desc" }
];

async function findBillOrThrow(billId: string) {
  const bill = await db.bill.findUnique({
    where: {
      id: billId
    }
  });

  if (!bill) {
    notFound("Factura nu a fost găsită.");
  }

  return bill;
}

function buildBillUpdateData(input: UpdateBillInput): Prisma.BillUpdateInput {
  const data: Prisma.BillUpdateInput = {};

  if (typeof input.provider !== "undefined") {
    data.provider = input.provider;
  }

  if (typeof input.amount !== "undefined") {
    data.amount = input.amount;
  }

  if (typeof input.dueDate !== "undefined") {
    data.dueDate = input.dueDate;
  }

  if (typeof input.frequency !== "undefined") {
    data.frequency = input.frequency;
  }

  if (typeof input.isPaid !== "undefined") {
    data.isPaid = input.isPaid;
  }

  if (typeof input.notes !== "undefined") {
    data.notes = input.notes;
  }

  return data;
}

export async function listBills(): Promise<readonly BillItem[]> {
  const bills = await db.bill.findMany({
    orderBy: DEFAULT_ORDER_BY
  });

  return bills.map(mapPrismaBillToBillItem);
}

export async function getBillById(billId: string): Promise<BillItem> {
  const bill = await findBillOrThrow(billId);

  return mapPrismaBillToBillItem(bill);
}

export async function createBill(input: CreateBillInput): Promise<BillItem> {
  const bill = await db.bill.create({
    data: {
      provider: input.provider,
      amount: input.amount,
      dueDate: input.dueDate,
      frequency: input.frequency,
      isPaid: input.isPaid,
      notes: input.notes
    }
  });

  return mapPrismaBillToBillItem(bill);
}

export async function updateBill(
  billId: string,
  input: UpdateBillInput
): Promise<BillItem> {
  await findBillOrThrow(billId);

  const bill = await db.bill.update({
    where: {
      id: billId
    },
    data: buildBillUpdateData(input)
  });

  return mapPrismaBillToBillItem(bill);
}

export async function deleteBill(billId: string): Promise<void> {
  await findBillOrThrow(billId);

  await db.bill.delete({
    where: {
      id: billId
    }
  });
}