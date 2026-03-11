import type { Prisma } from "../../../generated/prisma/client";

import { notFound } from "../../../server/http/api";
import { db } from "../../../server/db/client";
import type {
  CreateDocumentInput,
  DocumentItem,
  UpdateDocumentInput
} from "../lib/document.contracts";
import { mapPrismaDocumentToDocumentItem } from "./document.mappers";

const DEFAULT_ORDER_BY: Prisma.DocumentOrderByWithRelationInput[] = [
  { expiresAt: "asc" },
  { createdAt: "desc" }
];

async function findDocumentOrThrow(documentId: string) {
  const document = await db.document.findUnique({
    where: {
      id: documentId
    }
  });

  if (!document) {
    notFound("Documentul nu a fost găsit.");
  }

  return document;
}

function buildDocumentUpdateData(
  input: UpdateDocumentInput
): Prisma.DocumentUpdateInput {
  const data: Prisma.DocumentUpdateInput = {};

  if (typeof input.title !== "undefined") {
    data.title = input.title;
  }

  if (typeof input.category !== "undefined") {
    data.category = input.category;
  }

  if (typeof input.expiresAt !== "undefined") {
    data.expiresAt = input.expiresAt;
  }

  if (typeof input.hasReminder !== "undefined") {
    data.hasReminder = input.hasReminder;
  }

  if (typeof input.notes !== "undefined") {
    data.notes = input.notes;
  }

  return data;
}

export async function listDocuments(): Promise<readonly DocumentItem[]> {
  const documents = await db.document.findMany({
    orderBy: DEFAULT_ORDER_BY
  });

  return documents.map(mapPrismaDocumentToDocumentItem);
}

export async function getDocumentById(documentId: string): Promise<DocumentItem> {
  const document = await findDocumentOrThrow(documentId);

  return mapPrismaDocumentToDocumentItem(document);
}

export async function createDocument(
  input: CreateDocumentInput
): Promise<DocumentItem> {
  const document = await db.document.create({
    data: {
      title: input.title,
      category: input.category,
      expiresAt: input.expiresAt,
      hasReminder: input.hasReminder,
      notes: input.notes
    }
  });

  return mapPrismaDocumentToDocumentItem(document);
}

export async function updateDocument(
  documentId: string,
  input: UpdateDocumentInput
): Promise<DocumentItem> {
  await findDocumentOrThrow(documentId);

  const document = await db.document.update({
    where: {
      id: documentId
    },
    data: buildDocumentUpdateData(input)
  });

  return mapPrismaDocumentToDocumentItem(document);
}

export async function deleteDocument(documentId: string): Promise<void> {
  await findDocumentOrThrow(documentId);

  await db.document.delete({
    where: {
      id: documentId
    }
  });
}