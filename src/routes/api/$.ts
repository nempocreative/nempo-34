import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { buildNotifications } from "@/data/notifications";
import { PUBLIC_NEWS_COLUMNS } from "@/lib/security-policy";

// Public read-only bridge: old site endpoints (/api/wisata, ...) served from the database.
const TABLES: Record<string, { table: string; columns?: string; order?: string; filter?: (q: any) => any }> = {
  wisata: { table: "wisata" },
  kuliner: { table: "kuliner" },
  cafe: { table: "kuliner", filter: (q) => q.ilike("category", "%cafe%") },
  penginapan: { table: "penginapan" },
  events: { table: "events" },
  "event-tickets": { table: "event_tickets", order: "sort_order" },
  berita: { table: "berita", columns: PUBLIC_NEWS_COLUMNS, order: "published_at" },
  banners: { table: "banners", order: "sort_order" },
  "promo-banners": { table: "promo_banners", order: "sort_order" },
  perlombaan: { table: "perlombaan" },
  "digital-services": { table: "digital_services" },
  "price-list": { table: "price_list", order: "sort_order" },
  transportasi: { table: "transportasi" },
  vouchers: { table: "vouchers" },
  talents: { table: "talents", order: "sort_order" },
  influencers: { table: "influencers", order: "sort_order" },
  partners: { table: "partners", order: "sort_order" },
  "kamus-sunda": { table: "kamus_sunda" },
};

const camel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const toCamel = (row: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [camel(k), v]));

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=10" },
  });

// Returns null when no database is configured, so pages get empty data instead of a 500.
function client() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const parts = (params._splat ?? "").split("/").filter(Boolean);
        const [name, idOrSlug] = parts;
        const cfg = name ? TABLES[name] : undefined;
        if (name !== "stats" && name !== "notifications" && !cfg) return json({ error: "Not found" }, 404);
        if (name === "notifications") return json(buildNotifications());

        const sb = client();
        if (!sb) {
          if (name === "stats") return json({ wisata: 0, kuliner: 0, penginapan: 0, events: 0 });
          return parts.length === 2 ? json({ error: "Not found" }, 404) : json([]);
        }

        if (name === "stats") {
          const counts = await Promise.all(
            ["wisata", "kuliner", "penginapan", "events"].map(async (t) => {
              const { count } = await sb.from(t).select("*", { count: "exact", head: true });
              return [t, count ?? 0] as const;
            }),
          );
          return json(Object.fromEntries(counts));
        }

        if (!cfg) return json({ error: "Not found" }, 404);

        if (name === "events" && idOrSlug && parts.length === 3 && parts[2] === "tickets") {
          const col = /^\d+$/.test(idOrSlug) ? "id" : "slug";
          const { data: event, error: eventError } = await sb.from("events")
            .select("id").eq(col, idOrSlug).maybeSingle();
          if (eventError) return json({ error: "Gagal memuat data" }, 500);
          if (!event) return json({ error: "Not found" }, 404);
          const { data, error } = await sb.from("event_tickets").select("*")
            .eq("event_id", event.id).eq("active", true).order("sort_order", { ascending: true });
          if (error) return json({ error: "Gagal memuat data" }, 500);
          return json((data ?? []).map(toCamel));
        }

        let q: any = sb.from(cfg.table).select(cfg.columns ?? "*");
        if (cfg.filter) q = cfg.filter(q);

        if (idOrSlug && parts.length === 2) {
          const isId = /^\d+$/.test(idOrSlug);
          const col = cfg.table === "site_settings" ? "key" : isId ? "id" : "slug";
          const { data, error } = await q.eq(col, idOrSlug).maybeSingle();
          if (error) return json({ error: "Gagal memuat data" }, 500);
          if (!data) return json({ error: "Not found" }, 404);
          return json(toCamel(data));
        }
        if (parts.length > 2) return json({ error: "Not found" }, 404);

        q = cfg.order
          ? q.order(cfg.order, { ascending: cfg.order === "sort_order" ? true : false })
          : cfg.table === "site_settings" ? q : q.order("id", { ascending: true });
        const { data, error } = await q;
        if (error) {
          console.error(error);
          return json({ error: "Gagal memuat data" }, 500);
        }
        return json((data ?? []).map(toCamel));
      },
    },
  },
});
