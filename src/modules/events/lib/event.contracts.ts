export const EVENT_TYPES = ["meeting", "exam", "birthday", "deadline"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type EventItem = {
  readonly id: string;
  readonly title: string;
  readonly eventType: EventType;
  readonly date: string;
  readonly time: string;
  readonly notes: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type CreateEventInput = {
  readonly title: string;
  readonly eventType: EventType;
  readonly date: string;
  readonly time: string;
  readonly notes: string;
};

export type UpdateEventInput = {
  readonly title?: string;
  readonly eventType?: EventType;
  readonly date?: string;
  readonly time?: string;
  readonly notes?: string;
};

export type EventsListResponse = {
  readonly items: readonly EventItem[];
};

export type EventByIdResponse = {
  readonly item: EventItem;
};

export type CreateEventResponse = {
  readonly item: EventItem;
};

export type UpdateEventResponse = {
  readonly item: EventItem;
};

export type DeleteEventResponse = {
  readonly success: true;
};