import { describe, expect, it } from "vitest";
import {
  LO_ADDONS,
  LO_EXCLUSION_NOTE,
  LO_SERVICE_NAME,
  LO_TARIFFS,
  loRupiah,
} from "./liaison-officer";

describe("event liaison officer prices", () => {
  it.each([
    ["half-day", 150_000, "Durasi 4–5 jam / orang"],
    ["full-day", 250_000, "Durasi 8–10 jam / orang"],
    ["vip", 350_000, "Durasi 8–10 jam / orang"],
  ])("%s price and duration", (id, price, duration) => {
    expect(LO_TARIFFS.find((t) => t.id === id)).toMatchObject({ price, duration });
  });

  it("only VIP covers protocol coordination and VVIP handling", () => {
    expect(LO_TARIFFS.filter((t) => (t.items as readonly string[]).includes("Koordinasi protokoler")).map((t) => t.id)).toEqual(["vip"]);
    expect(LO_TARIFFS.filter((t) => (t.items as readonly string[]).includes("Pendampingan VIP / VVIP")).map((t) => t.id)).toEqual(["vip"]);
  });

  it("only Full Day covers rundown and talent needs", () => {
    expect(LO_TARIFFS.filter((t) => (t.items as readonly string[]).includes("Koordinasi rundown")).map((t) => t.id)).toEqual(["full-day"]);
    expect(LO_TARIFFS.filter((t) => (t.items as readonly string[]).includes("Mengatur kebutuhan talent")).map((t) => t.id)).toEqual(["full-day"]);
  });

  it("Half Day keeps the three basic escort duties", () => {
    expect(LO_TARIFFS.find((t) => t.id === "half-day")?.items).toEqual([
      "Pendampingan tamu atau talent",
      "Koordinasi kebutuhan acara",
      "Komunikasi dengan panitia",
    ]);
  });

  it.each([
    ["extra-hour", 35_000, false],
    ["briefing", 50_000, false],
    ["talent", 250_000, true],
    ["wedding", 250_000, true],
    ["corporate", 350_000, true],
  ])("additional fee %s", (id, price, startingFrom) => {
    expect(LO_ADDONS.find((a) => a.id === id)).toMatchObject({ price, startingFrom });
  });

  it("prices exclude transport, meals and accommodation", () => {
    expect(LO_EXCLUSION_NOTE).toBe(
      "Harga per orang, belum termasuk transportasi, konsumsi, dan akomodasi jika diperlukan.",
    );
  });

  it("is offered as Event Liaison Officer Service", () => {
    expect(LO_SERVICE_NAME).toBe("Event Liaison Officer Service");
  });

  it("formats rupiah with dot separators", () => {
    expect(loRupiah(150_000)).toBe("Rp150.000");
    expect(loRupiah(35_000)).toBe("Rp35.000");
  });
});
