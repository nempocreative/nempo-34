import { describe, expect, it } from "vitest";
import { weddingDecor, weddingGowns, weddingKebaya, weddingMakeup, weddingMoodConsultUrl, weddingTones } from "./wedding-concepts";

describe("wedding concept studio", () => {
  it("offers Barbie and Bold makeup and includes the selected style in consultation", () => {
    expect(weddingMakeup.map((option) => option.name)).toEqual(expect.arrayContaining(["Barbie", "Bold"]));
    const tone = weddingTones[0];
    const decor = weddingDecor[0];
    const kebaya = weddingKebaya[0];
    if (!tone || !decor || !kebaya) throw new Error("Missing options");
    for (const makeup of weddingMakeup) {
      const text = new URL(weddingMoodConsultUrl({ tone, decor, kebaya, makeup })).searchParams.get("text");
      expect(text).toContain(`Makeup: ${makeup.name}`);
    }
  });
  it("shows four tones, each with swatch colors", () => {
    expect(weddingTones).toHaveLength(4);
    for (const tone of weddingTones) {
      expect(tone.hexes.length).toBeGreaterThan(2);
      for (const hex of tone.hexes) {
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("has a real photo for every decor and kebaya in every tone", () => {
    expect(weddingDecor).toHaveLength(4);
    expect(weddingKebaya).toHaveLength(3);
    for (const option of [...weddingDecor, ...weddingKebaya]) {
      for (const tone of weddingTones) {
        expect(option.images[tone.key]).toMatch(/wedding-(decor|mannequins)-.*\.jpg/);
      }
    }
  });

  it("pairs every kebaya with matching menswear in all four tones", () => {
    for (const outfit of weddingKebaya) {
      expect(outfit.groomName).toMatch(/^Beskap/);
      expect(new Set(Object.values(outfit.images)).size).toBe(4);
      for (const tone of weddingTones) {
        expect(outfit.images[tone.key]).toContain(`wedding-mannequins-${outfit.key}--${tone.key}.jpg`);
      }
    }
  });

  it("offers a dedicated gown with matching suit in every tone", () => {
    expect(weddingGowns.length).toBeGreaterThan(0);
    for (const gown of weddingGowns) {
      expect(gown.category).toBe("gown");
      expect(gown.groomName).toMatch(/^Jas/);
      for (const tone of weddingTones) {
        expect(gown.images[tone.key]).toContain(`wedding-mannequins-gown--${tone.key}.jpg`);
      }
    }
    const gown = weddingGowns[0];
    const tone = weddingTones[0];
    const decor = weddingDecor[0];
    if (!gown || !tone || !decor) throw new Error("Missing gown options");
    const text = new URL(weddingMoodConsultUrl({ tone, decor, kebaya: gown })).searchParams.get("text");
    expect(text).toContain(`Gaun: ${gown.name}`);
    expect(text).toContain(`Busana pria: ${gown.groomName}`);
    expect(text).not.toContain("Kebaya:");
  });

  it("sends the chosen combination to the official WhatsApp number", () => {
    const tone = weddingTones[2];
    const decor = weddingDecor[1];
    const kebaya = weddingKebaya[1];
    if (!tone || !decor || !kebaya) throw new Error("Missing wedding option");
    const url = new URL(weddingMoodConsultUrl({ tone, decor, kebaya }));
    expect(url.origin + url.pathname).toBe("https://wa.me/6285724981356");
    const text = url.searchParams.get("text") ?? "";
    expect(text).toContain(`Tone warna: ${tone.name}`);
    expect(text).toContain(`Pelaminan/dekor: ${decor.name}`);
    expect(text).toContain(`Kebaya: ${kebaya.name}`);
    expect(text).toContain(`Busana pria: ${kebaya.groomName} — ${tone.name}`);
  });
});
