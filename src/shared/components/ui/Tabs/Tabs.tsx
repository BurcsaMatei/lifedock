"use client";

import { badge, list, trigger, triggerActive } from "./Tabs.css";

export type TabsItem<Value extends string> = {
  readonly label: string;
  readonly value: Value;
  readonly badge?: string;
};

type TabsProps<Value extends string> = {
  readonly ariaLabel: string;
  readonly items: readonly TabsItem<Value>[];
  readonly value: Value;
  readonly onValueChange: (value: Value) => void;
};

export function Tabs<Value extends string>({
  ariaLabel,
  items,
  onValueChange,
  value
}: TabsProps<Value>) {
  return (
    <div className={list} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={[trigger, isActive ? triggerActive : ""].filter(Boolean).join(" ")}
            onClick={() => onValueChange(item.value)}
          >
            <span>{item.label}</span>
            {item.badge ? <span className={badge}>{item.badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
}