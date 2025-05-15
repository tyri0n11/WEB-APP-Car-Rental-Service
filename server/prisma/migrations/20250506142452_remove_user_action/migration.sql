/*
  Warnings:

  - You are about to drop the `user_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_actions" DROP CONSTRAINT "user_actions_carId_fkey";

-- DropForeignKey
ALTER TABLE "user_actions" DROP CONSTRAINT "user_actions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_userId_fkey";

-- DropTable
DROP TABLE "user_actions";

-- DropTable
DROP TABLE "user_preferences";
