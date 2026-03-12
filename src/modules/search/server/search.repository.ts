import { db } from "../../../server/db/client";
import type { SearchResult } from "../lib/search.contracts";

export type SearchResults = {
  readonly events: readonly SearchResult[];
  readonly documents: readonly SearchResult[];
  readonly bills: readonly SearchResult[];
  readonly obligations: readonly SearchResult[];
};

export async function searchAll(query: string): Promise<SearchResults> {
  const [events, documents, bills, obligations] = await Promise.all([
    db.event.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { notes: { contains: query } }
        ]
      },
      select: { id: true, title: true, eventType: true },
      orderBy: { date: "desc" },
      take: 10
    }),
    db.document.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { notes: { contains: query } }
        ]
      },
      select: { id: true, title: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    db.bill.findMany({
      where: {
        OR: [
          { provider: { contains: query } },
          { notes: { contains: query } }
        ]
      },
      select: { id: true, provider: true, amount: true },
      orderBy: { dueDate: "desc" },
      take: 10
    }),
    db.obligation.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { details: { contains: query } }
        ]
      },
      select: { id: true, title: true, priority: true },
      orderBy: { dueDate: "desc" },
      take: 10
    })
  ]);

  return {
    events: events.map((e) => ({
      id: e.id,
      type: "event" as const,
      title: e.title,
      subtitle: e.eventType,
      href: `/events/${e.id}`
    })),
    documents: documents.map((d) => ({
      id: d.id,
      type: "document" as const,
      title: d.title,
      subtitle: d.category,
      href: `/documents/${d.id}`
    })),
    bills: bills.map((b) => ({
      id: b.id,
      type: "bill" as const,
      title: b.provider,
      subtitle: b.amount,
      href: `/bills/${b.id}`
    })),
    obligations: obligations.map((o) => ({
      id: o.id,
      type: "obligation" as const,
      title: o.title,
      subtitle: o.priority,
      href: `/obligations/${o.id}`
    }))
  };
}
