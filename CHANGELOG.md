# CHANGELOG.md — lifedock

Istoricul fazelor de dezvoltare — ce s-a implementat și de ce, nu doar ce există azi în cod.

## Faza A — Fundație + 4 verticale CRUD

Trecerea de la storage local (`localStorage`) la persistență reală server-side.

**Fundația DB:** `prisma/schema.prisma`, `prisma.config.ts`, `.env`, `src/server/db/client.ts`.
Migrații: `init_events`, `add_documents`, `add_bills`, `add_obligations`. DB locală: `dev.db`.

**Cele 4 verticale** (Events, Documents, Bills, Obligations) au primit fiecare, în paralel: model
Prisma, contracts, api client, mapper, parser, repository, rutele `GET`/`POST` pe colecție și
`GET`/`PATCH`/`DELETE` pe entitate, plus UI complet (list/create/detail/edit/delete, stări de
loading/error/not-found/delete).

**Standardizare de arhitectură** rezultată din construirea celor 4 verticale: pattern comun pe
module (`*.contracts.ts`, `*.api.ts`, `*.mappers.ts`, `*.parsers.ts`, `*.repository.ts`, rute) și
utilitare server-side comune (`src/server/http/api.ts`, `src/server/validation/input.ts`).

## Faza B — Dashboard / Home real

Dashboard-ul a fost transformat dintr-un shell static cu valori hardcodate `"0"` într-un read-model
unificat, agregat cross-module.

- `src/modules/dashboard/lib/dashboard.contracts.ts` — tipuri complete pentru read-model
- `src/modules/dashboard/server/dashboard.repository.ts` — 8 query-uri paralele via `Promise.all`
  (upcoming events limit 5, expiring documents ≤90 zile limit 5, unpaid bills limit 5, urgent
  obligations — `high` priority SAU due ≤7 zile — limit 5, plus 4 counters); `daysUntilExpiry` și
  `isOverdue` calculate în repository
- `GET /api/dashboard` (`force-dynamic`)
- `HomeScreen` rescris: loading/error/data states, 4 StatCards, 4 secțiuni condiționale (apar doar
  cu date), `EmptyState` global dacă toate secțiunile sunt goale

## Faza C — Calendar real

Construit în `src/modules/calendar/`, urmând pattern-ul existent.

- `react-calendar` v6 instalat ca dependință (zero CSS din librărie)
- `GET /api/calendar?month=YYYY-MM` — agregă `Events.date`, `Bills.dueDate`, `Obligations.dueDate`,
  `Documents.expiresAt` într-un `CalendarDayItem[]`
- Chips color-coded în `tileContent` cu inline styles (excepție izolată de la Vanilla Extract only,
  vezi [`ARCHITECTURE.md`](./ARCHITECTURE.md)): event `#0ea5e9`, bill `#f04438`, obligation
  `#f79009`, document `#12b76a`
- Click pe zi → `DayPanel` cu lista completă a zilei; click pe item → navighează la detaliul
  entității

## Faza D — Search real global

Construit în `src/modules/search/`, urmând pattern-ul existent.

- `GET /api/search?q=query` — 4 query-uri Prisma paralele cu `contains` (SQLite LIKE
  case-insensitive pentru ASCII) peste Events, Documents, Bills, Obligations
- `SearchModalProvider` context (`isOpen`/`open`/`close`, hook `useSearchModal`), montat global în
  `(app)/layout.tsx`
- `SearchModal`: debounce 300ms, empty state sub 2 caractere, loading/no-results/grouped results,
  ESC și click pe backdrop închid modalul, click pe rezultat navighează și închide
- Butonul „Caută" din `BottomNav` deschide modalul (nu mai navighează la `/search`)

## Mentenanță 2026-11-26 — sweep de securitate (25 vulnerabilități → 0), zero cod de produs

Proiectul e în **stand-by**; excepția de mentenanță (securitate) a fost **confirmată explicit** de proprietar. **Doar** `package.json`, `package-lock.json` și clientul Prisma generat (comis în repo).

**`npm audit`: 25 (3 critice, 9 grave, 12 moderate, 1 mică) → 0.** Schimbări: `next` `^16.4.6` (16.3.4 → 16.4.6, critică), `sharp` `^0.35.5`, `npm audit fix` (fără `--force`; între altele `zod` 4.3.6 → 4.6.7), `vitest` + `@vitest/coverage-v8` 3 → `^5.1.2` (salt major; critice `vitest`/`tinypool`), `overrides.effect` `^3.22.5` (Prisma fixează `effect` 3.20.0, vulnerabil ≤ 3.22.0; aceeași linie majoră, ca precedentul `mysql2`), `tsx` și `@vanilla-extract/integration` urcate (aceasta din urmă permite `esbuild` 0.28.2, reparat). Fișierele `src/generated/prisma/*` diferă **doar** prin versiunea clientului/motorului (CLI 7.10.0 → 7.10.1, regenerat de `postinstall`).

**Intenționat NEFĂCUT:** `eslint-config-next` rămâne **fixat 16.1.6** (fără vulnerabilitate). Urcarea lui trage `eslint-plugin-react-hooks` 7.1.1, care dă **5 erori** (`set-state-in-effect`) în codul de produs, interzis în stand-by; de făcut la reluare.

**Verificat:** `npm ci`, `npm ls`; `npm run check` (lint cu `--max-warnings=0`, typecheck, importuri, structură, tipuri stricte) verde; `npm run build` verde, aceleași rute. **Proiectul nu are niciun test**, deci comportamentul a fost verificat cu un test extern pe o bază SQLite **nouă și temporară** (`dev.db` neatins): 25 de pagini în browser, creare/citire/modificare/ștergere pe cele 4 entități cu date valide și invalide, dashboard, calendar, căutare, cele 4 formulare trimise goale și completate — **82 de verificări identice** înainte și după (testul a fost întâi rulat de două ori pe codul vechi cu rezultat identic). `vitest run --passWithNoTests` pornește pe 5.1.2. **`zod`:** diferențial pe cele 12 scheme, 6.100 de intrări, 4.3.6 ↔ 4.6.7: **12 schimbări respins → acceptat**, toate același caz — 61 de emoji într-un câmp cu maximum 120 (4.6.7 numără caractere, nu unități UTF-16); validarea de pe server (`src/server/validation/input.ts`, `value.length`) **respinge în continuare**, deci în bază nu ajunge nimic în plus; efectul vizibil: mesajul vine de la server, nu din formular. 0 diferențe la datele acceptate de ambele; restul diferențelor sunt formulări pentru `Infinity`.

**Avertismente rămase (preexistente, nu sunt de securitate; cer cod/config de produs):** `npm ci`: `prebuild-install` deprecat (adus de `better-sqlite3`); `next build`: `experimental.typedRoutes` mutat la `typedRoutes`, convenția `middleware` → `proxy`.

**Neverificat:** migrare/seed pe o bază cu date reale, notificările `web-push`, aspectul vizual (nu s-au comparat capturi).
