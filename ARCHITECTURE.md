# ARCHITECTURE.md — lifedock

## Stack

- Next.js 16 App Router
- TypeScript foarte strict
- **Vanilla Extract only** — zero inline styles, zero Tailwind
  - **Excepție izolată:** `CalendarGrid.tsx` — chips din `tileContent` folosesc inline styles
    (`CHIP_BASE`, `CHIP_COLORS`) din cauza limitării de scoping CSS cu react-calendar v6. Orice
    altă excepție necesită aprobare explicită.
- Doar importuri relative, fără alias-uri
- ESLint flat config
- Module-first architecture
- Direcție PWA
- Fără `any`, fără patch-uri pe presupuneri

## DB / ORM

- **Prisma 7**, `prisma.config.ts`, generator `prisma-client`, output în `src/generated/prisma`
- **SQLite local** (`dev.db`), `.env` la root, `DATABASE_URL="file:./dev.db"`
- Client DB în `src/server/db/client.ts`
- Adapter: `@prisma/adapter-better-sqlite3`
- Migrații existente: `init_events`, `add_documents`, `add_bills`, `add_obligations`

## Structura de directoare

```text
src/app/                 routing + composition
src/modules/             verticale / feature slices
src/server/              infrastructură server-only
src/shared/              theme, UI generic, helpers pure
src/generated/prisma/    client generat Prisma
docs/, tests/, scripts/, prisma/, public/
```

## Pattern pe module

Fiecare verticală (`events`, `documents`, `bills`, `obligations`, `dashboard`, `calendar`,
`search`, ...) urmează același tipar:

```text
*.contracts.ts     tipuri
*.api.ts           client-side fetch
*.mappers.ts
*.parsers.ts
*.repository.ts    acces Prisma
route.ts, [id]/route.ts
```

## Utilitare comune server-side

- `src/server/http/api.ts` — `apiOk`, `apiCreated`, `apiError`, `toErrorResponse`, `ApiHttpError`
- `src/server/validation/input.ts` — `parseJsonRequest`, `readRouteParam`

## Mecanisme cheie deja construite

- **Dashboard** (`src/modules/dashboard/`) — read-model unificat, 8 query-uri Prisma paralele via
  `Promise.all` (upcoming events, expiring documents, unpaid bills, urgent obligations + 4
  counters), rută `GET /api/dashboard` (`force-dynamic`).
- **Calendar** (`src/modules/calendar/`) — `react-calendar` v6, rută
  `GET /api/calendar?month=YYYY-MM`, agregă `Events.date`, `Bills.dueDate`, `Obligations.dueDate`,
  `Documents.expiresAt` într-un singur `CalendarDayItem[]`.
- **Search** (`src/modules/search/`) — rută `GET /api/search?q=query`, 4 query-uri Prisma paralele
  cu `contains` peste Events/Documents/Bills/Obligations, context global `SearchModalProvider` +
  `SearchModal` montate în `(app)/layout.tsx`.

Detalii de implementare și motivația fiecărei faze: [`CHANGELOG.md`](./CHANGELOG.md).
