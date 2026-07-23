/*
  Warnings:

  - Added the required column `updated_at` to the `patterns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patterns" ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL;
