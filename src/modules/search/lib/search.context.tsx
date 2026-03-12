"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import type { ReactNode } from "react";

type SearchModalContextValue = {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
};

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

type SearchModalProviderProps = {
  readonly children: ReactNode;
};

export function SearchModalProvider({ children }: SearchModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal(): SearchModalContextValue {
  const context = useContext(SearchModalContext);

  if (context === null) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }

  return context;
}
