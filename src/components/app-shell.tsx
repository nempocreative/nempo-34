import { Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { ClientOnly } from "@tanstack/react-router";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0194f3] border-t-transparent" />
    </div>
  );
}

export function AppShell({ app: App }: { app: LazyExoticComponent<ComponentType> }) {
  return (
    <div id="root">
      <ClientOnly fallback={<Loader />}>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
