import { parseCreateEventInput } from "../../../modules/events/server/event.parsers";
import { createEvent, listEvents } from "../../../modules/events/server/event.repository";
import {
  apiCreated,
  apiOk,
  parseJsonRequest,
  toErrorResponse
} from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const items = await listEvents();

    return apiOk({
      items
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load events.");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonRequest(request, parseCreateEventInput);
    const item = await createEvent(input);

    return apiCreated({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to create event.");
  }
}