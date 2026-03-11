export const BILL_FREQUENCIES = ["monthly", "quarterly", "yearly", "once"] as const;

export type BillFrequency = (typeof BILL_FREQUENCIES)[number];

export type BillItem = {
  readonly id: string;
  readonly provider: string;
  readonly amount: string;
  readonly dueDate: string;
  readonly frequency: BillFrequency;
  readonly isPaid: boolean;
  readonly notes: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateBillInput = {
  readonly provider: string;
  readonly amount: string;
  readonly dueDate: string;
  readonly frequency: BillFrequency;
  readonly isPaid: boolean;
  readonly notes: string;
};

export type UpdateBillInput = {
  readonly provider?: string;
  readonly amount?: string;
  readonly dueDate?: string;
  readonly frequency?: BillFrequency;
  readonly isPaid?: boolean;
  readonly notes?: string;
};

export type BillsListResponse = {
  readonly items: readonly BillItem[];
};

export type BillByIdResponse = {
  readonly item: BillItem;
};

export type CreateBillResponse = {
  readonly item: BillItem;
};

export type UpdateBillResponse = {
  readonly item: BillItem;
};

export type DeleteBillResponse = {
  readonly success: true;
};