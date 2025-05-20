-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('BOOKING', 'RETURN', 'PAYMENT', 'CAR_ADDED', 'CAR_UPDATED');

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ActivityType" NOT NULL,
    "bookingId" TEXT,
    "carId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "metadata" JSONB,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_createdAt_idx" ON "activities"("createdAt");

-- CreateIndex
CREATE INDEX "activities_bookingId_idx" ON "activities"("bookingId");

-- CreateIndex
CREATE INDEX "activities_carId_idx" ON "activities"("carId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
