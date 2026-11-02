import { Suspense, useEffect } from "react";
import { lazyWithRetry, reloadOnceForStaleChunks } from "@/lib/lazy-with-retry";
import { ClientOnly } from "@tanstack/react-router";

const NempoApp = lazyWithRetry(() => import("@/nempo-app"));

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0194f3] border-t-transparent" />
    </div>
  );
}

export function NempoShell() {
  // Vite reports files that fail to preload after an update; reload once to get the new ones.
  useEffect(() => {
    const onPreloadError = (event: Event) => {
      if (reloadOnceForStaleChunks()) event.preventDefault();
    };
    window.addEventListener("vite:preloadError", onPreloadError);
    return () => window.removeEventListener("vite:preloadError", onPreloadError);
  }, []);

  return (
    <div id="root">
      <ClientOnly fallback={<Loader />}>
        <Suspense fallback={<Loader />}>
          <NempoApp />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
