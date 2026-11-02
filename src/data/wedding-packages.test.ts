import { describe, expect, it } from "vitest";
import { weddingPackages, weddingAdatOptions, weddingTotal } from "./wedding-packages";

describe("Kenalan Nempo wedding rates", () => {
  it("uses the three slide package prices and team sizes", () => {
    expect(weddingPackages.map(({ name, price, team }) => ({ name, price, team }))).toEqual([
      { name: "Essential", price: 2500000, team: 4 },
      { name: "Signature", price: 4000000, team: 6 },
      { name: "Premium", price: 6000000, team: 8 },
    ]);
  });
  it("includes invitation and sawer only in Signature and Premium", () => {
    expect(weddingPackages.map(p => p.digitalInvitationAndSawer)).toEqual([false, true, true]);
  });
  it("uses the slide normal and special adat rates", () => {
    expect(weddingAdatOptions.map(({ normal, special }) => ({ normal, special }))).toEqual([
      { normal: 3500000, special: 2800000 }, { normal: 2500000, special: 1800000 },
    ]);
  });
  it("matches all six combined totals in the slide", () => {
    expect(weddingPackages.map(p => weddingAdatOptions.map(a => weddingTotal(p.price, a.special)))).toEqual([
      [5300000, 4300000], [6800000, 5800000], [8800000, 7800000],
    ]);
  });
});