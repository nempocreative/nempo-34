import { useEffect, useState } from "react";
import { api } from "@/apps/admin/lib/api";

type Row = Record<string, unknown>;

function fmt(v: unknown) {
  if (!v || v === "null") return "—";
  return String(v);
}

function fmtDate(v: unknown) {
  if (!v) return "—";
  try {
    return new Date(String(v)).toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return String(v); }
}

export default function BpjsRegistrationsPage() {
  const [data, setData]         = useState<Row[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  const load = () => {
    setLoading(true);
    (api as any).bpjsRegistrations
      .list()
      .then((d: Row[]) => setData(d))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  async function handleDelete(row: Row) {
    if (!confirm(`Hapus data ${row.nama_lengkap}?`)) return;
    await (api as any).bpjsRegistrations.delete(Number(row.id));
    load();
  }

  function downloadCSV() {
    const cols = ["No", "Nama Lengkap", "Jenis Peserta", "NIK", "Tempat Lahir", "Tgl Lahir", "No HP", "Email", "Match #", "Waktu Daftar"];
    const rows = filtered.map((r, i) => [
      i + 1,
      r.nama_lengkap ?? "",
      r.jenis_peserta ?? "",
      r.nomor_identitas ?? "",
      r.tempat_lahir ?? "",
      r.tgl_lahir ?? "",
      r.handphone ?? "",
      r.email ?? "",
      r.match_no ?? "",
      r.created_at ? new Date(String(r.created_at)).toLocaleString("id-ID") : "",
    ]);
    const csv = [cols, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FormulirAtlet_TemuTarung_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = data.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(r.nama_lengkap ?? "").toLowerCase().includes(q) ||
      String(r.nomor_identitas ?? "").toLowerCase().includes(q) ||
      String(r.handphone ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-900">Formulir Atlet</h1>
        <p className="text-sm text-gray-500 mt-0.5">Data pendaftaran atlet Temu Tarung 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800 text-sm">
              {loading ? "Memuat…" : `${filtered.length} pendaftar`}
            </span>
            <button onClick={load} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              ↻ Refresh
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama / NIK / HP…"
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 w-56 outline-none focus:border-blue-300"
            />
            <button
              onClick={downloadCSV}
              disabled={loading || filtered.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              ⬇ Download CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">No</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Jenis</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">NIK</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Tempat, Tgl Lahir</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">HP</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Match</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Daftar</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-400">Memuat data…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-400">Belum ada data</td></tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={String(row.id)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(row)} className="font-semibold text-gray-900 text-left hover:text-blue-600 transition-colors">
                        {fmt(row.nama_lengkap)}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        String(row.jenis_peserta) === "anak"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-50 text-blue-600"
                      }`}>
                        {fmt(row.jenis_peserta)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{fmt(row.nomor_identitas)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {fmt(row.tempat_lahir)}{row.tempat_lahir && row.tgl_lahir ? ", " : ""}{fmt(row.tgl_lahir)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{fmt(row.handphone)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{fmt(row.email)}</td>
                    <td className="px-4 py-3 text-center">
                      {row.match_no ? (
                        <span className="text-xs font-bold text-red-500">#{fmt(row.match_no)}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(row.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(row)} className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">Detail</button>
                        <button onClick={() => handleDelete(row)} className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors font-medium">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">Detail Pendaftar</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {([
                ["Nama Lengkap", "nama_lengkap"],
                ["Jenis Peserta", "jenis_peserta"],
                ["NIK", "nomor_identitas"],
                ["Tempat Lahir", "tempat_lahir"],
                ["Tanggal Lahir", "tgl_lahir"],
                ["No. HP", "handphone"],
                ["Email", "email"],
                ["Match #", "match_no"],
                ["Waktu Daftar", "created_at"],
              ] as [string, string][]).map(([label, key]) => (
                <div key={key} className="flex items-start gap-3 py-1.5 border-b border-gray-50 last:border-0">
                  <p className="text-xs font-semibold text-gray-400 w-28 shrink-0">{label}</p>
                  <p className="text-xs text-gray-800 font-medium flex-1">
                    {key === "created_at" ? fmtDate(selected[key]) : fmt(selected[key])}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => { handleDelete(selected); setSelected(null); }} className="px-4 py-2 text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 transition-colors">Hapus Data</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
