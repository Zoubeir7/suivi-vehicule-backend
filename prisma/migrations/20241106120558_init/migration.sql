-- CreateEnum
CREATE TYPE "UtilisateurRole" AS ENUM ('ADMIN', 'GESTIONNAIRE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UtilisateurRole" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeEntretiens" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "utilisateurId" INTEGER,

    CONSTRAINT "typeEntretiens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicules" (
    "id" SERIAL NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "annee_de_fabrication" TIMESTAMP(3) NOT NULL,
    "type_de_carburant" TEXT NOT NULL,
    "kilometrage" TEXT,
    "statut" TEXT NOT NULL,
    "utilisateurId" INTEGER,

    CONSTRAINT "vehicules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" SERIAL NOT NULL,
    "date_incident" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "gravite" TEXT NOT NULL,
    "entretien_requis" BOOLEAN NOT NULL DEFAULT false,
    "statut" TEXT NOT NULL,
    "vehiculeId" INTEGER,
    "utilisateurId" INTEGER,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "debut_validite" TIMESTAMP(3) NOT NULL,
    "fin_validite" TIMESTAMP(3) NOT NULL,
    "cout" DECIMAL(10,2) NOT NULL,
    "renouvellement" TIMESTAMP(3) NOT NULL,
    "vehiculeId" INTEGER,
    "utilisateurId" INTEGER,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entretiens" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cout" DECIMAL(10,2) NOT NULL,
    "utilisateurId" INTEGER,
    "typeEntretienId" INTEGER,
    "vehiculeId" INTEGER,

    CONSTRAINT "entretiens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_telephone_key" ON "utilisateurs"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "typeEntretiens_nom_key" ON "typeEntretiens"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "vehicules_immatriculation_key" ON "vehicules"("immatriculation");

-- AddForeignKey
ALTER TABLE "typeEntretiens" ADD CONSTRAINT "typeEntretiens_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicules" ADD CONSTRAINT "vehicules_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "vehicules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "vehicules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entretiens" ADD CONSTRAINT "entretiens_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entretiens" ADD CONSTRAINT "entretiens_typeEntretienId_fkey" FOREIGN KEY ("typeEntretienId") REFERENCES "typeEntretiens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entretiens" ADD CONSTRAINT "entretiens_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "vehicules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
