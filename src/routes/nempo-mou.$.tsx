import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/mou/entry"));

export const Route = createFileRoute("/nempo-mou/$")({
  head: () => ({
    meta: [
      { title: "Nempo MoU" },
      { name: "description", content: "Nempo MoU — bagian dari Nempo Organizer Garut." },
      { property: "og:title", content: "Nempo MoU" },
      { property: "og:description", content: "Nempo MoU — bagian dari Nempo Organizer Garut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
