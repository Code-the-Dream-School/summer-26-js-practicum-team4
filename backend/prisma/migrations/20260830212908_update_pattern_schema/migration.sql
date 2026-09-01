/*
  Warnings:

  - You are about to drop the column `max_colors` on the `patterns` table. All the data in the column will be lost.
  - Added the required column `grid` to the `patterns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palette` to the `patterns` table without a default value. This is not possible if the table is not empty.
  - Made the column `stitch_height` on table `patterns` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stitch_width` on table `patterns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "patterns" DROP COLUMN "max_colors",
ADD COLUMN     "grid" JSONB NOT NULL,
ADD COLUMN     "palette" JSONB NOT NULL,
ALTER COLUMN "original_img_url" DROP NOT NULL,
ALTER COLUMN "pattern_img_url" DROP NOT NULL,
ALTER COLUMN "stitch_height" SET NOT NULL,
ALTER COLUMN "stitch_width" SET NOT NULL;
