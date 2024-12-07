/*
  Warnings:

  - The `kilometrage` column on the `vehicules` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "vehicules" DROP COLUMN "kilometrage",
ADD COLUMN     "kilometrage" INTEGER;
