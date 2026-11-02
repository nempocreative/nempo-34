import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/navy-elegan-tanpa-foto")({
  head: () => ({ meta: [
    { title: "NEMPO 06 — Navy Elegan Tanpa Foto | Nempo" },
    { name: "description", content: "Contoh undangan NEMPO 06 dengan cartoon pengantin beranimasi, jadwal acara, cerita cinta, RSVP, dan kado digital." },
    { property: "og:title", content: "NEMPO 06 — Navy Elegan Tanpa Foto" },
    { property: "og:description", content: "Undangan Minimalist Luxury Tanpa Foto bernuansa navy dan putih dengan ilustrasi cartoon pengantin dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});