"use client";

import { useParams } from "next/navigation";

import { DocumentDetailScreen } from "../../../../modules/documents";

type RouteParams = {
  readonly documentId?: string | string[];
};

export default function DocumentDetailPage() {
  const params = useParams<RouteParams>();
  const documentId =
    typeof params.documentId === "string" ? params.documentId : "";

  return <DocumentDetailScreen documentId={documentId} />;
}