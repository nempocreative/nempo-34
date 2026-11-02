import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/design-creative")({
  head: () => ({
    meta: [
      { title: "Design Creative Nempo — Branding, Konten & Visual Garut" },
      { name: "description", content: "Pricelist desain Nempo: feed Rp50.000, story Rp35.000, logo mulai Rp500.000, branding mulai Rp1.500.000, dan paket desain bulanan mulai Rp500.000." },
      { property: "og:title", content: "Design Creative Nempo — Branding, Konten & Visual" },
      { property: "og:description", content: "Desain feed, poster, menu, logo, packaging, hingga paket bulanan dengan harga jelas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
