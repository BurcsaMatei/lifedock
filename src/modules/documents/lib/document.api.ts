import type {
  CreateDocumentInput,
  CreateDocumentResponse,
  DeleteDocumentResponse,
  DocumentByIdResponse,
  DocumentsListResponse,
  UpdateDocumentInput,
  UpdateDocumentResponse
} from "./document.contracts";

const DOCUMENTS_API_ROUTE = "/api/documents";

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

function extractErrorMessage(payload: unknown): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "Request failed.";
}

async function readJson<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(extractErrorMessage(payload), response.status);
  }

  return payload as T;
}

function buildDocumentRoute(documentId: string): string {
  return `${DOCUMENTS_API_ROUTE}/${encodeURIComponent(documentId)}`;
}

export async function getDocuments(): Promise<DocumentsListResponse> {
  const response = await fetch(DOCUMENTS_API_ROUTE, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<DocumentsListResponse>(response);
}

export async function getDocumentById(
  documentId: string
): Promise<DocumentByIdResponse> {
  const response = await fetch(buildDocumentRoute(documentId), {
    method: "GET",
    cache: "no-store"
  });

  return readJson<DocumentByIdResponse>(response);
}

export async function postDocument(
  input: CreateDocumentInput
): Promise<CreateDocumentResponse> {
  const response = await fetch(DOCUMENTS_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<CreateDocumentResponse>(response);
}

export async function patchDocument(
  documentId: string,
  input: UpdateDocumentInput
): Promise<UpdateDocumentResponse> {
  const response = await fetch(buildDocumentRoute(documentId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<UpdateDocumentResponse>(response);
}

export async function deleteDocument(
  documentId: string
): Promise<DeleteDocumentResponse> {
  const response = await fetch(buildDocumentRoute(documentId), {
    method: "DELETE"
  });

  return readJson<DeleteDocumentResponse>(response);
}