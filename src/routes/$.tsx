import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

// All NEMPO pages (wisata, kuliner, event, berita, digital services, ...) are
// matched inside the app itself; this catch-all hands every path to it.
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Nempo Garut — Organizer & Platform Kreatif Jawa Barat" },
      {
        name: "description",
        content:
          "Halaman Nempo Garut: layanan acara, wedding, undangan digital, sosmed, website, desain, talent, dan sistem usaha di Garut.",
      },
      { property: "og:title", content: "Nempo Garut — Organizer & Platform Kreatif Jawa Barat" },
      {
        property: "og:description",
        content:
          "Event, wedding, dan layanan kreatif bareng Nempo Garut.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
