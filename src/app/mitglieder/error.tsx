"use client";

import { AlertTriangle } from "lucide-react";
import { Button, LeererZustand } from "@/components/ui";

export default function Fehler({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <LeererZustand
      icon={<AlertTriangle className="size-6" aria-hidden />}
      titel="Etwas ist schiefgelaufen"
      beschreibung="Die Mitglieder konnten nicht geladen werden. Bitte versuche es erneut."
      aktion={
        <Button variant="secondary" onClick={reset}>
          Erneut versuchen
        </Button>
      }
    />
  );
}
