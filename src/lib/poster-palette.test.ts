import { describe, expect, it } from "vitest";
import { luminance, mix, paletteFromPixels, rgbToHex, saturation, type Rgb } from "./poster-palette";

/** Build RGBA pixel data from a list of [colour, how many pixels] pairs. */
function swatch(pairs: Array<[Rgb, number]>): Uint8ClampedArray {
  const total = pairs.reduce((sum, [, n]) => sum + n, 0);
  const data = new Uint8ClampedArray(total * 4);
  let at = 0;
  for (const [color, n] of pairs) {
    for (let i = 0; i < n; i++) {
      data[at++] = color.r;
      data[at++] = color.g;
      data[at++] = color.b;
      data[at++] = 255;
    }
  }
  return data;
}

// Sampled from the MusiComedy Night poster: maroon, gold, dark brown.
const MAROON: Rgb = { r: 146, g: 33, b: 15 };
const GOLD: Rgb = { r: 231, g: 178, b: 100 };
const BROWN: Rgb = { r: 91, g: 33, b: 26 };

describe("paletteFromPixels", () => {
  it("returns the poster's own tones for the MusiComedy poster colours", () => {
    const palette = paletteFromPixels(swatch([[MAROON, 600], [GOLD, 250], [BROWN, 150]]));
    expect(palette).not.toBeNull();
    expect(palette!.base).toBe("#5b211a");
    expect(palette!.cream).toBe("#e7b264");
    expect(palette!.accent).toBe("#92210f");
    expect(palette!.onAccent).toBe("#ffffff");
  });

  it("tints the hero wash with the poster instead of plain black", () => {
    const palette = paletteFromPixels(swatch([[MAROON, 600], [GOLD, 250], [BROWN, 150]]));
    expect(palette!.scrim).toContain("rgba(50, 18, 14");
    expect(palette!.scrim).not.toContain("rgba(0, 0, 0");
    expect(palette!.panel).toContain(palette!.base);
    expect(palette!.panel).toContain(palette!.baseDeep);
  });

  it("keeps a mostly-light poster dark enough to hold white text", () => {
    const palette = paletteFromPixels(
      swatch([[[245, 245, 245] as Rgb, 700], [[120, 170, 230] as Rgb, 300]]),
    );
    expect(palette).not.toBeNull();
    expect(luminance({ r: parseInt(palette!.base.slice(1, 3), 16), g: parseInt(palette!.base.slice(3, 5), 16), b: parseInt(palette!.base.slice(5, 7), 16) })).toBeLessThan(0.5);
    expect(palette!.cream).toBe("#ffffff");
  });

  it("uses dark text when the accent tone is a light one", () => {
    const palette = paletteFromPixels(
      swatch([[[30, 40, 60] as Rgb, 500], [[250, 220, 120] as Rgb, 500]]),
    );
    expect(palette).not.toBeNull();
    const accent = {
      r: parseInt(palette!.accent.slice(1, 3), 16),
      g: parseInt(palette!.accent.slice(3, 5), 16),
      b: parseInt(palette!.accent.slice(5, 7), 16),
    };
    expect(luminance(accent)).toBeGreaterThan(0.45);
    expect(palette!.onAccent).toBe(rgbToHex(mix({ r: 0, g: 0, b: 0 }, accent, 0)));
  });

  it("returns null when every pixel is transparent", () => {
    expect(paletteFromPixels(new Uint8ClampedArray(4 * 100))).toBeNull();
  });
});

describe("colour helpers", () => {
  it("rates maroon as more colourful than gold", () => {
    expect(saturation(MAROON)).toBeGreaterThan(saturation(GOLD));
    expect(rgbToHex(MAROON)).toBe("#92210f");
  });
});
