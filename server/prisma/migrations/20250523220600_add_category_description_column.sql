-- CreateTable
CREATE TABLE "categories_new" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "categories_new_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_new_name_key" ON "categories_new"("name");

-- Copy data
INSERT INTO "categories_new" ("id", "name", "createdAt", "updatedAt")
SELECT "id", "name", "createdAt", "updatedAt"
FROM "categories";

-- Drop old table and constraints
DROP TABLE "categories";

-- Rename new table
ALTER TABLE "categories_new" RENAME TO "categories";
