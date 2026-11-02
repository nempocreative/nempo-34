// Graphic design prices and package limits supplied by the user.
export const DESIGN_PRICES = [
  { id: "feed", name: "Desain Feed Instagram", price: 50_000, startingFrom: false },
  { id: "story", name: "Desain Instagram Story", price: 35_000, startingFrom: false },
  { id: "carousel", name: "Desain Carousel", price: 100_000, startingFrom: false },
  { id: "poster", name: "Desain Poster / Flyer", price: 100_000, startingFrom: false },
  { id: "banner", name: "Desain Banner / Spanduk", price: 150_000, startingFrom: false },
  { id: "brochure", name: "Desain Brosur", price: 150_000, startingFrom: false },
  { id: "menu", name: "Desain Menu Cafe / Resto", price: 150_000, startingFrom: false },
  { id: "pricelist", name: "Desain Pricelist", price: 100_000, startingFrom: false },
  { id: "catalog", name: "Desain Katalog Produk", price: 250_000, startingFrom: true },
  { id: "logo", name: "Desain Logo", price: 500_000, startingFrom: true },
  { id: "branding", name: "Branding Identity", price: 1_500_000, startingFrom: true },
  { id: "packaging", name: "Desain Packaging", price: 350_000, startingFrom: true },
  { id: "invitation", name: "Desain Undangan Digital", price: 150_000, startingFrom: true },
  { id: "merchandise", name: "Desain Merchandise", price: 150_000, startingFrom: true },
  { id: "presentation", name: "Desain Presentasi / Proposal", price: 250_000, startingFrom: true },
] as const;

export const DESIGN_MONTHLY_PACKAGES = [
  { id: "basic", name: "Basic", price: 500_000, designs: 10, carousels: 0, revisions: 2, formats: ["JPG", "PNG"], priority: false },
  { id: "business", name: "Business", price: 1_000_000, designs: 20, carousels: 2, revisions: 2, formats: ["JPG", "PNG"], priority: false },
  { id: "professional", name: "Professional", price: 1_500_000, designs: 30, carousels: 4, revisions: 2, formats: ["JPG", "PNG"], priority: true },
] as const;

export const DESIGN_TERMS = [
  { id: "printing", extraCharge: true, text: "Harga belum termasuk cetak." },
  { id: "revisions", extraCharge: true, text: "Revisi tambahan dikenakan biaya." },
  { id: "complex", perBrief: true, text: "Desain kompleks menyesuaikan brief." },
  { id: "source", extraCharge: true, text: "File editable/source file dikenakan biaya tambahan." },
] as const;

export const designRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export function designConsultUrl(base: string, id: string) {
  const monthly = DESIGN_MONTHLY_PACKAGES.find((p) => p.id === id);
  const single = DESIGN_PRICES.find((p) => p.id === id);
  if (!monthly && !single) return base;
  const url = new URL(base);
  const detail = monthly ? `paket desain ${monthly.name} (${designRupiah(monthly.price)}/bulan)` : single ? `${single.name} (${single.startingFrom ? "mulai " : ""}${designRupiah(single.price)})` : "desain";
  url.searchParams.set("text", `Halo Nempo, saya ingin konsultasi ${detail}.`);
  return url.toString();
}
