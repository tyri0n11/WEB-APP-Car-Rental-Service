/*
  Warnings:

  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "userId",
ADD COLUMN     "bookingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
