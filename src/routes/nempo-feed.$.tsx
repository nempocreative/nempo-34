import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/feed/entry"));

export const Route = createFileRoute("/nempo-feed/$")({
  head: () => ({
    meta: [
      { title: "Nempo Feed" },
      { name: "description", content: "Nempo Feed — bagian dari Nempo Organizer Garut." },
      { property: "og:title", content: "Nempo Feed" },
      { property: "og:description", content: "Nempo Feed — bagian dari Nempo Organizer Garut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
