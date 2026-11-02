// Talent Management — talent categories Nempo can book for events and productions.
// From Kenalan Nempo ("Creator & talent: konten, foto, video, panggung") and the wedding adat performers.
// Talent fees are quoted per event; no fixed prices are published.

import { NEMPO_WA_URL } from "@/lib/contact";

export type TalentCategory = { id: string; name: string; desc: string; examples: string[] };

export const TALENT_CATEGORIES: TalentCategory[] = [
  { id: "mc", name: "MC & Host", desc: "Pemandu acara yang bikin suasana hidup dan rundown tetap rapi.", examples: ["MC wedding", "Host corporate", "MC konser & festival"] },
  { id: "band", name: "Band & Musisi", desc: "Hiburan musik live untuk resepsi, gathering, sampai panggung festival.", examples: ["Full band", "Akustik", "Home band acara"] },
  { id: "penari", name: "Penari", desc: "Penampilan tari tradisional maupun modern untuk pembuka atau hiburan.", examples: ["Jaipong", "Tari tradisional Sunda", "Dance modern"] },
  { id: "vokalis", name: "Penyanyi", desc: "Vokalis solo atau duet untuk berbagai genre dan suasana acara.", examples: ["Penyanyi pop", "Penyanyi dangdut", "Vokalis wedding"] },
  { id: "model", name: "Model", desc: "Model untuk photoshoot produk, campaign brand, fashion show, dan event.", examples: ["Model foto produk", "Fashion show", "Usher & brand ambassador"] },
  { id: "budaya", name: "Seni Budaya Sunda", desc: "Pengisi acara adat dan budaya Sunda dari vendor rekanan.", examples: ["Lengser & Ambu", "Kecapi suling", "Sinden"] },
  { id: "creator", name: "Content Creator", desc: "Creator dan influencer untuk review, liputan, dan campaign digital.", examples: ["Review tempat", "Liputan event", "Campaign brand"] },
  { id: "foto-video", name: "Fotografer & Videografer", desc: "Dokumentasi acara dan produksi konten foto maupun video.", examples: ["Dokumentasi event", "Foto produk", "Video highlight"] },
];

export const EVENT_TYPES = ["Pernikahan", "Corporate / Gathering", "Konser & Festival", "Launching Produk", "Photoshoot / Campaign", "Acara Sekolah & Kampus", "Lainnya"] as const;

export type TalentRequest = { eventType: string; talentIds: string[]; date: string; location: string; note: string };

/** Builds the message a client sends to Nempo to request talents. */
export function buildTalentRequestMessage(r: TalentRequest): string {
  const names = r.talentIds
    .map((id) => TALENT_CATEGORIES.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];
  const lines = [
    "Halo Nempo, saya mau booking talent 🙌",
    `Acara: ${r.eventType || "-"}`,
    `Talent: ${names.length ? names.join(", ") : "-"}`,
    `Tanggal: ${r.date.trim() || "-"}`,
    `Lokasi: ${r.location.trim() || "-"}`,
  ];
  if (r.note.trim()) lines.push(`Catatan: ${r.note.trim()}`);
  return lines.join("\n");
}

/** Opens the Nempo WhatsApp chat with the request already typed in. */
export function buildTalentRequestUrl(r: TalentRequest): string {
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(buildTalentRequestMessage(r))}`;
}

export const canSendTalentRequest = (r: TalentRequest) => Boolean(r.eventType) && r.talentIds.length > 0;
