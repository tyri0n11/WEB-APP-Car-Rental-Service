/*
  Warnings:

  - You are about to drop the column `drivingLicenceId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `driving_licences` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_drivingLicenceId_fkey";

-- DropIndex
DROP INDEX "users_drivingLicenceId_key";

-- AlterTable
ALTER TABLE "driving_licences" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "drivingLicenceId";

-- CreateIndex
CREATE UNIQUE INDEX "driving_licences_userId_key" ON "driving_licences"("userId");

-- AddForeignKey
ALTER TABLE "driving_licences" ADD CONSTRAINT "driving_licences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
