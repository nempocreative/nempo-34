import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/rose-dusty")({
  head: () => ({ meta: [
    { title: "NEMPO 13 — Rose Dusty Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 13 Rose Dusty dengan foto pengantin, nuansa rose dan sage, acara, cerita, galeri, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 13 — Rose Dusty Foto" },
    { property: "og:description", content: "Undangan Adat Foto bernuansa rose dan sage dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});