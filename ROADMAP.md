# ROADMAP.md — lifedock

**Stand-by din 2026-04-11** (ultimul commit de feature). Reluare planificată, fără termen.

## Finalizate

| Fază | Conținut |
| --- | --- |
| **A** | Fundație, Prisma, 4 verticale CRUD complete (Events, Documents, Bills, Obligations) |
| **B** | Dashboard / Home real, agregare cross-module |
| **C** | Calendar real (react-calendar v6, chips color-coded, DayPanel) |
| **D** | Search real global (modal, debounce, grupat pe entități) |

Detalii de implementare pe fiecare fază: [`CHANGELOG.md`](./CHANGELOG.md).

## Următoarea

**Faza E — Notifications / reminders reale.**

## Fază de maturizare produs (după Faza E, fără ordine fixă)

- auth real + multi-user ownership
- spaces reale cu ownership / grouping logic
- billing real
- upload logic real pentru documente
- sync extern / automations / cron logic real

## Ce NU se reia la reluarea proiectului

Fundația Prisma, migrațiile, CRUD-urile celor 4 verticale, dashboard-ul, calendarul, search-ul —
toate finalizate și validate (typecheck + lint verzi). Următorul pas nu e redesign, alt CRUD, auth,
billing sau spaces — e Notifications/reminders.
