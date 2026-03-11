import { parseCreateObligationInput } from "../../../modules/obligations/server/obligation.parsers";
import {
  createObligation,
  listObligations
} from "../../../modules/obligations/server/obligation.repository";
import {
  apiCreated,
  apiOk,
  parseJsonRequest,
  toErrorResponse
} from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const items = await listObligations();

    return apiOk({
      items
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load obligations.");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonRequest(request, parseCreateObligationInput);
    const item = await createObligation(input);

    return apiCreated({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to create obligation.");
  }
}