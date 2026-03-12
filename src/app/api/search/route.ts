import { searchAll } from "../../../modules/search/server/search.repository";
import { apiError, apiOk, toErrorResponse } from "../../../server/http/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (query === null || query.trim().length < 2) {
    return apiError(400, "Parametrul 'q' trebuie să aibă cel puțin 2 caractere.");
  }

  try {
    const results = await searchAll(query.trim());

    return apiOk(results);
  } catch (error: unknown) {
    return toErrorResponse(error, "Nu am putut efectua căutarea.");
  }
}
