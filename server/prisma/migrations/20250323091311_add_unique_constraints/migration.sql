/*
  Warnings:

  - A unique constraint covering the columns `[carId,categoryId]` on the table `car_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carId,url]` on the table `car_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "car_categories_carId_categoryId_key" ON "car_categories"("carId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "car_images_carId_url_key" ON "car_images"("carId", "url");
