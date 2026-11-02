import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/hitam-mewah")({
  head: () => ({ meta: [
    { title: "NEMPO 09 — Hitam Mewah Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 09 Hitam Mewah dengan foto pengantin, aksen emas, acara, cerita, galeri, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 09 — Hitam Mewah Foto" },
    { property: "og:description", content: "Undangan Minimalist Luxury Foto dalam hitam dan emas dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});