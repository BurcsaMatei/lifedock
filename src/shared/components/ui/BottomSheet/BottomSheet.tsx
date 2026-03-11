"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";

import {
  content,
  description,
  handle,
  header,
  overlay,
  panel,
  title
} from "./BottomSheet.css";

type BottomSheetProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  readonly children: ReactNode;
  readonly closeOnOverlayClick?: boolean | undefined;
};

export function BottomSheet({
  children,
  closeOnOverlayClick = true,
  description: descriptionText,
  isOpen,
  onClose,
  title: titleText
}: BottomSheetProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={overlay}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
    >
      <section
        className={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleText ? titleId : undefined}
        aria-describedby={descriptionText ? descriptionId : undefined}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className={handle} aria-hidden="true" />

        {(titleText || descriptionText) ? (
          <header className={header}>
            {titleText ? <h2 id={titleId} className={title}>{titleText}</h2> : null}
            {descriptionText ? (
              <p id={descriptionId} className={description}>
                {descriptionText}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className={content}>{children}</div>
      </section>
    </div>
  );
}