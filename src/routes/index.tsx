import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nempo Garut — Event Organizer, Wedding & Layanan Kreatif" },
      {
        name: "description",
        content:
          "Bikin bareng Nempo: wedding & event organizer, undangan digital, kelola sosmed, website, desain, talent, dan sistem usaha. Ayo bikin acara bareng kita!",
      },
      { property: "og:title", content: "Nempo Garut — Event Organizer, Wedding & Layanan Kreatif" },
      {
        property: "og:description",
        content:
          "Wujudkan acara dan kontenmu bareng Nempo: wedding, event, sosmed, website, desain, talent, dan sistem usaha di Garut dan Jawa Barat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
