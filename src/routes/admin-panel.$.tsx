import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/admin/entry"));

export const Route = createFileRoute("/admin-panel/$")({
  head: () => ({
    meta: [
      { title: "Nempo Panel Admin" },
      { name: "description", content: "Nempo Panel Admin — bagian dari Nempo Organizer Garut." },
      { property: "og:title", content: "Nempo Panel Admin" },
      { property: "og:description", content: "Nempo Panel Admin — bagian dari Nempo Organizer Garut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
