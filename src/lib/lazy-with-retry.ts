import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "nempo-chunk-reload-at";
const RELOAD_WINDOW_MS = 30_000;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A page file can fail to load after the site is updated (old file names) or on a flaky connection,
 * which shows "Importing a module script failed" and a blank screen. Retry once, then reload the page
 * once to pick up the new files; only if that also fails is the error shown.
 */
export function reloadOnceForStaleChunks(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

export function importWithRetry<T>(factory: () => Promise<T>): Promise<T> {
  return factory().catch(async () => {
    await wait(600);
    try {
      return await factory();
    } catch (err) {
      if (reloadOnceForStaleChunks()) return new Promise<T>(() => {}); // page is reloading
      throw err;
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(() => importWithRetry(factory));
}
