export const invitationCategories = [
  { key: "special-photo", name: "Spesial Foto" },
  { key: "special-no-photo", name: "Spesial Tanpa Foto" },
  { key: "luxury-photo", name: "Minimalist Luxury Foto" },
  { key: "luxury-no-photo", name: "Minimalist Luxury Tanpa Foto" },
  { key: "vintage-photo", name: "Premium Vintage Foto" },
  { key: "vintage-no-photo", name: "Premium Vintage Tanpa Foto" },
  { key: "adat-photo", name: "Adat Foto" },
  { key: "adat-no-photo", name: "Adat Tanpa Foto" },
] as const;

export type InvitationCategoryKey = typeof invitationCategories[number]["key"];

export type InvitationTheme = {
  code: string;
  slug: string;
  name: string;
  mood: string;
  /** palette: bg, surface, ink, accent */
  colors: { bg: string; surface: string; ink: string; accent: string };
  ornament: "floral" | "leaf" | "star" | "minimal";
  category: InvitationCategoryKey;
  withPhoto: boolean;
};

const baseThemes: Omit<InvitationTheme, "category" | "withPhoto" | "code">[] = [
  { slug: "biru-bunga", name: "Biru Bunga", mood: "Bunga biru, lembut & segar", colors: { bg: "#5f8aa3", surface: "#f4f8fb", ink: "#1f3b5a", accent: "#2f5e8a" }, ornament: "floral" },
  { slug: "peach-klasik", name: "Peach Klasik", mood: "Krem hangat ala vintage", colors: { bg: "#c9a58f", surface: "#fbf4ee", ink: "#5a3e30", accent: "#a5714f" }, ornament: "floral" },
  { slug: "navy-elegan", name: "Navy Elegan", mood: "Navy tegas, huruf monogram", colors: { bg: "#3e5277", surface: "#eef1f7", ink: "#1b2742", accent: "#c9a84c" }, ornament: "minimal" },
  { slug: "mocca-hangat", name: "Mocca Hangat", mood: "Cokelat susu yang kalem", colors: { bg: "#a6876a", surface: "#faf5ee", ink: "#4b3624", accent: "#8b6440" }, ornament: "leaf" },
  { slug: "hitam-mewah", name: "Hitam Mewah", mood: "Gelap, dramatis, emas", colors: { bg: "#2a2a27", surface: "#1b1b19", ink: "#f0e6cf", accent: "#c9a84c" }, ornament: "star" },
  { slug: "biru-taman", name: "Biru Taman", mood: "Taman bunga pink & biru", colors: { bg: "#7891c4", surface: "#f3f5fb", ink: "#24335c", accent: "#d87a98" }, ornament: "floral" },
  { slug: "rose-dusty", name: "Rose Dusty", mood: "Pink pudar yang manis", colors: { bg: "#b39a95", surface: "#fbf3f1", ink: "#5b3f3b", accent: "#b4746c" }, ornament: "leaf" },
  { slug: "merah-marun", name: "Merah Marun", mood: "Mawar marun yang berani", colors: { bg: "#a86a74", surface: "#fdf2f3", ink: "#5e1f2b", accent: "#9b2335" }, ornament: "floral" },
];

const themeFamilies: Record<string, "special" | "luxury" | "vintage" | "adat"> = {
  "biru-bunga": "special", "biru-taman": "special",
  "navy-elegan": "luxury", "hitam-mewah": "luxury",
  "peach-klasik": "vintage", "mocca-hangat": "vintage",
  "rose-dusty": "adat", "merah-marun": "adat",
};

export const invitationThemes: InvitationTheme[] = baseThemes.flatMap((theme) => {
  const family = themeFamilies[theme.slug] ?? "special";
  return [
    { ...theme, category: `${family}-photo` as InvitationCategoryKey, withPhoto: true },
    { ...theme, slug: `${theme.slug}-tanpa-foto`, name: `${theme.name} Tanpa Foto`, category: `${family}-no-photo` as InvitationCategoryKey, withPhoto: false },
  ];
}).map((theme, index) => ({ ...theme, code: `NEMPO ${String(index + 1).padStart(2, "0")}` }));

export function filterInvitationThemes(category: InvitationCategoryKey | "all") {
  return category === "all" ? invitationThemes : invitationThemes.filter((theme) => theme.category === category);
}

export const findInvitationTheme = (slug: string) => invitationThemes.find((t) => t.slug === slug);
