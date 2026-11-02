/**
 * Poster palette helper.
 *
 * The event hero used to sit under a neutral black wash, which made every
 * poster look faded and put the side panel in colours that had nothing to do
 * with the poster next to it. These helpers read the poster's own colours so
 * the hero can be tinted with them instead.
 *
 * `paletteFromPixels` is pure and browser-safe (no DOM); only
 * `extractPosterPalette` touches the canvas, and it fails closed to `null`
 * so the hero can fall back to its old neutral look.
 */

export type Rgb = { r: number; g: number; b: number };

export type PosterPalette = {
  /** Darkest poster tone — panel background. */
  base: string;
  /** Base pushed further to black — hero edges and gradient start. */
  baseDeep: string;
  /** Base lifted slightly with the light tone — info cards. */
  soft: string;
  /** Most saturated poster tone — category chip and icons. */
  accent: string;
  /** Lightest poster tone — headings and values. */
  cream: string;
  /** Light tone pulled back toward base — small labels. */
  muted: string;
  /** Readable text colour on top of `accent`. */
  onAccent: string;
  /** Panel background: a solid gradient, so nothing reads as washed out. */
  panel: string;
  /** Hero wash tinted with the poster instead of plain black. */
  scrim: string;
};

const BLACK: Rgb = { r: 0, g: 0, b: 0 };
const WHITE: Rgb = { r: 255, g: 255, b: 255 };

const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

export function rgbToHex({ r, g, b }: Rgb): string {
  return "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}

export function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const k = Math.min(1, Math.max(0, t));
  return { r: a.r + (b.r - a.r) * k, g: a.g + (b.g - a.g) * k, b: a.b + (b.b - a.b) * k };
}

/** Relative luminance (0 = black, 1 = white). */
export function luminance({ r, g, b }: Rgb): number {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** How colourful a colour is (0 = grey, 1 = fully saturated). */
export function saturation({ r, g, b }: Rgb): number {
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  return mx === 0 ? 0 : (mx - mn) / mx;
}

function rgba({ r, g, b }: Rgb, alpha: number): string {
  return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${alpha})`;
}

type Bin = { color: Rgb; count: number };

/**
 * Build a palette from RGBA pixel data (as returned by `getImageData`).
 * Returns null when there is nothing usable to read.
 */
export function paletteFromPixels(pixels: ArrayLike<number>): PosterPalette | null {
  const bins = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;

  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha !== undefined && alpha < 128) continue;
    const r = pixels[i] ?? 0;
    const g = pixels[i + 1] ?? 0;
    const b = pixels[i + 2] ?? 0;
    const key = ((r >> 6) << 4) | ((g >> 6) << 2) | (b >> 6);
    const bin = bins.get(key);
    if (bin) {
      bin.r += r; bin.g += g; bin.b += b; bin.n += 1;
    } else {
      bins.set(key, { r, g, b, n: 1 });
    }
    total += 1;
  }

  if (!total) return null;

  const ranked: Bin[] = [...bins.values()]
    .filter((bin) => bin.n >= Math.max(2, total * 0.02))
    .map((bin) => ({ color: { r: bin.r / bin.n, g: bin.g / bin.n, b: bin.b / bin.n }, count: bin.n }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (!ranked.length) return null;

  const significant = ranked.filter((bin) => bin.count >= total * 0.05);
  const pool = significant.length ? significant : ranked;

  let base = pool.reduce((best, bin) => (luminance(bin.color) < luminance(best.color) ? bin : best), pool[0]!).color;
  // Dark enough that white text on the panel still reads comfortably.
  if (luminance(base) > 0.22) base = mix(base, BLACK, 0.7);

  let cream = pool.reduce((best, bin) => (luminance(bin.color) > luminance(best.color) ? bin : best), pool[0]!).color;
  if (luminance(cream) < 0.4) cream = mix(base, WHITE, 0.75);

  const others = pool.filter((bin) => rgbToHex(bin.color) !== rgbToHex(base));
  let accent = (others.length ? others : pool)
    .reduce((best, bin) => (saturation(bin.color) > saturation(best.color) ? bin : best), (others.length ? others : pool)[0]!)
    .color;
  if (rgbToHex(accent) === rgbToHex(base)) accent = mix(base, cream, 0.5);

  const baseDeep = mix(base, BLACK, 0.45);

  return {
    base: rgbToHex(base),
    baseDeep: rgbToHex(baseDeep),
    soft: rgbToHex(mix(base, cream, 0.1)),
    accent: rgbToHex(accent),
    cream: rgbToHex(cream),
    muted: rgbToHex(mix(base, cream, 0.9)),
    onAccent: luminance(accent) > 0.45 ? rgbToHex(mix(baseDeep, BLACK, 0.2)) : "#ffffff",
    panel: `linear-gradient(150deg, ${rgbToHex(baseDeep)} 0%, ${rgbToHex(base)} 100%)`,
    scrim: `linear-gradient(to bottom, ${rgba(baseDeep, 0.45)} 0%, transparent 42%, ${rgba(baseDeep, 0.78)} 100%)`,
  };
}

/**
 * Read an already-loaded poster image and return its palette.
 * Returns null when the canvas is unavailable or the image taints it.
 */
export function extractPosterPalette(img: HTMLImageElement): PosterPalette | null {
  try {
    if (!img.naturalWidth || !img.naturalHeight) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return paletteFromPixels(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
  } catch {
    return null;
  }
}
