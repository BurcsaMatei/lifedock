import type {
  CreateEventInput,
  CreateEventResponse,
  DeleteEventResponse,
  EventByIdResponse,
  EventsListResponse,
  UpdateEventInput,
  UpdateEventResponse
} from "./event.contracts";

const EVENTS_API_ROUTE = "/api/events";

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
    throw new ApiRequestError(
      extractErrorMessage(payload),
      response.status
    );
  }

  return payload as T;
}

function buildEventRoute(eventId: string): string {
  return `${EVENTS_API_ROUTE}/${encodeURIComponent(eventId)}`;
}

export async function getEvents(): Promise<EventsListResponse> {
  const response = await fetch(EVENTS_API_ROUTE, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<EventsListResponse>(response);
}

export async function getEventById(eventId: string): Promise<EventByIdResponse> {
  const response = await fetch(buildEventRoute(eventId), {
    method: "GET",
    cache: "no-store"
  });

  return readJson<EventByIdResponse>(response);
}

export async function postEvent(
  input: CreateEventInput
): Promise<CreateEventResponse> {
  const response = await fetch(EVENTS_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<CreateEventResponse>(response);
}

export async function patchEvent(
  eventId: string,
  input: UpdateEventInput
): Promise<UpdateEventResponse> {
  const response = await fetch(buildEventRoute(eventId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<UpdateEventResponse>(response);
}

export async function deleteEvent(
  eventId: string
): Promise<DeleteEventResponse> {
  const response = await fetch(buildEventRoute(eventId), {
    method: "DELETE"
  });

  return readJson<DeleteEventResponse>(response);
}