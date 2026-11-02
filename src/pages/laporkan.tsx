import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { useLocation } from "@/lib/wouter";
import {
  ArrowLeft, Flag, Bug, FileWarning, Lightbulb,
  MessageSquare, ChevronDown, Send, Loader2, CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const API = "/api";

const CATEGORIES = [
  { value: "bug",     label: "Bug / Error Teknis",       icon: Bug,          color: "text-red-500     bg-red-50     border-red-100"     },
  { value: "content", label: "Konten Tidak Akurat",       icon: FileWarning,  color: "text-amber-500   bg-amber-50   border-amber-100"   },
  { value: "feature", label: "Permintaan Fitur",          icon: Lightbulb,    color: "text-violet-500  bg-violet-50  border-violet-100"  },
  { value: "other",   label: "Lainnya / Keluhan Umum",    icon: MessageSquare,color: "text-gray-500    bg-gray-50    border-gray-100"    },
];

type Status = "idle" | "loading" | "done" | "error";

export default function LaporkanPage() {
  const [, navigate] = useLocation();
  const [category, setCategory]     = useState("bug");
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [catOpen, setCatOpen]       = useState(false);
  const [status, setStatus]         = useState<Status>("idle");
  const [errorMsg, setErrorMsg]     = useState("");
  const [reportId, setReportId]     = useState<number | null>(null);

  const selectedCat = CATEGORIES.find(c => c.value === category) ?? CATEGORIES[0];

  const handleSubmit = async () => {
    if (!title.trim()) { setErrorMsg("Judul masalah wajib diisi"); setStatus("error"); return; }
    if (!description.trim()) { setErrorMsg("Deskripsi masalah wajib diisi"); setStatus("error"); return; }
    if (description.trim().length < 20) { setErrorMsg("Deskripsi minimal 20 karakter"); setStatus("error"); return; }

    setStatus("loading");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("nempo_user_token");
      const res = await fetch(`${API}/user/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category,
          title: title.trim(),
          description: description.trim(),
          platform: navigator.userAgent.slice(0, 100),
          app_version: "2.4.1",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim laporan");
      setReportId(data.id);
      setStatus("done");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Terjadi kesalahan saat mengirim laporan");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 pb-24">
          <div
            className="relative pt-safe"
            style={{ background: "linear-gradient(135deg, #001E6E 0%, #0046B8 60%, #0194f3 100%)" }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #FFC300 0%, transparent 55%)" }} />
            <div className="relative flex items-center gap-3 px-4 pt-5 pb-5">
              <button onClick={() => navigate("/settings")}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0">
                <ArrowLeft className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
              <h1 className="text-white font-black text-lg leading-none">Laporkan Masalah</h1>
            </div>
          </div>
          <div className="px-4 pt-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 shadow-md">
              <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Laporan Terkirim!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Terima kasih sudah melaporkan masalah ini.
            </p>
            {reportId && (
              <div className="bg-gray-100 rounded-xl px-4 py-2 mb-6">
                <p className="text-xs text-gray-500">Nomor Laporan</p>
                <p className="text-base font-black text-gray-800">#RPT-{String(reportId).padStart(5, "0")}</p>
              </div>
            )}
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mb-8">
              Tim kami akan meninjau laporan Anda dan mengambil tindakan yang diperlukan dalam 1-3 hari kerja.
            </p>
            <button
              onClick={() => { setStatus("idle"); setTitle(""); setDescription(""); setCategory("bug"); }}
              className="w-full max-w-xs py-3.5 rounded-2xl text-white font-bold text-sm shadow-md"
              style={{ background: "linear-gradient(135deg, #0194f3, #0172B1)" }}
            >
              Kirim Laporan Lain
            </button>
            <button onClick={() => navigate("/settings")}
              className="mt-3 text-sm text-gray-400 font-medium">
              Kembali ke Pengaturan
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Laporkan Konten" noIndex />
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
                <Flag className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-white font-black text-xl leading-none">Laporkan Masalah</h1>
                <p className="text-white/50 text-xs mt-1">Bantu kami meningkatkan aplikasi</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-white/60 text-[11px]">Respons dalam 1-3 hari kerja</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">
          {/* Error banner */}
          {status === "error" && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          )}

          {/* Category picker */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Kategori Masalah</p>
            <div className="relative">
              <button
                onClick={() => setCatOpen(o => !o)}
                className={`w-full bg-white rounded-2xl border shadow-sm px-4 py-4 flex items-center gap-3 text-left transition-colors ${catOpen ? "border-[#0194f3]" : "border-gray-100"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${selectedCat.color}`}>
                  <selectedCat.icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <p className="flex-1 text-sm font-bold text-gray-800">{selectedCat.label}</p>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${catOpen ? "rotate-180" : ""}`} strokeWidth={2} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setCategory(cat.value); setCatOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${cat.color}`}>
                        <cat.icon className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <p className={`text-sm font-bold ${category === cat.value ? "text-[#0194f3]" : "text-gray-700"}`}>{cat.label}</p>
                      {category === cat.value && <div className="ml-auto w-2 h-2 rounded-full bg-[#0194f3]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Judul Masalah</p>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Singkat dan jelas, contoh: Tombol login tidak berfungsi"
              maxLength={100}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0194f3] transition-colors"
            />
            <p className="text-[10px] text-gray-300 text-right mt-1 px-1">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Deskripsi Lengkap</p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Jelaskan masalah secara detail: apa yang terjadi, langkah untuk mereproduksi, dan apa yang seharusnya terjadi..."
              rows={5}
              maxLength={1000}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0194f3] transition-colors resize-none"
            />
            <p className="text-[10px] text-gray-300 text-right mt-1 px-1">{description.length}/1000 (min. 20)</p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 space-y-1.5">
            <p className="text-xs font-bold text-blue-700">Tips laporan yang baik:</p>
            {["Sebutkan perangkat dan versi OS yang digunakan", "Jelaskan langkah-langkah untuk mereproduksi masalah", "Sertakan pesan error jika ada"].map(tip => (
              <div key={tip} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <p className="text-xs text-blue-600">{tip}</p>
              </div>
            ))}
          </div>

          {/* Submit button — inline (tidak fixed agar tidak tertutup bottom nav) */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-sm transition-all shadow-lg disabled:opacity-70"
            style={{ background: status === "loading" ? "#78b8f8" : "linear-gradient(135deg, #0194f3, #0172B1)" }}
          >
            {status === "loading" ? (
              <><Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} /> Mengirim...</>
            ) : (
              <><Send className="w-5 h-5" strokeWidth={2} /> Kirim Laporan</>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
