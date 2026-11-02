import { useState } from "react";
import { Pencil, Trash2, Plus, Search, RefreshCw, X, AlertTriangle } from "lucide-react";

interface Col {
  key: string;
  label: string;
  render?: (val: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface Props {
  title: string;
  cols: Col[];
  data: Record<string, unknown>[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (row: Record<string, unknown>) => void;
  onRefresh: () => void;
  onBulkDelete?: (ids: number[]) => Promise<void>;
}

export function ContentTable({ title, cols, data, loading, onAdd, onEdit, onDelete, onRefresh, onBulkDelete }: Props) {
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const filtered = data.filter(row =>
    Object.values(row).some(v =>
      String(v ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredIds = filtered.map(r => Number(r.id));
  const allSelected = filteredIds.length > 0 && filteredIds.every(id => selected.has(id));
  const someSelected = selected.size > 0;

  function toggleRow(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filteredIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelected(prev => new Set([...prev, ...filteredIds]));
    }
  }

  function clearSelection() {
    setSelected(new Set());
    setBulkConfirm(false);
  }

  async function handleBulkDelete() {
    if (!onBulkDelete) return;
    setBulkDeleting(true);
    try {
      await onBulkDelete([...selected]);
      setSelected(new Set());
      setBulkConfirm(false);
    } finally {
      setBulkDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 px-4 py-4 border-b border-gray-100 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
          {!loading && <p className="text-xs text-gray-400 mt-0.5">{data.length} data total</p>}
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setSelected(new Set()); }}
              placeholder="Cari data..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-44 bg-gray-50 focus:bg-white transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onAdd}
            className="flex shrink-0 items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 sm:px-4"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        </div>
      </div>

      {someSelected && onBulkDelete && (
        <div className="flex items-center justify-between px-5 py-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-red-700">{selected.size} item dipilih</span>
            <button onClick={clearSelection} className="text-xs text-red-400 hover:text-red-600 underline ml-1">Batal pilih</button>
          </div>
          {bulkConfirm ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 font-medium">Hapus {selected.size} item sekaligus?</span>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {bulkDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
              <button
                onClick={() => setBulkConfirm(false)}
                className="px-3 py-1.5 text-gray-600 text-xs hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setBulkConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus {selected.size} Item
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {onBulkDelete && (
                <th className="pl-4 pr-2 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    title="Pilih semua"
                  />
                </th>
              )}
              {cols.map(c => (
                <th key={c.key} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {onBulkDelete && <td className="pl-4 pr-2 py-3.5"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>}
                  {cols.map(c => (
                    <td key={c.key} className="px-4 py-3.5">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                  <td className="px-4 py-3.5">
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={cols.length + (onBulkDelete ? 2 : 1)} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Search className="w-8 h-8 text-gray-200" />
                    <p className="text-sm font-medium">{search ? "Tidak ada hasil pencarian" : "Belum ada data"}</p>
                    {!search && <p className="text-xs">Klik tombol Tambah untuk menambahkan data baru</p>}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => {
                const rowId = Number(row.id);
                const isSelected = selected.has(rowId);
                return (
                  <tr key={i} className={`transition-colors ${isSelected ? "bg-red-50/60" : "hover:bg-blue-50/30"}`}>
                    {onBulkDelete && (
                      <td className="pl-4 pr-2 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(rowId)}
                          className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                        />
                      </td>
                    )}
                    {cols.map(c => (
                      <td key={c.key} className="px-4 py-3 text-gray-700 max-w-xs">
                        {c.render ? c.render(row[c.key], row) : (
                          <span className="truncate block max-w-[200px] text-sm">{String(row[c.key] ?? "–")}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {deleteConfirm === i ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-xl px-2 py-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-xs text-red-600 font-medium mr-1">Hapus?</span>
                            <button
                              onClick={() => { onDelete(row); setDeleteConfirm(null); }}
                              className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Ya
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-0.5 text-gray-500 text-xs hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              Tidak
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(i)}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Menampilkan <span className="font-medium text-gray-600">{filtered.length}</span> dari <span className="font-medium text-gray-600">{data.length}</span> data
          </span>
          {search && filtered.length !== data.length && (
            <button onClick={() => setSearch("")} className="text-xs text-blue-500 hover:text-blue-700 font-medium">
              Tampilkan semua
            </button>
          )}
        </div>
      )}
    </div>
  );
}
