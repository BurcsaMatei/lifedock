-- CreateTable
CREATE TABLE "obligations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "obligations_dueDate_idx" ON "obligations"("dueDate");

-- CreateIndex
CREATE INDEX "obligations_priority_idx" ON "obligations"("priority");

-- CreateIndex
CREATE INDEX "obligations_isCompleted_idx" ON "obligations"("isCompleted");
