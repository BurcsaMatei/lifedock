"use client";

import type { ReactNode } from "react";
import { useEffect, useId } from "react";

import {
  closeButton,
  content,
  description,
  footer,
  header,
  headerText,
  overlay,
  panel,
  title
} from "./Modal.css";

type ModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string | undefined;
  readonly description?: string | undefined;
  readonly children: ReactNode;
  readonly footer?: ReactNode | undefined;
  readonly closeOnOverlayClick?: boolean | undefined;
};

export function Modal({
  children,
  closeOnOverlayClick = true,
  description: descriptionText,
  footer: footerNode,
  isOpen,
  onClose,
  title: titleText
}: ModalProps) {
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
        {(titleText || descriptionText) ? (
          <header className={header}>
            <div className={headerText}>
              {titleText ? <h2 id={titleId} className={title}>{titleText}</h2> : null}
              {descriptionText ? (
                <p id={descriptionId} className={description}>
                  {descriptionText}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              className={closeButton}
              onClick={onClose}
              aria-label="Închide"
            >
              ×
            </button>
          </header>
        ) : null}

        <div className={content}>{children}</div>

        {footerNode ? <div className={footer}>{footerNode}</div> : null}
      </section>
    </div>
  );
}