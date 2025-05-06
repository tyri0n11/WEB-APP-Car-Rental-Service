/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_code_key" ON "bookings"("code");
