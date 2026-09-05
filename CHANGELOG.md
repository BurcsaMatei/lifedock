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
