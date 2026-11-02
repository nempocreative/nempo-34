import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/navy-elegan")({
  head: () => ({ meta: [
    { title: "NEMPO 05 — Navy Elegan Foto | Nempo" },
    { name: "description", content: "Contoh undangan NEMPO 05 Navy Elegan: foto pengantin, jadwal pernikahan, cerita, galeri, RSVP, dan kado digital." },
    { property: "og:title", content: "NEMPO 05 — Navy Elegan Foto" },
    { property: "og:description", content: "Undangan Minimalist Luxury Foto dengan monogram, warna navy, dan aksen emas dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});