# CLAUDE.md — lifedock

Instrucțiuni pentru agentul care lucrează în acest repo. Se încarcă la fiecare sesiune, deci rămâne
**scurt**. Detaliile stau în fișierele de mai jos.

---

## Status proiect

**Stand-by din 2026-04-11** (ultimul commit de feature). Cod funcțional — typecheck curat, 4
verticale CRUD + Dashboard + Calendar + Search complete — dar fără auth real, fără deployment, fără
testare configurată. **Va fi reluat** (Faza E — Notifications/reminders e pasul planificat), dar nu
e prioritate curentă. **Nu se atinge codul până la reluare.**

Mentenanța de portofoliu (sweep de securitate, aliniere Node, aliniere documentație) se aplică și în
stand-by, prin excepții explicite confirmate de user — sunt patch-uri, configurație sau
documentație, zero cod de produs. Excepția **nu** se extinde la feature work fără reconfirmare.

`check:all` e aici **alias către `check`** — poarta proprie a proiectului (lint + typecheck +
`check:imports` + `check:structure` + `check:types`) e mai strictă decât standardul din
`konceptid-ops/STANDARDS.md`, deci standardul o cheamă pe ea, nu o slăbește.

---

## Harta documentației

| Fișier | Când îl citești |
| --- | --- |
| **`CLAUDE.md`** (acesta) | Mereu — reguli de lucru + esențialul |
| [`AGENTS.md`](./AGENTS.md) | Pointer către acest fișier |
| [`PRD.md`](./PRD.md) | Ce e LifeDock, pentru cine, direcția de produs |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Stack, structură, modele DB, pattern de module, API |
| [`ROADMAP.md`](./ROADMAP.md) | Faze finalizate, faza curentă/următoare |
| [`CHANGELOG.md`](./CHANGELOG.md) | Ce s-a implementat pe faze, și de ce |

**Regula de aur:** codul e sursa de adevăr. Dacă documentația contrazice codul, codul câștigă — și
actualizezi documentația în același commit.

---

## Reguli de lucru

- **TypeScript foarte strict**, fără `any`, fără patch-uri pe presupuneri.
- **Vanilla Extract only** — zero inline styles, zero Tailwind. Excepție izolată documentată în
  [`ARCHITECTURE.md`](./ARCHITECTURE.md) (`CalendarGrid.tsx`). Orice altă excepție necesită
  aprobare explicită.
- Doar importuri relative, fără alias-uri.
- ESLint flat config, module-first architecture.
