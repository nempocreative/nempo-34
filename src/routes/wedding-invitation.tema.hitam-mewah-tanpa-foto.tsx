import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation/tema/hitam-mewah-tanpa-foto")({
  head: () => ({ meta: [
    { title: "NEMPO 10 — Hitam Mewah Tanpa Foto | Nempo" },
    { name: "description", content: "Undangan NEMPO 10 Hitam Mewah Tanpa Foto dengan cartoon pengantin beranimasi, cerita, acara, dan RSVP pratinjau." },
    { property: "og:title", content: "NEMPO 10 — Hitam Mewah Tanpa Foto" },
    { property: "og:description", content: "Undangan hitam dan emas dengan cartoon pengantin beranimasi, acara, cerita, dan ucapan pratinjau." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NempoShell,
});
