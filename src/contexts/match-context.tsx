import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { MATCHES, type MatchItem, type MatchStatus } from "@/data/temu-tarung";

const STORAGE_KEY = "nempo:match-overrides";
const CHANNEL_NAME = "nempo:match-sync";

export interface MatchOverride {
  status: MatchStatus;
  pemenang?: "merah" | "biru";
  metode?: string;
}

type Overrides = Record<number, MatchOverride>;

interface MatchContextValue {
  matches: MatchItem[];
  updateMatch: (no: number, patch: Partial<MatchOverride>) => void;
  resetMatch: (no: number) => void;
  resetAll: () => void;
}

function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

function applyOverrides(base: readonly MatchItem[], overrides: Overrides): MatchItem[] {
  return base.map(m => {
    const o = overrides[m.no];
    return o ? { ...m, ...o } : m;
  });
}

const MatchCtx = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(loadOverrides);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const reload = useCallback(() => {
    setOverrides(loadOverrides());
  }, []);

  useEffect(() => {
    // BroadcastChannel — works across tabs AND same-origin iframes
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = () => reload();
      channelRef.current = ch;
    } catch {
      channelRef.current = null;
    }

    // Storage event — fires in other tabs/windows (not same-page iframes)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) reload();
    };
    window.addEventListener("storage", onStorage);

    // Polling fallback every 3s for edge cases
    const poll = setInterval(reload, 3000);

    return () => {
      channelRef.current?.close();
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, [reload]);

  const broadcast = useCallback(() => {
    try { channelRef.current?.postMessage("update"); } catch {}
  }, []);

  const updateMatch = useCallback((no: number, patch: Partial<MatchOverride>) => {
    setOverrides(prev => {
      const base = MATCHES.find(m => m.no === no);
      const existing: MatchOverride = prev[no] ?? { status: base?.status ?? "belum" };
      const next: Overrides = { ...prev, [no]: { ...existing, ...patch } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    broadcast();
  }, [broadcast]);

  const resetMatch = useCallback((no: number) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[no];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    broadcast();
  }, [broadcast]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setOverrides({});
    broadcast();
  }, [broadcast]);

  const matches = applyOverrides(MATCHES, overrides);

  return (
    <MatchCtx.Provider value={{ matches, updateMatch, resetMatch, resetAll }}>
      {children}
    </MatchCtx.Provider>
  );
}

export function useMatchContext(): MatchContextValue {
  const ctx = useContext(MatchCtx);
  if (!ctx) throw new Error("useMatchContext must be used within MatchProvider");
  return ctx;
}
