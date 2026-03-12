"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "../../../../shared/components/layout/PageHeader";
import { ScreenContainer } from "../../../../shared/components/layout/ScreenContainer";
import { EmptyState } from "../../../../shared/components/ui";
import { getCalendarMonth } from "../../lib/calendar.api";
import type { CalendarDayItem } from "../../lib/calendar.contracts";
import { CalendarGrid } from "../../components/CalendarGrid/CalendarGrid";
import { DayPanel } from "../../components/DayPanel/DayPanel";
import { calendarSection, layout, loadingText, root } from "./CalendarScreen.css";

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");

  return `${String(y)}-${m}`;
}

export function CalendarScreen() {
  const [activeMonth, setActiveMonth] = useState<string>(getCurrentMonth);
  const [items, setItems] = useState<readonly CalendarDayItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMonth(): Promise<void> {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getCalendarMonth(activeMonth);

        if (!isMounted) return;

        setItems(response.items);
      } catch (error: unknown) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error ? error.message : "Nu am putut încărca calendarul."
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadMonth();

    return () => {
      isMounted = false;
    };
  }, [activeMonth]);

  const dayItems: readonly CalendarDayItem[] =
    selectedDate !== null ? items.filter((item) => item.date === selectedDate) : [];

  function handleMonthChange(month: string): void {
    setActiveMonth(month);
    setSelectedDate(null);
  }

  return (
    <ScreenContainer as="main">
      <div className={root}>
        <PageHeader
          eyebrow="Calendar"
          title="Calendarul tău"
          description="Evenimente, facturi, obligații și documente pe un singur timeline vizual."
        />

        {isLoading ? (
          <p className={loadingText}>Se încarcă calendarul...</p>
        ) : errorMessage !== null ? (
          <EmptyState
            title="Nu am putut încărca calendarul"
            description={errorMessage}
          />
        ) : (
          <div className={layout}>
            <div className={calendarSection}>
              <CalendarGrid
                items={items}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                activeMonth={activeMonth}
                onMonthChange={handleMonthChange}
              />
            </div>

            {selectedDate !== null && (
              <DayPanel
                date={selectedDate}
                items={dayItems}
                onClose={() => setSelectedDate(null)}
              />
            )}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
