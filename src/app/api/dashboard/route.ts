import { getDashboardSummary } from "../../../modules/dashboard/server/dashboard.repository";
import { apiOk, toErrorResponse } from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const summary = await getDashboardSummary();

    return apiOk({ summary });
  } catch (error: unknown) {
    return toErrorResponse(error, "Failed to load dashboard.");
  }
}
