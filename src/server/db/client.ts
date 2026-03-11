import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../../generated/prisma/client";

declare global {
  var __lifedockPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db"
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });
}

export const db: PrismaClient =
  globalThis.__lifedockPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__lifedockPrisma = db;
}