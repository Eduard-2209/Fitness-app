// BR2 aus SPEC.md: Vor jeder Buchung prueft das System in dieser Reihenfolge
// Mitgliedschaft aktiv (pausiert: nichts buchbar), Tarif, Buchungen im Monat.
// Basic hoechstens 5 pro Monat ohne Ausnahme, Plus und Premium unbegrenzt.
// Reine Funktion ohne Datenbank, damit jeder Zweig testbar ist.

import {
  MITGLIEDSCHAFT_STATUS,
  type MitgliedschaftStatus,
} from "./mitgliedschaft";

export type BuchungsAblehnungsgrund =
  | "keine_aktive_mitgliedschaft"
  | "mitgliedschaft_pausiert"
  | "buchungslimit_erreicht";

export type Buchungspruefung =
  | { erlaubt: true }
  | { erlaubt: false; grund: BuchungsAblehnungsgrund; meldung: string };

export type TarifFuerBuchung = {
  name: string;
  /** null = unbegrenzt (Plus, Premium) */
  buchungslimitMonat: number | null;
};

export type MitgliedschaftFuerBuchung = {
  status: MitgliedschaftStatus;
  gueltigAb: Date;
  gueltigBis: Date | null;
  tarif: TarifFuerBuchung;
};

export type BuchungspruefungInput = {
  mitgliedschaft: MitgliedschaftFuerBuchung | null;
  /** Zaehlende Buchungen im Kalendermonat (storniert/wartend zaehlen nicht, Annahme) */
  buchungenImMonat: number;
  stichtag?: Date;
};

function ablehnung(
  grund: BuchungsAblehnungsgrund,
  meldung: string,
): Buchungspruefung {
  return { erlaubt: false, grund, meldung };
}

export function pruefeBuchungsvoraussetzungen(
  input: BuchungspruefungInput,
): Buchungspruefung {
  const stichtag = input.stichtag ?? new Date();
  const { mitgliedschaft, buchungenImMonat } = input;

  // 1. Mitgliedschaft aktiv?
  if (!mitgliedschaft) {
    return ablehnung(
      "keine_aktive_mitgliedschaft",
      "Fuer dieses Mitglied gibt es keine Mitgliedschaft.",
    );
  }
  const imZeitraum =
    mitgliedschaft.gueltigAb <= stichtag &&
    (mitgliedschaft.gueltigBis === null || stichtag < mitgliedschaft.gueltigBis);
  if (!imZeitraum) {
    return ablehnung(
      "keine_aktive_mitgliedschaft",
      "Die Mitgliedschaft gilt zu diesem Zeitpunkt nicht.",
    );
  }

  // Pausiert: nichts buchbar.
  if (mitgliedschaft.status === MITGLIEDSCHAFT_STATUS.PAUSIERT) {
    return ablehnung(
      "mitgliedschaft_pausiert",
      "Die Mitgliedschaft ist pausiert. Waehrend der Pause ist nichts buchbar.",
    );
  }

  // 2./3. Tarif und Buchungen im Monat.
  const limit = mitgliedschaft.tarif.buchungslimitMonat;
  if (limit !== null && buchungenImMonat >= limit) {
    return ablehnung(
      "buchungslimit_erreicht",
      `Im Tarif ${mitgliedschaft.tarif.name} sind ${limit} Buchungen pro Monat enthalten.`,
    );
  }

  return { erlaubt: true };
}
