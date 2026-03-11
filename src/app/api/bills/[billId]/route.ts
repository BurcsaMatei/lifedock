import type {
  BillByIdResponse,
  DeleteBillResponse,
  UpdateBillResponse
} from "../../../../modules/bills/lib/bill.contracts";
import { parseUpdateBillInput } from "../../../../modules/bills/server/bill.parsers";
import {
  deleteBill,
  getBillById,
  updateBill
} from "../../../../modules/bills/server/bill.repository";
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
    const billId = await readRouteParam(context.params, "billId", "Bill ID");
    const item = await getBillById(billId);

    return apiOk<BillByIdResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load bill.");
  }
}

export async function PATCH(
  request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const billId = await readRouteParam(context.params, "billId", "Bill ID");
    const input = await parseJsonRequest(request, parseUpdateBillInput);
    const item = await updateBill(billId, input);

    return apiOk<UpdateBillResponse>({
      item
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to update bill.");
  }
}

export async function DELETE(
  _request: Request,
  context: DynamicRouteContext
): Promise<Response> {
  try {
    const billId = await readRouteParam(context.params, "billId", "Bill ID");
    await deleteBill(billId);

    return apiOk<DeleteBillResponse>({
      success: true
    });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to delete bill.");
  }
}