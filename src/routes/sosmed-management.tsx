import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/sosmed-management")({
  head: () => ({
    meta: [
      { title: "Sosmed Management Nempo — Kelola Instagram & TikTok" },
      { name: "description", content: "Jasa kelola media sosial Nempo: konten feed, reels, story, caption, jadwal posting, sampai iklan Instagram & TikTok. Paket bulanan mulai Rp750.000, Promo UMKM Rp1.500.000 per bulan." },
      { property: "og:title", content: "Sosmed Management Nempo — Kelola Instagram & TikTok" },
      { property: "og:description", content: "Konten, caption, jadwal posting, sampai iklan Instagram & TikTok. Paket bulanan Basic, Growth, dan Professional." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
