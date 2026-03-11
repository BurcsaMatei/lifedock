import type {
  DeleteEventResponse,
  EventByIdResponse,
  UpdateEventResponse
} from "../../../../modules/events/lib/event.contracts";
import { parseUpdateEventInput } from "../../../../modules/events/server/event.parsers";
import {
  deleteEvent,
  getEventById,
  updateEvent
} from "../../../../modules/events/server/event.repository";
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
    const eventId = await readRouteParam(context.params, "eventId", "Event ID");
    const item = await getEventById(eventId);

    return apiOk<EventByIdResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load event.");
  }
}

export async function PATCH(
  request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const eventId = await readRouteParam(context.params, "eventId", "Event ID");
    const input = await parseJsonRequest(request, parseUpdateEventInput);
    const item = await updateEvent(eventId, input);

    return apiOk<UpdateEventResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to update event.");
  }
}

export async function DELETE(
  _request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const eventId = await readRouteParam(context.params, "eventId", "Event ID");
    await deleteEvent(eventId);

    return apiOk<DeleteEventResponse>({
      success: true
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to delete event.");
  }
}