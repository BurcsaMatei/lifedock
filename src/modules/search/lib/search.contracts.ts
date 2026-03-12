export type SearchResultType = "event" | "document" | "bill" | "obligation";

export type SearchResult = {
  readonly id: string;
  readonly type: SearchResultType;
  readonly title: string;
  readonly subtitle: string;
  readonly href: string;
};

export type SearchResponse = {
  readonly events: readonly SearchResult[];
  readonly documents: readonly SearchResult[];
  readonly bills: readonly SearchResult[];
  readonly obligations: readonly SearchResult[];
};
