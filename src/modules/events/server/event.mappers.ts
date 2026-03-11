import type { Event as PrismaEvent } from "../../../generated/prisma/client";

import { EVENT_TYPES } from "../lib/event.contracts";
import type { EventItem, EventType } from "../lib/event.contracts";

function normalizeEventType(value: string): EventType {
  if (EVENT_TYPES.includes(value as EventType)) {
    return value as EventType;
  }

  return "meeting";
}

export function mapPrismaEventToEventItem(event: PrismaEvent): EventItem {
  return {
    id: event.id,
    title: event.title,
    eventType: normalizeEventType(event.eventType),
    date: event.date,
    time: event.time,
    notes: event.notes,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString()
  };
}