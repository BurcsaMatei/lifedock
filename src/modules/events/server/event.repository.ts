import type { Prisma } from "../../../generated/prisma/client";

import { notFound } from "../../../server/http/api";
import { db } from "../../../server/db/client";
import type {
  CreateEventInput,
  EventItem,
  UpdateEventInput
} from "../lib/event.contracts";
import { mapPrismaEventToEventItem } from "./event.mappers";

const DEFAULT_ORDER_BY: Prisma.EventOrderByWithRelationInput[] = [
  { date: "asc" },
  { time: "asc" },
  { createdAt: "desc" }
];

async function findEventOrThrow(eventId: string) {
  const event = await db.event.findUnique({
    where: {
      id: eventId
    }
  });

  if (!event) {
    notFound("Evenimentul nu a fost găsit.");
  }

  return event;
}

function buildEventUpdateData(input: UpdateEventInput): Prisma.EventUpdateInput {
  const data: Prisma.EventUpdateInput = {};

  if (typeof input.title !== "undefined") {
    data.title = input.title;
  }

  if (typeof input.eventType !== "undefined") {
    data.eventType = input.eventType;
  }

  if (typeof input.date !== "undefined") {
    data.date = input.date;
  }

  if (typeof input.time !== "undefined") {
    data.time = input.time;
  }

  if (typeof input.notes !== "undefined") {
    data.notes = input.notes;
  }

  return data;
}

export async function listEvents(): Promise<readonly EventItem[]> {
  const events = await db.event.findMany({
    orderBy: DEFAULT_ORDER_BY
  });

  return events.map(mapPrismaEventToEventItem);
}

export async function getEventById(eventId: string): Promise<EventItem> {
  const event = await findEventOrThrow(eventId);

  return mapPrismaEventToEventItem(event);
}

export async function createEvent(input: CreateEventInput): Promise<EventItem> {
  const event = await db.event.create({
    data: {
      title: input.title,
      eventType: input.eventType,
      date: input.date,
      time: input.time,
      notes: input.notes
    }
  });

  return mapPrismaEventToEventItem(event);
}

export async function updateEvent(
  eventId: string,
  input: UpdateEventInput
): Promise<EventItem> {
  await findEventOrThrow(eventId);

  const event = await db.event.update({
    where: {
      id: eventId
    },
    data: buildEventUpdateData(input)
  });

  return mapPrismaEventToEventItem(event);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await findEventOrThrow(eventId);

  await db.event.delete({
    where: {
      id: eventId
    }
  });
}