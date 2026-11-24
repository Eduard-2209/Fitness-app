"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  legeMitgliedAn,
  setzePause,
  wechsleTarif,
} from "@/lib/mitglieder";

export type FormularZustand = {
  fehler?: string;
  felder?: Record<string, string>;
};

function alsDatum(wert: FormDataEntryValue | null): Date | null {
  if (typeof wert !== "string" || wert.trim() === "") return null;
  const datum = new Date(`${wert}T00:00:00`);
  return Number.isNaN(datum.getTime()) ? null : datum;
}

export async function mitgliedAnlegenAction(
  _zustand: FormularZustand,
  formData: FormData,
): Promise<FormularZustand> {
  const mitgliedNr = String(formData.get("mitgliedNr") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const tarifId = Number(formData.get("tarifId"));
  const gueltigAb = alsDatum(formData.get("gueltigAb"));

  const felder: Record<string, string> = {};
  if (mitgliedNr === "") felder.mitgliedNr = "Bitte eine Mitgliedsnummer angeben.";
  if (name === "") felder.name = "Bitte einen Namen angeben.";
  if (!Number.isInteger(tarifId) || tarifId <= 0) {
    felder.tarifId = "Bitte einen Tarif waehlen.";
  }
  if (gueltigAb === null) {
    felder.gueltigAb = "Bitte ein gueltiges Datum waehlen.";
  }
  if (Object.keys(felder).length > 0) {
    return { fehler: "Bitte die markierten Felder pruefen.", felder };
  }

  try {
    await legeMitgliedAn({
      mitgliedNr,
      name,
      tarifId,
      gueltigAb: gueltigAb as Date,
    });
  } catch (fehler) {
    const meldung =
      fehler instanceof Error && fehler.message.includes("Unique")
        ? "Diese Mitgliedsnummer ist schon vergeben."
        : "Das Mitglied konnte nicht angelegt werden.";
    return { fehler: meldung, felder: { mitgliedNr } };
  }

  revalidatePath("/mitglieder");
  redirect(`/mitglieder/${encodeURIComponent(mitgliedNr)}`);
}

export async function tarifWechselnAction(formData: FormData) {
  const mitgliedNr = String(formData.get("mitgliedNr") ?? "");
  const tarifId = Number(formData.get("tarifId"));
  if (mitgliedNr === "" || !Number.isInteger(tarifId) || tarifId <= 0) return;
  await wechsleTarif({ mitgliedNr, neuerTarifId: tarifId });
  revalidatePath(`/mitglieder/${encodeURIComponent(mitgliedNr)}`);
  revalidatePath("/mitglieder");
}

export async function pauseUmschaltenAction(formData: FormData) {
  const mitgliedNr = String(formData.get("mitgliedNr") ?? "");
  const pausieren = formData.get("pausieren") === "true";
  if (mitgliedNr === "") return;
  await setzePause({ mitgliedNr, pausieren });
  revalidatePath(`/mitglieder/${encodeURIComponent(mitgliedNr)}`);
  revalidatePath("/mitglieder");
}
