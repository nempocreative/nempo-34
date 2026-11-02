const store = new Map<string, { data: unknown; ts: number }>();

const TTL = 5_000; // 5 detik — supaya perubahan admin langsung kelihatan di preview

export async function cachedFetch<T = unknown>(url: string): Promise<T> {
  const hit = store.get(url);
  if (hit && Date.now() - hit.ts < TTL) return hit.data as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();
  store.set(url, { data, ts: Date.now() });
  return data as T;
}

export function invalidate(url: string) {
  store.delete(url);
}
