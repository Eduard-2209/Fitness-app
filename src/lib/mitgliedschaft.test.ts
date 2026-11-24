import { describe, expect, it } from "vitest";
import {
  MITGLIEDSCHAFT_STATUS,
  aktuelleMitgliedschaft,
  anzeigeMitgliedschaft,
  decktAb,
  istKuenftig,
  planeTarifwechsel,
  statusNachPause,
  type MitgliedschaftsZeile,
} from "./mitgliedschaft";

function zeile(
  overrides: Partial<MitgliedschaftsZeile> = {},
): MitgliedschaftsZeile {
  return {
    id: 1,
    tarifId: 1,
    gueltigAb: new Date("2026-01-01T00:00:00Z"),
    gueltigBis: null,
    status: MITGLIEDSCHAFT_STATUS.AKTIV,
    ...overrides,
  };
}

describe("decktAb - halboffenes Intervall", () => {
  it("Stichtag gleich gueltigAb zaehlt als gueltig", () => {
    const z = zeile({ gueltigBis: new Date("2026-02-01T00:00:00Z") });
    expect(decktAb(z, new Date("2026-01-01T00:00:00Z"))).toBe(true);
  });

  it("Stichtag gleich gueltigBis zaehlt als nicht mehr gueltig", () => {
    const z = zeile({ gueltigBis: new Date("2026-02-01T00:00:00Z") });
    expect(decktAb(z, new Date("2026-02-01T00:00:00Z"))).toBe(false);
  });

  it("offenes Ende deckt jeden spaeteren Tag ab", () => {
    expect(decktAb(zeile(), new Date("2030-05-05T00:00:00Z"))).toBe(true);
  });
});

describe("aktuelleMitgliedschaft", () => {
  it("waehlt am Stichtag die gueltige Zeile", () => {
    const alt = zeile({
      id: 1,
      tarifId: 1,
      gueltigAb: new Date("2026-01-01T00:00:00Z"),
      gueltigBis: new Date("2026-06-01T00:00:00Z"),
    });
    const neu = zeile({
      id: 2,
      tarifId: 2,
      gueltigAb: new Date("2026-06-01T00:00:00Z"),
      gueltigBis: null,
    });
    const aktuell = aktuelleMitgliedschaft(
      [alt, neu],
      new Date("2026-06-15T00:00:00Z"),
    );
    expect(aktuell?.id).toBe(2);
  });

  it("liefert null, wenn keine Zeile den Stichtag abdeckt", () => {
    const alt = zeile({ gueltigBis: new Date("2026-02-01T00:00:00Z") });
    expect(
      aktuelleMitgliedschaft([alt], new Date("2026-06-15T00:00:00Z")),
    ).toBeNull();
  });
});

describe("planeTarifwechsel", () => {
  it("schliesst die alte Zeile am Stichtag und oeffnet die neue", () => {
    const stichtag = new Date("2026-06-01T00:00:00Z");
    const plan = planeTarifwechsel({
      mitgliedschaften: [zeile({ id: 7, tarifId: 1 })],
      neuerTarifId: 2,
      stichtag,
    });
    expect(plan).toEqual({
      art: "wechsel",
      schliessen: { id: 7, gueltigBis: stichtag },
      neu: { tarifId: 2, gueltigAb: stichtag },
    });
  });

  it("meldet unveraendert, wenn der Tarif schon aktiv ist", () => {
    const plan = planeTarifwechsel({
      mitgliedschaften: [zeile({ tarifId: 3 })],
      neuerTarifId: 3,
      stichtag: new Date("2026-06-01T00:00:00Z"),
    });
    expect(plan).toEqual({ art: "unveraendert" });
  });

  it("meldet Fehler, wenn es keine gueltige Mitgliedschaft gibt", () => {
    const plan = planeTarifwechsel({
      mitgliedschaften: [],
      neuerTarifId: 2,
      stichtag: new Date("2026-06-01T00:00:00Z"),
    });
    expect(plan.art).toBe("fehler");
  });
});

describe("statusNachPause", () => {
  it("pausieren setzt den Status auf pausiert", () => {
    expect(statusNachPause(true)).toBe(MITGLIEDSCHAFT_STATUS.PAUSIERT);
  });
  it("fortsetzen setzt den Status auf aktiv", () => {
    expect(statusNachPause(false)).toBe(MITGLIEDSCHAFT_STATUS.AKTIV);
  });
});

describe("anzeigeMitgliedschaft", () => {
  const stichtag = new Date("2026-06-15T00:00:00Z");

  it("zeigt die gueltige Zeile als aktiv", () => {
    const ergebnis = anzeigeMitgliedschaft(
      [zeile({ id: 5, gueltigAb: new Date("2026-01-01T00:00:00Z") })],
      stichtag,
    );
    expect(ergebnis.art).toBe("aktiv");
    expect(ergebnis.zeile?.id).toBe(5);
  });

  it("zeigt eine spaeter startende Zeile als geplant", () => {
    const ergebnis = anzeigeMitgliedschaft(
      [zeile({ id: 9, gueltigAb: new Date("2026-09-01T00:00:00Z") })],
      stichtag,
    );
    expect(ergebnis.art).toBe("geplant");
    expect(ergebnis.zeile?.id).toBe(9);
  });

  it("bevorzugt die gueltige Zeile vor einer kuenftigen", () => {
    const ergebnis = anzeigeMitgliedschaft(
      [
        zeile({ id: 1, gueltigAb: new Date("2026-01-01T00:00:00Z") }),
        zeile({ id: 2, gueltigAb: new Date("2026-09-01T00:00:00Z") }),
      ],
      stichtag,
    );
    expect(ergebnis.art).toBe("aktiv");
    expect(ergebnis.zeile?.id).toBe(1);
  });

  it("meldet keine, wenn weder gueltig noch kuenftig", () => {
    const ergebnis = anzeigeMitgliedschaft(
      [zeile({ gueltigBis: new Date("2026-02-01T00:00:00Z") })],
      stichtag,
    );
    expect(ergebnis).toEqual({ art: "keine", zeile: null });
  });
});

describe("istKuenftig", () => {
  const stichtag = new Date("2026-06-15T00:00:00Z");

  it("erkennt eine spaeter startende Zeile", () => {
    expect(istKuenftig(zeile({ gueltigAb: new Date("2026-09-01T00:00:00Z") }), stichtag)).toBe(true);
  });

  it("erkennt eine bereits laufende Zeile nicht als kuenftig", () => {
    expect(istKuenftig(zeile({ gueltigAb: new Date("2026-01-01T00:00:00Z") }), stichtag)).toBe(false);
  });
});
