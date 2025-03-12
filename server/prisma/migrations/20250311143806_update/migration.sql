/*
  Warnings:

  - A unique constraint covering the columns `[userId,preference]` on the table `user_preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_preference_key" ON "user_preferences"("userId", "preference");
