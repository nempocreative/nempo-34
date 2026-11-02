import { describe, expect, it } from "vitest";
import {
  SOSMED_ADDONS,
  SOSMED_BUNDLES,
  SOSMED_ITEMS,
  SOSMED_MONTHLY_PACKAGES,
  SOSMED_UMKM_PROMO,
  bundleSaving,
  rupiah,
  sosmedMonthlyPackage,
} from "./sosmed-packages";

const price = (id: string) => SOSMED_ITEMS.find((i) => i.id === id)?.price;
const pkg = (id: string) => sosmedMonthlyPackage(id);

describe("sosmed packages", () => {
  it("keeps per-item prices from the price list", () => {
    expect(price("ig-ads")).toBe(300_000);
    expect(price("ig-feed")).toBe(1_250_000);
    expect(price("ig-story")).toBe(250_000);
    expect(price("ig-reels")).toBe(650_000);
    expect(price("ig-highlight")).toBe(500_000);
    expect(price("tt-photo")).toBe(400_000);
    expect(price("tt-video")).toBe(500_000);
  });

  it("Paket Social Media is Rp4.000.000 (normal Rp5.000.000), saving Rp1.000.000", () => {
    const b = SOSMED_BUNDLES.find((x) => x.id === "social-media")!;
    expect(b.price).toBe(4_000_000);
    expect(b.normalPrice).toBe(5_000_000);
    expect(bundleSaving(b)).toBe(1_000_000);
  });

  it("All Promotion is Rp7.500.000 (normal Rp10.000.000), saving Rp2.500.000", () => {
    const b = SOSMED_BUNDLES.find((x) => x.id === "all-promotion")!;
    expect(b.price).toBe(7_500_000);
    expect(bundleSaving(b)).toBe(2_500_000);
  });

  it("formats rupiah with dots", () => {
    expect(rupiah(1_250_000)).toBe("Rp1.250.000");
  });

  it("has three monthly packages: Basic Rp750.000, Growth Rp1.500.000, Professional Rp2.500.000", () => {
    expect(SOSMED_MONTHLY_PACKAGES.map((p) => p.price)).toEqual([750_000, 1_500_000, 2_500_000]);
    expect(SOSMED_MONTHLY_PACKAGES.map((p) => p.name)).toEqual(["Paket Basic", "Paket Growth", "Paket Professional"]);
    expect(SOSMED_MONTHLY_PACKAGES.every((p) => p.unit === "/bulan")).toBe(true);
    expect(pkg("growth").recommended).toBe(true);
    expect(SOSMED_MONTHLY_PACKAGES.filter((p) => p.recommended)).toHaveLength(1);
  });

  it("Paket Basic holds 8 feed + 8 story, 1 Instagram account", () => {
    expect(pkg("basic").includes).toEqual([
      "8 desain Feed Instagram",
      "8 Instagram Story",
      "Caption dan hashtag",
      "Content planning",
      "Penjadwalan posting",
      "1 akun Instagram",
    ]);
  });

  it("Paket Growth holds 8 feed, 8 reels, 12 story, 1 production visit, monthly report", () => {
    expect(pkg("growth").includes).toEqual([
      "8 desain Feed",
      "8 video Reels",
      "12 Instagram Story",
      "Caption dan hashtag",
      "Content planning",
      "Posting dan penjadwalan",
      "1x kunjungan produksi konten (maks. 2 jam)",
      "Monthly report",
    ]);
  });

  it("Paket Professional holds 12 feed, 12 reels, 20 story, 2 production visits", () => {
    expect(pkg("professional").includes).toEqual([
      "12 desain Feed",
      "12 video Reels",
      "20 Instagram Story",
      "Caption dan copywriting",
      "Content planning",
      "Posting dan penjadwalan",
      "2x kunjungan produksi konten",
      "Optimasi profil Instagram",
      "Monthly report",
    ]);
  });

  it("UMKM promo is the Growth package price", () => {
    expect(SOSMED_UMKM_PROMO.price).toBe(1_500_000);
    expect(SOSMED_UMKM_PROMO.unit).toBe("/bulan");
    expect(SOSMED_UMKM_PROMO.includes).toEqual(pkg("growth").includes);
  });

  it("add-on prices match the price list", () => {
    const addons = Object.fromEntries(SOSMED_ADDONS.map((a) => [a.label, a.price]));
    expect(addons["Tambahan 1 Reels"]).toBe("Rp100.000");
    expect(addons["Tambahan 1 desain Feed"]).toBe("Rp50.000");
    expect(addons["Foto produk"]).toBe("Mulai Rp300.000");
    expect(addons["Video promosi bisnis"]).toBe("Mulai Rp500.000");
    expect(addons["Talent / model"]).toBe("Menyesuaikan");
    expect(addons["Meta Ads management"]).toBe("Mulai Rp300.000");
    expect(addons["TikTok management"]).toBe("Mulai Rp500.000");
    expect(SOSMED_ADDONS).toHaveLength(7);
  });
});
