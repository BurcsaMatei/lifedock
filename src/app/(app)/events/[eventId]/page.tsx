"use client";

import { useParams } from "next/navigation";

import { EventDetailScreen } from "../../../../modules/events/screens/EventDetailScreen";

type RouteParams = {
  readonly eventId?: string | string[];
};

export default function EventDetailPage() {
  const params = useParams<RouteParams>();
  const eventId = typeof params.eventId === "string" ? params.eventId : "";

  return <EventDetailScreen eventId={eventId} />;
}