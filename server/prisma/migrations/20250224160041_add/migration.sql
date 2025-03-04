/*
  Warnings:

  - You are about to drop the column `drivingLicence` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[drivingLicenceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "drivingLicence",
ADD COLUMN     "drivingLicenceId" TEXT;

-- CreateTable
CREATE TABLE "driving_licences" (
    "id" TEXT NOT NULL,
    "licenceNumber" TEXT NOT NULL,
    "drivingLicenseImages" TEXT[],
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driving_licences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_drivingLicenceId_key" ON "users"("drivingLicenceId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_drivingLicenceId_fkey" FOREIGN KEY ("drivingLicenceId") REFERENCES "driving_licences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
