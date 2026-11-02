import { useEffect, useState } from "react";

const TIPS = [
  "Nempo Garut Organizer — tim kreatif di balik acara seru di Garut 🎉",
  "Dari konsep sampai hari-H, semua kami yang urus 🎪",
  "Wedding, gathering, sampai launching produk — kami siap 💍",
  "Konten sosmedmu juga bisa kami garap biar makin rame 📱",
  "Undangan digital kekinian? Tinggal pesan, beres ✉️",
  "Website buat brand-mu? Kami bikinkan dari nol 💻",
  "Desain kreatif yang bikin brand-mu beda dari yang lain 🎨",
  "Ceritakan acara impianmu, kami wujudkan bareng-bareng ✨",
];

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = "Memuat data…" }: PageLoaderProps) {
  const [tip, setTip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [fadeTip, setFadeTip] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setFadeTip(false);
      setTimeout(() => {
        setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
        setFadeTip(true);
      }, 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      <style>{`
        @keyframes plDot{0%,100%{transform:scaleY(0.4);opacity:0.35}45%{transform:scaleY(1);opacity:1}}
        @keyframes plFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes plSpin{to{transform:rotate(360deg)}}
        @keyframes plPulse{0%,100%{opacity:0.4;transform:scale(0.92)}50%{opacity:1;transform:scale(1)}}
      `}</style>

      <div style={{
        minHeight: 320,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
        fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
        animation: "plFadeIn 0.35s ease both",
      }}>
        {/* Animated icon — CSS only, no Lottie */}
        <div style={{ position: "relative", width: 80, height: 80, marginBottom: 20 }}>
          {/* Outer ring spin */}
          <div style={{
            position: "absolute", inset: 0,
            border: "3px solid transparent",
            borderTopColor: "#0194f3",
            borderRightColor: "#1BA0E2",
            borderRadius: "50%",
            animation: "plSpin 0.9s linear infinite",
          }}/>
          {/* Middle ring spin reverse */}
          <div style={{
            position: "absolute", inset: 10,
            border: "3px solid transparent",
            borderBottomColor: "#0172B1",
            borderLeftColor: "#0194f3",
            borderRadius: "50%",
            animation: "plSpin 1.4s linear infinite reverse",
          }}/>
          {/* Center icon */}
          <div style={{
            position: "absolute", inset: 22,
            background: "linear-gradient(135deg, #0194f3, #0172B1)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "plPulse 1.8s ease-in-out infinite",
          }}>
            {/* Compass/map pin SVG */}
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <circle cx="12" cy="10" r="5" fill="white" opacity="0.95"/>
              <circle cx="12" cy="10" r="2.5" fill="#0194f3"/>
              <path d="M12 15 L14.5 20 L12 18.5 L9.5 20 Z" fill="white" opacity="0.95"/>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center", marginBottom: 10, animation: "plFadeIn 0.45s ease both" }}>
          <p style={{
            fontSize: 20, fontWeight: 900, color: "#111827",
            margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            Nempo Garut <span style={{ color: "#0194f3" }}>Organizer</span>
          </p>
          <p style={{
            fontSize: 10, fontWeight: 800, color: "#0194f3",
            textTransform: "uppercase", letterSpacing: "0.28em",
            margin: "2px 0 0",
          }}>
            Layanan Kreatif Garut
          </p>
        </div>

        {/* Loading text */}
        <p style={{
          fontSize: 15, fontWeight: 800, color: "#111827",
          margin: "0 0 12px",
          animation: "plFadeIn 0.5s ease both",
        }}>
          {text}
        </p>

        {/* Dot bounce bar */}
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 18, marginBottom: 22 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6, height: 18, borderRadius: 99,
                background: i === 1 ? "#0194f3" : "#1BA0E2",
                animation: `plDot 1.1s ease-in-out ${i * 0.18}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Tip card */}
        <div style={{
          maxWidth: 300, width: "100%",
          background: "rgba(1,148,243,0.05)",
          border: "1px solid rgba(1,148,243,0.15)",
          borderRadius: 16,
          padding: "12px 16px",
          transition: "opacity 0.3s ease",
          opacity: fadeTip ? 1 : 0,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: "#0194f3",
            textTransform: "uppercase", letterSpacing: "0.08em",
            margin: "0 0 4px",
          }}>
            Tahukah Kamu?
          </p>
          <p style={{
            fontSize: 12, color: "#374151", lineHeight: 1.6, margin: 0,
          }}>
            {tip}
          </p>
        </div>
      </div>
    </>
  );
}
