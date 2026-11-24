import Link from "next/link";
import { UserX } from "lucide-react";
import { Button, LeererZustand } from "@/components/ui";

export default function MitgliedNichtGefunden() {
  return (
    <LeererZustand
      icon={<UserX className="size-6" aria-hidden />}
      titel="Mitglied nicht gefunden"
      beschreibung="Zu dieser Mitgliedsnummer gibt es kein Mitglied. Vielleicht wurde sie geloescht oder falsch geschrieben."
      aktion={
        <Link href="/mitglieder">
          <Button variant="secondary">Zur Mitgliederliste</Button>
        </Link>
      }
    />
  );
}
