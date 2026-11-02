import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/mocca-hangat-tanpa-foto")({
  head: () => ({ meta: [
    { title: "NEMPO 08 — Mocca Hangat Tanpa Foto | Nempo" },
    { name: "description", content: "Pratinjau undangan NEMPO 08 Mocca Hangat dengan cartoon pengantin beranimasi, jadwal acara, cerita, RSVP, dan kado." },
    { property: "og:title", content: "NEMPO 08 — Mocca Hangat Tanpa Foto" },
    { property: "og:description", content: "Undangan Premium Vintage Tanpa Foto dengan cartoon pengantin dan taman botanical dari Nempo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});