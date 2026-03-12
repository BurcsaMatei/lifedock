"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { fetchSearch } from "../../lib/search.api";
import { useSearchModal } from "../../lib/search.context";
import type { SearchResponse, SearchResult, SearchResultType } from "../../lib/search.contracts";
import {
  closeButton,
  group,
  groupHeader,
  overlay,
  panel,
  resultItem,
  resultList,
  resultSubtitle,
  resultTitle,
  resultsArea,
  searchInput,
  searchRow,
  stateMessage
} from "./SearchModal.css";

const GROUP_LABELS: Record<SearchResultType, string> = {
  event: "Evenimente",
  document: "Documente",
  bill: "Facturi",
  obligation: "Obligații"
};

type ResultGroupProps = {
  readonly type: SearchResultType;
  readonly items: readonly SearchResult[];
  readonly onSelect: (href: string) => void;
};

function ResultGroup({ items, onSelect, type }: ResultGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={group}>
      <p className={groupHeader}>{GROUP_LABELS[type]}</p>
      <ul className={resultList} role="listbox">
        {items.map((item) => (
          <li key={item.id} role="option" aria-selected={false}>
            <button
              type="button"
              className={resultItem}
              onClick={() => {
                onSelect(item.href);
              }}
            >
              <span className={resultTitle}>{item.title}</span>
              {item.subtitle ? (
                <span className={resultSubtitle}>{item.subtitle}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function hasResults(results: SearchResponse): boolean {
  return (
    results.events.length > 0 ||
    results.documents.length > 0 ||
    results.bills.length > 0 ||
    results.obligations.length > 0
  );
}

export function SearchModal() {
  const { close, isOpen } = useSearchModal();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchSearch(q.trim());
      setResults(data);
    } catch {
      setResults({ events: [], documents: [], bills: [], obligations: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleQueryChange(value: string): void {
    setQuery(value);

    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      void runSearch(value);
    }, 300);
  }

  function handleSelect(href: string): void {
    close();
    router.push(href as Route);
  }

  if (!isOpen) {
    return null;
  }

  const trimmedQuery = query.trim();
  const isTooShort = trimmedQuery.length < 2;
  const noResults = !isLoading && results !== null && !hasResults(results);

  return (
    <div
      className={overlay}
      onClick={close}
      role="presentation"
    >
      <div
        className={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Căutare globală"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={searchRow}>
          <input
            ref={inputRef}
            type="search"
            className={searchInput}
            placeholder="Caută în LifeDock..."
            value={query}
            onChange={(e) => {
              handleQueryChange(e.target.value);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className={closeButton}
            onClick={close}
            aria-label="Închide căutarea"
          >
            ×
          </button>
        </div>

        <div className={resultsArea}>
          {isTooShort && !isLoading ? (
            <p className={stateMessage}>Scrie cel puțin 2 caractere pentru a căuta</p>
          ) : isLoading ? (
            <p className={stateMessage}>Se caută...</p>
          ) : noResults ? (
            <p className={stateMessage}>
              Niciun rezultat pentru &ldquo;{trimmedQuery}&rdquo;
            </p>
          ) : results !== null ? (
            <>
              <ResultGroup type="event" items={results.events} onSelect={handleSelect} />
              <ResultGroup type="document" items={results.documents} onSelect={handleSelect} />
              <ResultGroup type="bill" items={results.bills} onSelect={handleSelect} />
              <ResultGroup type="obligation" items={results.obligations} onSelect={handleSelect} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
