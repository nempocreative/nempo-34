import { describe, expect, it } from "vitest";
import {
  BIZ_BUNDLES, BIZ_CUSTOM, BIZ_INDUSTRY, BIZ_INDUSTRY_NOTE, BIZ_MAINTENANCE, BIZ_MAINTENANCE_EXCLUSION,
  BIZ_MAINTENANCE_SCOPE, BIZ_MANAGEMENT, BIZ_OPERATIONAL, BIZ_TAGLINE, BIZ_TERMS, bizConsultUrl, bizRupiah,
} from "./business-system";

const operational = (id: string) => BIZ_OPERATIONAL.find((s) => s.id === id);
const management = (id: string) => BIZ_MANAGEMENT.find((s) => s.id === id);
const industry = (id: string) => BIZ_INDUSTRY.find((s) => s.id === id);

describe("business system catalog", () => {
  it.each([
    ["qr-menu", 750_000],
    ["pos", 2_500_000],
    ["antrian", 1_500_000],
    ["reservasi", 2_000_000],
    ["membership", 1_500_000],
    ["voucher", 1_500_000],
    ["ticketing", 3_500_000],
  ])("operational %s costs %i", (id, price) => {
    expect(operational(id)).toMatchObject({ price, startingFrom: false });
  });

  it.each([
    ["cms", 2_000_000],
    ["finance", 2_500_000],
    ["inventory", 2_500_000],
    ["warehouse", 2_500_000],
    ["purchasing", 2_000_000],
    ["crm", 2_500_000],
    ["hr-payroll", 3_500_000],
    ["attendance", 1_500_000],
  ])("management %s costs %i", (id, price) => {
    expect(management(id)).toMatchObject({ price, startingFrom: false });
  });

  it("lists 7 operational and 8 management systems with features and targets", () => {
    expect(BIZ_OPERATIONAL).toHaveLength(7);
    expect(BIZ_MANAGEMENT).toHaveLength(8);
    for (const s of [...BIZ_OPERATIONAL, ...BIZ_MANAGEMENT]) {
      expect(s.features.length).toBeGreaterThan(3);
      expect(s.target).toMatch(/\./);
    }
  });

  it.each([
    ["salon", 5_000_000],
    ["cafe", 7_500_000],
    ["hotel", 7_500_000],
    ["school", 7_500_000],
    ["clinic", 7_500_000],
    ["rental", 3_000_000],
    ["property", 5_000_000],
    ["travel", 5_000_000],
    ["event", 5_000_000],
    ["cooperative", 7_500_000],
  ])("industry %s starts at %i", (id, price) => {
    expect(industry(id)).toMatchObject({ price });
  });

  it("industry note keeps prices as starting prices", () => {
    expect(BIZ_INDUSTRY).toHaveLength(10);
    expect(BIZ_INDUSTRY_NOTE).toContain("harga mulai");
    expect(BIZ_INDUSTRY_NOTE).toContain("dihitung terpisah");
  });

  it.each([
    ["small-business", 3_500_000, false, false],
    ["business-management", 7_500_000, false, true],
    ["enterprise", 15_000_000, true, false],
  ])("bundle %s", (id, price, startingFrom, recommended) => {
    expect(BIZ_BUNDLES.find((b) => b.id === id)).toMatchObject({ price, startingFrom, recommended });
  });

  it("bundle contents match the catalogue", () => {
    expect(BIZ_BUNDLES.find((b) => b.id === "small-business")?.items).toContain("QR Digital Menu");
    expect(BIZ_BUNDLES.find((b) => b.id === "business-management")?.items).toEqual(
      expect.arrayContaining(["POS / Sistem Kasir", "Inventory Management", "Finance Management"]),
    );
    expect(BIZ_BUNDLES.find((b) => b.id === "enterprise")?.items).toEqual(
      expect.arrayContaining(["HR & Payroll", "CRM", "Multi-cabang"]),
    );
  });

  it.each([
    ["basic", 150_000, false],
    ["business", 300_000, false],
    ["professional", 500_000, false],
    ["enterprise", 1_000_000, true],
    ["backup", 100_000, true],
  ])("maintenance %s", (id, price, startingFrom) => {
    expect(BIZ_MAINTENANCE.find((m) => m.id === id)).toMatchObject({ price, startingFrom, unit: "/bulan" });
  });

  it("hosting and support are quoted, not priced", () => {
    expect(BIZ_MAINTENANCE.find((m) => m.id === "hosting")).toMatchObject({ price: null, quoteNote: "Sesuai spesifikasi" });
    expect(BIZ_MAINTENANCE.find((m) => m.id === "support")).toMatchObject({ price: null, quoteNote: "Sesuai paket" });
  });

  it("maintenance scope and exclusion are stated", () => {
    expect(BIZ_MAINTENANCE_SCOPE).toHaveLength(5);
    expect(BIZ_MAINTENANCE_SCOPE).toContain("Backup database berkala sesuai paket.");
    expect(BIZ_MAINTENANCE_EXCLUSION).toBe("Maintenance tidak otomatis mencakup pembuatan fitur baru, perubahan besar, atau penambahan modul.");
  });

  it("payment, warranty and training terms are stated", () => {
    const terms = Object.fromEntries(BIZ_TERMS.map((t) => [t.label, t.detail]));
    expect(terms["Pembayaran awal"]).toBe("DP 50%");
    expect(terms["Pembayaran akhir"]).toBe("50% setelah testing dan sebelum serah terima");
    expect(terms["Garansi bug"]).toBe("30 hari setelah serah terima");
    expect(terms["Training"]).toBe("1 sesi pelatihan dasar");
    expect(terms["Domain & hosting"]).toBe("Terpisah jika belum termasuk paket");
  });

  it("custom development is offered without a fixed price", () => {
    expect(BIZ_CUSTOM.name).toBe("Custom Development");
    expect(BIZ_CUSTOM.desc).toContain("Web app");
    expect(BIZ_TAGLINE).toBe("Technology that moves your business forward.");
  });

  it("formats rupiah with dot separators", () => {
    expect(bizRupiah(750_000)).toBe("Rp750.000");
    expect(bizRupiah(2_500_000)).toBe("Rp2.500.000");
  });

  it("WhatsApp link carries the system name and price", () => {
    const url = bizConsultUrl("POS / Sistem Kasir", 2_500_000);
    expect(url).toMatch(/^https:\/\/wa\.me\/6285724981356\?text=/);
    const text = decodeURIComponent(url.split("?text=")[1]!);
    expect(text).toContain("POS / Sistem Kasir");
    expect(text).toContain("Rp2.500.000");
  });

  it("WhatsApp link for a custom request carries only the name", () => {
    const text = decodeURIComponent(bizConsultUrl(BIZ_CUSTOM.name).split("?text=")[1]!);
    expect(text).toContain("Custom Development");
    expect(text).not.toContain("Rp");
  });
});
