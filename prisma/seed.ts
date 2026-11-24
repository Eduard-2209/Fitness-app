// Seed fuer FitZone Berlin: legt die drei Tarife an (Testwerte aus SPEC.md).
// Idempotent: upsert per Tarifname, damit mehrfaches Ausfuehren nichts kaputt macht.
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

const tarife = [
  {
    name: "Basic",
    monatsbeitrag: 3900,
    buchungslimitMonat: 5,
    stornoFrei: false,
    einzeltermineInklusiveMonat: 0,
  },
  {
    name: "Plus",
    monatsbeitrag: 5900,
    buchungslimitMonat: null,
    stornoFrei: false,
    einzeltermineInklusiveMonat: 0,
  },
  {
    name: "Premium",
    monatsbeitrag: 8900,
    buchungslimitMonat: null,
    stornoFrei: true,
    einzeltermineInklusiveMonat: 1,
  },
];

async function main() {
  for (const tarif of tarife) {
    await prisma.tarif.upsert({
      where: { name: tarif.name },
      update: {
        monatsbeitrag: tarif.monatsbeitrag,
        buchungslimitMonat: tarif.buchungslimitMonat,
        stornoFrei: tarif.stornoFrei,
        einzeltermineInklusiveMonat: tarif.einzeltermineInklusiveMonat,
      },
      create: tarif,
    });
  }
  console.log(`Seed fertig: ${tarife.length} Tarife.`);
}

main()
  .catch((fehler) => {
    console.error(fehler);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
