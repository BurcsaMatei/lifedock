"use client";

import Link from "next/link";
import { useState } from "react";

import { BottomSheet, Button } from "../../../../shared/components/ui";
import { ROUTES } from "../../../../shared/config/routes";
import {
  actionDescription,
  actionGrid,
  actionLink,
  actionTitle
} from "./QuickAddBar.css";

export function QuickAddBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Adaugă element</Button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Adaugă rapid"
        description="Alege tipul de element pe care vrei să îl creezi."
      >
        <div className={actionGrid}>
          <Link
            href={ROUTES.app.documentsNew}
            className={actionLink}
            onClick={() => setIsOpen(false)}
          >
            <span className={actionTitle}>Document</span>
            <span className={actionDescription}>
              Carte de identitate, permis, RCA, contract, legitimație.
            </span>
          </Link>

          <Link
            href={ROUTES.app.eventsNew}
            className={actionLink}
            onClick={() => setIsOpen(false)}
          >
            <span className={actionTitle}>Eveniment</span>
            <span className={actionDescription}>
              Întâlnire, examen, zi de naștere, termen important.
            </span>
          </Link>

          <Link
            href={ROUTES.app.billsNew}
            className={actionLink}
            onClick={() => setIsOpen(false)}
          >
            <span className={actionTitle}>Factură</span>
            <span className={actionDescription}>
              Curent, gaz, internet, chirie, abonamente sau costuri recurente.
            </span>
          </Link>

          <Link
            href={ROUTES.app.obligationsNew}
            className={actionLink}
            onClick={() => setIsOpen(false)}
          >
            <span className={actionTitle}>Obligație</span>
            <span className={actionDescription}>
              Task administrativ, termen limită, lucru de rezolvat.
            </span>
          </Link>
        </div>
      </BottomSheet>
    </>
  );
}