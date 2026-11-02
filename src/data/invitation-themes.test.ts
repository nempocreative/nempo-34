import { describe, expect, it } from "vitest";
import { invitationCategories, invitationThemes, filterInvitationThemes, findInvitationTheme } from "./invitation-themes";

describe("invitation categories", () => {
  it("keeps NEMPO 16 as Merah Marun without people photos", () => {
    expect(findInvitationTheme("merah-marun-tanpa-foto")).toMatchObject({code: "NEMPO 16", category: "adat-no-photo", withPhoto: false});
  });
  it("keeps NEMPO 15 as Merah Marun with traditional wedding photos", () => {
    expect(findInvitationTheme("merah-marun")).toMatchObject({code: "NEMPO 15", category: "adat-photo", withPhoto: true});
  });
  it("keeps NEMPO 14 as the Rose Dusty no-photo traditional invitation", () => {
    expect(findInvitationTheme("rose-dusty-tanpa-foto")).toMatchObject({code: "NEMPO 14", category: "adat-no-photo", withPhoto: false});
  });
  it("keeps NEMPO 13 as Rose Dusty with traditional wedding photos", () => {
    expect(findInvitationTheme("rose-dusty")).toMatchObject({code: "NEMPO 13", category: "adat-photo", withPhoto: true});
  });
  it("keeps NEMPO 12 as Biru Taman without people photos", () => {
    expect(findInvitationTheme("biru-taman-tanpa-foto")).toMatchObject({
      code: "NEMPO 12", category: "special-no-photo", withPhoto: false,
    });
  });
  it("keeps NEMPO 11 as Biru Taman with photos", () => {
    expect(findInvitationTheme("biru-taman")).toMatchObject({
      code: "NEMPO 11", category: "special-photo", withPhoto: true,
    });
  });
  it("keeps NEMPO 10 as Hitam Mewah without people photos", () => {
    expect(findInvitationTheme("hitam-mewah-tanpa-foto")).toMatchObject({
      code: "NEMPO 10", category: "luxury-no-photo", withPhoto: false,
    });
  });
  it("keeps NEMPO 09 as the Hitam Mewah luxury photo invitation", () => {
    expect(findInvitationTheme("hitam-mewah")).toMatchObject({
      code: "NEMPO 09", category: "luxury-photo", withPhoto: true,
    });
  });
  it("keeps NEMPO 08 as the Mocca Hangat no-photo vintage invitation", () => {
    expect(findInvitationTheme("mocca-hangat-tanpa-foto")).toMatchObject({
      code: "NEMPO 08", category: "vintage-no-photo", withPhoto: false,
    });
  });
  it("keeps NEMPO 07 as the Mocca Hangat vintage photo invitation", () => {
    expect(findInvitationTheme("mocca-hangat")).toMatchObject({
      code: "NEMPO 07", category: "vintage-photo", withPhoto: true,
    });
  });
  it("keeps NEMPO 06 as the Navy Elegan no-photo invitation", () => {
    expect(findInvitationTheme("navy-elegan-tanpa-foto")).toMatchObject({
      code: "NEMPO 06", category: "luxury-no-photo", withPhoto: false,
    });
  });
  it("keeps NEMPO 05 as Navy Elegan with photos", () => {
    expect(findInvitationTheme("navy-elegan")).toMatchObject({
      code: "NEMPO 05", category: "luxury-photo", withPhoto: true,
    });
  });
  it("keeps NEMPO 04 as the Peach Klasik no-photo vintage invitation", () => {
    expect(findInvitationTheme("peach-klasik-tanpa-foto")).toMatchObject({
      code: "NEMPO 04", category: "vintage-no-photo", withPhoto: false,
    });
  });
  it("numbers themes NEMPO 01 onward and preserves codes when filtered", () => {
    expect(invitationThemes.map((theme) => theme.code)).toEqual(Array.from({ length: 16 }, (_, index) => `NEMPO ${String(index + 1).padStart(2, "0")}`));
    expect(filterInvitationThemes("vintage-photo").map((theme) => theme.code)).toEqual(["NEMPO 03", "NEMPO 07"]);
  });
  it("offers all eight requested photo and no-photo categories", () => {
    expect(invitationCategories.map((category) => category.name)).toEqual([
      "Spesial Foto", "Spesial Tanpa Foto", "Minimalist Luxury Foto", "Minimalist Luxury Tanpa Foto",
      "Premium Vintage Foto", "Premium Vintage Tanpa Foto", "Adat Foto", "Adat Tanpa Foto",
    ]);
  });
  it("has two available themes in every category", () => {
    for (const category of invitationCategories) {
      const themes = filterInvitationThemes(category.key);
      expect(themes).toHaveLength(2);
      expect(themes.every((theme) => theme.category === category.key)).toBe(true);
    }
    expect(filterInvitationThemes("all")).toHaveLength(16);
  });
  it("omits photos in every no-photo theme and preserves resolvable demo slugs", () => {
    expect(new Set(invitationThemes.map((theme) => theme.slug)).size).toBe(16);
    for (const theme of invitationThemes) {
      expect(theme.withPhoto).toBe(!theme.category.endsWith("no-photo"));
      expect(findInvitationTheme(theme.slug)).toEqual(theme);
    }
  });
});