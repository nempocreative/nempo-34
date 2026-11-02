import { Music, Pause, Play, X } from "lucide-react";
import { useJingle, JINGLE_TRACK } from "@/contexts/jingle-context";

function fmtTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function JingleMiniPlayer() {
  const { hasStarted, isPlaying, progress, duration, toggle, dismiss } = useJingle();

  if (!hasStarted) return null;

  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div
      className="fixed z-[60] left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl shadow-2xl px-3.5 py-2.5 w-[calc(100%-24px)] max-w-sm"
      style={{
        bottom: "calc(76px + env(safe-area-inset-bottom, 0px))",
        background: "linear-gradient(135deg, #f472b6, #fb923c)",
        boxShadow: "0 12px 32px rgba(244,114,182,0.35)",
      }}
    >
      <div
        className={`h-9 w-9 shrink-0 rounded-full bg-white/25 flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}
      >
        <Music className="h-4.5 w-4.5 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-xs truncate">{JINGLE_TRACK.title}</p>
        <div className="mt-1 h-1 w-full bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <span className="text-white/80 text-[10px] tabular-nums shrink-0">{fmtTime(progress)}</span>

      <button
        onClick={toggle}
        className="h-8 w-8 shrink-0 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center transition-colors"
      >
        {isPlaying ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white ml-0.5" />}
      </button>

      <button
        onClick={dismiss}
        className="h-8 w-8 shrink-0 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
      >
        <X className="h-3.5 w-3.5 text-white" />
      </button>
    </div>
  );
}
