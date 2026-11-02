import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/business-system")({
  head: () => ({
    meta: [
      { title: "Business System & Digital Solutions Nempo — Kasir, Stok, CRM, HR & Sistem Industri" },
      { name: "description", content: "Katalog sistem bisnis Nempo: QR Menu Rp750.000, POS Rp2.500.000, antrian, reservasi, membership, voucher, ticketing, CMS, finance, inventory, HR & payroll, sampai sistem khusus salon, cafe, hotel, dan sekolah." },
      { property: "og:title", content: "Business System & Digital Solutions Nempo" },
      { property: "og:description", content: "Sistem operasional, manajemen, dan solusi per industri — harga mulai jelas, fitur tercantum, konsultasi langsung via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
