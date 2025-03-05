/*
  Warnings:

  - You are about to drop the column `kilomiters` on the `cars` table. All the data in the column will be lost.
  - Added the required column `kilometers` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "kilomiters",
ADD COLUMN     "kilometers" INTEGER NOT NULL;
