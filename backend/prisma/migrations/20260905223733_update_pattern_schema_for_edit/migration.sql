/*
  Warnings:

  - Added the required column `og_stitch_height` to the `patterns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `og_stitch_width` to the `patterns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_grid` to the `patterns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patterns" ADD COLUMN     "og_stitch_height" INTEGER NOT NULL,
ADD COLUMN     "og_stitch_width" INTEGER NOT NULL,
ADD COLUMN     "original_grid" JSONB NOT NULL;
