import { NextResponse } from "next/server";

export type RouteParams = Record<string, string | string[] | undefined>;

export type DynamicRouteContext = {
  params: Promise<RouteParams>;
};

export class ApiHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

function createJsonResponse<T extends Record<string, unknown>>(
  body: T,
  status: number
): Response {
  return NextResponse.json(body, {
    status
  });
}

export function apiOk<T extends Record<string, unknown>>(body: T): Response {
  return createJsonResponse(body, 200);
}

export function apiCreated<T extends Record<string, unknown>>(body: T): Response {
  return createJsonResponse(body, 201);
}

export function apiError(status: number, message: string): Response {
  return createJsonResponse(
    {
      error: message
    },
    status
  );
}

export function badRequest(message: string): never {
  throw new ApiHttpError(400, message);
}

export function notFound(message: string): never {
  throw new ApiHttpError(404, message);
}

export async function parseJsonRequest<T>(
  request: Request,
  parser: (value: unknown) => T
): Promise<T> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    badRequest("Body JSON invalid.");
  }

  return parser(payload);
}

export async function readRouteParam(
  paramsInput: RouteParams | Promise<RouteParams>,
  key: string,
  label: string
): Promise<string> {
  const params = await paramsInput;
  const rawValue = params[key];

  if (typeof rawValue !== "string") {
    badRequest(`${label} invalid.`);
  }

  const value = rawValue.trim();

  if (!value) {
    badRequest(`${label} invalid.`);
  }

  return value;
}

export function toErrorResponse(
  error: unknown,
  fallbackMessage: string
): Response {
  if (error instanceof ApiHttpError) {
    return apiError(error.status, error.message);
  }

  return apiError(500, fallbackMessage);
}