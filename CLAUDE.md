## Faza C — Calendar real — FINALIZATĂ

Construit în `src/modules/calendar/` urmând exact pattern-ul existent.

### Ce s-a implementat

* `react-calendar` v6 instalat ca dependință (zero CSS din librărie)
* `GET /api/calendar?month=YYYY-MM` — returnează `CalendarDayItem[]` pentru luna respectivă
* Surse de date agregate: `Events.date`, `Bills.dueDate`, `Obligations.dueDate`, `Documents.expiresAt`
* `CalendarItemType`: `event | bill | obligation | document`
* Chips color-coded în tileContent cu inline styles (vezi excepția de styling din secțiunea 2):
  * event → `#0ea5e9`
  * bill → `#f04438`
  * obligation → `#f79009`
  * document → `#12b76a`
* Click pe zi → `selectedDate` în state local → `DayPanel` cu lista completă a zilei
* Click pe item în `DayPanel` → navighezi la `href` (detaliu entitate)
* Loading / error / empty states complete
* Typecheck verde, lint verde

### Fișierele cheie

```text
src/modules/calendar/lib/calendar.contracts.ts
src/modules/calendar/lib/calendar.api.ts
src/modules/calendar/server/calendar.repository.ts
src/app/api/calendar/route.ts
src/modules/calendar/components/CalendarGrid/CalendarGrid.tsx
src/modules/calendar/components/CalendarGrid/CalendarGrid.css.ts
src/modules/calendar/components/DayPanel/DayPanel.tsx
src/modules/calendar/components/DayPanel/DayPanel.css.ts
src/modules/calendar/screens/CalendarScreen/CalendarScreen.tsx
src/modules/calendar/screens/CalendarScreen/CalendarScreen.css.ts
src/modules/calendar/index.ts
src/app/(app)/calendar/page.tsx
```


## 1. Direcția corectă a produsului

LifeDock a fost construit corect, de la început, ca:

* aplicație **app-first**
* pornită **de la zero**
* gândită modular
* orientată pe management personal / operațional al vieții de zi cu zi:

  * events
  * documents
  * bills
  * obligations
  * dashboard
  * calendar
  * search
  * notifications
  * spaces
  * onboarding
  * auth
  * billing

Direcția sănătoasă stabilită încă de la brainstorming a fost:
**mai întâi fundație + fluxuri reale + arhitectură scalabilă**, apoi suprafețe mai inteligente și mai integrate.

---

## 2. Repere fixe ale proiectului

Stack-ul și regulile proiectului rămân:

* **Next.js 16 App Router**
* **TypeScript foarte strict**
* **Vanilla Extract only** — zero inline styles, zero Tailwind
  * **Excepție izolată:** `CalendarGrid.tsx` — chips din `tileContent` folosesc inline styles (`CHIP_BASE`, `CHIP_COLORS`) din cauza limitării de scoping CSS cu react-calendar v6. Orice altă excepție necesită aprobare explicită.
* **doar importuri relative**
* **ESLint flat config**
* **module-first architecture**
* direcție **PWA**
* fără Tailwind
* fără alias-uri
* fără `any`
* fără patch-uri pe presupuneri

### DB / ORM

* **Prisma 7**
* `prisma.config.ts`
* generator `prisma-client`
* output în `src/generated/prisma`
* **SQLite local**
* `.env` la root
* `DATABASE_URL="file:./dev.db"`
* client DB în `src/server/db/client.ts`
* adapter Prisma: `@prisma/adapter-better-sqlite3`

---

## 3. Structura mare a proiectului

Repo curent:
`F:\KonceptID\lifedock`

Structura principală activă:

* `src/app/` = routing + composition
* `src/modules/` = verticale / feature slices
* `src/server/` = infrastructură server-only
* `src/shared/` = theme, UI generic, helpers pure
* `src/generated/prisma/` = client generat Prisma
* `docs/`, `tests/`, `scripts/`, `prisma/`, `public/`

---

## 4. Ce era deja făcut înainte de persistența reală

Înainte de trecerea pe DB aveam deja:

* fundația proiectului
* theme contract + theme + global theme
* config general
* app shell
* auth shells
* onboarding shells
* QuickAddBar
* screen shells pentru mai multe zone
* persistență temporară în `localStorage`
* primele forme și liste pentru:

  * Events
  * Documents
  * Bills
  * Obligations

---

## 5. Ce s-a făcut în faza Prisma / server persistence

A fost făcută trecerea de la storage local la **persistență reală server-side**.

### Fundația DB

Au fost introduse și stabilizate:

* `prisma/schema.prisma`
* `prisma.config.ts`
* `.env`
* `src/server/db/client.ts`

### Migrații existente

* `init_events`
* `add_documents`
* `add_bills`
* `add_obligations`

### DB locală

* `dev.db`

---

## 6. Ce s-a făcut pe verticale

Toate cele 4 verticale principale sunt acum mutate complet pe persistență reală și au fluxul CRUD practic complet în UI.

### Events

Implementat:

* model Prisma
* contracts
* api client
* mapper
* parser
* repository
* routes:

  * `GET /api/events`
  * `POST /api/events`
  * `GET /api/events/[eventId]`
  * `PATCH /api/events/[eventId]`
  * `DELETE /api/events/[eventId]`

UI:

* list real
* create real
* detail real
* edit real
* delete real
* link din listă spre detail
* loading / error / not-found / delete states

### Documents

Implementat:

* model Prisma
* contracts
* api client
* mapper
* parser
* repository
* routes:

  * `GET /api/documents`
  * `POST /api/documents`
  * `GET /api/documents/[documentId]`
  * `PATCH /api/documents/[documentId]`
  * `DELETE /api/documents/[documentId]`

UI:

* list real
* create real
* detail real
* edit real
* delete real
* loading / error / not-found / delete states

### Bills

Implementat:

* model Prisma
* contracts
* api client
* mapper
* parser
* repository
* routes:

  * `GET /api/bills`
  * `POST /api/bills`
  * `GET /api/bills/[billId]`
  * `PATCH /api/bills/[billId]`
  * `DELETE /api/bills/[billId]`

UI:

* list real
* create real
* detail real
* edit real
* delete real
* loading / error / not-found / delete states

### Obligations

Implementat:

* model Prisma
* contracts
* api client
* mapper
* parser
* repository
* routes:

  * `GET /api/obligations`
  * `POST /api/obligations`
  * `GET /api/obligations/[obligationId]`
  * `PATCH /api/obligations/[obligationId]`
  * `DELETE /api/obligations/[obligationId]`

UI:

* list real
* create real
* detail real
* edit real
* delete real
* loading / error / not-found / delete states

---

## 7. Ce s-a făcut ca standardizare de arhitectură

După mutarea pe DB, proiectul a fost consolidat și disciplinat.

### Pattern stabilizat pe module

Pentru fiecare verticală avem acum pattern coerent:

* `*.contracts.ts`
* `*.api.ts`
* `*.mappers.ts`
* `*.parsers.ts`
* `*.repository.ts`
* `route.ts`
* `[id]/route.ts`

### Utilitare comune server-side

Există deja:

* `src/server/http/api.ts`
* `src/server/validation/input.ts`

### Standard comun pentru API

Avem structură comună pentru:

* `apiOk`
* `apiCreated`
* `apiError`
* `parseJsonRequest`
* `readRouteParam`
* `toErrorResponse`
* `ApiHttpError`

---

## 8. Ce s-a făcut în faza Dashboard / Home real (Faza B — finalizată)

Dashboard-ul a fost transformat dintr-un shell static cu valori hardcodate `"0"` într-un **produs coerent cu date reale agregate cross-module**.

### Read-model unificat

Implementat în `src/modules/dashboard/`:

* `lib/dashboard.contracts.ts` — tipuri complete pentru read-model:
  * `DashboardUpcomingEvent`
  * `DashboardExpiringDocument`
  * `DashboardUnpaidBill`
  * `DashboardUrgentObligation`
  * `DashboardCounters`
  * `DashboardSummary`
  * `DashboardSummaryResponse`

* `server/dashboard.repository.ts` — 8 query-uri paralele via `Promise.all`:
  * upcoming events (`date >= today`, limit 5)
  * expiring documents (`expiresAt <= today+90days`, limit 5)
  * unpaid bills (`isPaid = false`, limit 5)
  * urgent obligations (`isCompleted = false` AND (`priority = "high"` OR `dueDate <= today+7days`), limit 5)
  * 4 counters: totalEvents, totalDocuments, unpaidBills, pendingObligations
  * calculează `daysUntilExpiry` și `isOverdue` în repository

* `lib/dashboard.api.ts` — client-side fetch urmând pattern-ul existent

### API route

* `GET /api/dashboard` — `src/app/api/dashboard/route.ts`, `force-dynamic`

### HomeScreen real

`src/modules/dashboard/screens/HomeScreen/HomeScreen.tsx` — rescris complet:

* `"use client"` + `useEffect` + `useState` (același pattern ca celelalte screens)
* loading / error / data states
* 4 StatCards cu date reale din counters
* 4 secțiuni condiționale (apar doar dacă au date):
  * Urmează curând (evenimente viitoare)
  * Documente care expiră (în next 90 days)
  * Facturi de plată (unpaid)
  * Obligații urgente (high priority sau due în next 7 days)
* EmptyState global dacă toate secțiunile sunt goale
* Sub-componente inline: `Section`, `UpcomingEventItem`, `ExpiringDocumentItem`, `UnpaidBillItem`, `UrgentObligationItem`
* Helpers de formatare: date, zile până la expirare, labels pentru tipuri / categorii / priorități
* Link spre detaliu pentru fiecare item

`src/modules/dashboard/screens/HomeScreen/HomeScreen.css.ts` — clase noi adăugate:

* `sectionHeaderRow`, `sectionHeading`, `viewAllLink`
* `itemList`, `item`, `itemHeader`, `itemTitle`, `itemMeta`, `itemDetailLink`
* `loadingText`

### QuickAddBar

Neschimbat — funcționează corect, reutilizat în HomeScreen.

---

## 9. Starea exactă acum

LifeDock este acum un **produs coerent**, nu doar o colecție de CRUD-uri.

### Funcțional și validat

* fundație proiect solidă
* Prisma + SQLite funcționale
* 4 verticale reale pe DB cu CRUD complet
* Dashboard / Home real cu agregare cross-module
* Calendar real cu react-calendar v6, chips color-coded, DayPanel
* counters reale, secțiuni reale, items cu link spre detaliu
* loading / error / empty states pe tot
* typecheck verde
* lint verde

### Ce NU este încă făcut

* auth real complet
* multi-user ownership
* spaces reale cu ownership / grouping logic
* search real global peste entități
* notifications reale / reminder engine
* billing real
* upload logic real pentru documente
* sync extern / automations / cron logic real

---

## 10. Roadmap logic după acest checkpoint

### Faza A — finalizată

* fundație
* Prisma
* 4 verticale CRUD complete

### Faza B — finalizată

* **Dashboard / Home real cu agregare cross-module**

### Faza C — finalizată

* **Calendar real** bazat pe Events + Bills + Obligations + Documents
* react-calendar v6, tileContent cu chips color-coded, DayPanel per zi

### Faza D — următoarea

* **Search real global** peste toate entitățile (Events, Documents, Bills, Obligations)

### Faza E — după search

* **Notifications / reminders reale**

### Faza E — fază de maturizare produs

* auth real
* user ownership
* spaces reale
* billing
* eventual sync / automations

---

# Ce trebuie reținut clar pentru conversația următoare

În conversația nouă nu trebuie reluat nimic din:

* fundația Prisma
* migrații
* list/create/detail/edit/delete pentru cele 4 verticale
* standardizarea server-side
* dashboard-ul real — acesta este **finalizat și validat**
* calendarul real — acesta este **finalizat și validat**

Următorul pas NU este:

* refacerea dashboard-ului sau calendarului
* încă un CRUD
* redesign gratuit
* auth
* billing
* spaces
* multi-user

Următorul pas ESTE:

## **Search real global peste toate entitățile (Events, Documents, Bills, Obligations)**

---

# Fișierele cheie ale dashboard-ului (pentru referință)

```text
src/modules/dashboard/lib/dashboard.contracts.ts
src/modules/dashboard/lib/dashboard.api.ts
src/modules/dashboard/server/dashboard.repository.ts
src/app/api/dashboard/route.ts
src/modules/dashboard/screens/HomeScreen/HomeScreen.tsx
src/modules/dashboard/screens/HomeScreen/HomeScreen.css.ts
src/modules/dashboard/components/QuickAddBar/QuickAddBar.tsx
src/modules/dashboard/index.ts
src/app/(app)/home/page.tsx
```

---

# Prompt pentru conversația următoare

```text
Continuăm proiectul LifeDock din F:\KonceptID\lifedock, fără să reluăm ce este deja finalizat și fără presupuneri.

Context fix:
- Stack: Next.js 16 App Router, TypeScript foarte strict, Vanilla Extract only, relative imports only, ESLint flat config, module-first architecture, direcție PWA.
- Prisma 7 funcțional cu SQLite local (dev.db), client în src/server/db/client.ts.
- Migrații aplicate: init_events, add_documents, add_bills, add_obligations.
- Faza A finalizată: 4 verticale CRUD complete (Events, Documents, Bills, Obligations).
- Faza B finalizată: Dashboard / Home real cu agregare cross-module.
  - read-model unificat în src/modules/dashboard/lib/dashboard.contracts.ts
  - repository cu 8 query-uri paralele în src/modules/dashboard/server/dashboard.repository.ts
  - GET /api/dashboard în src/app/api/dashboard/route.ts
  - client-side fetch în src/modules/dashboard/lib/dashboard.api.ts
  - HomeScreen real cu secțiuni: upcoming events, expiring documents, unpaid bills, urgent obligations
  - loading / error / empty states complete
  - typecheck și lint verzi
- Faza C finalizată: Calendar real cu react-calendar v6.
  - src/modules/calendar/ complet (contracts, api, repository, CalendarGrid, DayPanel, CalendarScreen)
  - GET /api/calendar?month=YYYY-MM în src/app/api/calendar/route.ts
  - Chips color-coded inline styles: event=#0ea5e9, bill=#f04438, obligation=#f79009, document=#12b76a
  - Click pe zi → DayPanel cu items reale; click pe item → navigate la detaliu
  - typecheck și lint verzi
- Nu tratăm acum: redesign, auth, billing, spaces, multi-user, alt CRUD.

Scopul fazei D:
- Search real global peste toate entitățile (Events, Documents, Bills, Obligations)

Workflow obligatoriu:
- fără presupuneri
- citim fișierele înainte de orice patch
- patch-uri complete, ready-to-replace
- TypeScript strict, Vanilla Extract only (excepție izolată CalendarGrid chips), relative imports only
- păstrăm disciplina arhitecturală deja stabilită
```
