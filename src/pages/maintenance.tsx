import { NEMPO_CONSULT_URL } from "@/lib/contact";

export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #0172B1 0%, #0194f3 45%, #1BA0E2 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.08)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes dotBlink { 0%,80%,100%{opacity:0} 40%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Decorative circles */}
      <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, right:-60, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"20%", right:"8%", width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none", animation:"pulse 3s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"25%", left:"6%", width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none", animation:"pulse 4s ease-in-out infinite 1s" }} />

      {/* Gear icons decorative */}
      <div style={{ position:"absolute", top:40, right:40, opacity:0.10, animation:"spinSlow 12s linear infinite" }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.373.554 1.098 2.699L4 18l2 2 1.832-1.49 2.702 1.11L11 22h2l.553-2.371 2.693-1.101 1.812 1.482 2-2-1.484-1.75 1.106-2.698L22 13v-2l-2.378-.605Z"/>
        </svg>
      </div>
      <div style={{ position:"absolute", bottom:60, left:32, opacity:0.08, animation:"spinSlow 18s linear infinite reverse" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2">
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.373.554 1.098 2.699L4 18l2 2 1.832-1.49 2.702 1.1L11 22h2l.553-2.371 2.693-1.101 1.812 1.482 2-2-1.484-1.75 1.106-2.698L22 13v-2l-2.378-.605Z"/>
        </svg>
      </div>

      {/* Main card */}
      <div style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255,255,255,0.25)",
        borderRadius: 28,
        padding: "40px 32px",
        maxWidth: 420,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
      }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(255,255,255,0.25)",
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img
              src="/Assets/Logo/nempo-new.webp"
              alt="Nempo Organizer"
              style={{ width: 30, height: 30, objectFit: "contain", background: "white", borderRadius: 8, padding: 2 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: "white", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Nempo<span style={{ opacity: 0.6 }}>.</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Jawa Barat
            </div>
          </div>
        </div>

        {/* Animated wrench illustration */}
        <div style={{ marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "rgba(255,255,255,0.18)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto",
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "white", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          Sedang dalam Pemeliharaan 🔧
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: "0 0 28px", lineHeight: 1.65 }}>
          Website Nempo Organizer sedang kami perbarui untuk memberikan pengalaman terbaik buat kamu.
          Kami akan segera kembali — terima kasih atas kesabaranmu! 🙏
        </p>

        {/* Animated dots */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:28 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
              animation: `dotBlink 1.4s ease-in-out ${delay}s infinite`,
            }} />
          ))}
        </div>

        {/* Info chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:28 }}>
          {[
            { icon:"🕐", label:"Proses ini tidak akan lama" },
            { icon:"📱", label:"Data kamu tetap aman" },
          ].map(({ icon, label }) => (
            <span key={label} style={{
              display:"inline-flex", alignItems:"center", gap:5,
              fontSize: 11, fontWeight: 700,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white", borderRadius: 99, padding: "5px 12px",
            }}>
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.2)", marginBottom:20 }} />

        {/* Contact */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>
          Butuh bantuan mendesak? Hubungi kami:
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="https://instagram.com/nempo.id" target="_blank" rel="noopener noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:6,
              fontSize: 12, fontWeight: 700,
              background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366)",
              color: "white", borderRadius: 10, padding: "8px 14px",
              textDecoration: "none",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @nempo.id
          </a>
           <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
            style={{
              display:"inline-flex", alignItems:"center", gap:6,
              fontSize: 12, fontWeight: 700,
               background: "linear-gradient(135deg,#f09433,#dc2743,#cc2366)", color: "white",
              borderRadius: 10, padding: "8px 14px",
              textDecoration: "none",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
             </svg>
             <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>◎</span>
             DM Instagram
          </a>
        </div>
      </div>

      {/* Footer note */}
      <p style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        © 2025 Nempo Organizer · Jelajahi pesona Jawa Barat, Temukan Ceritamu
      </p>
    </div>
  );
}
