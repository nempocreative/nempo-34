import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import {
  ArrowLeft, Download, User, Activity, Shield,
  Bell, CheckCircle, Loader2, FileText, Clock,
  ChevronRight, AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const API = "/api";

type DownloadStatus = "idle" | "loading" | "done" | "error";

const DATA_CATEGORIES = [
  {
    icon: User,
    color: "text-[#0194f3] bg-blue-50",
    title: "Profil & Akun",
    items: ["Nama, email, nomor telepon", "Avatar & foto profil", "Tanggal bergabung", "Preferensi tampilan"],
  },
  {
    icon: Activity,
    color: "text-violet-500 bg-violet-50",
    title: "Riwayat Aktivitas",
    items: ["Login & logout", "Perubahan profil", "Destinasi yang dikunjungi", "Riwayat ulasan"],
  },
  {
    icon: Shield,
    color: "text-emerald-500 bg-emerald-50",
    title: "Data Keamanan",
    items: ["Sesi aktif & riwayat sesi", "Status 2FA", "IP address login", "Perangkat terdaftar"],
  },
  {
    icon: Bell,
    color: "text-amber-500 bg-amber-50",
    title: "Preferensi",
    items: ["Pengaturan notifikasi", "Pilihan bahasa", "Mata uang", "Preferensi konten"],
  },
];

function fmt(val: unknown): string {
  if (val === null || val === undefined) return "–";
  if (typeof val === "boolean") return val ? "Ya" : "Tidak";
  if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/)) {
    try {
      return new Date(val).toLocaleString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return val; }
  }
  return String(val);
}

function buildPdfHtml(data: Record<string, unknown>): string {
  const now = new Date().toLocaleString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const profile: Record<string, unknown> = (data.profile as Record<string, unknown>) ?? {};
  const activities: unknown[] = Array.isArray(data.activities) ? data.activities : [];
  const sessions: unknown[] = Array.isArray(data.sessions) ? data.sessions : [];
  const notifPrefs: Record<string, unknown> = (data.notification_prefs as Record<string, unknown>) ?? {};
  const displayPrefs: Record<string, unknown> = (data.display_preferences as Record<string, unknown>) ?? {};

  const profileRows: [string, string][] = [
    ["Nama", fmt(profile.name)],
    ["Email", fmt(profile.email)],
    ["Nomor Telepon", fmt(profile.phone)],
    ["Login dengan Google", fmt(profile.is_google)],
    ["Bergabung sejak", fmt(profile.created_at)],
    ["Login terakhir", fmt(profile.last_login_at)],
  ];

  const tableRow = ([label, value]: [string, string]) => `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value}</td>
    </tr>`;

  const activityRows = activities.slice(0, 30).map((a: unknown) => {
    const act = a as Record<string, unknown>;
    return `<tr>
      <td>${fmt(act.created_at)}</td>
      <td>${fmt(act.action ?? act.type)}</td>
      <td>${fmt(act.description ?? act.detail ?? "")}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="3" class="empty">Belum ada aktivitas tercatat</td></tr>`;

  const sessionRows = sessions.slice(0, 10).map((s: unknown) => {
    const ses = s as Record<string, unknown>;
    return `<tr>
      <td>${fmt(ses.created_at ?? ses.started_at)}</td>
      <td>${fmt(ses.device ?? ses.user_agent ?? "")}</td>
      <td>${fmt(ses.ip_address ?? ses.ip ?? "")}</td>
    </tr>`;
  }).join("") || `<tr><td colspan="3" class="empty">Tidak ada sesi tercatat</td></tr>`;

  const notifEntries = Object.entries(notifPrefs).filter(([k]) => !k.startsWith("_") && k !== "user_id");
  const notifRows = notifEntries.length
    ? notifEntries.map(([k, v]) => `<tr><td class="label">${k.replace(/_/g, " ")}</td><td class="value">${fmt(v)}</td></tr>`).join("")
    : `<tr><td colspan="2" class="empty">Tidak ada preferensi notifikasi</td></tr>`;

  const dispEntries = Object.entries(displayPrefs).filter(([k]) => !k.startsWith("_"));
  const dispRows = dispEntries.length
    ? dispEntries.map(([k, v]) => `<tr><td class="label">${k.replace(/_/g, " ")}</td><td class="value">${fmt(v)}</td></tr>`).join("")
    : `<tr><td colspan="2" class="empty">Menggunakan pengaturan default</td></tr>`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Data Akun – Nempo Organizer</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    background: #fff;
    padding: 36px 44px;
    max-width: 900px;
    margin: 0 auto;
  }
  /* Header */
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 3px solid #0194f3;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #0194f3, #0172B1);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-weight: 900; font-size: 18px; letter-spacing: -1px;
  }
  .brand-text h1 { font-size: 20px; font-weight: 900; color: #0194f3; line-height: 1; }
  .brand-text p { font-size: 11px; color: #888; margin-top: 2px; }
  .export-meta { text-align: right; }
  .export-meta p { font-size: 11px; color: #888; line-height: 1.6; }
  .export-meta strong { color: #444; }

  /* Section */
  .section { margin-bottom: 28px; page-break-inside: avoid; }
  .section-header {
    display: flex; align-items: center; gap: 8px;
    background: #f0f7ff;
    border-left: 4px solid #0194f3;
    padding: 8px 12px;
    border-radius: 0 8px 8px 0;
    margin-bottom: 10px;
  }
  .section-header h2 { font-size: 13px; font-weight: 800; color: #0172B1; }
  .section-header .icon { font-size: 15px; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  th {
    background: #f8fafc;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: #888;
    padding: 7px 10px;
    border-bottom: 1px solid #e8ecf0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 12px;
    vertical-align: top;
  }
  td.label { color: #666; width: 35%; font-weight: 500; }
  td.value { color: #1a1a2e; font-weight: 600; }
  td.empty { color: #aaa; font-style: italic; text-align: center; padding: 14px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafcff; }

  /* Footer */
  .footer {
    margin-top: 32px;
    padding-top: 14px;
    border-top: 1px solid #e8ecf0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer p { font-size: 10px; color: #bbb; }
  .footer .badge {
    background: #f0f7ff;
    color: #0194f3;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    border: 1px solid #bae6fd;
  }

  /* Print */
  @media print {
    body { padding: 20px; }
    .no-print { display: none !important; }
    .section { page-break-inside: avoid; }
  }

  /* Print button (web only) */
  .print-bar {
    position: fixed; top: 0; left: 0; right: 0;
    background: #0194f3; color: #fff;
    padding: 10px 20px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 2px 12px rgba(1,148,243,0.3);
    z-index: 999;
  }
  .print-bar button {
    background: #fff; color: #0194f3;
    border: none; border-radius: 8px;
    padding: 6px 16px; font-weight: 700; font-size: 13px;
    cursor: pointer;
  }
  .print-bar button:hover { background: #e0f0ff; }
  @media print { .print-bar { display: none !important; } body { padding-top: 20px; } }
  body { padding-top: 58px; }
</style>
</head>
<body>

<div class="print-bar no-print">
  <span>📄 Data Akun Nempo Organizer — Siap dicetak / simpan sebagai PDF</span>
  <button onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
</div>

<div class="header">
  <div class="brand">
    <div class="brand-icon">NG</div>
    <div class="brand-text">
      <h1>Nempo Organizer</h1>
      <p>Laporan Data Akun Pengguna</p>
    </div>
  </div>
  <div class="export-meta">
    <p><strong>Tanggal ekspor</strong></p>
    <p>${now}</p>
    <p style="margin-top:4px"><strong>Email:</strong> ${fmt(profile.email)}</p>
  </div>
</div>

<!-- Profil -->
<div class="section">
  <div class="section-header">
    <span class="icon">👤</span>
    <h2>Profil &amp; Akun</h2>
  </div>
  <table>
    <tbody>
      ${profileRows.map(tableRow).join("")}
    </tbody>
  </table>
</div>

<!-- Aktivitas -->
<div class="section">
  <div class="section-header">
    <span class="icon">📋</span>
    <h2>Riwayat Aktivitas (${Math.min(activities.length, 30)} terbaru)</h2>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32%">Waktu</th>
        <th style="width:25%">Aktivitas</th>
        <th>Keterangan</th>
      </tr>
    </thead>
    <tbody>${activityRows}</tbody>
  </table>
</div>

<!-- Sesi -->
<div class="section">
  <div class="section-header">
    <span class="icon">🔒</span>
    <h2>Riwayat Sesi Login (${Math.min(sessions.length, 10)} terbaru)</h2>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32%">Waktu</th>
        <th>Perangkat</th>
        <th style="width:22%">IP Address</th>
      </tr>
    </thead>
    <tbody>${sessionRows}</tbody>
  </table>
</div>

<!-- Preferensi Notifikasi -->
<div class="section">
  <div class="section-header">
    <span class="icon">🔔</span>
    <h2>Preferensi Notifikasi</h2>
  </div>
  <table><tbody>${notifRows}</tbody></table>
</div>

<!-- Preferensi Tampilan -->
<div class="section">
  <div class="section-header">
    <span class="icon">⚙️</span>
    <h2>Preferensi Tampilan</h2>
  </div>
  <table><tbody>${dispRows}</tbody></table>
</div>

<div class="footer">
  <p>Dokumen ini digenerate otomatis oleh sistem Nempo Organizer. Bersifat rahasia — jangan sebarkan ke pihak lain.</p>
  <span class="badge">nempo-export-v2</span>
</div>

</body>
</html>`;
}

export default function UnduhDataPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownload = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("nempo_user_token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const [profileRes, activitiesRes, sessionsRes, notifsRes] = await Promise.allSettled([
        fetch(`${API}/auth/me`,                        { headers }),
        fetch(`${API}/user/activities?limit=100`,      { headers }),
        fetch(`${API}/user/sessions`,                  { headers }),
        fetch(`${API}/user/notifications/prefs`,       { headers }),
      ]);

      const safe = async (r: PromiseSettledResult<Response>) => {
        if (r.status === "rejected") return null;
        if (!r.value.ok) return null;
        return r.value.json().catch(() => null);
      };

      const profile    = await safe(profileRes);
      const activities = await safe(activitiesRes);
      const sessions   = await safe(sessionsRes);
      const notifs     = await safe(notifsRes);

      const displayPrefs = (() => {
        try { return JSON.parse(localStorage.getItem("nempo_display_prefs") || "{}"); }
        catch { return {}; }
      })();

      const exportData = {
        profile: profile ?? null,
        activities: activities?.activities ?? activities ?? [],
        sessions: sessions?.sessions ?? sessions ?? [],
        notification_prefs: notifs ?? {},
        display_preferences: displayPrefs,
      };

      const html = buildPdfHtml(exportData);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("done");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Terjadi kesalahan saat mengunduh data");
      setStatus("error");
    }
  };

  return (
    <Layout>
      <SEO title="Unduh Data Akun" noIndex />
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div
          className="relative pt-safe"
          style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
          <div className="relative px-4 pt-5 pb-6">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mb-4"
            >
              <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
            <div className="flex items-end gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-white font-black text-xl leading-none">Unduh Data Saya</h1>
                <p className="text-white/50 text-xs mt-1">Ekspor seluruh data akun Anda</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <FileText className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
                  <span className="text-white/60 text-[11px]">Format PDF · Mudah Dibaca · Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* Download button */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-5">
            <h2 className="text-sm font-black text-gray-800 mb-1">Unduh Laporan Data Akun</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Data akun Anda akan dibuka sebagai halaman laporan yang rapi. Gunakan tombol
              <strong className="text-gray-600"> Cetak / Simpan PDF</strong> untuk menyimpannya ke perangkat.
            </p>

            {status === "done" ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-4">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" strokeWidth={2} />
                <div>
                  <p className="text-sm font-bold text-emerald-700">Laporan dibuka di tab baru!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Gunakan tombol "Cetak / Simpan PDF" di bagian atas halaman</p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition-colors shrink-0"
                >
                  Buka Lagi
                </button>
              </div>
            ) : status === "error" ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-bold text-red-700">Gagal mengunduh</p>
                    <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <button
                onClick={handleDownload}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-sm transition-all shadow-lg disabled:opacity-70"
                style={{ background: status === "loading" ? "#78b8f8" : "linear-gradient(135deg, #0194f3, #0172B1)" }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                    Menyiapkan laporan...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" strokeWidth={2.5} />
                    Buka Laporan PDF
                  </>
                )}
              </button>
            )}
          </div>

          {/* What's included */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Data yang Disertakan</p>
            <div className="space-y-2">
              {DATA_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <p className="text-sm font-black text-gray-800">{cat.title}</p>
                    </div>
                    <div className="space-y-1.5 pl-11">
                      {cat.items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" strokeWidth={2.5} />
                          <p className="text-xs text-gray-500">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-xs text-amber-700 leading-relaxed">
              Laporan berisi data real-time akun Anda. Simpan file di tempat yang aman karena berisi informasi pribadi.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
