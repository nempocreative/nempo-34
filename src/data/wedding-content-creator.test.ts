import { describe, expect, it } from "vitest";
import { WCC_PACKAGES, WCC_ADDONS, WCC_TRANSPORT_NOTE } from "./wedding-content-creator";

describe("wedding content creator prices", () => {
  it.each([["intimate", 350_000, "Akad Only · 2–3 Jam"], ["essential", 650_000, "Akad & Resepsi · 5 Jam"], ["exclusive", 950_000, "Full Wedding Day · 8 Jam"]])("%s price and duration", (id, price, scope) => {
    expect(WCC_PACKAGES.find((p) => p.id === id)).toMatchObject({ price, scope });
  });
  it("highlight counts per package", () => {
    expect(WCC_PACKAGES.map((p) => p.items.find((i) => i.includes("video highlight")))).toEqual(["1 video highlight", "2 video highlight", "3 video highlight"]);
  });
  it("only Exclusive includes Same Day Edit and TikTok trend", () => {
    expect(WCC_PACKAGES.filter((p) => (p.items as readonly string[]).includes("Same Day Edit")).map((p) => p.id)).toEqual(["exclusive"]);
    expect(WCC_PACKAGES.filter((p) => (p.items as readonly string[]).includes("1 video TikTok trend")).map((p) => p.id)).toEqual(["exclusive"]);
  });
  it.each([["extra-hour", 100_000, false], ["highlight", 100_000, false], ["sde", 200_000, false], ["crew", 250_000, false], ["engagement", 350_000, true]])("add-on %s", (id, price, startingFrom) => {
    expect(WCC_ADDONS.find((a) => a.id === id)).toMatchObject({ price, startingFrom });
  });
  it("transport outside Garut city is quoted separately", () => {
    expect(WCC_TRANSPORT_NOTE).toBe("Transportasi luar Garut kota menyesuaikan.");
  });
});
