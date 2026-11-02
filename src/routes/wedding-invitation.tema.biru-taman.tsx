import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/biru-taman")({
  head: () => ({ meta: [
    { title: "NEMPO 11 — Biru Taman Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 11 Biru Taman dengan foto pengantin, bunga pink dan biru, acara, cerita, galeri, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 11 — Biru Taman Foto" },
    { property: "og:description", content: "Undangan Spesial Foto bernuansa taman bunga pink dan biru dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});