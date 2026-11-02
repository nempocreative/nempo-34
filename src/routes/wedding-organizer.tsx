import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/wedding-organizer")({
  head: () => ({
    meta: [
      { title: "Wedding Organizer Nempo — Paket WO & Adat Sunda" },
      { name: "description", content: "Paket Wedding Organizer Nempo Essential, Signature, dan Premium. Pilihan adat Sunda, tarif khusus vendor rekanan, dan simulasi biaya pernikahan." },
      { property: "og:title", content: "Wedding Organizer Nempo — Paket WO & Adat Sunda" },
      { property: "og:description", content: "Pilih paket WO Nempo mulai Rp2.500.000 dengan pilihan adat Sunda dan rincian biaya sesuai kebutuhan acara." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});