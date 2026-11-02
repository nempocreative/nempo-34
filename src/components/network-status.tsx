import { useEffect, useState, useRef } from "react";
import { Wifi, Clock, RefreshCw, X, CheckCircle2, WifiOff, Gauge } from "lucide-react";

type NetState = "online" | "offline" | "slow";

async function checkSpeed(): Promise<NetState> {
  if (!navigator.onLine) return "offline";
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000);
    const t0 = Date.now();
    await fetch(`/favicon.ico?_=${Date.now()}`, {
      method: "HEAD", cache: "no-store", signal: controller.signal,
    });
    clearTimeout(id);
    return (Date.now() - t0) > 5000 ? "slow" : "online";
  } catch {
    return navigator.onLine ? "slow" : "offline";
  }
}

export function NetworkStatus() {
  const [state, setState]         = useState<NetState>("online");
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible]     = useState(false);
  const [retrying, setRetrying]   = useState(false);
  const prevState                 = useRef<NetState>("online");

  const run = async () => {
    const s = await checkSpeed();
    if (s !== prevState.current) {
      prevState.current = s;
      setState(s);
      if (s !== "online") {
        setDismissed(false);
        setVisible(true);
      } else {
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
      }
    }
  };

  useEffect(() => {
    /* Tunda cek pertama 4 detik agar browser selesai load halaman
       sebelum mengukur kecepatan koneksi — mencegah false-positive "lambat" */
    const init = setTimeout(run, 4000);
    const iv = setInterval(run, 15000);
    window.addEventListener("online",  run);
    window.addEventListener("offline", run);
    return () => {
      clearTimeout(init);
      clearInterval(iv);
      window.removeEventListener("online",  run);
      window.removeEventListener("offline", run);
    };
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    await run();
    setTimeout(() => setRetrying(false), 400);
  };

  if (!visible) return null;

  /* ── "Kembali normal" green toast ── */
  if (state === "online") {
    return (
      <>
        <style>{`
          @keyframes nsSlideUp{from{opacity:0;transform:translate(-50%,20px)}to{opacity:1;transform:translate(-50%,0)}}
          @keyframes nsFadeOut{from{opacity:1}to{opacity:0}}
        `}</style>
        <div style={{
          position: "fixed", bottom: 88, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9995,
          background: "linear-gradient(135deg,#16a34a,#15803d)",
          color: "white",
          borderRadius: 99,
          padding: "11px 22px",
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 32px rgba(22,163,74,0.45)",
          whiteSpace: "nowrap",
          animation: "nsSlideUp 0.45s cubic-bezier(0.34,1.5,0.64,1) both",
          fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
        }}>
          <CheckCircle2 style={{ width: 15, height: 15, flexShrink: 0 }} />
          Koneksi kembali normal
        </div>
      </>
    );
  }

  if (dismissed) return null;

  /* ── Offline / Slow banner ── */
  const isOffline = state === "offline";

  const bg     = isOffline
    ? "linear-gradient(135deg,#0a0a0a 0%,#111827 60%,#1a1a1a 100%)"
    : "linear-gradient(135deg,#78350f 0%,#92400e 100%)";

  const border = isOffline
    ? "rgba(239,68,68,0.25)"
    : "rgba(251,191,36,0.25)";

  const iconColor  = isOffline ? "#ef4444" : "#fbbf24";
  const iconBg     = isOffline ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)";
  const title      = isOffline ? "Kamu sedang offline" : "Koneksi kamu lambat";
  const sub        = isOffline
    ? "Koneksi internet terputus. Cek Wi-Fi atau data seluler kamu."
    : "Jaringan sedang lemot. Beberapa fitur mungkin butuh waktu lebih lama.";

  return (
    <>
      <style>{`
        @keyframes nsSlideDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes nsBlink{0%,49%{opacity:1}50%,100%{opacity:0.15}}
        @keyframes nsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 9995,
        padding: "14px 16px",
        background: bg,
        borderBottom: `1.5px solid ${border}`,
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
        animation: "nsSlideDown 0.35s cubic-bezier(0.22,1,0.36,1) both",
        fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
      }}>
        {/* WiFi / Clock icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: iconBg,
          border: `1.5px solid ${isOffline ? "rgba(239,68,68,0.3)" : "rgba(251,191,36,0.3)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: isOffline ? "nsBlink 1.2s ease-in-out infinite" : undefined,
        }}>
          {isOffline ? (
            <Wifi style={{ width: 18, height: 18, color: iconColor }} strokeWidth={2.2} />
          ) : (
            <Clock style={{ width: 18, height: 18, color: iconColor }} strokeWidth={2.2} />
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.25 }}>
            {title}
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.52)", margin: "3px 0 0", lineHeight: 1.45 }}>
            {sub}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleRetry}
            disabled={retrying}
            style={{
              height: 32, paddingInline: 12,
              borderRadius: 99,
              border: "1.5px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              fontSize: 11, fontWeight: 700,
              cursor: retrying ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 5,
              opacity: retrying ? 0.7 : 1,
              transition: "opacity 0.2s, background 0.2s",
            }}
          >
            <RefreshCw style={{
              width: 12, height: 12,
              animation: retrying ? "nsSpin 0.7s linear infinite" : undefined,
            }} />
            {retrying ? "Mencoba…" : "Coba Lagi"}
          </button>

          <button
            onClick={() => setDismissed(true)}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.55)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </>
  );
}
