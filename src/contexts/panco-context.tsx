import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { PANCO_MATCHES, type MatchItem, type MatchStatus } from "@/data/temu-tarung";

const STORAGE_KEY = "nempo:panco-overrides";
const CHANNEL_NAME = "nempo:panco-sync";

export interface PancoOverride {
  status: MatchStatus;
  pemenang?: "merah" | "biru";
}

type Overrides = Record<number, PancoOverride>;

interface PancoContextValue {
  pancoMatches: MatchItem[];
  updatePanco: (no: number, patch: Partial<PancoOverride>) => void;
  resetPanco: (no: number) => void;
  resetAllPanco: () => void;
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

const PancoCtx = createContext<PancoContextValue | null>(null);

export function PancoProvider({ children }: { children: React.ReactNode }) {
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

    // Polling fallback every 3s
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

  const updatePanco = useCallback((no: number, patch: Partial<PancoOverride>) => {
    setOverrides(prev => {
      const base = PANCO_MATCHES.find(m => m.no === no);
      const existing: PancoOverride = prev[no] ?? { status: base?.status ?? "belum" };
      const next: Overrides = { ...prev, [no]: { ...existing, ...patch } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    broadcast();
  }, [broadcast]);

  const resetPanco = useCallback((no: number) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[no];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    broadcast();
  }, [broadcast]);

  const resetAllPanco = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setOverrides({});
    broadcast();
  }, [broadcast]);

  const pancoMatches = applyOverrides(PANCO_MATCHES, overrides);

  return (
    <PancoCtx.Provider value={{ pancoMatches, updatePanco, resetPanco, resetAllPanco }}>
      {children}
    </PancoCtx.Provider>
  );
}

export function usePancoContext(): PancoContextValue {
  const ctx = useContext(PancoCtx);
  if (!ctx) throw new Error("usePancoContext must be used within PancoProvider");
  return ctx;
}
