// Fachliche Regeln rund um Mitglied und Mitgliedschaft (SPEC.md, Feature F-001).
// Bewusst ohne Prisma-Abhaengigkeit, damit die Regeln ohne Datenbank testbar sind.

export const MITGLIEDSCHAFT_STATUS = {
  AKTIV: "aktiv",
  PAUSIERT: "pausiert",
} as const;

export type MitgliedschaftStatus =
  (typeof MITGLIEDSCHAFT_STATUS)[keyof typeof MITGLIEDSCHAFT_STATUS];

export function istMitgliedschaftStatus(
  wert: string,
): wert is MitgliedschaftStatus {
  return (
    wert === MITGLIEDSCHAFT_STATUS.AKTIV ||
    wert === MITGLIEDSCHAFT_STATUS.PAUSIERT
  );
}

export const TARIF_NAMEN = ["Basic", "Plus", "Premium"] as const;
export type TarifName = (typeof TARIF_NAMEN)[number];

/**
 * Eine Mitgliedschaftszeile in der Form, die die Regeln brauchen.
 * `status` bleibt hier bewusst `string`, weil die Zeilen direkt aus der
 * Datenbank kommen; `istMitgliedschaftStatus` validiert Eingaben.
 */
export type MitgliedschaftsZeile = {
  id: number;
  tarifId: number;
  gueltigAb: Date;
  gueltigBis: Date | null;
  status: string;
};

/**
 * Deckt die Zeile den Stichtag ab? Das Intervall ist halboffen:
 * [gueltigAb, gueltigBis). So ueberlappt ein Tarifwechsel am Stichtag nicht.
 */
export function decktAb(
  zeile: Pick<MitgliedschaftsZeile, "gueltigAb" | "gueltigBis">,
  stichtag: Date,
): boolean {
  return (
    zeile.gueltigAb <= stichtag &&
    (zeile.gueltigBis === null || stichtag < zeile.gueltigBis)
  );
}

/** Die aktuell gueltige Mitgliedschaft am Stichtag (juengste, falls mehrere). */
export function aktuelleMitgliedschaft<T extends MitgliedschaftsZeile>(
  zeilen: T[],
  stichtag: Date = new Date(),
): T | null {
  return (
    zeilen
      .filter((zeile) => decktAb(zeile, stichtag))
      .sort((a, b) => b.gueltigAb.getTime() - a.gueltigAb.getTime())[0] ?? null
  );
}

/**
 * Anzeige-Zustand fuer Listen und Profile:
 * - `aktiv`: es gibt eine am Stichtag gueltige Zeile (aktiv oder pausiert)
 * - `geplant`: keine gueltige Zeile, aber eine kuenftige (startet spaeter)
 * - `keine`: weder gueltig noch kuenftig
 */
export type MitgliedschaftsAnzeige<T extends MitgliedschaftsZeile> =
  | { art: "aktiv"; zeile: T }
  | { art: "geplant"; zeile: T }
  | { art: "keine"; zeile: null };

export function anzeigeMitgliedschaft<T extends MitgliedschaftsZeile>(
  zeilen: T[],
  stichtag: Date = new Date(),
): MitgliedschaftsAnzeige<T> {
  const aktuelle = aktuelleMitgliedschaft(zeilen, stichtag);
  if (aktuelle) {
    return { art: "aktiv", zeile: aktuelle };
  }
  const naechste = zeilen
    .filter((zeile) => zeile.gueltigAb > stichtag)
    .sort((a, b) => a.gueltigAb.getTime() - b.gueltigAb.getTime())[0];
  if (naechste) {
    return { art: "geplant", zeile: naechste };
  }
  return { art: "keine", zeile: null };
}

/** Beginnt die Zeile erst nach dem Stichtag? (fuer "Nicht aktiv" in der Historie) */
export function istKuenftig(
  zeile: Pick<MitgliedschaftsZeile, "gueltigAb">,
  stichtag: Date = new Date(),
): boolean {
  return zeile.gueltigAb > stichtag;
}

export type TarifwechselPlan =
  | { art: "unveraendert" }
  | {
      art: "wechsel";
      schliessen: { id: number; gueltigBis: Date };
      neu: { tarifId: number; gueltigAb: Date };
    }
  | { art: "fehler"; meldung: string };

/**
 * Plant einen Tarifwechsel (SPEC: neue Rechte ab Stichtag, Historie bleibt).
 * Die alte Mitgliedschaft endet am Stichtag, die neue beginnt am Stichtag.
 */
export function planeTarifwechsel(input: {
  mitgliedschaften: MitgliedschaftsZeile[];
  neuerTarifId: number;
  stichtag: Date;
}): TarifwechselPlan {
  const aktuelle = aktuelleMitgliedschaft(input.mitgliedschaften, input.stichtag);
  if (!aktuelle) {
    return {
      art: "fehler",
      meldung: "Es gibt keine gueltige Mitgliedschaft, die gewechselt werden kann.",
    };
  }
  if (aktuelle.tarifId === input.neuerTarifId) {
    return { art: "unveraendert" };
  }
  return {
    art: "wechsel",
    schliessen: { id: aktuelle.id, gueltigBis: input.stichtag },
    neu: { tarifId: input.neuerTarifId, gueltigAb: input.stichtag },
  };
}

/** Ziel-Status fuer Pause/Fortsetzen (SPEC-Annahme: Lisa setzt die Pause). */
export function statusNachPause(pausieren: boolean): MitgliedschaftStatus {
  return pausieren
    ? MITGLIEDSCHAFT_STATUS.PAUSIERT
    : MITGLIEDSCHAFT_STATUS.AKTIV;
}
