import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getWishlist, getUserWishlistKey, WISHLIST_KEY, type WishlistItem } from "./wishlist";

const API = "/api";
const GUEST_WISHLIST_MIGRATED_KEY = `${WISHLIST_KEY}:guest-migrated`;

async function apiFetch(method: string, path: string, token: string, body?: unknown) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}

export function useWishlist() {
  const { token, user } = useAuth();
  const [items, setItems]     = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const accountId = user?.id ?? null;
  const accountStorageKey = accountId === null ? null : getUserWishlistKey(accountId);

  const loadFromDB = useCallback(async (t: string, storageKey?: string | null) => {
    setLoading(true);
    try {
      const data = await apiFetch("GET", "/wishlist", t);
      setItems(data);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    } catch {
      setItems(storageKey ? getWishlist(storageKey) : getWishlist());
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLocal = useCallback(() => {
    setItems(getWishlist());
  }, []);

  useEffect(() => {
    if (token) {
      loadFromDB(token, accountStorageKey);
    } else {
      loadLocal();
    }
  }, [token, accountStorageKey, loadFromDB, loadLocal]);

  useEffect(() => {
    const handler = () => {
      if (token) loadFromDB(token, accountStorageKey);
      else loadLocal();
    };
    window.addEventListener("wishlist-change", handler);
    return () => window.removeEventListener("wishlist-change", handler);
  }, [token, accountStorageKey, loadFromDB, loadLocal]);

  useEffect(() => {
    if (!token || accountId === null) return;
    if (localStorage.getItem(GUEST_WISHLIST_MIGRATED_KEY) === "1") return;

    const local = getWishlist();
    if (local.length === 0) {
      localStorage.setItem(GUEST_WISHLIST_MIGRATED_KEY, "1");
      return;
    }

    apiFetch("POST", "/wishlist/sync", token, { items: local })
      .then(() => {
        // Keep the guest copy as a backup; logging in must never erase local data.
        localStorage.setItem(GUEST_WISHLIST_MIGRATED_KEY, "1");
        loadFromDB(token, accountStorageKey);
      })
      .catch(() => {});
  }, [token, accountId, accountStorageKey, loadFromDB]);

  const toggle = useCallback(async (item: Omit<WishlistItem, "savedAt">) => {
    if (token) {
      const exists = items.some(i => i.id === item.id && i.type === item.type);
      try {
        if (exists) {
          await apiFetch("DELETE", `/wishlist/${item.type}/${item.id}`, token);
        } else {
          await apiFetch("POST", "/wishlist", token, item);
        }
        await loadFromDB(token, accountStorageKey);
        return !exists;
      } catch {
        return exists;
      }
    } else {
      const list = getWishlist();
      const idx  = list.findIndex(i => i.id === item.id && i.type === item.type);
      if (idx >= 0) list.splice(idx, 1);
      else list.unshift({ ...item, savedAt: Date.now() });
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      setItems([...list]);
      window.dispatchEvent(new Event("wishlist-change"));
      return idx < 0;
    }
  }, [token, items, accountStorageKey, loadFromDB]);

  const checkWishlisted = useCallback((id: string, type: string) => {
    return items.some(i => i.id === id && i.type === type);
  }, [items]);

  return {
    items,
    loading,
    toggle,
    isWishlisted: checkWishlisted,
    count: items.length,
  };
}
