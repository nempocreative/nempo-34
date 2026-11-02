import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/web-development")({
  head: () => ({
    meta: [
      { title: "Web Development Nempo — Website & Sistem Bisnis Garut" },
      { name: "description", content: "Paket website Nempo: Landing Page Rp1.500.000, Website UMKM Rp2.500.000, Company Profile Rp4.000.000, Professional Rp7.500.000, dan E-Commerce Rp8.500.000." },
      { property: "og:title", content: "Web Development Nempo — Website & Sistem Bisnis" },
      { property: "og:description", content: "Website untuk usaha dan perusahaan di Garut. Bandingkan lima paket mulai Rp1.500.000 beserta fitur dan biaya tambahannya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
