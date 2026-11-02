import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  BACKUP_PAGE_SIZE,
  BACKUP_TABLES,
  backupFileName,
  buildBackupFile,
  fetchAllRows,
  orderColumn,
  type BackupTable,
  type BackupTableResult,
} from "@/lib/backup";
import stylesCss from "@/styles.css?raw";

function client() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
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

// Full JSON backup of every table. Reads only what the site already serves publicly via /api/*.
export const Route = createFileRoute("/api/backup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sb = client();
        if (!sb) {
          return new Response(JSON.stringify({ error: "Database belum terhubung" }), {
            status: 503,
            headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
          });
        }
        const entries = await Promise.all(
          BACKUP_TABLES.map(async (table): Promise<[BackupTable, BackupTableResult]> => {
            try {
              const { count, error: countError } = await sb.from(table).select("*", { count: "exact", head: true });
              if (countError) throw countError;
              const rows = await fetchAllRows(async (from, to) => {
                const { data, error } = await sb
                  .from(table)
                  .select("*")
                  .order(orderColumn(table), { ascending: true })
                  .range(from, to);
                if (error) throw error;
                return (data ?? []) as Record<string, unknown>[];
              }, BACKUP_PAGE_SIZE);
              return [table, { rows, expected: count ?? null }];
            } catch (e) {
              console.error("backup", table, e);
              return [table, { rows: [], expected: null, error: "gagal dibaca" }];
            }
          }),
        );
        const file = buildBackupFile(Object.fromEntries(entries) as Record<BackupTable, BackupTableResult>, new Date(), {
          "src/styles.css": stylesCss,
        });
        return new Response(JSON.stringify(file, null, 2), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
            ...(new URL(request.url).searchParams.has("download")
              ? { "content-disposition": `attachment; filename="${backupFileName()}"` }
              : {}),
          },
        });
      },
    },
  },
});
