# Architektur

Diese Datei hält die technischen Grundentscheidungen des Projekt-Setups fest. Fachliche Regeln stehen in `SPEC.md`, Feature-Zuschnitt in `docs/backlog.md`, Design-Entscheidungen in `docs/decisions.md`.

## Stack

| Baustein | Wahl | Begründung |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) | Vorgabe aus `AGENTS.md`; App Router ist der Standard für neue Projekte |
| Sprache | TypeScript (strict) | Typsicherheit für Datenmodell und Business Rules |
| Styling | Tailwind CSS 4 | Vorgabe aus `AGENTS.md` |
| Datenbank | SQLite über Prisma 7 (lokale Datei) | Vorgabe aus `AGENTS.md`, kein DB-Server nötig |
| Schrift | Google Fonts über `next/font` (Geist) | Vorgabe aus `AGENTS.md`; wird beim ersten Feature durch die Design-Richtung ersetzt |
| Icons | lucide (noch nicht installiert) | Vorgabe aus `AGENTS.md`, kommt mit dem ersten UI-Feature |

## Ordnerstruktur

```
src/app/            App Router: Seiten und Layouts
src/generated/prisma/  Generierter Prisma-Client (nicht versioniert)
prisma/schema.prisma    Datenmodell, wächst mit jedem Feature
prisma/migrations/      Prisma-Migrationen (versioniert)
prisma7.config.ts       Prisma-Konfiguration (Schema, Migrationen, Datasource)
docs/                   Backlog, Architektur, Design-Entscheidungen
```

## Datenbank

- Datasource: `sqlite`, Datei `prisma/dev.db` (nicht versioniert), URL aus `DATABASE_URL` in `.env`.
- Prisma 7 liest die `.env` über `dotenv/config` in `prisma7.config.ts`.
- Der Prisma-Client wird nach `src/generated/prisma` generiert und ist in `.gitignore`.
- Modelländerungen laufen ausschließlich über `npx prisma migrate dev`, nie von Hand an der DB-Datei.
- Das Schema ist beim Setup absichtlich leer; das erste Datenmodell entsteht mit Feature F-001.

## Setup-Entscheidungen

- Das Projekt wurde per `create-next-app` in einen Temp-Ordner erzeugt und die Dateien wurden in den bestehenden Repo-Ordner kopiert; vorhandene Dateien (`AGENTS.md`, `README.md`, `SPEC.md`, `docs/backlog.md`) wurden nicht überschrieben.
- `agentRules: false` in `next.config.ts`: `next dev` hängt sonst automatisch einen Block an `AGENTS.md`; das wollen wir nicht, unsere `AGENTS.md` bleibt allein maßgeblich.
- `.gitignore` schützt `.env`, `prisma/dev.db*` und `src/generated/prisma` vor dem Commit.
- `npm` ist in PowerShell durch die Execution Policy blockiert; Befehle laufen über `cmd /c "npm ..."`.

## Verifikation

- `npm run dev` startet auf http://localhost:3000, Startseite antwortet mit HTTP 200.
- `npm run build` läuft fehlerfrei durch (benötigt Netzwerkzugriff für Google Fonts).
