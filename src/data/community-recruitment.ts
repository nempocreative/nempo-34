import { NEMPO_WA_URL } from "@/lib/contact";

/**
 * Pilihan minat open recruitment Nempo Community — satu sumber untuk halaman
 * Recruitment dan halaman Komunitas.
 */
export const interestOptions = [
  "Designer",
  "Web Developer",
  "Content Creator",
  "Videografer dan Fotographer",
  "Marketing",
  "Event Management",
] as const;

export type CommunityApplication = {
  full_name: string;
  email: string;
  whatsapp: string;
  interest: string;
  reason?: string;
};

/** Isi pesan WhatsApp yang disiapkan setelah formulir diisi. */
export function buildApplicationMessage(app: CommunityApplication) {
  const lines = [
    "Halo Nempo! Saya mau daftar Nempo Community.",
    "",
    `Nama: ${app.full_name}`,
    `WhatsApp: ${app.whatsapp}`,
    `Email: ${app.email}`,
    `Minat: ${app.interest}`,
  ];
  if (app.reason) lines.push(`Cerita: ${app.reason}`);
  return lines.join("\n");
}

/** Tautan WhatsApp resmi Nempo dengan isian formulir sudah terisi. */
export function applicationWaUrl(app: CommunityApplication) {
  return `${NEMPO_WA_URL}?text=${encodeURIComponent(buildApplicationMessage(app))}`;
}
