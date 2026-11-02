import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/tion/entry"));

export const Route = createFileRoute("/tion-feed/")({
  head: () => ({
    meta: [
      { title: "Nempo Tion Feed" },
      { name: "description", content: "Nempo Tion Feed — bagian dari Nempo Organizer Garut." },
      { property: "og:title", content: "Nempo Tion Feed" },
      { property: "og:description", content: "Nempo Tion Feed — bagian dari Nempo Organizer Garut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
