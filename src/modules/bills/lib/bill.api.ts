import type {
  BillByIdResponse,
  BillsListResponse,
  CreateBillInput,
  CreateBillResponse,
  DeleteBillResponse,
  UpdateBillInput,
  UpdateBillResponse
} from "./bill.contracts";

const BILLS_API_ROUTE = "/api/bills";

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

function buildBillRoute(billId: string): string {
  return `${BILLS_API_ROUTE}/${encodeURIComponent(billId)}`;
}

export async function getBills(): Promise<BillsListResponse> {
  const response = await fetch(BILLS_API_ROUTE, {
    method: "GET",
    cache: "no-store"
  });

  return readJson<BillsListResponse>(response);
}

export async function getBillById(billId: string): Promise<BillByIdResponse> {
  const response = await fetch(buildBillRoute(billId), {
    method: "GET",
    cache: "no-store"
  });

  return readJson<BillByIdResponse>(response);
}

export async function postBill(
  input: CreateBillInput
): Promise<CreateBillResponse> {
  const response = await fetch(BILLS_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<CreateBillResponse>(response);
}

export async function patchBill(
  billId: string,
  input: UpdateBillInput
): Promise<UpdateBillResponse> {
  const response = await fetch(buildBillRoute(billId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return readJson<UpdateBillResponse>(response);
}

export async function deleteBill(billId: string): Promise<DeleteBillResponse> {
  const response = await fetch(buildBillRoute(billId), {
    method: "DELETE"
  });

  return readJson<DeleteBillResponse>(response);
}