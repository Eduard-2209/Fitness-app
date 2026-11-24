-- CreateTable
CREATE TABLE "mitglied" (
    "mitglied_nr" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gesperrt_bis" DATETIME
);

-- CreateTable
CREATE TABLE "tarif" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "monatsbeitrag" INTEGER NOT NULL,
    "buchungslimit_monat" INTEGER,
    "storno_frei" BOOLEAN NOT NULL DEFAULT false,
    "einzeltermine_inklusive_monat" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "mitgliedschaft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mitglied_nr" TEXT NOT NULL,
    "tarif_id" INTEGER NOT NULL,
    "gueltig_ab" DATETIME NOT NULL,
    "gueltig_bis" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'aktiv',
    "erstellt_am" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mitgliedschaft_mitglied_nr_fkey" FOREIGN KEY ("mitglied_nr") REFERENCES "mitglied" ("mitglied_nr") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "mitgliedschaft_tarif_id_fkey" FOREIGN KEY ("tarif_id") REFERENCES "tarif" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tarif_name_key" ON "tarif"("name");

-- CreateIndex
CREATE INDEX "mitgliedschaft_mitglied_nr_idx" ON "mitgliedschaft"("mitglied_nr");
