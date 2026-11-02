import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2, Plus } from "lucide-react";
import { api } from "@/apps/admin/lib/api";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

export function MultiImageUpload({ value, onChange, max = 8, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(async (files: File[]) => {
    const room = max - value.length;
    if (room <= 0) { setError(`Maksimal ${max} foto`); return; }
    const toUpload = files.slice(0, room);
    setError("");
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) { setError("Ukuran file maksimal 5MB"); continue; }
        const url = await api.uploadImage(file);
        urls.push(url);
      }
      if (urls.length) onChange([...value, ...urls]);
    } catch {
      setError("Gagal mengunggah salah satu foto. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }, [value, onChange, max]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  }, [uploadFiles]);

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {value.map((url, i) => (
          <div key={i} className="relative rounded-xl overflow-hidden border border-gray-200 group aspect-square">
            <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.currentTarget.style.opacity = "0.3"; }} />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 pointer-events-none">
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-medium">Tambah</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <ImageIcon className="w-3 h-3" />
        {value.length}/{max} foto · JPG, PNG, WebP · Maks 5MB · otomatis WebP ≤450KB per foto
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) uploadFiles(files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {value.length === 0 && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg shadow-sm hover:bg-gray-50"
        >
          <Upload className="w-3 h-3" /> Unggah Foto
        </button>
      )}
    </div>
  );
}
