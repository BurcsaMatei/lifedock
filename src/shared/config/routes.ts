import type { Route } from "next";

export const ROUTES = {
  public: {
    root: "/" as Route,
    pricing: "/pricing" as Route,
    privacy: "/privacy" as Route,
    terms: "/terms" as Route,
    cookies: "/cookies" as Route,
    offline: "/offline" as Route
  },
  auth: {
    login: "/login" as Route,
    signup: "/signup" as Route,
    forgotPassword: "/forgot-password" as Route,
    resetPassword: "/reset-password" as Route,
    verifyEmail: "/verify-email" as Route
  },
  onboarding: {
    mode: "/mode" as Route,
    setup: "/setup" as Route,
    templates: "/templates" as Route,
    notifications: "/notifications" as Route,
    complete: "/complete" as Route
  },
  app: {
    home: "/home" as Route,
    calendar: "/calendar" as Route,
    categories: "/categories" as Route,
    search: "/search" as Route,
    notifications: "/notifications" as Route,
    upgrade: "/upgrade" as Route,
    spaces: "/spaces" as Route,
    documents: "/documents" as Route,
    documentsNew: "/documents/new" as Route,
    events: "/events" as Route,
    eventsNew: "/events/new" as Route,
    bills: "/bills" as Route,
    billsNew: "/bills/new" as Route,
    obligations: "/obligations" as Route,
    obligationsNew: "/obligations/new" as Route,
    settings: "/settings" as Route
  }
} as const;

export const BOTTOM_NAV_ITEMS = [
  {
    href: ROUTES.app.home,
    label: "Acasă"
  },
  {
    href: ROUTES.app.calendar,
    label: "Calendar"
  },
  {
    href: ROUTES.app.categories,
    label: "Categorii"
  },
  {
    href: ROUTES.app.search,
    label: "Caută"
  },
  {
    href: ROUTES.app.spaces,
    label: "Spații"
  }
] as const;