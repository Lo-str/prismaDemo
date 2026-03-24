/*
  Warnings:

  - You are about to drop the column `sport` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sport",
ADD COLUMN     "languages" TEXT[];
