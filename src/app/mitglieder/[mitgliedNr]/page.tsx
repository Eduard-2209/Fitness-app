import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, CalendarCheck, Clock, Pause, Play } from "lucide-react";
import { ladeMitglied, listeTarife } from "@/lib/mitglieder";
import { anzeigeMitgliedschaft, istKuenftig } from "@/lib/mitgliedschaft";
import { formatiereCent, formatiereDatum, formatiereLimit } from "@/lib/format";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import {
  pauseUmschaltenAction,
  tarifWechselnAction,
} from "../actions";

export const instant = false;

export default async function MitgliedProfil({
  params,
}: PageProps<"/mitglieder/[mitgliedNr]">) {
  await connection();
  const { mitgliedNr } = await params;
  const [mitglied, tarife] = await Promise.all([
    ladeMitglied(decodeURIComponent(mitgliedNr)),
    listeTarife(),
  ]);

  if (!mitglied) {
    notFound();
  }

  const stichtag = new Date();
  const anzeige = anzeigeMitgliedschaft(mitglied.mitgliedschaften, stichtag);
  const zeile = anzeige.zeile;
  const geplant = anzeige.art === "geplant";
  const hatAktive = anzeige.art === "aktiv";
  const pausiert = hatAktive && zeile?.status === "pausiert";

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
        titel={mitglied.name}
        beschreibung={`Mitgliedsnummer ${mitglied.mitgliedNr}`}
        aktion={
          zeile ? (
            geplant ? (
              <Badge farbe="geplant">Nicht aktiv</Badge>
            ) : (
              <Badge farbe={pausiert ? "pausiert" : "aktiv"}>
                {pausiert ? "pausiert" : "aktiv"}
              </Badge>
            )
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-tinte-900">
            {geplant ? "Geplanter Tarif" : "Aktueller Tarif"}
          </h2>
          {zeile ? (
            <>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-tinte-900">
                  {zeile.tarif.name}
                </span>
                <span className="text-tinte-700 tnum">
                  {formatiereCent(zeile.tarif.monatsbeitrag)} / Monat
                </span>
              </div>
              {geplant ? (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-akzent-50 px-4 py-3 text-sm text-akzent-700">
                  <Clock className="size-4 shrink-0" aria-hidden />
                  Dieser Tarif ist noch nicht aktiv. Er gilt ab{" "}
                  {formatiereDatum(zeile.gueltigAb)}.
                </p>
              ) : null}
              <dl className="mt-5 space-y-2 text-sm">
                <Zeile
                  label="Buchungslimit"
                  wert={formatiereLimit(zeile.tarif.buchungslimitMonat)}
                />
                <Zeile
                  label="Storno"
                  wert={
                    zeile.tarif.stornoFrei ? "kostenfrei" : "8,00 EUR Gebuehr"
                  }
                />
                <Zeile
                  label="Einzeltermine inklusive"
                  wert={`${zeile.tarif.einzeltermineInklusiveMonat} / Monat`}
                />
                <Zeile
                  label="Gueltig ab"
                  wert={formatiereDatum(zeile.gueltigAb)}
                />
              </dl>
            </>
          ) : (
            <p className="mt-3 text-sm text-tinte-500">
              Fuer dieses Mitglied gibt es weder eine gueltige noch eine
              geplante Mitgliedschaft.
            </p>
          )}
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-tinte-900">Verwalten</h2>

          {!hatAktive ? (
            <p className="mt-4 rounded-xl bg-stein-200/60 px-4 py-3 text-sm text-tinte-700">
              {geplant
                ? `Tarifwechsel und Pause sind moeglich, sobald der Tarif ab ${formatiereDatum(
                    zeile?.gueltigAb ?? null,
                  )} aktiv ist.`
                : "Tarifwechsel und Pause sind erst mit einer aktiven Mitgliedschaft moeglich."}
            </p>
          ) : (
            <>
          <form action={tarifWechselnAction} className="mt-4 space-y-3">
            <input type="hidden" name="mitgliedNr" value={mitglied.mitgliedNr} />
            <label
              htmlFor="tarifId"
              className="block text-sm font-medium text-tinte-700"
            >
              Tarif wechseln
            </label>
            <select
              id="tarifId"
              name="tarifId"
              defaultValue={zeile?.tarifId ?? ""}
              className="w-full rounded-xl border border-stein-300 bg-stein-50 px-4 py-2.5 text-sm text-tinte-900 outline-none transition focus:border-akzent-500 focus:ring-2 focus:ring-akzent-500/25"
            >
              {tarife.map((tarif) => (
                <option key={tarif.id} value={tarif.id}>
                  {tarif.name} - {formatiereCent(tarif.monatsbeitrag)}
                </option>
              ))}
            </select>
            <p className="text-xs text-tinte-500">
              Der Wechsel gilt ab heute, die bisherige Mitgliedschaft wird in der
              Historie geschlossen.
            </p>
            <Button type="submit" variant="secondary">
              <CalendarCheck className="size-4" aria-hidden />
              Tarif wechseln
            </Button>
          </form>

          <div className="my-6 border-t border-stein-200" />

          <form action={pauseUmschaltenAction}>
            <input type="hidden" name="mitgliedNr" value={mitglied.mitgliedNr} />
            <input
              type="hidden"
              name="pausieren"
              value={pausiert ? "false" : "true"}
            />
            <p className="mb-3 text-sm text-tinte-700">
              {pausiert
                ? "Die Mitgliedschaft ist pausiert. Waehrend der Pause ist nichts buchbar."
                : "Pausiere die Mitgliedschaft, um Buchungen voruebergehend zu sperren."}
            </p>
            <Button type="submit" variant="ghost">
              {pausiert ? (
                <>
                  <Play className="size-4" aria-hidden />
                  Mitgliedschaft fortsetzen
                </>
              ) : (
                <>
                  <Pause className="size-4" aria-hidden />
                  Mitgliedschaft pausieren
                </>
              )}
            </Button>
          </form>
            </>
          )}
        </Card>
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold text-tinte-900">
        Verlauf
      </h2>
      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stein-200 text-left text-xs uppercase tracking-wide text-tinte-500">
              <th className="px-5 py-3 font-medium">Tarif</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Gueltig ab</th>
              <th className="px-5 py-3 text-right font-medium">Gueltig bis</th>
            </tr>
          </thead>
          <tbody>
            {mitglied.mitgliedschaften.map((eintrag) => {
              const kuenftig = istKuenftig(eintrag, stichtag);
              return (
                <tr
                  key={eintrag.id}
                  className="border-b border-stein-200/70 last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-tinte-900">
                    {eintrag.tarif.name}
                  </td>
                  <td className="px-5 py-4">
                    {kuenftig ? (
                      <Badge farbe="geplant">Nicht aktiv</Badge>
                    ) : (
                      <Badge
                        farbe={
                          eintrag.status === "pausiert" ? "pausiert" : "aktiv"
                        }
                      >
                        {eintrag.status}
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-tinte-700 tnum">
                    {formatiereDatum(eintrag.gueltigAb)}
                  </td>
                  <td className="px-5 py-4 text-right text-tinte-700 tnum">
                    {eintrag.gueltigBis
                      ? formatiereDatum(eintrag.gueltigBis)
                      : "offen"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Zeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex items-center justify-between border-b border-stein-200/70 pb-2 last:border-0">
      <dt className="text-tinte-500">{label}</dt>
      <dd className="text-tinte-900 tnum">{wert}</dd>
    </div>
  );
}
