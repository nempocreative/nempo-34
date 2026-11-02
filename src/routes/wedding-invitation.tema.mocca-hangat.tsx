import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/mocca-hangat")({
  head: () => ({ meta: [
    { title: "NEMPO 07 — Mocca Hangat Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 07 Mocca Hangat dengan foto botanical vintage, jadwal acara, cerita, galeri, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 07 — Mocca Hangat Foto" },
    { property: "og:description", content: "Undangan Premium Vintage Foto dengan sentuhan mocca dan taman botanical dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});