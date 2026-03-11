import type {
  DeleteDocumentResponse,
  DocumentByIdResponse,
  UpdateDocumentResponse
} from "../../../../modules/documents/lib/document.contracts";
import { parseUpdateDocumentInput } from "../../../../modules/documents/server/document.parsers";
import {
  deleteDocument,
  getDocumentById,
  updateDocument
} from "../../../../modules/documents/server/document.repository";
import type { DynamicRouteContext } from "../../../../server/http/api";
import {
  apiOk,
  parseJsonRequest,
  readRouteParam,
  toErrorResponse
} from "../../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const documentId = await readRouteParam(
      context.params,
      "documentId",
      "Document ID"
    );
    const item = await getDocumentById(documentId);

    return apiOk<DocumentByIdResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load document.");
  }
}

export async function PATCH(
  request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const documentId = await readRouteParam(
      context.params,
      "documentId",
      "Document ID"
    );
    const input = await parseJsonRequest(request, parseUpdateDocumentInput);
    const item = await updateDocument(documentId, input);

    return apiOk<UpdateDocumentResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to update document.");
  }
}

export async function DELETE(
  _request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const documentId = await readRouteParam(
      context.params,
      "documentId",
      "Document ID"
    );
    await deleteDocument(documentId);

    return apiOk<DeleteDocumentResponse>({
      success: true
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to delete document.");
  }
}