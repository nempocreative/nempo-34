import type React from "react";

export type Category3D = {
  id: string;
  name: string;
  path: string;
  bg: string;
  shadow: string;
  Icon?: React.ComponentType;
  imageSrc?: string;
  lottieSrc?: string;
  lottieSize?: number;
  lottieOffsetX?: number;
  lottieOffsetY?: number;
  imgScale?: number;
  popOut?: boolean;
  popScaleMin?: number;
  popScaleMax?: number;
  popTranslateX?: string;
  popTranslateY?: string;
  customGradient?: string;
};

export const categories3D: Category3D[] = [
  { id: "wisata",      name: "Wisata",      path: "/wisata",         bg: "#0194f3", shadow: "#1BA0E2", lottieSrc: "animations/icon-wisata.json",       lottieSize: 44, lottieOffsetX: 3,                 customGradient: "linear-gradient(145deg, #fed7aa 0%, #0194f3 50%, #0172B1 100%)" },
  { id: "kuliner",     name: "Kuliner",     path: "/kuliner",        bg: "#2dd4bf", shadow: "#0d9488", lottieSrc: "animations/icon-kuliner.json",      lottieSize: 54,                                   customGradient: "linear-gradient(145deg, #99f6e4 0%, #2dd4bf 45%, #0f766e 100%)" },
  { id: "jajan-yuk",   name: "Jajan YUK",   path: "/jajan-yuk",      bg: "#f97316", shadow: "#c2410c",                                                      customGradient: "linear-gradient(145deg, #fed7aa 0%, #f97316 48%, #c2410c 100%)" },
  { id: "cafe",        name: "Cafe",        path: "/cafe",           bg: "#7c3aed", shadow: "#4c1d95", customGradient: "linear-gradient(145deg, #ede9fe 0%, #7c3aed 45%, #4c1d95 100%)" },
  { id: "warung",      name: "Warung",      path: "/warung",         bg: "#d97706", shadow: "#92400e", customGradient: "linear-gradient(145deg, #fef3c7 0%, #f59e0b 50%, #92400e 100%)" },
  { id: "tiket-event", name: "Event",       path: "/event",          bg: "#64748b", shadow: "#334155", lottieSrc: "animations/icon-event.json",       lottieSize: 70, lottieOffsetX: 2, lottieOffsetY: 4, customGradient: "linear-gradient(145deg, #cbd5e1 0%, #64748b 45%, #1e293b 100%)" },
  { id: "sewa-mobil",  name: "Travel",      path: "/rent-car",       bg: "#facc15", shadow: "#d97706", lottieSrc: "animations/icon-sewa-mobil.json",  lottieSize: 70,                                   customGradient: "linear-gradient(145deg, #fef9c3 0%, #facc15 45%, #ca8a04 100%)" },
  { id: "adventure",   name: "Adventure",   path: "/adventure-gear", bg: "#4ade80", shadow: "#15803d", lottieSrc: "animations/icon-adventure.json",   lottieSize: 56, lottieOffsetX: 1, lottieOffsetY: -2, customGradient: "linear-gradient(145deg, #bbf7d0 0%, #4ade80 45%, #15803d 100%)" },
  { id: "penginapan",  name: "Hotel",       path: "/penginapan",     bg: "#818cf8", shadow: "#4338ca", lottieSrc: "animations/icon-penginapan.json",  lottieSize: 56,                                   customGradient: "linear-gradient(145deg, #e0e7ff 0%, #818cf8 45%, #4338ca 100%)" },
  { id: "talent",          name: "Talenta Lokal",   path: "/talent",          bg: "#c026d3", shadow: "#701a75", customGradient: "linear-gradient(145deg, #f5d0fe 0%, #c026d3 50%, #701a75 100%)" },
  { id: "layanan-digital", name: "Digi Nempo",      path: "/digital-services",bg: "#06b6d4", shadow: "#155e75", customGradient: "linear-gradient(145deg, #a5f3fc 0%, #06b6d4 50%, #155e75 100%)" },
  { id: "daftar-harga",    name: "Kerja sama",      path: "/price-list",      bg: "#84cc16", shadow: "#365314", customGradient: "linear-gradient(145deg, #d9f99d 0%, #84cc16 50%, #365314 100%)" },
  { id: "komunitas",       name: "Komunitas",       path: "/komunitas",       bg: "#38bdf8", shadow: "#0369a1", customGradient: "linear-gradient(145deg, #bae6fd 0%, #38bdf8 50%, #0369a1 100%)" },
  { id: "influencer-hub",  name: "Influencer",      path: "/influencer-hub",  bg: "#ec4899", shadow: "#9d174d", customGradient: "linear-gradient(145deg, #fbcfe8 0%, #ec4899 50%, #9d174d 100%)" },
  { id: "merchandise",     name: "Merchandise",     path: "/merchandise",     bg: "#0194f3", shadow: "#0172B1", customGradient: "linear-gradient(145deg, #bae6fd 0%, #0194f3 50%, #0172B1 100%)" },
  { id: "cultural-tour",   name: "Cultural Tour",   path: "/cultural-tour", bg: "#b7793d", shadow: "#704214", customGradient: "linear-gradient(145deg, #fef3c7 0%, #c88a4d 50%, #704214 100%)" },
  { id: "voucher",         name: "Voucher",         path: "/voucherlist",     bg: "#f43f5e", shadow: "#9f1239", customGradient: "linear-gradient(145deg, #fecdd3 0%, #f43f5e 50%, #9f1239 100%)" },
  { id: "kamus-sunda",     name: "Kamus",           path: "/kamus-sunda",     bg: "#f59e0b", shadow: "#92400e", customGradient: "linear-gradient(145deg, #fde68a 0%, #f59e0b 50%, #92400e 100%)" },
];
