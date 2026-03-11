export const DOCUMENT_CATEGORIES = [
  "identity",
  "vehicle",
  "home",
  "education",
  "company"
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export type DocumentItem = {
  readonly id: string;
  readonly title: string;
  readonly category: DocumentCategory;
  readonly expiresAt: string;
  readonly hasReminder: boolean;
  readonly notes: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateDocumentInput = {
  readonly title: string;
  readonly category: DocumentCategory;
  readonly expiresAt: string;
  readonly hasReminder: boolean;
  readonly notes: string;
};

export type UpdateDocumentInput = {
  readonly title?: string;
  readonly category?: DocumentCategory;
  readonly expiresAt?: string;
  readonly hasReminder?: boolean;
  readonly notes?: string;
};

export type DocumentsListResponse = {
  readonly items: readonly DocumentItem[];
};

export type DocumentByIdResponse = {
  readonly item: DocumentItem;
};

export type CreateDocumentResponse = {
  readonly item: DocumentItem;
};

export type UpdateDocumentResponse = {
  readonly item: DocumentItem;
};

export type DeleteDocumentResponse = {
  readonly success: true;
};