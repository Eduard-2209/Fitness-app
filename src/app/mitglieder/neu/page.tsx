import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { listeTarife } from "@/lib/mitglieder";
import { MitgliedFormular } from "@/components/mitglied-formular";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function NeuesMitgliedSeite() {
  await connection();
  const tarife = await listeTarife();

  return (
    <>
      <Link
        href="/mitglieder"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-tinte-500 hover:text-akzent-600"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Zurueck zu den Mitgliedern
      </Link>
      <PageHeader
        titel="Mitglied anlegen"
        beschreibung="Neues Mitglied mit Name, Mitgliedsnummer und Tarif aufnehmen."
      />
      <MitgliedFormular tarife={tarife} />
    </>
  );
}
