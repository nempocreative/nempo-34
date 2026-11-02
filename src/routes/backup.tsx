import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Database, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BackupFile } from "@/lib/backup";

export const Route = createFileRoute("/backup")({
  head: () => ({
    meta: [
      { title: "Backup Data Nempo — Unduh Semua Data (JSON)" },
      { name: "description", content: "Unduh cadangan lengkap seluruh data Nempo dalam satu file JSON." },
      { property: "og:title", content: "Backup Data Nempo" },
      { property: "og:description", content: "Cadangan lengkap seluruh data Nempo dalam satu file JSON." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BackupPage,
});

const LABELS: Record<string, string> = {
  banners: "Banner",
  berita: "Berita",
  digital_services: "Layanan Digital",
  event_tickets: "Tiket Event",
  events: "Event",
  influencers: "Influencer",
  kamus_sunda: "Kamus Sunda",
  kuliner: "Kuliner & Cafe",
  partners: "Partner",
  penginapan: "Penginapan",
  perlombaan: "Perlombaan",
  price_list: "Daftar Harga",
  promo_banners: "Banner Promo",
  site_settings: "Pengaturan Situs",
  talents: "Talent",
  transportasi: "Transportasi",
  vouchers: "Voucher",
  wisata: "Wisata",
};


function BackupPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<BackupFile | null>(null);

  async function check() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/backup", { cache: "no-store" });
      if (res.status === 503) {
        setFile(null);
        setError("Database belum terhubung, jadi belum ada data untuk dibackup.");
        return;
      }
      if (!res.ok) throw new Error("Server tidak merespons");
      setFile((await res.json()) as BackupFile);
    } catch {
      setError("Isi backup belum bisa dicek. Coba lagi sebentar lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void check();
  }, []);

  const s = file?.summary;

  return (
    <main className="min-h-screen bg-brand-sky px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-primary-foreground">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-brand-navy">Backup Data</h1>
            <p className="text-sm text-muted-foreground">Semua data Nempo dalam satu file JSON.</p>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Tekan <b className="text-foreground">Unduh Backup Sekarang</b>. File selalu diambil langsung dari data terbaru, jadi setiap
            perubahan (data baru, diedit, atau dihapus) otomatis ikut masuk ke backup. Desain situs (warna, font, dan gaya tampilan) versi
            terbaru juga ikut tersimpan.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/api/backup?download=1" download>
                <Download className="h-4 w-4" />
                Unduh Backup Sekarang
              </a>
            </Button>
            <Button variant="secondary" size="lg" onClick={check} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Mengecek isi..." : "Cek Ulang Isi"}
            </Button>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {s && (
            <div className="mt-6">
              <div
                className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                  s.complete ? "border-primary/30 bg-primary/10 text-brand-navy" : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {s.complete ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>
                  {s.complete
                    ? `Lengkap: ${s.totalRows.toLocaleString("id-ID")} data dari ${s.tables} tabel akan masuk ke backup.`
                    : `Ada tabel yang belum lengkap: ${s.problems.join("; ")}. Coba cek ulang.`}
                </span>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(s.counts).map(([table, count]) => (
                  <li key={table} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-foreground">{LABELS[table] ?? table}</span>
                    <span className="font-bold tabular-nums text-brand-navy">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
