"use client";

import { useParams } from "next/navigation";

import { ObligationDetailScreen } from "../../../../modules/obligations";

type RouteParams = {
  readonly obligationId?: string | string[];
};

export default function ObligationDetailPage() {
  const params = useParams<RouteParams>();
  const obligationId =
    typeof params.obligationId === "string" ? params.obligationId : "";

  return <ObligationDetailScreen obligationId={obligationId} />;
}