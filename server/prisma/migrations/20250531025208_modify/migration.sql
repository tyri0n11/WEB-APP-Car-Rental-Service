/*
  Warnings:

  - You are about to drop the column `bookingId` on the `activities` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_bookingId_fkey";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "bookingId";
