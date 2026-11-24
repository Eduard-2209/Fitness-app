"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import {
  mitgliedAnlegenAction,
  type FormularZustand,
} from "@/app/mitglieder/actions";
import { Button, Card } from "@/components/ui";
import { alsDateInput, formatiereCent, formatiereLimit } from "@/lib/format";
import { cn } from "@/lib/cn";

type TarifOption = {
  id: number;
  name: string;
  monatsbeitrag: number;
  buchungslimitMonat: number | null;
};

const initialState: FormularZustand = {};

export function MitgliedFormular({ tarife }: { tarife: TarifOption[] }) {
  const [zustand, formAction, laeuft] = useActionState(
    mitgliedAnlegenAction,
    initialState,
  );
  // Heutiges Datum bewusst im Client, damit die Seite prerendern kann.
  const [heute] = useState(() => alsDateInput(new Date()));
  const felder = zustand.felder ?? {};

  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <form action={formAction} className="space-y-6">
        {zustand.fehler ? (
          <p className="flex items-center gap-2 rounded-xl bg-akzent-50 px-4 py-3 text-sm text-akzent-700">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {zustand.fehler}
          </p>
        ) : null}

        <Feld
          label="Name"
          name="name"
          pflicht
          placeholder="z. B. Anna Weber"
          fehler={felder.name}
        />

        <Feld
          label="Mitgliedsnummer"
          name="mitgliedNr"
          pflicht
          placeholder="z. B. M-1001"
          fehler={felder.mitgliedNr}
        />

        <div>
          <label
            htmlFor="tarifId"
            className="mb-2 block text-sm font-medium text-tinte-700"
          >
            Tarif <span className="text-akzent-600">*</span>
          </label>
          <select
            id="tarifId"
            name="tarifId"
            defaultValue=""
            className={cn(
              "w-full rounded-xl border bg-stein-50 px-4 py-2.5 text-sm text-tinte-900 outline-none transition focus:border-akzent-500 focus:ring-2 focus:ring-akzent-500/25",
              felder.tarifId ? "border-akzent-500" : "border-stein-300",
            )}
          >
            <option value="" disabled>
              Bitte waehlen
            </option>
            {tarife.map((tarif) => (
              <option key={tarif.id} value={tarif.id}>
                {tarif.name} - {formatiereCent(tarif.monatsbeitrag)} (
                {formatiereLimit(tarif.buchungslimitMonat)})
              </option>
            ))}
          </select>
          <FeldFehler text={felder.tarifId} />
        </div>

        <Feld
          label="Gueltig ab"
          name="gueltigAb"
          type="date"
          pflicht
          defaultValue={heute}
          fehler={felder.gueltigAb}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={laeuft}>
            {laeuft ? "Wird gespeichert..." : "Mitglied anlegen"}
          </Button>
          <Link href="/mitglieder">
            <Button type="button" variant="ghost">
              Abbrechen
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  );
}

function Feld({
  label,
  name,
  type = "text",
  pflicht = false,
  placeholder,
  defaultValue,
  fehler,
}: {
  label: string;
  name: string;
  type?: string;
  pflicht?: boolean;
  placeholder?: string;
  defaultValue?: string;
  fehler?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-tinte-700"
      >
        {label} {pflicht ? <span className="text-akzent-600">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={cn(
          "w-full rounded-xl border bg-stein-50 px-4 py-2.5 text-sm text-tinte-900 outline-none transition placeholder:text-tinte-300 focus:border-akzent-500 focus:ring-2 focus:ring-akzent-500/25",
          fehler ? "border-akzent-500" : "border-stein-300",
        )}
      />
      <FeldFehler text={fehler} />
    </div>
  );
}

function FeldFehler({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1.5 text-xs text-akzent-700">{text}</p>;
}
