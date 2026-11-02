import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Download, FileArchive, RefreshCw, ShieldCheck, Upload } from "lucide-react";
import { api } from "@/apps/admin/lib/api";

export default function BackupPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function downloadBackup() {
    setDownloading(true);
    setMessage("");
    setError("");
    try {
      await api.backup.download();
      setMessage("Backup berhasil diunduh. Simpan file ini di tempat yang aman.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backup gagal dibuat");
    } finally {
      setDownloading(false);
    }
  }

  async function restoreBackup(file: File) {
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Pilih file backup berformat JSON.");
      return;
    }
    setRestoring(true);
    setMessage("");
    setError("");
    try {
      const result = await api.backup.restore(file);
      setMessage(`${result.message} ${result.importedRows.toLocaleString("id-ID")} baris diproses.`);
      if (result.failedTables.length > 0) {
        setError(`Tabel yang dilewati: ${result.failedTables.join(", ")}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore gagal");
    } finally {
      setRestoring(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Backup & Restore Data</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simpan dan pindahkan seluruh data Nempo.id saat berganti project atau akun Replit.
        </p>
      </div>

      {message && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div className="text-sm text-blue-800">
          <p className="font-bold">Restore aman, tidak menghapus data lain</p>
          <p className="mt-1 leading-relaxed text-blue-700">
            Data di dalam backup akan dicocokkan berdasarkan ID. Data baru yang sudah ada di project tujuan tetap dipertahankan.
            Foto yang tersimpan di database juga ikut masuk ke backup.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Download className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-gray-900">1. Unduh Backup</h2>
          <p className="mt-1.5 min-h-16 text-sm leading-relaxed text-gray-500">
            Gunakan di project lama sebelum pindah akun. File berisi konten, akun, pesanan, pengaturan, dan foto database.
          </p>
          <button
            type="button"
            onClick={downloadBackup}
            disabled={downloading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "Membuat backup..." : "Unduh Backup Database"}
          </button>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Upload className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-gray-900">2. Pulihkan di Project Baru</h2>
          <p className="mt-1.5 min-h-16 text-sm leading-relaxed text-gray-500">
            Login ke Admin CMS di akun baru, lalu pilih file backup JSON yang sudah diunduh.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) void restoreBackup(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={restoring}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {restoring ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {restoring ? "Memulihkan data..." : "Pilih File Backup"}
          </button>
        </section>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Database className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-800">Urutan yang disarankan saat pindah akun</h2>
        </div>
        <ol className="mt-3 space-y-2 text-sm text-gray-600">
          {[
            "Di akun lama, unduh backup dan simpan file JSON di perangkat kamu.",
            "Fork atau upload project ke akun Replit baru dan jalankan database barunya.",
            "Buka Admin CMS di akun baru, masuk sebagai admin, lalu pulihkan file backup.",
            "Periksa menu Wisata, Kuliner, Event, User, dan Foto untuk memastikan semuanya sudah masuk.",
          ].map((item, index) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-600">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-amber-700">
          <FileArchive className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          File backup dapat berisi data akun dan pesanan. Simpan secara pribadi dan jangan mengunggahnya ke tempat umum.
        </p>
      </div>
    </div>
  );
}