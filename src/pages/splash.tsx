import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Props { onDone: () => void; }

const LOGO_SRC = `${import.meta.env.BASE_URL}Assets/Logo/nempo-new.webp`;

export default function SplashScreen({ onDone }: Props) {
  const [fading,   setFading]   = useState(false);
  const [progress, setProgress] = useState(0);

  /* ── progress bar + exit ── */
  useEffect(() => {
    const DURATION = 2000;
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / DURATION) * 100));
      setProgress(pct);
      if (pct < 100) { raf = requestAnimationFrame(tick); }
      else {
        setTimeout(() => setFading(true), 80);
        setTimeout(() => onDone(), 630);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  /* ── particles ── */
  const particles = [
    { size:6,  top:"18%", left:"12%",  dur:"3.2s", delay:"0s",    color:"rgba(255,195,0,0.7)" },
    { size:4,  top:"28%", left:"82%",  dur:"2.8s", delay:"0.6s",  color:"rgba(255,255,255,0.55)" },
    { size:5,  top:"38%", left:"7%",   dur:"3.5s", delay:"1.1s",  color:"rgba(255,195,0,0.5)" },
    { size:3,  top:"22%", left:"68%",  dur:"2.4s", delay:"0.3s",  color:"rgba(255,255,255,0.4)" },
    { size:7,  top:"48%", left:"90%",  dur:"4.0s", delay:"0.8s",  color:"rgba(255,195,0,0.35)" },
    { size:4,  top:"55%", left:"5%",   dur:"3.0s", delay:"1.4s",  color:"rgba(255,255,255,0.45)" },
    { size:5,  top:"14%", left:"50%",  dur:"2.6s", delay:"0.2s",  color:"rgba(255,195,0,0.6)" },
    { size:3,  top:"42%", left:"75%",  dur:"3.8s", delay:"1.7s",  color:"rgba(255,255,255,0.35)" },
  ];

  const stars = Array.from({ length: 18 }, (_, i) => ({
    top:  `${Math.floor(5  + (i * 37)  % 55)}%`,
    left: `${Math.floor(3  + (i * 53)  % 94)}%`,
    dur:  `${1.4 + (i * 0.17) % 1.4}s`,
    delay:`${(i * 0.31) % 1.8}s`,
    size: i % 3 === 0 ? 2.5 : 1.5,
  }));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center",
      background: "linear-gradient(170deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%)",
      opacity: fading ? 0 : 1,
      transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1)",
      pointerEvents: fading ? "none" : "all",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes splDown    { from{transform:translateY(-20px) scale(0.92);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
        @keyframes splUp      { from{transform:translateY(16px);opacity:0}  to{transform:translateY(0);opacity:1} }
        @keyframes splFadeIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes splGlowPulse { 0%,100%{opacity:0.55} 50%{opacity:1} }
        @keyframes splFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes splPop     { 0%,100%{transform:scale(1);opacity:var(--op)} 50%{transform:scale(1.5);opacity:1} }
        @keyframes splStar    { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
        @keyframes splRing    { from{transform:translate(-50%,-50%) scale(0.7);opacity:0.6} to{transform:translate(-50%,-50%) scale(1.8);opacity:0} }
        @keyframes splShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes splSlideIn { from{transform:translateY(50px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* stars */}
      {stars.map((s, i) => (
        <div key={i} style={{
          position:"absolute", top:s.top, left:s.left,
          width:s.size, height:s.size, borderRadius:"50%", background:"white",
          animation:`splStar ${s.dur} ease-in-out ${s.delay} infinite`,
        }} />
      ))}

      {/* particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position:"absolute", top:p.top, left:p.left,
          width:p.size, height:p.size, borderRadius:"50%", background:p.color,
          "--op":"0.7",
          animation:`splPop ${p.dur} ease-in-out ${p.delay} infinite`,
        } as React.CSSProperties} />
      ))}

      {/* pulsing rings */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position:"absolute", top:"calc(40% - 56px)", left:"50%",
          transform:"translate(-50%, -50%)",
          width:88 + i * 48, height:88 + i * 48, borderRadius:"50%",
          border:"1.5px solid rgba(255,255,255,0.18)",
          animation:`splRing ${2.2 + i * 0.7}s ease-out ${i * 0.55}s infinite`,
        }} />
      ))}

      {/* ── Logo area ── */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"48%",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"flex-end",
        paddingBottom:16,
      }}>
        {/* Logo badge — animates in immediately on mount */}
        <div style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          willChange:"transform, opacity",
          animation:"splDown 0.6s cubic-bezier(0.34,1.3,0.64,1) 0.05s both",
        }}>
          <img
            src={LOGO_SRC}
            alt="Nempo Garut Organizer"
            fetchPriority="high"
            decoding="sync"
            style={{
              height:110, width:110,
              objectFit:"contain",
              display:"block",
              marginBottom:16,
              filter:"brightness(0) invert(1)",
              willChange:"transform",
              position:"relative",
            }}
          />

          <div style={{ textAlign:"center" }}>
            <div style={{
              fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",
              fontWeight:900, fontSize:34, color:"white",
              letterSpacing:"-0.04em", lineHeight:1,
              textShadow:"0 2px 20px rgba(0,0,0,0.3)",
            }}>Nempo Garut</div>
            <div style={{
              fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",
              fontWeight:800, fontSize:13, color:"rgba(255,255,255,0.75)",
              letterSpacing:"0.35em", textTransform:"uppercase", marginTop:6,
              textShadow:"0 0 16px rgba(1,148,243,0.6)",
            }}>ORGANIZER</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          marginTop:14,
          animation:"splUp 0.7s ease 0.4s both",
          textAlign:"center", paddingInline:32,
          willChange:"transform, opacity",
        }}>
          <p style={{ color:"rgba(255,255,255,0.82)", fontWeight:600, fontSize:14, lineHeight:1.5 }}>
            Wedding, event & layanan kreatif
          </p>
          <p style={{ color:"rgba(255,255,255,0.5)", fontWeight:400, fontSize:12, marginTop:2 }}>
            Dari konsep sampai hari-H
          </p>
        </div>
      </div>

      {/* ── Lottie at bottom ── */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"56%",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"flex-end",
        animation:"splSlideIn 0.85s cubic-bezier(0.34,1.2,0.64,1) 0.25s both",
        willChange:"transform, opacity",
      }}>
        <div style={{
          position:"absolute", bottom:"14%", left:"50%",
          transform:"translateX(-50%)",
          width:260, height:40, borderRadius:"50%",
          background:"rgba(255,195,0,0.18)",
          filter:"blur(18px)",
          animation:"splFloat 3s ease-in-out infinite 1s",
        }} />

        <div style={{
          width:"100%", maxWidth:380, paddingInline:8,
          animation:"splFloat 4s ease-in-out infinite 1.2s",
        }}>
          <DotLottieReact
            src="https://lottie.host/0c3db08c-4d59-4066-90e8-b90b1923ca15/8qd1xzWa5j.lottie"
            loop autoplay
            style={{ width:"100%", height:"auto", maxHeight:280 }}
          />
        </div>

        {/* Progress bar */}
        <div style={{
          width:"100%", paddingInline:44, paddingBottom:44, paddingTop:6,
          display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          animation:"splUp 0.7s ease 0.6s both",
        }}>
          <div style={{
            width:"100%", maxWidth:200, height:4, borderRadius:99,
            background:"rgba(255,255,255,0.15)", overflow:"hidden",
          }}>
            <div style={{
              height:"100%", borderRadius:99,
              width:`${progress}%`,
              background:"linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,1),rgba(255,255,255,0.9))",
              backgroundSize:"200% 100%",
              animation:"splShimmer 1.4s linear infinite",
              transition:"width 0.1s linear",
              willChange:"width",
            }} />
          </div>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:10, fontWeight:500, letterSpacing:"0.07em" }}>
            Menyiapkan acaramu…
          </p>
        </div>
      </div>
    </div>
  );
}
