const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const datum = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Betrag in Cent als Euro-String, z. B. 3900 -> "39,00 EUR". */
export function formatiereCent(cent: number): string {
  return euro.format(cent / 100);
}

export function formatiereDatum(wert: Date | string | null): string {
  if (wert === null) return "-";
  const d = typeof wert === "string" ? new Date(wert) : wert;
  return datum.format(d);
}

/** Fuer input type=date (yyyy-mm-dd). */
export function alsDateInput(wert: Date | string | null): string {
  if (wert === null) return "";
  const d = typeof wert === "string" ? new Date(wert) : wert;
  const jahr = d.getFullYear();
  const monat = String(d.getMonth() + 1).padStart(2, "0");
  const tag = String(d.getDate()).padStart(2, "0");
  return `${jahr}-${monat}-${tag}`;
}

/** Tarif-Limit als Text, null = unbegrenzt. */
export function formatiereLimit(limit: number | null): string {
  return limit === null ? "unbegrenzt" : `${limit} / Monat`;
}
