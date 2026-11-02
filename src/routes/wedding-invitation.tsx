import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-invitation")({
  head: () => ({
    meta: [
      { title: "Wedding Invitation Nempo — Undangan Digital Rp199.000" },
      { name: "description", content: "Undangan pernikahan digital Nempo: RSVP online, galeri, ucapan tamu, musik, kado digital, dan link siap dibagikan. Rp199.000 sekali bayar." },
      { property: "og:title", content: "Wedding Invitation Nempo — Undangan Digital Rp199.000" },
      { property: "og:description", content: "Undangan digital yang personal dan elegan, cukup satu link untuk semua tamu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
