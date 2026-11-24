import { describe, expect, it } from "vitest";
import { pruefeBuchungsvoraussetzungen } from "./buchungsregeln";
import { MITGLIEDSCHAFT_STATUS } from "./mitgliedschaft";

const basis = {
  status: MITGLIEDSCHAFT_STATUS.AKTIV,
  gueltigAb: new Date("2026-01-01T00:00:00Z"),
  gueltigBis: null,
  tarif: { name: "Basic", buchungslimitMonat: 5 },
};
const stichtag = new Date("2026-06-15T12:00:00Z");

// BR2: Mitgliedschaft aktiv (pausiert: nichts buchbar)
describe("BR2 - Mitgliedschaft", () => {
  it("ohne Mitgliedschaft ist keine Buchung erlaubt", () => {
    const ergebnis = pruefeBuchungsvoraussetzungen({
      mitgliedschaft: null,
      buchungenImMonat: 0,
      stichtag,
    });
    expect(ergebnis).toMatchObject({
      erlaubt: false,
      grund: "keine_aktive_mitgliedschaft",
    });
  });

  it("Mitgliedschaft ausserhalb des Gueltigkeitszeitraums blockt", () => {
    const ergebnis = pruefeBuchungsvoraussetzungen({
      mitgliedschaft: { ...basis, gueltigAb: new Date("2026-08-01T00:00:00Z") },
      buchungenImMonat: 0,
      stichtag,
    });
    expect(ergebnis).toMatchObject({
      erlaubt: false,
      grund: "keine_aktive_mitgliedschaft",
    });
  });

  it("pausierte Mitgliedschaft blockt jede Buchung", () => {
    const ergebnis = pruefeBuchungsvoraussetzungen({
      mitgliedschaft: { ...basis, status: MITGLIEDSCHAFT_STATUS.PAUSIERT },
      buchungenImMonat: 0,
      stichtag,
    });
    expect(ergebnis).toMatchObject({
      erlaubt: false,
      grund: "mitgliedschaft_pausiert",
    });
  });
});

// BR2: Basic hoechstens 5 pro Monat ohne Ausnahme
describe("BR2 - Buchungslimit Basic", () => {
  it("erlaubt die fuenfte Buchung im Monat", () => {
    const ergebnis = pruefeBuchungsvoraussetzungen({
      mitgliedschaft: basis,
      buchungenImMonat: 4,
      stichtag,
    });
    expect(ergebnis).toEqual({ erlaubt: true });
  });

  it("blockt die sechste Buchung im Monat", () => {
    const ergebnis = pruefeBuchungsvoraussetzungen({
      mitgliedschaft: basis,
      buchungenImMonat: 5,
      stichtag,
    });
    expect(ergebnis).toMatchObject({
      erlaubt: false,
      grund: "buchungslimit_erreicht",
    });
  });
});

// BR2: Plus und Premium unbegrenzt
describe("BR2 - unbegrenzte Tarife", () => {
  it.each(["Plus", "Premium"])(
    "%s erlaubt auch bei vielen Buchungen weiter",
    (name) => {
      const ergebnis = pruefeBuchungsvoraussetzungen({
        mitgliedschaft: {
          ...basis,
          tarif: { name, buchungslimitMonat: null },
        },
        buchungenImMonat: 99,
        stichtag,
      });
      expect(ergebnis).toEqual({ erlaubt: true });
    },
  );
});
