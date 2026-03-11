export const OBLIGATION_PRIORITIES = ["low", "medium", "high"] as const;

export type ObligationPriority = (typeof OBLIGATION_PRIORITIES)[number];

export type ObligationItem = {
  readonly id: string;
  readonly title: string;
  readonly priority: ObligationPriority;
  readonly dueDate: string;
  readonly details: string;
  readonly isCompleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateObligationInput = {
  readonly title: string;
  readonly priority: ObligationPriority;
  readonly dueDate: string;
  readonly details: string;
  readonly isCompleted: boolean;
};

export type UpdateObligationInput = {
  readonly title?: string;
  readonly priority?: ObligationPriority;
  readonly dueDate?: string;
  readonly details?: string;
  readonly isCompleted?: boolean;
};

export type ObligationsListResponse = {
  readonly items: readonly ObligationItem[];
};

export type ObligationByIdResponse = {
  readonly item: ObligationItem;
};

export type CreateObligationResponse = {
  readonly item: ObligationItem;
};

export type UpdateObligationResponse = {
  readonly item: ObligationItem;
};

export type DeleteObligationResponse = {
  readonly success: true;
};