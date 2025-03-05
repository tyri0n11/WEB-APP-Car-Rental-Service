/*
  Warnings:

  - Added the required column `address` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoGearbox` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numSeats` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('DIESEL', 'PETROL', 'ELECTRIC', 'HYBRID');

-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "autoGearbox" BOOLEAN NOT NULL,
ADD COLUMN     "fuelType" "FuelType" NOT NULL,
ADD COLUMN     "numSeats" INTEGER NOT NULL;
