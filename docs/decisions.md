# Entscheidungen

Kurzprotokoll der wichtigen Entscheidungen (Datum, was, warum). Fachliche Regeln
stehen in `SPEC.md`, der Feature-Zuschnitt in `docs/backlog.md`, die technische
Grundlage in `docs/architecture.md`.

## 2026-11-24 - Design-Richtung festgelegt (Feature F-001)

- **Richtung:** ruhig und editorial. Getoente Grundflaeche statt reinem Weiss,
  eine kraeftige Akzentfarbe nur fuer Hauptaktionen und den aktiven Menuepunkt,
  sonst zurueckhaltend. Kein Standard-Indigo, keine Lila-Blau-Verlaeufe.
- **Farben:** Grundflaeche warmes Stein (`#f5f1ea`), Karten heller (`#fffdf9`),
  Text tiefes Tintenbraun (`#241f1a`), Akzent Terrakotta (`#c2410c`) mit
  dunklerem Hover (`#9a3412`). Status: aktiv gruen, pausiert gedämpft.
- **Schrift:** Ueberschriften *Fraunces* (Serif mit Charakter), Fliesstext
  *Inter*; beide ueber `next/font`. Zahlen und Datumswerte mit `tabular-nums`.
- **Warum:** Die App soll wie ein gutes Produkt wirken, nicht wie ein
  Tailwind-Beispiel (Vorgabe aus `AGENTS.md`). Die Richtung wird ueber alle
  Features durchgehalten.

## 2026-11-24 - Technische Entscheidungen F-001

- **Prisma 7 + SQLite-Adapter:** Prisma 7 verlangt fuer jede Datenbank einen
  Driver-Adapter; fuer SQLite ist das `@prisma/adapter-better-sqlite3`. Der
  Client wird in `src/lib/prisma.ts` mit dem Adapter erzeugt.
- **Status als String:** SQLite/Prisma kann hier keine Enums; `status` wird als
  String gefuehrt und ueber `istMitgliedschaftStatus` validiert.
- **Betraege in Cent:** `monatsbeitrag` als Ganzzahl in Cent, damit keine
  Rundungsfehler entstehen; Anzeige ueber `formatiereCent`.
- **Regeln ohne Datenbank:** `mitgliedschaft.ts` und `buchungsregeln.ts` sind
  reine Funktionen (BR2), damit sie ohne DB testbar sind.
- **Tests:** Vitest (`npm test`); fuer jede Business Rule aus der SPEC.md
  mindestens ein Test.
- **Datenbankdatei:** `DATABASE_URL="file:./prisma/dev.db"`, damit die Datei
  neben dem Schema liegt (wie in `docs/architecture.md` beschrieben).

## 2026-11-24 - Kuenftiger Tarif sichtbar machen (Feature F-001, Nachtrag)

- **Anlass:** Wird ein Tarif erst spaeter gueltig, zeigte die Mitgliederliste
  bisher nur "Minus" (kein Tarif, kein Status, kein Datum).
- **Entscheidung:** `anzeigeMitgliedschaft` in `src/lib/mitgliedschaft.ts`
  liefert drei Faelle: `aktiv` (gueltig am Stichtag), `geplant` (startet
  spaeter) und `keine`. Bei `geplant` zeigt die Liste den kuenftigen Tarif mit
  "ab TT.MM.JJJJ" und den Status **Nicht aktiv**; das Profil nennt die Karte
  "Geplanter Tarif" und sperrt Tarifwechsel/Pause, bis der Tarif aktiv ist.
- **Warum:** Lisa soll auf einen Blick sehen, dass das Mitglied einen Tarif hat,
  der aber noch nicht laeuft - statt eines leeren Eintrags.
- **Nicht betroffen:** Die Buchungspruefung (BR2) bleibt unveraendert; ein
  geplanter Tarif ist nicht buchbar, weil noch keine gueltige Zeile existiert.
