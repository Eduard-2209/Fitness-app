/** Kleiner Klassen-Helfer: kombiniert Tailwind-Klassen, filtert Falsy-Werte. */
export function cn(...werte: Array<string | false | null | undefined>): string {
  return werte.filter(Boolean).join(" ");
}
