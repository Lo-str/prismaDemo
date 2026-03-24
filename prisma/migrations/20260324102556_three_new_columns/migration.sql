/*
  Warnings:

  - Added the required column `isMarried` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sport` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "isMarried" BOOLEAN NOT NULL,
ADD COLUMN     "sport" TEXT NOT NULL;
