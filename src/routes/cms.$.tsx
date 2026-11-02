import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry } from "@/lib/lazy-with-retry";
import { AppShell } from "@/components/app-shell";

const Entry = lazyWithRetry(() => import("@/apps/cms/entry"));

export const Route = createFileRoute("/cms/$")({
  head: () => ({
    meta: [
      { title: "Nempo CMS" },
      { name: "description", content: "Nempo CMS — bagian dari Nempo Organizer Garut." },
      { property: "og:title", content: "Nempo CMS" },
      { property: "og:description", content: "Nempo CMS — bagian dari Nempo Organizer Garut." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell app={Entry} />,
});
