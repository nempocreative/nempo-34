export type WishlistItem = {
  id: string;
  type: "wisata" | "kuliner" | "penginapan" | "event";
  name: string;
  image: string;
  location?: string;
  category?: string;
  savedAt: number;
};

export const WISHLIST_KEY = "nempo_wishlist";

export function getWishlist(key = WISHLIST_KEY): WishlistItem[] {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}

export function getUserWishlistKey(userId: number | string) {
  return `${WISHLIST_KEY}:user:${userId}`;
}

export function toggleWishlist(item: Omit<WishlistItem, "savedAt">, key = WISHLIST_KEY) {
  const list = getWishlist(key);
  const idx  = list.findIndex(i => i.id === item.id && i.type === item.type);
  if (idx >= 0) list.splice(idx, 1);
  else list.unshift({ ...item, savedAt: Date.now() });
  localStorage.setItem(key, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-change"));
  return idx < 0;
}

export function isWishlisted(id: string, type: string, key = WISHLIST_KEY) {
  return getWishlist(key).some(i => i.id === id && i.type === type);
}
