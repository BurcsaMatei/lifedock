import type {
  DeleteObligationResponse,
  ObligationByIdResponse,
  UpdateObligationResponse
} from "../../../../modules/obligations/lib/obligation.contracts";
import { parseUpdateObligationInput } from "../../../../modules/obligations/server/obligation.parsers";
import {
  deleteObligation,
  getObligationById,
  updateObligation
} from "../../../../modules/obligations/server/obligation.repository";
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
    const obligationId = await readRouteParam(
      context.params,
      "obligationId",
      "Obligation ID"
    );
    const item = await getObligationById(obligationId);

    return apiOk<ObligationByIdResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load obligation.");
  }
}

export async function PATCH(
  request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const obligationId = await readRouteParam(
      context.params,
      "obligationId",
      "Obligation ID"
    );
    const input = await parseJsonRequest(request, parseUpdateObligationInput);
    const item = await updateObligation(obligationId, input);

    return apiOk<UpdateObligationResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to update obligation.");
  }
}

export async function DELETE(
  _request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const obligationId = await readRouteParam(
      context.params,
      "obligationId",
      "Obligation ID"
    );
    await deleteObligation(obligationId);

    return apiOk<DeleteObligationResponse>({
      success: true
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to delete obligation.");
  }
}