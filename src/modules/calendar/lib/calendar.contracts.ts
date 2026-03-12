export type CalendarItemType = "event" | "bill" | "obligation" | "document";

export type CalendarDayItem = {
  readonly id: string;
  readonly type: CalendarItemType;
  readonly title: string;
  readonly date: string; // YYYY-MM-DD
  readonly href: string;
};

export type CalendarMonthResponse = {
  readonly items: readonly CalendarDayItem[];
};
