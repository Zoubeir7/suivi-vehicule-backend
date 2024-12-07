/*
  Warnings:

  - Changed the type of `annee_de_fabrication` on the `vehicules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "vehicules" DROP COLUMN "annee_de_fabrication",
ADD COLUMN     "annee_de_fabrication" INTEGER NOT NULL;
