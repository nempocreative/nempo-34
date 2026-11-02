import { describe, expect, it } from "vitest";
import { bottomNavItems } from "./bottom-nav-items";

describe("navigasi bawah", () => {
  it("berisi Recruitment, Portofolio, dan Contact", () => {
    const labels = bottomNavItems.map((item) => item.label);
    expect(labels).toEqual(["Beranda", "Recruitment", "Event", "Portofolio", "Contact"]);
    const hrefs = bottomNavItems.map((item) => item.href);
    expect(hrefs).toEqual(["/", "/recruitment", "/event", "/portofolio", "/contact"]);
  });

  it("tidak lagi memuat Wishlist, Pesanan, atau Profile", () => {
    const labels = bottomNavItems.map((item) => item.label);
    expect(labels).not.toContain("Wishlist");
    expect(labels).not.toContain("Pesanan");
    expect(labels).not.toContain("Profile");
  });
});
