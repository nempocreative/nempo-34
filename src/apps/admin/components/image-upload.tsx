import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { api } from "@/apps/admin/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [imgBroken, setImgBroken] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diizinkan");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const url = await api.uploadImage(file);
      setImgBroken(false);
      onChange(url);
    } catch (err: any) {
      setError(err?.message || "Gagal mengunggah gambar. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const showUploadZone = !value || imgBroken;

  return (
    <div className={className}>
      {!showUploadZone ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-44 object-cover"
            onError={() => setImgBroken(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ganti Foto
              </button>
              <button
                type="button"
                onClick={() => { onChange(""); setImgBroken(false); }}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-sm font-medium">Mengunggah...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                {imgBroken && value ? (
                  <p className="text-xs text-orange-500 font-medium mb-1">Foto lama tidak tersedia — unggah ulang</p>
                ) : null}
                <p className="text-sm text-gray-700 font-medium">Klik atau seret foto ke sini</p>
        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP • Maks 5MB • otomatis WebP ≤450KB • sisi maks 1600px</p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm pointer-events-auto">
                <Upload className="w-3.5 h-3.5" />
                Pilih File
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
