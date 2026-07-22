/*
  Warnings:

  - You are about to drop the column `createdAt` on the `patterns` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `patterns` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `pattern_name` to the `patterns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patterns" DROP CONSTRAINT "patterns_user_id_fkey";

-- AlterTable
ALTER TABLE "patterns" DROP COLUMN "createdAt",
DROP COLUMN "title",
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pattern_name" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "user_name" VARCHAR(30) NOT NULL;

-- AddForeignKey
ALTER TABLE "patterns" ADD CONSTRAINT "patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
