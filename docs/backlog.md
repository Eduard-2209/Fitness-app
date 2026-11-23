# Backlog

Abgeleitet aus `SPEC.md`. Ein Feature ist ein Ablauf, den eine Person in der App von Anfang bis Ende durchspielen kann; Datenmodell, Oberfläche, Regeln und Tests gehören jeweils dazu. Die Business Rules (BR) und Annahmen stehen in `SPEC.md` und werden hier nur referenziert.

- Phase 1 (v1): Prioritäten 1–3 der SPEC.md (Kursbuchung, Mitgliederverwaltung, Kurstermine/Trainer).
- Phase 2 (später): Prioritäten 4–5 der SPEC.md (Videos, Personal Training).

| ID | Name | Phase | Status | BR/Entitäten |
|---|---|---|---|---|
| F-001 | Mitglied anlegen und Tarif verwalten (Tarifwechsel, Pause) | 1 | offen | BR2 (aktive Mitgliedschaft als Buchungsvoraussetzung); Mitglied, Mitgliedschaft, Tarif |
| F-002 | Kurstermine mit Trainer planen | 1 | offen | —; Kurstyp, Kurstermin, Trainer |
| F-003 | Kurs online buchen (Buchungslimit, Warteliste) | 1 | offen | BR2, BR4; Buchung, Kurstermin, Mitglied, Mitgliedschaft, Tarif |
| F-004 | Buchung stornieren mit Stornogebühr | 1 | offen | BR1; Buchung, Tarif |
| F-005 | No-Show erfassen und Kurs-Sperre verhängen | 1 | offen | BR5; Buchung, Mitglied |
| F-006 | Videos mit Tarifzugang ansehen | 2 | offen | BR3; Video, Tarif |
| F-007 | Personal Training: Einzeltermin buchen | 2 | offen | PT1, PT2; Trainer, Mitglied, Tarif, Buchung |
| F-008 | Personal Training: offene Beträge bezahlen | 2 | offen | PT3; Buchung, Trainer |
