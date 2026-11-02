import { Component, type ReactNode } from "react";
import { RefreshCw, MessageCircle, HeartHandshake } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

const ADMIN_CONTACT = "https://www.instagram.com/nempo.id";

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[Nempo Organizer] Unhandled error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        background: "linear-gradient(160deg, #f0f7ff 0%, #e8f4ff 50%, #f5f0ff 100%)",
        fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
      }}>
        {/* decorative blobs */}
        <div style={{
          position: "fixed", top: "-20%", right: "-10%",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(1,148,243,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "fixed", bottom: "-15%", left: "-10%",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 420, width: "100%", position: "relative" }}>

          {/* Icon area */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ position: "relative" }}>
              {/* Outer glow ring */}
              <div style={{
                position: "absolute", inset: -14, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(1,148,243,0.12) 0%, transparent 70%)",
                animation: "errPulse 2.4s ease-in-out infinite",
              }} />
              {/* Icon container */}
              <div style={{
                width: 96, height: 96, borderRadius: "50%",
                background: "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
                border: "2px solid rgba(1,148,243,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(1,148,243,0.15), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                position: "relative",
              }}>
                {/* Professional broken-connection SVG */}
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cloud base */}
                  <path d="M38 34H14C10.686 34 8 31.314 8 28C8 25.04 10.1 22.58 12.94 22.1C12.98 18.72 15.72 16 19.1 16C20.44 16 21.68 16.42 22.7 17.14C23.96 14.68 26.56 13 29.5 13C33.642 13 37 16.358 37 20.5C37 20.666 36.994 20.83 36.982 20.992C37.654 20.668 38.408 20.5 39.2 20.5C42.4 20.5 45 23.1 45 26.3C45 29.5 42.4 32 39.2 32H38V34Z" fill="url(#cloudGrad)" opacity="0.15"/>
                  <path d="M38 32H14C10.686 32 8 29.314 8 26C8 23.04 10.1 20.58 12.94 20.1C12.98 16.72 15.72 14 19.1 14C20.44 14 21.68 14.42 22.7 15.14C23.96 12.68 26.56 11 29.5 11C33.642 11 37 14.358 37 18.5C37 18.666 36.994 18.83 36.982 18.992C37.654 18.668 38.408 18.5 39.2 18.5C42.4 18.5 45 21.1 45 24.3C45 27.5 42.4 30 39.2 30H38V32Z" stroke="#0194f3" strokeWidth="1.5" strokeLinejoin="round" fill="url(#cloudGrad)"/>
                  {/* Lightning bolt — disconnected */}
                  <path d="M27 20L23 27H27L23 34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Broken link left */}
                  <path d="M10 40L16 40" stroke="#0194f3" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5"/>
                  {/* Broken link right */}
                  <path d="M20 40L26 40" stroke="#0194f3" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.5"/>
                  {/* X mark on break */}
                  <circle cx="18" cy="40" r="2.5" fill="#ef4444" opacity="0.85"/>
                  <path d="M17 39L19 41M19 39L17 41" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="cloudGrad" x1="8" y1="11" x2="45" y2="34" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#e0f0ff"/>
                      <stop offset="1" stopColor="#c7e4ff"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Pulse ring */}
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                border: "1.5px solid rgba(1,148,243,0.2)",
                animation: "errPulse 2.4s ease-in-out infinite 0.6s",
              }} />
            </div>
          </div>

          <style>{`
            @keyframes errPulse { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
          `}</style>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
            padding: "28px 24px 24px",
          }}>
            <h1 style={{
              fontSize: 22, fontWeight: 900, color: "#111827",
              textAlign: "center", marginBottom: 8, lineHeight: 1.2,
            }}>
              Sedang dalam perbaikan
            </h1>

            <p style={{
              fontSize: 14, color: "#6b7280", textAlign: "center",
              lineHeight: 1.6, marginBottom: 24,
            }}>
              Mohon refresh halaman. Jika masih ada kendala, hubungi admin kami.
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Report to admin */}
              <a
                href={`https://ig.me/m/nempo.id`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%", padding: "13px 16px",
                  borderRadius: 16, border: "none",
                  background: "linear-gradient(135deg, #0194f3 0%, #0172B1 100%)",
                  color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  textDecoration: "none",
                  boxShadow: "0 6px 20px rgba(1,148,243,0.35)",
                }}
              >
                <MessageCircle style={{ width: 16, height: 16 }} />
                Laporkan ke Admin
              </a>

              {/* Back to home */}
              <button
                onClick={this.handleReload}
                style={{
                  width: "100%", padding: "12px 16px",
                  borderRadius: 16, border: "1px solid #e5e7eb",
                  background: "white", color: "#6b7280",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s",
                }}
              >
                <RefreshCw style={{ width: 15, height: 15 }} />
                Kembali ke Beranda
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p style={{
            textAlign: "center", fontSize: 11, color: "#9ca3af",
            marginTop: 20, lineHeight: 1.6,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <HeartHandshake style={{ width: 13, height: 13 }} />
              Nempo Organizer · Tim kami siap membantu 24/7
            </span>
          </p>
        </div>
      </div>
    );
  }
}
