import type { DashboardSummaryResponse } from "./dashboard.contracts";

const DASHBOARD_API_ROUTE = "/api/dashboard";

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

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  const response = await fetch(DASHBOARD_API_ROUTE, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<DashboardSummaryResponse>(response);
}
