"use client";

import { useParams } from "next/navigation";

import { BillDetailScreen } from "../../../../modules/bills";

type RouteParams = {
  readonly billId?: string | string[];
};

export default function BillDetailPage() {
  const params = useParams<RouteParams>();
  const billId = typeof params.billId === "string" ? params.billId : "";

  return <BillDetailScreen billId={billId} />;
}