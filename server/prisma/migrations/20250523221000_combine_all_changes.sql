-- Drop old enum values
ALTER TYPE "ActivityType" DROP VALUE IF EXISTS 'BOOKING';
ALTER TYPE "ActivityType" DROP VALUE IF EXISTS 'RETURN';
ALTER TYPE "ActivityType" DROP VALUE IF EXISTS 'PAYMENT';
ALTER TYPE "ActivityType" DROP VALUE IF EXISTS 'CAR_ADDED';
ALTER TYPE "ActivityType" DROP VALUE IF EXISTS 'CAR_UPDATED';

-- Add new enum values
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'USER_REGISTERED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CAR_CREATED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CAR_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CAR_DELETED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_CREATED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_UPDATED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_CANCELLED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'BOOKING_COMPLETED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'PAYMENT_COMPLETED';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'REVIEW_ADDED';

-- Update PaymentProvider enum
ALTER TYPE "PaymentProvider" DROP VALUE IF EXISTS 'ZALOPAY';

-- Update activities table
ALTER TABLE "activities" 
ADD COLUMN IF NOT EXISTS "bookingId" TEXT,
ADD COLUMN IF NOT EXISTS "carId" TEXT,
ADD COLUMN IF NOT EXISTS "amount" DECIMAL,
ADD COLUMN IF NOT EXISTS "title" TEXT,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Recreate categories table with description
CREATE TABLE "categories_new" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "categories_new_pkey" PRIMARY KEY ("id")
);

-- Create new index
CREATE UNIQUE INDEX "categories_new_name_key" ON "categories_new"("name");

-- Copy existing data
INSERT INTO "categories_new" ("id", "name", "createdAt", "updatedAt")
SELECT "id", "name", "createdAt", "updatedAt"
FROM "categories";

-- Drop old constraints first
ALTER TABLE "car_categories" DROP CONSTRAINT IF EXISTS "car_categories_categoryId_fkey";

-- Drop old table and rename new one
DROP TABLE "categories";
ALTER TABLE "categories_new" RENAME TO "categories";

-- Recreate foreign key constraint
ALTER TABLE "car_categories" 
ADD CONSTRAINT "car_categories_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update point_history table constraints
ALTER TABLE "point_history"
  DROP CONSTRAINT IF EXISTS "point_history_userId_fkey",
  DROP CONSTRAINT IF EXISTS "point_history_rewardId_fkey",
  DROP CONSTRAINT IF EXISTS "point_history_membership_userId_fkey",
  ADD CONSTRAINT "ph_user_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "ph_reward_fkey" FOREIGN KEY ("rewardId") REFERENCES "rewards"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "ph_membership_fkey" FOREIGN KEY ("userId") REFERENCES "memberships"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
