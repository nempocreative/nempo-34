import { describe, expect, it } from "vitest";
import { WEB_PLANS, WEB_PROJECTS, WEBSITE_PACKAGES, WEBSITE_ADDITIONAL_FEES, WEBSITE_EXCLUSIONS, websiteConsultUrl, firstMonthTotal, monthlySaving, webRupiah } from "./web-development";

const plan = (id: string) => {
  const value = WEB_PLANS.find((p) => p.id === id);
  if (!value) throw new Error(`Missing plan ${id}`);
  return value;
};
const project = (id: string) => {
  const value = WEB_PROJECTS.find((p) => p.id === id);
  if (!value) throw new Error(`Missing project ${id}`);
  return value;
};

describe("current website packages supplied by the user", () => {
  it.each([
    ["landing-page", 1_500_000, ["Website 1 halaman", "Responsive mobile & desktop", "Informasi produk / jasa", "Tombol WhatsApp", "Google Maps", "Integrasi Instagram"]],
    ["umkm", 2_500_000, ["Maksimal 5 halaman", "Home, About, Produk, Galeri, Kontak", "Responsive", "WhatsApp", "Google Maps", "SEO dasar"]],
    ["company-profile", 4_000_000, ["Maksimal 10 halaman", "Desain profesional", "Profil perusahaan", "Layanan dan portfolio", "Artikel / berita", "Dashboard admin", "SEO dasar"]],
    ["professional", 7_500_000, ["Desain UI/UX custom", "Dashboard admin", "Manajemen konten", "Fitur sesuai kebutuhan", "SEO dasar", "Integrasi API sederhana"]],
    ["ecommerce", 8_500_000, ["Katalog produk", "Keranjang belanja", "Checkout", "Manajemen produk", "Dashboard admin", "Order management", "Integrasi WhatsApp"]],
  ])("%s has the exact price and inclusions", (id, price, items) => {
    const value = WEBSITE_PACKAGES.find((p) => p.id === id);
    expect(value?.price).toBe(price);
    expect(value?.items).toEqual(items);
  });

  it.each([
    ["domain", 200_000, undefined, "/tahun", true],
    ["hosting", 500_000, undefined, "/tahun", true],
    ["maintenance", 300_000, 1_000_000, "/bulan", false],
    ["content", 250_000, undefined, "/bulan", true],
    ["seo", 750_000, undefined, "/bulan", true],
  ])("%s has the specified fee and billing period", (id, price, maxPrice, unit, startingFrom) => {
    expect(WEBSITE_ADDITIONAL_FEES.find((f) => f.id === id)).toMatchObject({ price, unit, startingFrom });
    expect(WEBSITE_ADDITIONAL_FEES.find((f) => f.id === id)?.maxPrice).toBe(maxPrice);
  });

  it.each(["paymentGateway", "complexSystems", "customIntegrations"] as const)("%s is quoted separately", (key) => {
    expect(WEBSITE_EXCLUSIONS[key]).toBe(true);
  });

  it("consultation includes the selected package and correct price", () => {
    const url = new URL(websiteConsultUrl("https://wa.me/628123456789?text=old", "ecommerce"));
    expect(url.searchParams.get("text")).toBe("Halo Nempo, saya ingin konsultasi paket Website E-Commerce (Rp8.500.000).");
  });
});

describe("web development prices", () => {
  it("Company Website is Rp1.500.000, built once", () => {
    expect(project("company").price).toBe(1_500_000);
    expect(project("company").billing).toBe("sekali buat");
  });

  it("Link Bio is Rp49.000 per month and Event Ticketing Rp499.000 per event", () => {
    expect(project("link-bio").price).toBe(49_000);
    expect(project("ticketing").price).toBe(499_000);
  });

  it("first month = monthly price + setup, matching the price list", () => {
    expect(firstMonthTotal(plan("mulai-online"))).toBe(179_000);
    expect(firstMonthTotal(plan("operasional-rapi"))).toBe(499_000);
    expect(firstMonthTotal(plan("usaha-bertumbuh"))).toBe(749_000);
    expect(firstMonthTotal(plan("super-app"))).toBe(1_449_000);
  });

  it("monthly savings match the promo labels", () => {
    expect(monthlySaving(plan("mulai-online"))).toBe(20_000);
    expect(monthlySaving(plan("operasional-rapi"))).toBe(150_000);
    expect(monthlySaving(plan("usaha-bertumbuh"))).toBe(250_000);
    expect(monthlySaving(plan("super-app"))).toBe(400_000);
  });

  it("formats rupiah", () => {
    expect(webRupiah(1_449_000)).toBe("Rp1.449.000");
  });
});
