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

- Mitglied 1:n Mitgliedschaft n:1 Tarif (Historie bei Tarifwechsel)
- Mitglied n:m Kurstermin über Buchung (Warteliste = Buchung mit Status wartend)
- Kurstyp 1:n Kurstermin
- Trainer 1:n Kurstermin (Annahme: ein Trainer je Termin)
- Trainer n:m Kurstyp (Qualifikation)
- Video n:m Tarif (Freigabe)

## Business Rules

- **BR1** Absage weniger als 2 Stunden vor Kursbeginn kostet einen fixen Betrag je Storno (Annahme: 8 €, Lisa nennt 8–10 €), Premium zahlt nie (Nachricht 3, 7, 8, 17)
- **BR2** Vor jeder Buchung prüft das System in dieser Reihenfolge: Mitgliedschaft aktiv (pausiert: nichts buchbar), Tarif, Buchungen im Monat. Basic höchstens 5 pro Monat ohne Ausnahme, Plus und Premium unbegrenzt (Nachricht 7, 9, 15)
- **BR3** Videos sehen nur Tarife, die für das Video freigegeben sind: Basic keine, Plus die Mehrheit, Premium alle (Nachricht 4, 5)
- **BR4** Wird ein Platz frei, bekommt die erste wartende Person automatisch eine Benachrichtigung und etwa 30 Minuten zur Bestätigung, sonst rückt die nächste nach. Je Kurs höchstens 5 Wartende, ein Platz wird nie an zwei Personen vergeben (Nachricht 2, 10)
- **BR5** Wer dreimal hintereinander gebucht hat und nicht erschienen ist, kann 2 Wochen keine Live-Kurse buchen, in jedem Tarif (Nachricht 11, 15, 16)

## Widersprüche

- **W1** „Online ist für alle“ (Nachr. 5) vs. Basic ohne Video-Zugang (Nachr. 4, 5) → aufgelöst über die Freigabe je Video und Tarif (BR3), Annahme: Basic bleibt ohne Videos
- **W2** „Hälfte des Kursbeitrags“ (Nachr. 3, 7) vs. fixer Betrag je Storno, 8 € (Nachr. 8, 17) → aufgelöst über `storno_gebuehr` als fixer Betrag für alle außer Premium (BR1), Annahme: 8 €

## Neue Anforderung: Personal Training

Einzeltermine 1:1 zwischen Mitglied und Trainer, bisher per WhatsApp und Excel (Nachricht 12, 13). Lisa will sie erst nach den Basics (Nachricht 12).

- **PT1** Der Preis hängt am Trainer: Tom 70 €, Marie 60 € pro Stunde (Nachricht 14), gespeichert als `einzeltermin_preis` am Trainer
- **PT2** Premium hat einen Einzeltermin pro Monat inklusive, weitere zum Trainerpreis (Nachricht 14, Rest Annahme), gespeichert als `einzeltermine_inklusive_monat` am Tarif
- **PT3** Für Einzeltermine soll später ein Bezahlstatus geführt werden, damit offene Beträge sichtbar sind (Nachricht 13).
- Stornoregel für Einzeltermine: siehe Offene Fragen (Nachricht 19)

## Prioritäten

1. Online-Kursbuchung mit Storno, Buchungslimit, Warteliste und No-Show-Sperre (v1)
2. Mitgliederverwaltung mit Tarif, Tarifwechsel und Pause (v1)
3. Kurstermine und Trainer-Planung (v1)
4. Videos mit Tarifzugang (später)
5. Personal Training mit Einzeltermin (später, Lisa will erst die Basics, Nachricht 12)

## Offene Fragen

- Höhe der Stornogebühr: Lisa will noch kalkulieren (Nachricht 17) → Annahme: 8 €
- Tarifwechsel mitten im Monat: keine Regel (Nachricht 20) → Annahme: neue Rechte ab Stichtag, Monatszähler läuft weiter, Monat = Kalendermonat
- Stornoregel für Einzeltermine, evtl. strenger (Nachricht 19) → Annahme: gleiche 2-Stunden-Frist und gleicher Fixbetrag
- No-Show-Sperre: Was sind „Live-Kurse“, wann startet der Zähler neu? (Nachricht 16) → Annahme: Studio und Live-Stream gesperrt, Videos erlaubt, Zähler startet nach einem Besuch und nach der Sperre bei 0
- Dürfen Basic-Mitglieder Live-Streams buchen? (Nachricht 4, 5) → Annahme: ja, keine Einschränkung nach Format
- Zählen stornierte oder wartende Buchungen aufs Basic-Limit? (Nachricht 9) → Annahme: nein
- Pause: Dauer und bestehende Buchungen? (Nachricht 9) → Annahme: Lisa beendet die Pause, zukünftige Buchungen werden ohne Gebühr storniert
- Mehrere Räume, Raumkonflikte, Trainer-Verfügbarkeit digital? (Nachricht 6, 13, 18) → Annahme: Raum nur als Text, Verfügbarkeit später
- Höhe der Monatsbeiträge nicht genannt (Nachricht 4) → Annahme: Testwerte
- Rollen und Rechte nicht besprochen (Nachricht 2, 6) → Annahme: Lisa verwaltet, Mitglieder buchen selbst, Trainer ohne Zugang
- Bestätigungsfrist der Warteliste „vielleicht 30 Minuten“ (Nachricht 10) → Annahme: 30 Minuten fix
