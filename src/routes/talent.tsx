import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/talent")({
  head: () => ({
    meta: [
      { title: "Talent Management Nempo — MC, Band, Penari & Model Garut" },
      { name: "description", content: "Booking talent untuk acara di Garut dan Jawa Barat: MC & host, band & musisi, penari jaipong & modern, penyanyi, model, seni budaya Sunda, content creator, fotografer." },
      { property: "og:title", content: "Talent Management Nempo — MC, Band, Penari & Model" },
      { property: "og:description", content: "Satu tempat untuk mencari pengisi acara: MC, band, penari, penyanyi, model, dan seniman Sunda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
