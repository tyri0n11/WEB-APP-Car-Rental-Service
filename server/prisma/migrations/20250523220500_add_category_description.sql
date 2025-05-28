-- Add description column to categories table if it doesn't exist
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "description" TEXT;
