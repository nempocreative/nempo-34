import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildNotifications, notificationItems } from "./notifications";
import { DESIGN_PRICES, designRupiah } from "./design-creative";
import { weddingPackages, weddingRupiah } from "./wedding-packages";
import { WEBSITE_PACKAGES, webRupiah } from "./web-development";
import { SOSMED_UMKM_PROMO, rupiah } from "./sosmed-packages";

const routeSource = readFileSync(resolve(process.cwd(), "src/nempo-app.tsx"), "utf8");
const registeredPaths = [...routeSource.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);

const messageFor = (href: string) =>
  notificationItems.filter((n) => n.href === href).map((n) => `${n.title} ${n.message}`).join(" ");

describe("isi notifikasi", () => {
  it("setiap tautan menunjuk halaman yang benar-benar terdaftar", () => {
    for (const item of notificationItems) {
      const path = item.href.split("#", 1)[0];
      expect(registeredPaths, `${item.href} tidak terdaftar`).toContain(path);
    }
  });

  it("tidak menyebut menu yang sudah dihapus dari situs", () => {
    const all = notificationItems.map((n) => `${n.title} ${n.message}`).join(" ").toLowerCase();
    for (const removed of ["metode pembayaran", "wishlist", "pesanan", "keranjang"]) {
      expect(all, `notifikasi masih menyebut "${removed}"`).not.toContain(removed);
    }
    const paths = notificationItems.map((n) => n.href.split("#", 1)[0]);
    for (const gone of ["/profile", "/wishlist", "/pesanan-saya"]) {
      expect(paths, `notifikasi masih menautkan ${gone}`).not.toContain(gone);
    }
  });

  it("harga paket wedding sama dengan daftar harga resmi", () => {
    const msg = messageFor("/wedding-organizer");
    for (const pkg of weddingPackages) {
      expect(msg).toContain(weddingRupiah(pkg.price));
      expect(msg).toContain(`tim ${pkg.team}`);
    }
  });

  it("harga paket sosmed sama dengan promo UMKM resmi", () => {
    const msg = messageFor("/sosmed-management");
    expect(msg).toContain(rupiah(SOSMED_UMKM_PROMO.price));
    expect(msg).toContain(SOSMED_UMKM_PROMO.unit);
  });

  it("harga desain kreatif sama dengan daftar harga resmi", () => {
    const msg = messageFor("/design-creative");
    for (const id of ["story", "feed", "poster", "banner", "logo", "branding"]) {
      const price = DESIGN_PRICES.find((p) => p.id === id);
      expect(price, `harga ${id} tidak ada di data`).toBeDefined();
      expect(msg).toContain(designRupiah(price!.price));
    }
  });

  it("harga website sama dengan daftar harga resmi", () => {
    const msg = messageFor("/web-development");
    for (const id of ["landing-page", "umkm", "company-profile", "professional", "ecommerce"]) {
      const pkg = WEBSITE_PACKAGES.find((p) => p.id === id);
      expect(pkg, `paket ${id} tidak ada di data`).toBeDefined();
      expect(msg).toContain(webRupiah(pkg!.price));
    }
  });

  it("dibuat urut dari yang terbaru", () => {
    const list = buildNotifications(new Date("2026-11-02T14:00:00Z"));
    expect(list[0]?.id).toBe(1);
    expect(list[0]?.created_at).toBe("2026-11-02T13:00:00.000Z");
    expect(list.at(-1)?.id).toBe(12);
    expect(list.at(-1)?.created_at).toBe("2026-10-30T06:00:00.000Z");
  });
});
