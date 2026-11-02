import { useRef, useState, useCallback } from "react";
import { Upload, X, Video, Loader2 } from "lucide-react";
import { api } from "@/apps/admin/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function VideoUpload({ value, onChange, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/") && !file.name.endsWith(".mp4")) {
      setError("Hanya file video (.mp4, .webm, dll) yang diizinkan");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setError("Ukuran file maksimal 200MB");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload-video");
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            onChange(data.url);
            resolve();
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || "Upload gagal"));
            } catch {
              reject(new Error("Upload gagal"));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Koneksi gagal"));
        xhr.send(formData);
      });
    } catch (e: any) {
      setError(e?.message || "Gagal mengunggah video. Coba lagi.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div className={className}>
      {value && !uploading ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 group bg-black">
          <video
            src={value}
            className="w-full h-44 object-contain"
            controls
            preload="metadata"
          />
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors shadow"
            >
              Ganti Video
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-3 py-1.5 bg-black/60 text-white/70 text-[10px] truncate">{value}</div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${uploading ? "cursor-default" : "cursor-pointer"} ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-blue-600">
              <Loader2 className="w-7 h-7 animate-spin" />
              <div className="w-full max-w-[200px]">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Mengunggah…</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-400">Jangan tutup halaman ini</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Klik atau seret video ke sini</p>
                <p className="text-xs text-gray-400 mt-0.5">MP4, WebM • Maks 200MB</p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg shadow-sm pointer-events-auto">
                <Upload className="w-3.5 h-3.5" />
                Pilih File Video
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mp4,.webm,.mov"
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
