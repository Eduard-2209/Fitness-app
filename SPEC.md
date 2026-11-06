# SPEC.md – FitZone Berlin (K2, Lisa Sommer)

Quelle: Meeting 1 (Nachricht 1–12) und Meeting 2 (Nachricht 13–20) mit der Inhaberin Lisa Sommer (K2). Zu jeder Regel steht die Nachricht, aus der sie stammt. „Annahme“ heißt: Lisa hat es so nicht direkt gesagt aber angedeutet.

## Entitäten

| Entität | Attribute |
|---|---|
| Mitglied | mitglied_nr, name, gesperrt_bis |
| Mitgliedschaft | mitgliedschaft_id, mitglied → Mitglied, tarif → Tarif, gueltig_ab, gueltig_bis, status (aktiv, pausiert) |
| Tarif | name (Basic, Plus, Premium), monatsbeitrag, buchungslimit_monat, storno_frei, einzeltermine_inklusive_monat |
| Kurstyp | kurstyp_id, name (Yoga, Pilates, Spinning, HIIT, Bodyworkout) |
| Trainer | trainer_id, name, einzeltermin_preis (pro Stunde) |
| Kurstermin | termin_id, kurstyp → Kurstyp, trainer → Trainer, beginn (Datum und Uhrzeit), raum, max_plaetze, format (Studio, Live-Stream) |
| Buchung | buchung_id, mitglied → Mitglied, termin → Kurstermin, status (gebucht, wartend, storniert, nicht erschienen), gebucht_am, storniert_am, benachrichtigt_am, storno_gebuehr |
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

- **BR1** Absage weniger als 2 Stunden vor Kursbeginn kostet eine fixe Stornogebühr, Premium zahlt nie (Nachricht. 3, 7, 8)
- **BR2** Basic höchstens 5 Buchungen pro Monat ohne Ausnahme, Plus ohne harte Grenze, Premium unbegrenzt (Nachricht. 7, 9)
- **BR3** Videos sehen nur Tarife, die für das Video freigegeben sind: Basic keine, Plus die Mehrheit, Premium alle (Nachricht. 4, 5)
- **BR4** Wird ein Platz frei, wird die erste Person der Warteliste benachrichtigt und hat etwa 30 Minuten zur Bestätigung, sonst rückt die nächste nach. Warteliste höchstens 5 Einträge je Kurs (Nachricht. 2, 10)
- **BR5** Vor jeder Buchung prüft das System in dieser Reihenfolge: Mitgliedschaft aktiv, Tarif, Buchungen im Monat (Nachricht. 9)

## Widersprüche

- **W1** „Online ist für alle“ (Nachr. 1, 5) vs. Basic ohne Video-Zugang (Nachr. 4, 5) → aufgelöst über Freigabe je Tarif (BR3), Annahme: Basic bleibt ohne Videos
- **W2** „Hälfte des Kursbeitrags“ (Nachr. 3) vs. fixer Betrag von etwa 5 bis 10 € (Nachr. 8) → aufgelöst über `storno_gebuehr` als fixen Betrag, Annahme für v1: z. B. 5 €

## Prioritäten

1. Online-Kursbuchung mit Storno und Warteliste (v1)
2. Mitgliederverwaltung mit Tarif und Pause (v1)
3. Trainer-Planung (v1)
4. Videos mit Tarifzugang (später)
5. Personal Training als 1:1-Termine (später, nur angedeutet in Nachricht 12)

## Offene Fragen

- Genaue Höhe der Stornogebühr, pro Kurstyp oder generell (Nachricht 8)
- Dürfen Basic-Mitglieder Live-Streams buchen? (Nachricht 4, 5)
- Hat Plus wirklich keine Buchungsgrenze? (Nachricht 9)
- Umgang mit No-Shows (Nachricht 11)
- Mehrere Räume, die geplant werden müssen? (Nachricht 6)
- Zählt eine stornierte Buchung aufs Basic-Limit? (Nachricht 9)
- Was passiert bei einer Pause mit bestehenden Buchungen? (Nachricht 9)
- Ist die Bestätigungsfrist der Warteliste fix bei 30 Minuten? (Nachricht 10)
