import { parseCreateBillInput } from "../../../modules/bills/server/bill.parsers";
import { createBill, listBills } from "../../../modules/bills/server/bill.repository";
import {
  apiCreated,
  apiOk,
  parseJsonRequest,
  toErrorResponse
} from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const items = await listBills();

    return apiOk({
      items
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load bills.");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonRequest(request, parseCreateBillInput);
    const item = await createBill(input);

    return apiCreated({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to create bill.");
  }
}