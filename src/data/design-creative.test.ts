import { describe, expect, it } from "vitest";
import { DESIGN_PRICES, DESIGN_MONTHLY_PACKAGES, DESIGN_TERMS, designConsultUrl } from "./design-creative";

describe("graphic design prices", () => {
  it.each([
    ["feed", 50_000, false], ["story", 35_000, false], ["carousel", 100_000, false], ["poster", 100_000, false],
    ["banner", 150_000, false], ["brochure", 150_000, false], ["menu", 150_000, false], ["pricelist", 100_000, false],
    ["catalog", 250_000, true], ["logo", 500_000, true], ["branding", 1_500_000, true], ["packaging", 350_000, true],
    ["invitation", 150_000, true], ["merchandise", 150_000, true], ["presentation", 250_000, true],
  ])("%s price", (id, price, startingFrom) => {
    expect(DESIGN_PRICES.find((p) => p.id === id)).toMatchObject({ price, startingFrom });
  });
  it.each([["basic", 500_000, 10, 0, false], ["business", 1_000_000, 20, 2, false], ["professional", 1_500_000, 30, 4, true]])("%s monthly package", (id, price, designs, carousels, priority) => {
    expect(DESIGN_MONTHLY_PACKAGES.find((p) => p.id === id)).toMatchObject({ price, designs, carousels, priority, revisions: 2 });
  });
  it("lists all four terms", () => {
    expect(DESIGN_TERMS.map((t) => t.text)).toEqual(["Harga belum termasuk cetak.", "Revisi tambahan dikenakan biaya.", "Desain kompleks menyesuaikan brief.", "File editable/source file dikenakan biaya tambahan."]);
  });
  it("consultation mentions the chosen package", () => {
    const url = new URL(designConsultUrl("https://wa.me/62812?text=x", "business"));
    expect(url.searchParams.get("text")).toBe("Halo Nempo, saya ingin konsultasi paket desain Business (Rp1.000.000/bulan).");
  });
});
