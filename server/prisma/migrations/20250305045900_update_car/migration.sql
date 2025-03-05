/*
  Warnings:

  - You are about to drop the column `mileage` on the `cars` table. All the data in the column will be lost.
  - Added the required column `kilomiters` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "mileage",
ADD COLUMN     "kilomiters" INTEGER NOT NULL;
