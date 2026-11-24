// Datenschicht fuer F-001: Mitglieder lesen und schreiben.
// Fachliche Regeln liegen in mitgliedschaft.ts / buchungsregeln.ts.

import { prisma } from "./prisma";
import {
  aktuelleMitgliedschaft,
  anzeigeMitgliedschaft,
  planeTarifwechsel,
  statusNachPause,
} from "./mitgliedschaft";

export type MitgliedMitDetails = Awaited<
  ReturnType<typeof ladeMitglied>
>;

export async function listeMitglieder(stichtag: Date) {
  const mitglieder = await prisma.mitglied.findMany({
    orderBy: { mitgliedNr: "asc" },
    include: {
      mitgliedschaften: {
        orderBy: { gueltigAb: "asc" },
        include: { tarif: true },
      },
    },
  });
  return mitglieder.map((mitglied) => ({
    ...mitglied,
    anzeige: anzeigeMitgliedschaft(mitglied.mitgliedschaften, stichtag),
  }));
}

export async function ladeMitglied(mitgliedNr: string) {
  return prisma.mitglied.findUnique({
    where: { mitgliedNr },
    include: {
      mitgliedschaften: {
        orderBy: { gueltigAb: "desc" },
        include: { tarif: true },
      },
    },
  });
}

export async function listeTarife() {
  return prisma.tarif.findMany({ orderBy: { monatsbeitrag: "asc" } });
}

export async function legeMitgliedAn(input: {
  mitgliedNr: string;
  name: string;
  tarifId: number;
  gueltigAb: Date;
}) {
  return prisma.mitglied.create({
    data: {
      mitgliedNr: input.mitgliedNr,
      name: input.name,
      mitgliedschaften: {
        create: {
          tarifId: input.tarifId,
          gueltigAb: input.gueltigAb,
          status: "aktiv",
        },
      },
    },
  });
}

/**
 * Tarifwechsel: schliesst die aktuelle Mitgliedschaft am Stichtag und legt eine
 * neue Zeile an (SPEC: neue Rechte ab Stichtag, Historie bleibt erhalten).
 */
export async function wechsleTarif(input: {
  mitgliedNr: string;
  neuerTarifId: number;
  stichtag?: Date;
}) {
  const stichtag = input.stichtag ?? new Date();
  const mitglied = await ladeMitglied(input.mitgliedNr);
  if (!mitglied) {
    throw new Error("Mitglied nicht gefunden.");
  }
  const plan = planeTarifwechsel({
    mitgliedschaften: mitglied.mitgliedschaften,
    neuerTarifId: input.neuerTarifId,
    stichtag,
  });
  if (plan.art === "unveraendert") {
    return { art: "unveraendert" as const };
  }
  if (plan.art === "fehler") {
    throw new Error(plan.meldung);
  }
  await prisma.$transaction([
    prisma.mitgliedschaft.update({
      where: { id: plan.schliessen.id },
      data: { gueltigBis: plan.schliessen.gueltigBis },
    }),
    prisma.mitgliedschaft.create({
      data: {
        mitgliedNr: input.mitgliedNr,
        tarifId: plan.neu.tarifId,
        gueltigAb: plan.neu.gueltigAb,
        status: "aktiv",
      },
    }),
  ]);
  return { art: "wechsel" as const };
}

/** Pause setzen oder aufheben (SPEC-Annahme: Lisa steuert die Pause). */
export async function setzePause(input: {
  mitgliedNr: string;
  pausieren: boolean;
}) {
  const mitglied = await ladeMitglied(input.mitgliedNr);
  if (!mitglied) {
    throw new Error("Mitglied nicht gefunden.");
  }
  const aktuelle = aktuelleMitgliedschaft(mitglied.mitgliedschaften);
  if (!aktuelle) {
    throw new Error("Es gibt keine gueltige Mitgliedschaft.");
  }
  await prisma.mitgliedschaft.update({
    where: { id: aktuelle.id },
    data: { status: statusNachPause(input.pausieren) },
  });
}
