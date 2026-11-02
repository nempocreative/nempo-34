import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { api } from "@/apps/admin/lib/api";
import { Camera, CameraOff, CheckCircle2, XCircle, AlertTriangle, RotateCcw, ScanLine } from "lucide-react";

type ScanResult =
  | { state: "ok"; order: OrderInfo }
   | { state: "duplicate"; order: OrderInfo; message?: string }
  | { state: "invalid"; message: string; order?: OrderInfo }
  | { state: "not_found"; message: string }
  | { state: "error"; message: string };

type OrderInfo = {
  order_code: string;
  buyer_name: string;
  ticket_name: string;
  qty: number;
  event_name: string;
  event_date?: string | null;
  checked_in: boolean;
  checked_in_at?: string | null;
};

function fmtDatetime(s: string | null | undefined) {
  if (!s) return "-";
  return new Date(s).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TicketScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [lastCode, setLastCode] = useState<string>("");
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const cooldownRef = useRef(false);

  /* Load available cameras */
  useEffect(() => {
    BrowserMultiFormatReader.listVideoInputDevices()
      .then(devs => {
        setCameras(devs);
        if (devs.length > 0) {
          /* prefer back/rear camera */
          const back = devs.find(d => /back|rear|environment/i.test(d.label));
          setSelectedCamera(back?.deviceId ?? devs[devs.length - 1].deviceId);
        }
      })
      .catch(() => {});
  }, []);

  const stopScanner = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    readerRef.current = null;
    setScanning(false);
  }, []);

  const handleCode = useCallback(async (raw: string) => {
    if (cooldownRef.current) return;
    /* Extract order code from raw barcode text (may be full ticket code like NGT205QUJZ-01) */
    const match = raw.match(/^(NGT[A-Z0-9]{7})(?:-\d+)?$/);
    if (!match) return;
    const code = match[1];
    if (code === lastCode) return;

    cooldownRef.current = true;
    setLastCode(code);
    setLoading(true);
    setResult(null);

    try {
      const data = await api.eventOrders.checkin(code);
      setScanCount(c => c + 1);
      setResult({ state: "ok", order: data.order });
    } catch (err: any) {
      const body = err?.body ?? {};
      if (err?.status === 409) {
        setResult({ state: "duplicate", order: body.order, message: body.error });
      } else if (err?.status === 400) {
        setResult({ state: "invalid", message: body.error ?? "Tiket tidak valid", order: body.order });
      } else if (err?.status === 404) {
        setResult({ state: "not_found", message: "Kode tiket tidak ditemukan" });
      } else {
        setResult({ state: "error", message: err?.message ?? "Gagal scan" });
      }
    } finally {
      setLoading(false);
      setTimeout(() => { cooldownRef.current = false; }, 3000);
    }
  }, [lastCode]);

  const startScanner = useCallback(async () => {
    if (!selectedCamera || !videoRef.current) return;
    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      const controls = await reader.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current,
        (res, err) => {
          if (res) handleCode(res.getText());
          if (err && !(err instanceof NotFoundException)) {
            /* ignore decode misses */
          }
        }
      );
      controlsRef.current = controls;
      setScanning(true);
      setResult(null);
      setLastCode("");
    } catch (e: any) {
      setResult({ state: "error", message: "Tidak bisa akses kamera. Pastikan izin kamera sudah diberikan." });
    }
  }, [selectedCamera, handleCode]);

  useEffect(() => () => { stopScanner(); }, [stopScanner]);

  const reset = () => {
    setResult(null);
    setLastCode("");
    cooldownRef.current = false;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <ScanLine className="h-6 w-6 text-teal-600" /> Scan Tiket Masuk
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Scan barcode tiket untuk verifikasi &amp; tandai sudah masuk
          {scanCount > 0 && <span className="ml-2 font-bold text-teal-600">· {scanCount} sudah scan hari ini</span>}
        </p>
      </div>

      {/* Camera selector */}
      {cameras.length > 1 && (
        <div className="mb-3">
          <select
            value={selectedCamera}
            onChange={e => { stopScanner(); setSelectedCamera(e.target.value); }}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10"
          >
            {cameras.map(c => (
              <option key={c.deviceId} value={c.deviceId}>{c.label || `Kamera ${c.deviceId.slice(0, 6)}`}</option>
            ))}
          </select>
        </div>
      )}

      {cameras.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-amber-800 text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Tidak ada kamera terdeteksi. Pastikan kamera terhubung dan izin sudah diberikan.
        </div>
      )}

      {/* Video feed */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video mb-4 shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
        />

        {/* Overlay scan frame */}
        {scanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-48 h-32">
              {/* corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-lg" />
              {/* scan line animation */}
              <div className="absolute inset-x-0 h-0.5 bg-teal-400/80 animate-bounce top-1/2" style={{ boxShadow: "0 0 8px #2dd4bf" }} />
            </div>
            <p className="absolute bottom-3 text-teal-300 text-xs font-semibold tracking-wide">Arahkan kamera ke barcode tiket</p>
          </div>
        )}

        {!scanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CameraOff className="h-12 w-12 text-gray-600" />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-5">
        {!scanning ? (
          <button
            onClick={startScanner}
            disabled={cameras.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors disabled:opacity-40 shadow-sm shadow-teal-600/20"
          >
            <Camera className="h-4 w-4" /> Mulai Scan
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-700 hover:bg-gray-800 text-white font-bold text-sm transition-colors"
          >
            <CameraOff className="h-4 w-4" /> Stop Kamera
          </button>
        )}
        {result && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      {/* Result card */}
      {result && (
        <div className={`rounded-2xl border-2 p-5 ${
          result.state === "ok"
            ? "bg-emerald-50 border-emerald-300"
            : result.state === "duplicate"
            ? "bg-amber-50 border-amber-300"
            : "bg-red-50 border-red-300"
        }`}>
          {result.state === "ok" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <p className="font-extrabold text-emerald-800 text-lg">Masuk Berhasil!</p>
              </div>
              <OrderCard order={result.order} />
            </>
          )}

          {result.state === "duplicate" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                <p className="font-extrabold text-amber-800 text-lg">Tiket Sudah Digunakan</p>
              </div>
              {result.order && <OrderCard order={result.order} />}
              {result.order?.checked_in_at && (
                <p className="text-amber-700 text-xs mt-2 font-semibold">
                  Sudah masuk pada: {fmtDatetime(result.order.checked_in_at)}
                </p>
              )}
            </>
          )}

          {(result.state === "invalid" || result.state === "not_found" || result.state === "error") && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-6 w-6 text-red-600 shrink-0" />
                <p className="font-extrabold text-red-800 text-lg">
                  {result.state === "not_found" ? "Tiket Tidak Ditemukan" : result.state === "invalid" ? "Tiket Tidak Valid" : "Gagal Scan"}
                </p>
              </div>
              <p className="text-red-700 text-sm">{result.message}</p>
              {result.state === "invalid" && result.order && <OrderCard order={result.order} />}
            </>
          )}
        </div>
      )}

      {/* Manual input fallback */}
      <ManualCheckin onCheckin={handleCode} />
    </div>
  );
}

function OrderCard({ order }: { order: OrderInfo }) {
  return (
    <div className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Kode</span>
        <span className="font-mono font-bold text-gray-900">{order.order_code}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Nama</span>
        <span className="font-semibold text-gray-900">{order.buyer_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Event</span>
        <span className="font-semibold text-gray-900 text-right max-w-[60%]">{order.event_name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Tiket</span>
        <span className="font-semibold text-gray-900">{order.ticket_name} × {order.qty}</span>
      </div>
    </div>
  );
}

function ManualCheckin({ onCheckin }: { onCheckin: (code: string) => void }) {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed) { onCheckin(trimmed); setCode(""); }
  };

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <button
        onClick={() => setShow(v => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 font-semibold underline underline-offset-2"
      >
        {show ? "Sembunyikan" : "Input kode manual (jika kamera tidak berfungsi)"}
      </button>
      {show && (
        <form onSubmit={submit} className="flex gap-2 mt-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Contoh: NGT205QUJZ"
            className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10 font-mono uppercase"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors disabled:opacity-40"
          >
            Cek
          </button>
        </form>
      )}
    </div>
  );
}
