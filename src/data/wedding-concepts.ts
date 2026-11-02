import { NEMPO_WA_URL } from "@/lib/contact";
import makeupBarbie from "@/assets/wedding-makeup-barbie.jpg";
import makeupBold from "@/assets/wedding-makeup-bold.jpg";
import makeupNatural from "@/assets/wedding-makeup-natural.jpg";
import makeupSoftGlam from "@/assets/wedding-makeup-soft-glam.jpg";
import makeupKorean from "@/assets/wedding-makeup-korean.jpg";

import ballroomBurgundy from "@/assets/graded/wedding-decor-ballroom--burgundy.jpg";
import ballroomRose from "@/assets/graded/wedding-decor-ballroom--rose.jpg";
import ballroomSage from "@/assets/graded/wedding-decor-ballroom--sage.jpg";
import ballroomSky from "@/assets/graded/wedding-decor-ballroom--sky.jpg";
import classicBurgundy from "@/assets/graded/wedding-decor-classic--burgundy.jpg";
import classicRose from "@/assets/graded/wedding-decor-classic--rose.jpg";
import classicSage from "@/assets/graded/wedding-decor-classic--sage.jpg";
import classicSky from "@/assets/graded/wedding-decor-classic--sky.jpg";
import gardenBurgundy from "@/assets/graded/wedding-decor-garden--burgundy.jpg";
import gardenRose from "@/assets/graded/wedding-decor-garden--rose.jpg";
import gardenSage from "@/assets/graded/wedding-decor-garden--sage.jpg";
import gardenSky from "@/assets/graded/wedding-decor-garden--sky.jpg";
import greenhouseBurgundy from "@/assets/graded/wedding-decor-greenhouse--burgundy.jpg";
import greenhouseRose from "@/assets/graded/wedding-decor-greenhouse--rose.jpg";
import greenhouseSage from "@/assets/graded/wedding-decor-greenhouse--sage.jpg";
import greenhouseSky from "@/assets/graded/wedding-decor-greenhouse--sky.jpg";
import kebayaGoldBurgundy from "@/assets/graded/wedding-mannequins-gold--burgundy.jpg";
import kebayaGoldRose from "@/assets/graded/wedding-mannequins-gold--rose.jpg";
import kebayaGoldSage from "@/assets/graded/wedding-mannequins-gold--sage.jpg";
import kebayaGoldSky from "@/assets/graded/wedding-mannequins-gold--sky.jpg";
import kebayaIvoryBurgundy from "@/assets/graded/wedding-mannequins-ivory--burgundy.jpg";
import kebayaIvoryRose from "@/assets/graded/wedding-mannequins-ivory--rose.jpg";
import kebayaIvorySage from "@/assets/graded/wedding-mannequins-ivory--sage.jpg";
import kebayaIvorySky from "@/assets/graded/wedding-mannequins-ivory--sky.jpg";
import kebayaRoseBurgundy from "@/assets/graded/wedding-mannequins-rose--burgundy.jpg";
import kebayaRoseRose from "@/assets/graded/wedding-mannequins-rose--rose.jpg";
import kebayaRoseSage from "@/assets/graded/wedding-mannequins-rose--sage.jpg";
import kebayaRoseSky from "@/assets/graded/wedding-mannequins-rose--sky.jpg";
import gownSage from "@/assets/graded/wedding-mannequins-gown--sage.jpg";
import gownRose from "@/assets/graded/wedding-mannequins-gown--rose.jpg";
import gownBurgundy from "@/assets/graded/wedding-mannequins-gown--burgundy.jpg";
import gownSky from "@/assets/graded/wedding-mannequins-gown--sky.jpg";

export type ToneKey = "sage" | "rose" | "burgundy" | "sky";

export type WeddingTone = {
  key: ToneKey;
  name: string;
  swatches: string[];
  hexes: string[];
  note: string;
};

export type WeddingOption = {
  key: string;
  name: string;
  note: string;
  width: number;
  height: number;
  images: Record<ToneKey, string>;
};

export const weddingTones: WeddingTone[] = [
  {
    key: "sage",
    name: "Sage & Ivory",
    swatches: ["bg-wed-sage", "bg-wed-ivory", "bg-wed-gold"],
    hexes: ["#7f9a72", "#f7f2e7", "#c79a4a"],
    note: "Segar dan tenang, cocok untuk akad pagi atau acara outdoor.",
  },
  {
    key: "rose",
    name: "Rose & Champagne",
    swatches: ["bg-wed-dust", "bg-wed-champagne", "bg-wed-ivory"],
    hexes: ["#c68a9b", "#e9cdb4", "#f7f2e7"],
    note: "Romantis dan hangat, paling aman untuk resepsi indoor.",
  },
  {
    key: "burgundy",
    name: "Burgundy & Gold",
    swatches: ["bg-wed-burgundy", "bg-wed-gold", "bg-wed-ivory"],
    hexes: ["#6d1f2c", "#c79a4a", "#f7f2e7"],
    note: "Mewah dan dramatis, bagus untuk acara malam hari.",
  },
  {
    key: "sky",
    name: "Sky & Pearl",
    swatches: ["bg-wed-sky", "bg-wed-pearl", "bg-wed-sage"],
    hexes: ["#7fa3bd", "#f2ede4", "#9bb08c"],
    note: "Bersih dan terang, pas untuk tema garden & beach party.",
  },
];

export const weddingDecor: WeddingOption[] = [
  {
    key: "garden",
    name: "Garden Romance",
    note: "Bunga putih, dedaunan, dan nuansa taman yang segar.",
    width: 1200,
    height: 800,
    images: { sage: gardenSage, rose: gardenRose, burgundy: gardenBurgundy, sky: gardenSky },
  },
  {
    key: "classic",
    name: "Sunda Classic",
    note: "Gebyok berukir dengan bunga dan sentuhan emas.",
    width: 1200,
    height: 800,
    images: { sage: classicSage, rose: classicRose, burgundy: classicBurgundy, sky: classicSky },
  },
  {
    key: "greenhouse",
    name: "Greenhouse Hijau",
    note: "Rangka kaca dan rotan dengan daun tropis.",
    width: 1024,
    height: 1280,
    images: {
      sage: greenhouseSage,
      rose: greenhouseRose,
      burgundy: greenhouseBurgundy,
      sky: greenhouseSky,
    },
  },
  {
    key: "ballroom",
    name: "Ballroom Emas",
    note: "Drapery, lilin, dan lampu gantung di dalam gedung.",
    width: 1024,
    height: 1280,
    images: { sage: ballroomSage, rose: ballroomRose, burgundy: ballroomBurgundy, sky: ballroomSky },
  },
];

export type WeddingOutfit = WeddingOption & { groomName: string; category?: "gown" };

export const weddingKebaya: WeddingOutfit[] = [
  {
    key: "ivory",
    name: "Ivory Lace",
    groomName: "Beskap Lace",
    note: "Bordir lembut, warna ivory, dan kain batik klasik.",
    width: 1200,
    height: 1104,
    images: {
      sage: kebayaIvorySage,
      rose: kebayaIvoryRose,
      burgundy: kebayaIvoryBurgundy,
      sky: kebayaIvorySky,
    },
  },
  {
    key: "rose",
    name: "Dusty Rose",
    groomName: "Beskap Floral",
    note: "Kebaya bernuansa rose dengan detail floral yang romantis.",
    width: 1200,
    height: 1104,
    images: {
      sage: kebayaRoseSage,
      rose: kebayaRoseRose,
      burgundy: kebayaRoseBurgundy,
      sky: kebayaRoseSky,
    },
  },
  {
    key: "gold",
    name: "Sona Emas",
    groomName: "Beskap Sona Emas",
    note: "Kebaya bersulam benang emas dengan batik klasik.",
    width: 1200,
    height: 1104,
    images: {
      sage: kebayaGoldSage,
      rose: kebayaGoldRose,
      burgundy: kebayaGoldBurgundy,
      sky: kebayaGoldSky,
    },
  },
];

export const weddingGowns: WeddingOutfit[] = [
  {
    key: "gown",
    name: "Floral Fairytale",
    groomName: "Jas Fairytale",
    category: "gown",
    note: "Gaun tulle mengembang dengan bunga tiga dimensi dan pita lembut.",
    width: 1200,
    height: 1104,
    images: { sage: gownSage, rose: gownRose, burgundy: gownBurgundy, sky: gownSky },
  },
];

export const weddingOutfits = [...weddingKebaya, ...weddingGowns];

export type WeddingMakeup = {
  key: string;
  name: string;
  note: string;
  image: string;
};

export const weddingMakeup: WeddingMakeup[] = [
  { key: "barbie", name: "Barbie", image: makeupBarbie, note: "Mata doll-eye, bulu mata lentik, blush pink, dan bibir rosy." },
  { key: "bold", name: "Bold", image: makeupBold, note: "Mata tegas, eyeliner dramatis, contour terdefinisi, dan lipstik statement." },
  { key: "natural", name: "Natural", image: makeupNatural, note: "Complexion ringan, alis lembut, dan warna nude yang segar." },
  { key: "soft-glam", name: "Soft Glam", image: makeupSoftGlam, note: "Eyeshadow champagne, kulit satin, dan bibir nude peach." },
  { key: "korean", name: "Korean", image: makeupKorean, note: "Kulit dewy, blush lembut, shimmer halus, dan bibir gradasi." },
];

export type WeddingMood = {
  tone: WeddingTone;
  decor: WeddingOption;
  kebaya: WeddingOutfit;
  makeup?: WeddingMakeup;
};

export function weddingMoodConsultUrl(mood: WeddingMood): string {
  const text = [
    "Halo Nempo Garut Organizer! Saya mau konsultasi konsep pernikahan:",
    `• Tone warna: ${mood.tone.name}`,
    `• Pelaminan/dekor: ${mood.decor.name}`,
    `• ${mood.kebaya.category === "gown" ? "Gaun" : "Kebaya"}: ${mood.kebaya.name}`,
    `• Busana pria: ${mood.kebaya.groomName} — ${mood.tone.name}`,
    ...(mood.makeup ? [`• Makeup: ${mood.makeup.name}`] : []),
    "Boleh dibantu pengecekan ketersediaan dan estimasinya?",
  ].join("\n");
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(text)}`;
}

export function weddingToneByKey(key: ToneKey): WeddingTone {
  const found = weddingTones.find((tone) => tone.key === key);
  if (!found) throw new Error(`Unknown tone key: ${key}`);
  return found;
}
