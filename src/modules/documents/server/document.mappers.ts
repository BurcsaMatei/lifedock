import type { Document as PrismaDocument } from "../../../generated/prisma/client";

import {
  DOCUMENT_CATEGORIES
} from "../lib/document.contracts";
import type {
  DocumentCategory,
  DocumentItem
} from "../lib/document.contracts";

function normalizeDocumentCategory(value: string): DocumentCategory {
  if (DOCUMENT_CATEGORIES.includes(value as DocumentCategory)) {
    return value as DocumentCategory;
  }

  return "identity";
}

export function mapPrismaDocumentToDocumentItem(
  document: PrismaDocument
): DocumentItem {
  return {
    id: document.id,
    title: document.title,
    category: normalizeDocumentCategory(document.category),
    expiresAt: document.expiresAt,
    hasReminder: document.hasReminder,
    notes: document.notes,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString()
  };
}