import { useLocation } from "@/lib/wouter";
import { Home, Compass, MessageCircle, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
      background: "linear-gradient(160deg, #f0f7ff 0%, #e8f4ff 50%, #f0fff4 100%)",
      fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* bg blobs */}
      <div style={{
        position: "fixed", top: "-15%", right: "-8%",
        width: 320, height: 320, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(1,148,243,0.10) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "fixed", bottom: "-15%", left: "-10%",
        width: 280, height: 280, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)",
      }} />

      <style>{`
        @keyframes nf404Float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes nf404FadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nf404Spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 400, width: "100%", textAlign: "center", position: "relative" }}>

        {/* Big 404 */}
        <div style={{
          fontSize: 120, fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg, #0194f3 0%, #22c55e 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "nf404Float 3.5s ease-in-out infinite",
          marginBottom: 4, userSelect: "none",
        }}>
          404
        </div>

        {/* Compass icon */}
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 20,
          animation: "nf404FadeIn 0.6s ease 0.2s both",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(255,255,255,0.85)",
            border: "1.5px solid rgba(1,148,243,0.15)",
            boxShadow: "0 8px 28px rgba(1,148,243,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Compass style={{ width: 30, height: 30, color: "#0194f3" }} strokeWidth={1.5} />
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          padding: "28px 24px 24px",
          animation: "nf404FadeIn 0.6s ease 0.3s both",
        }}>
          <h1 style={{
            fontSize: 22, fontWeight: 900, color: "#111827",
            marginBottom: 8, lineHeight: 1.2,
          }}>
            Halaman Ini Hilang Entah ke Mana 🧭
          </h1>
          <p style={{
            fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 24,
          }}>
             Sepertinya destinasi ini belum ada di peta Nempo Organizer. Mungkin link-nya salah,
             atau halamannya sudah dipindahkan. Kamu bisa kembali ke beranda atau melihat daftar wisata terbaru.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                width: "100%", padding: "13px 16px",
                borderRadius: 16, border: "none",
                background: "linear-gradient(135deg, #0194f3 0%, #0172B1 100%)",
                color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 20px rgba(1,148,243,0.35)",
                transition: "transform 0.15s",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Home style={{ width: 16, height: 16 }} />
              Kembali ke Beranda
            </button>

            <button
              onClick={() => navigate("/wisata")}
              style={{
                width: "100%", padding: "12px 16px",
                borderRadius: 16,
                border: "1.5px solid rgba(1,148,243,0.25)",
                background: "rgba(1,148,243,0.06)",
                color: "#0194f3", fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s",
              }}
            >
              <Compass style={{ width: 15, height: 15 }} />
              Lihat Wisata Terbaru
            </button>

            <a
              href="https://ig.me/m/nempo.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%", padding: "12px 16px",
                borderRadius: 16, border: "1px solid #e5e7eb",
                background: "white", color: "#6b7280",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                textDecoration: "none",
              }}
            >
              <MessageCircle style={{ width: 15, height: 15 }} />
              Laporkan ke Admin
            </a>
          </div>
        </div>

        <p style={{
          fontSize: 11, color: "#9ca3af", marginTop: 20, lineHeight: 1.6,
        }}>
          Nempo Organizer · Temukan Ceritamu di Swiss van Java 🌿
        </p>
      </div>
    </div>
  );
}
