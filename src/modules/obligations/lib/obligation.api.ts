import type {
  CreateObligationInput,
  CreateObligationResponse,
  DeleteObligationResponse,
  ObligationByIdResponse,
  ObligationsListResponse,
  UpdateObligationInput,
  UpdateObligationResponse
} from "./obligation.contracts";

const OBLIGATIONS_API_ROUTE = "/api/obligations";

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

function buildObligationRoute(obligationId: string): string {
  return `${OBLIGATIONS_API_ROUTE}/${encodeURIComponent(obligationId)}`;
}

export async function getObligations(): Promise<ObligationsListResponse> {
  const response = await fetch(OBLIGATIONS_API_ROUTE, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<ObligationsListResponse>(response);
}

export async function getObligationById(
  obligationId: string
): Promise<ObligationByIdResponse> {
  const response = await fetch(buildObligationRoute(obligationId), {
    method: "GET",
    cache: "no-store"
  });

  return readJson<ObligationByIdResponse>(response);
}

export async function postObligation(
  input: CreateObligationInput
): Promise<CreateObligationResponse> {
  const response = await fetch(OBLIGATIONS_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<CreateObligationResponse>(response);
}

export async function patchObligation(
  obligationId: string,
  input: UpdateObligationInput
): Promise<UpdateObligationResponse> {
  const response = await fetch(buildObligationRoute(obligationId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<UpdateObligationResponse>(response);
}

export async function deleteObligation(
  obligationId: string
): Promise<DeleteObligationResponse> {
  const response = await fetch(buildObligationRoute(obligationId), {
    method: "DELETE"
  });

  return readJson<DeleteObligationResponse>(response);
}