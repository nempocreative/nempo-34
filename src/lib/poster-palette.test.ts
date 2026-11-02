import { describe, expect, it } from "vitest";
import { luminance, paletteFromPixels, rgbToHex, saturation, type Rgb } from "./poster-palette";

const WHITE: Rgb = { r: 255, g: 255, b: 255 };

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

function toRgb(hex: string): Rgb {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function contrast(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
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

  it("keeps small card labels readable on the card background", () => {
    const palette = paletteFromPixels(swatch([[MAROON, 600], [GOLD, 250], [BROWN, 150]]));
    expect(palette).not.toBeNull();
    expect(contrast(toRgb(palette!.muted), toRgb(palette!.soft))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(toRgb(palette!.cream), toRgb(palette!.base))).toBeGreaterThanOrEqual(4.5);
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
      swatch([[{ r: 245, g: 245, b: 245 }, 700], [{ r: 120, g: 170, b: 230 }, 300]]),
    );
    expect(palette).not.toBeNull();
    // Panel must be readable with white text, but still the poster's own blue.
    expect(contrast(toRgb(palette!.base), WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(toRgb(palette!.base).b).toBeGreaterThan(toRgb(palette!.base).r);
    // The light tone is the poster's own near-white, not a made-up pure white.
    expect(palette!.cream).toBe("#f5f5f5");
  });

  it("uses dark text when the accent tone is a light one", () => {
    const palette = paletteFromPixels(
      swatch([[{ r: 30, g: 40, b: 60 }, 500], [{ r: 250, g: 220, b: 120 }, 500]]),
    );
    expect(palette).not.toBeNull();
    expect(palette!.accent).toBe("#fadc78");
    expect(contrast(toRgb(palette!.onAccent), toRgb(palette!.accent))).toBeGreaterThanOrEqual(4.5);
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
