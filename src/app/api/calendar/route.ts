import { getCalendarItems } from "../../../modules/calendar/server/calendar.repository";
import { apiError, apiOk, toErrorResponse } from "../../../server/http/api";

export const dynamic = "force-dynamic";

function isValidMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const month = url.searchParams.get("month");

  if (month === null || !isValidMonth(month)) {
    return apiError(400, "Parametrul 'month' este invalid. Folosiți formatul YYYY-MM.");
  }

  try {
    const items = await getCalendarItems(month);

    return apiOk({ items });
  } catch (error: unknown) {
    return toErrorResponse(error, "Nu am putut încărca datele calendarului.");
  }
}
