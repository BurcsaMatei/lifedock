import { parseCreateDocumentInput } from "../../../modules/documents/server/document.parsers";
import {
  createDocument,
  listDocuments
} from "../../../modules/documents/server/document.repository";
import {
  apiCreated,
  apiOk,
  parseJsonRequest,
  toErrorResponse
} from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const items = await listDocuments();

    return apiOk({
      items
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load documents.");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonRequest(request, parseCreateDocumentInput);
    const item = await createDocument(input);

    return apiCreated({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to create document.");
  }
}