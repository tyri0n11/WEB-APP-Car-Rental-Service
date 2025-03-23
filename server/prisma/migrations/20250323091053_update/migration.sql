/*
  Warnings:

  - A unique constraint covering the columns `[licensePlate]` on the table `cars` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cars_licensePlate_key" ON "cars"("licensePlate");
