const galleryAssets = import.meta.glob<string>("/src/assets/sosmed-gallery/*.jpg", { eager: true, query: "?url", import: "default" });

export interface SosmedTone {
  id: string;
  name: string;
  image: string;
  posts: string[];
}

function tones(category: string, names: [string, string]): SosmedTone[] {
  return names.map((name, index) => ({
    id: `${category}-${index}`,
    name,
    image: galleryAssets[`/src/assets/sosmed-gallery/${category}-${index}-grid.jpg`],
    posts: Array.from({ length: 9 }, (_, post) => galleryAssets[`/src/assets/sosmed-gallery/${category}-${index}-${post}.jpg`]),
  }));
}

export type SosmedPortfolioCategory = "Beauty" | "Fashion" | "Food" | "Cafe" | "Event" | "Skincare";

export interface SosmedPortfolioItem {
  id: string;
  name: string;
  category: SosmedPortfolioCategory;
  image: string;
  cover: number;
  tones: SosmedTone[];
}

export const SOSMED_PORTFOLIO_CATEGORIES: SosmedPortfolioCategory[] = [
  "Beauty",
  "Fashion",
  "Food",
  "Cafe",
  "Event",
  "Skincare",
];

export const SOSMED_PORTFOLIO: SosmedPortfolioItem[] = [
  { id: "beauty", name: "Social Media Beauty", category: "Beauty", cover: 0, tones: tones("beauty", ["Blush Pink", "Sage Botanical"]) },
  { id: "fashion", name: "Social Media Fashion", category: "Fashion", cover: 0, tones: tones("fashion", ["Neutral Editorial", "Cobalt Studio"]) },
  { id: "food", name: "Social Media Food", category: "Food", cover: 0, tones: tones("food", ["Warm Nusantara", "Fresh Green"]) },
  { id: "cafe", name: "Social Media Cafe", category: "Cafe", cover: 0, tones: tones("cafe", ["Espresso Warm", "Sky Blue"]) },
  { id: "event", name: "Social Media Event", category: "Event", cover: 0, tones: tones("event", ["Acoustic Amber", "Monochrome Stage"]) },
  { id: "skincare", name: "Social Media Skincare", category: "Skincare", cover: 1, tones: tones("skincare", ["Soft Lavender", "Peach Glow"]) },
].map((item) => ({ ...item, category: item.category as SosmedPortfolioCategory, image: item.tones[item.cover]?.image ?? item.tones[0]?.image ?? "" }));
