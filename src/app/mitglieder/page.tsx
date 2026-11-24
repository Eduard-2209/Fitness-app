import Link from "next/link";
import { connection } from "next/server";
import { Plus, Users } from "lucide-react";
import { listeMitglieder } from "@/lib/mitglieder";
import { formatiereDatum } from "@/lib/format";
import { Badge, Button, Card, LeererZustand, PageHeader } from "@/components/ui";

export const instant = false;

export default async function MitgliederSeite() {
  await connection();
  const stichtag = new Date();
  const mitglieder = await listeMitglieder(stichtag);

  return (
    <>
      <PageHeader
        titel="Mitglieder"
        beschreibung="Alle Mitglieder mit Tarif und Status. Tarif wechseln und Pausen steuerst du im Profil."
        aktion={
          <Link href="/mitglieder/neu">
            <Button>
              <Plus className="size-4" aria-hidden />
              Mitglied anlegen
            </Button>
          </Link>
        }
      />

      {mitglieder.length === 0 ? (
        <LeererZustand
          icon={<Users className="size-6" aria-hidden />}
          titel="Noch keine Mitglieder"
          beschreibung="Sobald du das erste Mitglied anlegst, erscheint es hier mit Tarif und Status."
          aktion={
            <Link href="/mitglieder/neu">
              <Button>
                <Plus className="size-4" aria-hidden />
                Erstes Mitglied anlegen
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-stein-200 text-left text-xs uppercase tracking-wide text-tinte-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Nummer</th>
                <th className="px-5 py-3 font-medium">Tarif</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Gueltig ab</th>
              </tr>
            </thead>
            <tbody>
              {mitglieder.map((mitglied) => {
                const zeile = mitglied.anzeige.zeile;
                const geplant = mitglied.anzeige.art === "geplant";
                return (
                  <tr
                    key={mitglied.mitgliedNr}
                    className="border-b border-stein-200/70 last:border-0 hover:bg-stein-100/60"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/mitglieder/${encodeURIComponent(mitglied.mitgliedNr)}`}
                        className="font-medium text-tinte-900 underline-offset-4 hover:text-akzent-600 hover:underline"
                      >
                        {mitglied.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-tinte-500 tnum">
                      {mitglied.mitgliedNr}
                    </td>
                    <td className="px-5 py-4">
                      {zeile ? (
                        <span className="inline-flex flex-wrap items-center gap-2">
                          <Badge farbe="neutral">{zeile.tarif.name}</Badge>
                          {geplant ? (
                            <span className="text-xs text-tinte-500">
                              ab {formatiereDatum(zeile.gueltigAb)}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span className="text-tinte-300">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {zeile ? (
                        geplant ? (
                          <Badge farbe="geplant">Nicht aktiv</Badge>
                        ) : (
                          <Badge
                            farbe={
                              zeile.status === "pausiert" ? "pausiert" : "aktiv"
                            }
                          >
                            {zeile.status === "pausiert" ? "pausiert" : "aktiv"}
                          </Badge>
                        )
                      ) : (
                        <span className="text-tinte-300">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-tinte-700 tnum">
                      {zeile ? formatiereDatum(zeile.gueltigAb) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
