import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/peach-klasik-tanpa-foto")({
  head: () => ({ meta: [
    { title: "NEMPO 04 — Peach Klasik Tanpa Foto | Nempo" },
    { name: "description", content: "Contoh undangan NEMPO 04 dengan ilustrasi taman vintage, informasi acara, cerita cinta, RSVP, dan kado digital." },
    { property: "og:title", content: "NEMPO 04 — Peach Klasik Tanpa Foto" },
    { property: "og:description", content: "Undangan bernuansa peach dan taman klasik tanpa foto orang. Buka contoh NEMPO 04 dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});