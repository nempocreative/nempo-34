import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/merah-marun")({
  head: () => ({ meta: [
    { title: "NEMPO 15 — Merah Marun Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 15 Merah Marun dengan foto pengantin, nuansa marun dan emerald, acara, cerita, galeri, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 15 — Merah Marun Foto" },
    { property: "og:description", content: "Undangan Adat Foto bernuansa marun dan emerald dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});