/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id]` on the table `patterns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "user_profile_img_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "compound_unique_pattern_id_user_id" ON "patterns"("id", "user_id");
