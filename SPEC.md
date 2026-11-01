# SPEC.md – FitZone Berlin (K2, Lisa Sommer)

Stand: v1 nach Meeting 1 (12 Nachrichten). Verweise "Nr." = Nachricht im Chat.

Quelle: Meeting 1 mit der Inhaberin Lisa Sommer (K2, 12 Nachrichten). Zu jeder Regel steht die Nachricht, aus der sie stammt. Mit „Annahme“ markierte Stellen stammen nicht direkt von Lisa.

## Entitäten

| Entität | Attribute |
|---|---|
| Mitglied | mitglied_nr, name, tarif → Tarif, status (aktiv, pausiert), pause_von, pause_bis |
| Tarif | name (Basic, Plus, Premium), monatsbeitrag, max_buchungen_monat, storno_frei |
| Kurstyp | kurstyp_id, name (Yoga, Pilates, Spinning, HIIT) |
| Trainer | trainer_id, name |
| Kurstermin | termin_id, kurstyp → Kurstyp, trainer → Trainer, datum, uhrzeit, max_plaetze, format (Studio, Live-Stream) |
| Buchung | buchung_id, mitglied → Mitglied, termin → Kurstermin, gebucht_am, status (gebucht, storniert, nicht erschienen), storno_gebuehr |
| Wartelisteneintrag | eintrag_id, mitglied → Mitglied, termin → Kurstermin, position, benachrichtigt_am (Annahme: eigene Entität statt Buchungsstatus) |
| Video | video_id, titel |

## Beziehungen

- Tarif 1:n Mitglied
- Mitglied n:m Kurstermin über Buchung
- Mitglied n:m Kurstermin über Wartelisteneintrag
- Trainer n:m Kurstyp (Qualifikation)
- Kurstyp 1:n Kurstermin
- Trainer 1:n Kurstermin (Annahme: ein Trainer pro Termin)
- Video n:m Tarif (Freigabe)

## Business Rules

- **BR1** Absage weniger als 2 Stunden vor Kursbeginn kostet eine fixe Stornogebühr, Premium zahlt nie (Nr. 3, 7, 8)
- **BR2** Basic höchstens 5 Buchungen pro Monat ohne Ausnahme, Plus ohne harte Grenze, Premium unbegrenzt (Nr. 7, 9)
- **BR3** Videos sehen nur Tarife, die für das Video freigegeben sind: Basic keine, Plus die Mehrheit, Premium alle (Nr. 4, 5)
- **BR4** Wird ein Platz frei, wird die erste Person der Warteliste benachrichtigt und hat etwa 30 Minuten zur Bestätigung, sonst rückt die nächste nach. Warteliste höchstens 5 Einträge je Kurs (Nr. 2, 10)
- **BR5** Vor jeder Buchung prüft das System in dieser Reihenfolge: Mitgliedschaft aktiv, Tarif, Buchungen im Monat (Nr. 9)
