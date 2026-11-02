import React, { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import { Link } from "@/lib/wouter";
import { getTypeLabel, getAgeLabel, TYPE_COLORS, getMatchJam, MATCH_BREAKS, daftarTunggu, RUNDOWN_DAY1, RUNDOWN_DAY2, type MatchItem, type MatchStatus, type RundownItem } from "@/data/temu-tarung";
import { useMatchContext } from "@/contexts/match-context";
import { usePancoContext } from "@/contexts/panco-context";
import {
  Lock, Eye, EyeOff, ChevronLeft, ChevronRight, ChevronDown,
  Calendar, Users, FileText, Phone, CheckSquare,
  LogOut, Shield, Clock, MapPin, CalendarDays, Megaphone, AlertTriangle,
  CheckCircle2, Circle, Star, Zap, Coffee, Camera, Volume2,
  Package, UserCheck, Wrench, X, Info, Search, Swords, Trophy,
  Filter, Home, LayoutGrid, Crown, Mic, Music, ShoppingBag,
  Lightbulb, Bed, Tv2,
  Medal, Building2, ClipboardList, SearchX, Timer, Dumbbell,
  FileSpreadsheet, ListChecks, QrCode, ScanLine, CheckCheck, Ban,
  XCircle, RefreshCw, KeyRound, History, AlertCircle, Clock3, Ticket,
  Plus, Minus, Moon, Instagram,
} from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const CREW_PASSWORD = "NEMPO1601";
const CREW_KEY = "nempo_crew_auth";
const EVENT_DATE = new Date("2026-06-20T08:00:00+07:00");

/* ── Events ── */
const EVENTS = [
  {
    id: "temu-tarung",
    name: "Temu Tarung 2026",
    subtitle: "Turnamen Bela Diri Nasional · GOR Adiwijaya, Garut",
    date: "20–21 Juni 2026",
    location: "GOR Adiwijaya, Garut",
    color: "#0194f3",
  },
];

/* ── Download utility ── */
function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function downloadEl(el: HTMLElement, filename: string, format: "png" | "pdf") {
  const pixelRatio = isMobile() ? 2 : 3;

  // fontEmbedCSS:"" → skip fetch Google Fonts (CORS error) agar tidak crash
  const dataUrl = await toPng(el, {
    pixelRatio,
    backgroundColor: "#ffffff",
    cacheBust: true,
    fontEmbedCSS: "",
  });

  if (format === "png") {
    if (isIOS()) {
      // iOS Safari: navigasi ke blob URL — user bisa tap-tahan → Simpan Gambar
      const blob = await (await fetch(dataUrl)).blob();
      const blobUrl = URL.createObjectURL(blob);
      window.location.href = blobUrl;
    } else {
      const blob = await (await fetch(dataUrl)).blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, `${filename}.png`);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    }
  } else {
    const img = new Image();
    img.src = dataUrl;
    await new Promise(r => { img.onload = r; });
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const isLandscape = imgW > imgH;
    const pdf = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait", unit: "mm", format: "a4" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxW = pdfW - margin * 2;
    const maxH = pdfH - margin * 2;
    const ratio = Math.min(maxW / imgW, maxH / imgH);
    const drawW = imgW * ratio;
    const drawH = imgH * ratio;
    const x = margin + (maxW - drawW) / 2;
    const y = margin + (maxH - drawH) / 2;
    pdf.addImage(dataUrl, "PNG", x, y, drawW, drawH);
    if (isIOS()) {
      // iOS Safari: navigasi ke blob PDF — Safari akan render inline
      window.location.href = pdf.output("bloburl") as unknown as string;
    } else {
      pdf.save(`${filename}.pdf`);
    }
  }
}

function DownloadMenu({ elRef, filename, className = "" }: {
  elRef: React.RefObject<HTMLElement | null>;
  filename: string;
  className?: string;
}) {
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null);
  async function handle(fmt: "png" | "pdf") {
    if (!elRef.current || loading) return;
    setLoading(fmt);
    try { await downloadEl(elRef.current, filename, fmt); }
    finally { setLoading(null); }
  }
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        onClick={() => handle("png")}
        disabled={!!loading}
        className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl bg-gray-100 text-gray-600 active:bg-gray-200 disabled:opacity-50"
      >
        {loading === "png" ? "⏳" : "⬇"} PNG
      </button>
      <button
        onClick={() => handle("pdf")}
        disabled={!!loading}
        className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl bg-[#0194f3] text-white active:bg-blue-600 disabled:opacity-50"
      >
        {loading === "pdf" ? "⏳" : "⬇"} PDF A4
      </button>
    </div>
  );
}

const RUNDOWN = RUNDOWN_DAY1;

/* ── Divisi ── */
const DIVISI = [
  {
    name: "Pertandingan",
    icon: Swords,
    color: "#DC2626",
    bg: "#FEF2F2",
    tugas: [
      "Leader Pertandingan — koordinasi seluruh jalannya match",
      "Sudut Merah — holding room merah, panggil atlet, bantu sudut",
      "Sudut Biru — holding room biru, panggil atlet, bantu sudut",
    ],
    anggota: ["Nurdiansyah (Leader)", "Sudut Merah: Iki, Yuda, Zaky, Bagas, Reyhan", "Sudut Biru: Faqih, Alpin, Gisan, Rama, Panji"],
  },
  {
    name: "Tiket & Gate",
    icon: Users,
    color: "#0194f3",
    bg: "#EFF6FF",
    tugas: [
      "Sayap Kiri — loket & scan tiket pintu kiri",
      "Sayap Kanan — loket & scan tiket pintu kanan",
      "On The Spot — tiket mendadak & meja bantuan",
      "Gate Area — pengamanan & pengarahan penonton",
    ],
    anggota: ["Sayap Kiri: Yusuf, Jasmine", "Sayap Kanan: Putri, Agni", "On The Spot: Ica, Nur", "Gate Area: A Ocot"],
  },
  {
    name: "Kursi & Tribun",
    icon: Shield,
    color: "#D97706",
    bg: "#FFFBEB",
    tugas: [
      "Tribun A Kanan — penempatan & ketertiban tribun A",
      "Tribun B Kiri — penempatan & ketertiban tribun B",
      "Reguler — area tribun reguler",
      "VIP — kursi VIP & pelayanan tamu penting",
      "VVIP — tamu VVIP & Bupati (protokoler)",
    ],
    anggota: ["Tribun A Kanan: Aldon, Wildan", "Tribun B Kiri: Lutfi, Aldy", "Reguler: Sopian, Sayid", "VIP: Deva, Refitra", "VVIP: Damar, Esti"],
  },
  {
    name: "Ops, Logistik & Support",
    icon: Package,
    color: "#7C3AED",
    bg: "#F5F3FF",
    tugas: [
      "Konsumsi & UMKM — distribusi makan panitia & area stand UMKM",
      "Akomodasi — transportasi & penginapan tim",
      "Wasit & Juri — koordinasi wasit & pencatatan hasil",
      "Sekretariat & Logistik — administrasi, perlengkapan, gudang",
      "Sponsorship — hubungan mitra & sponsor",
      "MC — pembawa acara",
      "Talent — koordinasi penampil (penari, DJ, band)",
    ],
    anggota: ["Konsumsi & UMKM: Nazwa", "Akomodasi: Rifki, Fiki", "Wasit & Juri: Iksan, Rizaldi, Sansan", "Sekretariat & Logistik: Fadhil, Halim, Aida", "Sponsorship: Helen, Febri", "MC: Niman", "Talent: Dimas, Gustian"],
  },
];

/* ── SOP List ── */
const SOP_LIST = [
  {
    title: "SOP Registrasi Peserta",
    icon: UserCheck,
    color: "#0194f3",
    steps: [
      "Peserta menunjukkan e-tiket (screenshot/barcode) ke panitia loket",
      "Scan barcode menggunakan aplikasi scan tiket admin",
      "Jika valid: berikan gelang/stiker & catat nomor peserta",
      "Jika tiket tidak valid: arahkan ke meja bantuan (jangan ditolak langsung)",
      "Jika sistem scan error: verifikasi manual dengan foto tiket + KTP/identitas",
      "Tiap jam, laporkan jumlah peserta terdaftar ke koordinator utama",
    ],
  },
  {
    title: "SOP Insiden & Kedaruratan",
    icon: AlertTriangle,
    color: "#DC2626",
    steps: [
      "Jika ada pertengkaran: segera pisahkan pihak yang terlibat dengan tenang",
      "Hubungi koordinator keamanan via HT/WA grup panitia",
      "Jika ada cedera: panggil P3K (kotak P3K ada di meja registrasi)",
      "Cedera serius: hubungi ambulans 118 & beritahu ketua panitia SEGERA",
      "Evakuasi area sekitar insiden, jangan biarkan kerumunan",
      "Dokumentasikan kronologi kejadian setelah situasi aman",
    ],
  },
  {
    title: "SOP Pertandingan",
    icon: Star,
    color: "#D97706",
    steps: [
      "Wasit harus hadir 30 menit sebelum sesi dimulai",
      "Pastikan ring/area pertandingan bersih dan aman",
      "Peserta dipanggil 2 kali; jika tidak hadir di panggilan ke-2 = diskualifikasi",
      "Dokumentasi setiap hasil pertandingan di form resmi panitia",
      "Hasil pertandingan TIDAK boleh diumumkan sebelum dicek koordinator",
      "Keputusan wasit FINAL — tidak ada protes setelah pertandingan selesai",
    ],
  },
  {
    title: "SOP Media Sosial",
    icon: Zap,
    color: "#7C3AED",
    steps: [
      "Upload konten menggunakan akun resmi @nempo.id",
      "Caption harus menggunakan hashtag: #TemuTarung #NempoOrganizer #GarutBerdaya",
      "Jangan upload foto/video peserta minor tanpa izin orang tua",
      "Foto yang mengandung insiden/kecelakaan DILARANG diupload",
      "Konfirmasi dulu ke koordinator sebelum upload konten sensitif",
      "Target minimal: 5 Story dan 2 Feed per hari acara",
    ],
  },
];

/* ── Kontak ── */
const KONTAK = [
  { role: "Leader LO Medis", name: "—", wa: "", note: "Posko Medis & Ambulans Siaga", urgent: true },
  { role: "Koordinator Keamanan", name: "—", wa: "", note: "Koordinasi Security seluruh venue", urgent: true },
  { role: "Leader LO VIP", name: "Deva / Refitra", wa: "", note: "Drop Zone VIP & Sofa Front-Row", urgent: true },
  { role: "Admin Nempo (Darurat)", name: "Admin Nempo", wa: "", instagram: true, note: "Hanya untuk darurat teknis", urgent: true },
  { role: "Koordinator Pertandingan", name: "Nurdiansyah", wa: "", note: "Koordinasi seluruh jalannya match" },
  { role: "Leader LO Tiket & Gate", name: "Yusuf / Jasmine", wa: "", note: "Loket Utama & Gate Scanner" },
  { role: "Leader LO Tribun A (Kanan)", name: "Aldon / Wildan", wa: "", note: "Tribun Sayap Kanan" },
  { role: "Leader LO Tribun B (Kiri)", name: "Lutfi / Aldy", wa: "", note: "Tribun Sayap Kiri" },
  { role: "Leader LO Tribun Reguler", name: "Sopian / Sayid", wa: "", note: "Tribun Terbuka Reguler" },
  { role: "Leader LO VVIP", name: "Damar / Esti", wa: "", note: "Sofa Utama VVIP & Protokoler" },
  { role: "Leader LO Konsumsi & UMKM", name: "Nazwa", wa: "", note: "Dapur Lapangan & Stand UMKM" },
  { role: "Leader LO Logistik & Sekretariat", name: "Fadhil / Halim / Aida", wa: "", note: "Perlengkapan & Administrasi" },
  { role: "Leader LO Akomodasi", name: "Rifki / Fiki", wa: "", note: "Transportasi & Penginapan Tim" },
  { role: "Wasit & Juri", name: "Iksan / Rizaldi / Sansan", wa: "", note: "Koordinasi Wasit & Pencatatan Hasil" },
  { role: "Leader LO Sponsor", name: "Helen / Febri", wa: "", note: "Display Booth & Mitra Sponsor" },
  { role: "Leader LO MC", name: "Niman", wa: "", note: "Panggung Utama & Ring Announcer" },
  { role: "Leader LO Talent", name: "Dimas / Gustian", wa: "", note: "Koordinasi Penampil & Backstage" },
  { role: "Leader LO Panco", name: "—", wa: "", note: "Area Meja Teknis Panco" },
  { role: "Leader LO Runner", name: "—", wa: "", note: "Posko Komando & Lapangan" },
];

/* ── Checklist ── */
const CHECKLIST_GROUPS = [
  {
    label: "H-3 (3 Hari Sebelum)", color: "#7C3AED", bg: "#F5F3FF",
    items: ["Konfirmasi kehadiran semua panitia via WA grup","Cek stok perlengkapan: banner, backdrop, meja, kursi","Konfirmasi sound system & teknis dengan vendor","Pastikan tiket terjual sesuai target","Distribusikan rundown & SOP ke semua divisi","Cek kondisi venue/lokasi acara","Siapkan form absensi peserta","Pastikan kotak P3K tersedia & terisi"],
  },
  {
    label: "H-1 (1 Hari Sebelum)", color: "#0194f3", bg: "#EFF6FF",
    items: ["Briefing semua panitia (live/online)","Distribute HT/walkie-talkie ke PIC divisi","Cek kembali daftar peserta terdaftar","Siapkan konsumsi panitia (koordinasikan dengan katering)","Pastikan akun medsos ready & konten scheduled","Cek cuaca & siapkan alternatif jika hujan","Konfirmasi wasit/juri hadir","Pastikan cash/petty cash untuk keperluan mendadak"],
  },
  {
    label: "Hari H — Pagi", color: "#059669", bg: "#ECFDF5",
    items: ["Kumpul panitia pukul 06.30 di venue","Absensi kehadiran semua panitia","Setup venue: meja registrasi, banner, backdrop","Sound check & uji coba semua peralatan teknis","Pasang tanda-tanda penunjuk arah di venue","Briefing akhir sebelum peserta datang","Buka registrasi tepat pukul 09.00","Dokumentasikan suasana persiapan venue"],
  },
  {
    label: "Hari H — Selama Acara", color: "#D97706", bg: "#FFFBEB",
    items: ["Panitia tetap di pos masing-masing","Update jumlah peserta tiap jam ke koordinator","Catat hasil semua pertandingan di form resmi","Upload konten ke medsos sesuai jadwal","Distribusi konsumsi saat Ishoma","Monitor keamanan & kondisi penonton","Siapkan trofi & sertifikat sebelum awarding","Foto & video awarding ceremony"],
  },
  {
    label: "Post-Event (Setelah Acara)", color: "#64748B", bg: "#F8FAFC",
    items: ["Bongkar semua dekorasi & perlengkapan","Kembalikan venue ke kondisi semula","Kumpulkan semua form & dokumen resmi","Backup semua foto & video ke drive","Laporan keuangan ke ketua panitia (max H+1)","Ucapan terima kasih ke semua panitia","Evaluasi acara & buat notulen","Upload summary acara ke medsos"],
  },
];

/* ── Match Data ── */
/* MatchItem & MATCHES imported from @/data/temu-tarung */

/* ─────────────────────────────────────────────────────────────────
   ALUR TIMBANG BADAN (Day 1)
───────────────────────────────────────────────────────────────── */
const ALUR_TIMBANG_BADAN = {
  entry: { pengarah: "Acer", pjMerah: "Aldon", pjBiru: "Wildan" },
  merah: [
    { meja: 1, step: "Registrasi — Isi form & serahkan Surat Pernyataan", pj: "Nurdin" },
    { meja: 2, step: "Cek Kesehatan (Dinkes / Perawat)", pj: "Bagas" },
    { meja: 3, step: "Penimbangan", pj: "Rama & Gisan" },
    { meja: 4, step: "Ambil Baju & ID Card", pj: "Helen & Febri" },
  ],
  biru: [
    { meja: 1, step: "Registrasi — Isi form & serahkan Surat Pernyataan", pj: "Faqih" },
    { meja: 2, step: "Cek Kesehatan (Dinkes / Perawat)", pj: "Iky" },
    { meja: 3, step: "Penimbangan", pj: "Yuda & Zaki" },
    { meja: 4, step: "Ambil Baju & ID Card", pj: "Lutfi & Aldi" },
  ],
  catatan: [
    "Face-off dilaksanakan selama sesi penimbangan berlangsung",
    "Tim ID Card mengarahkan atlet keluar ke area break setelah selesai",
  ],
};

/* ─────────────────────────────────────────────────────────────────
   TALKSHOW DETAIL (Day 1)
───────────────────────────────────────────────────────────────── */
const TALKSHOW_DETAIL = {
  tema: "Bertarung dengan Prestasi",
  moderator: "Annisa N",
  pembicara: [
    "Muchtarul Wildan",
    "Dila Nurul Fadilah, S.E.",
    "Hilman Hegar, S.E.",
    "Kasat Narkoba (opsional)",
  ],
  setup: [
    "4 sofa + 1 meja panjang",
    "Set up kursi penonton",
    "Transit pembicara: Ruang Logistik",
  ],
};

/* ─────────────────────────────────────────────────────────────────
   TYPE COLORS
───────────────────────────────────────────────────────────────── */
const RUNDOWN_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  admin:    { bar: "#94a3b8", bg: "#f8fafc", text: "#64748b" },
  meeting:  { bar: "#0194f3", bg: "#eff6ff", text: "#1d4ed8" },
  ceremony: { bar: "#f59e0b", bg: "#fffbeb", text: "#d97706" },
  special:  { bar: "#8b5cf6", bg: "#f5f3ff", text: "#7c3aed" },
  match:    { bar: "#ef4444", bg: "#fef2f2", text: "#dc2626" },
  break:    { bar: "#d97706", bg: "#fff7ed", text: "#c2410c" },
};

/* ─────────────────────────────────────────────────────────────────
   MODULES DATA
───────────────────────────────────────────────────────────────── */
const MODULE_PAGES = [
  [
    { label: "Informasi", icon: Info, action: "info" },
    { label: "VVIP", icon: Crown, action: "vvip" },
    { label: "Talkshow", icon: Megaphone, action: "talkshow" },
    { label: "Panco", icon: Swords, action: "panco" },
    { label: "Rundown", icon: Calendar, action: "rundown" },
    { label: "Match", icon: LayoutGrid, action: "skema" },
  ],
  [
    { label: "Konsumsi", icon: Coffee, action: "konsumsi" },
    { label: "Akomodasi", icon: Bed, action: "akomodasi" },
    { label: "UMKM", icon: ShoppingBag, action: "umkm" },
    { label: "Guest Star", icon: Music, action: "gueststar" },
    { label: "Panitia", icon: Users, action: "panitia" },
    { label: "Lokasi", icon: MapPin, action: "lokasi" },
  ],
  [
    { label: "Tiket", icon: Ticket, action: "tiket" },
    { label: "Kontak", icon: Phone, action: "kontak" },
    { label: "Fight Malam", icon: Zap, action: "fightmalam" },
    { label: "Lighting", icon: Lightbulb, action: "lighting" },
    { label: "Sponsor", icon: Star, action: "sponsor" },
    { label: "Scan QR", icon: QrCode, action: "scan" },
  ],
];

/* ─────────────────────────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────────────────────────── */
function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(0, Math.floor(diff / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s, done: total === 0 };
}

/* ─────────────────────────────────────────────────────────────────
   GATE — HALAMAN LOGIN
───────────────────────────────────────────────────────────────── */
function CrewGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === CREW_PASSWORD) {
      localStorage.setItem(CREW_KEY, "1");
      onUnlock();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#f3f4f6] px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0194f3] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
          <span className="text-white font-extrabold text-2xl">T</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">LO Panitia Nempo Organizer</h1>
        <p className="text-sm text-gray-500 mt-1">Dokumen Internal Panitia</p>
      </div>

      {/* Card */}
      <div className={`w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all ${shake ? "animate-shake" : ""}`}>
        <div className="flex items-center gap-2 mb-5">
          <Lock className="h-4 w-4 text-[#0194f3]" />
          <p className="text-sm font-bold text-gray-700">Masukkan kode akses panitia</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3 transition-colors ${err ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-[#0194f3]"}`}>
            <Lock className={`h-4 w-4 shrink-0 ${err ? "text-red-400" : "text-gray-400"}`} />
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(false); }}
              placeholder="Kode akses"
              className="flex-1 text-sm font-semibold outline-none bg-transparent text-gray-900 placeholder-gray-300"
              autoFocus
            />
            <button type="button" onClick={() => setShow(s => !s)} className="text-gray-400 hover:text-gray-600">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {err && <p className="text-xs text-red-500 font-semibold px-1">Kode salah. Hubungi koordinator.</p>}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0194f3 0%, #0070c7 100%)" }}
          >
            Masuk ke Crew Portal
          </button>
        </form>
        <Link href="/">
          <button className="w-full mt-3 py-2.5 rounded-2xl text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            ← Kembali ke Nempo Organizer
          </button>
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">LO Panitia Nempo Organizer · Dokumen Internal</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TOP BAR
───────────────────────────────────────────────────────────────── */
function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0194f3] flex items-center justify-center shadow-sm shadow-blue-200">
            <span className="text-white font-extrabold text-sm">T</span>
          </div>
          <span className="font-extrabold text-gray-900 text-base">LO Panitia Nempo Organizer</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500">20–21 Jun '26</span>
          <button onClick={onLogout} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <LogOut className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   INFO TICKER
───────────────────────────────────────────────────────────────── */
function InfoTicker() {
  const msg = "Adiwijaya, Garut · Turnamen Bela Diri Nasional · Selamat datang di Temu Tarung 2026 · GOR Adiwijaya, Garut · Turnamen Bela Diri Nasional · ";
  return (
    <div className="bg-[#0194f3] overflow-hidden py-1.5">
      <div className="flex items-center gap-3 px-4" style={{ animation: "marquee 28s linear infinite", width: "max-content" }}>
        <span className="text-[10px] font-extrabold text-white/70 uppercase tracking-widest shrink-0">INFO</span>
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-[11px] text-white/90 font-semibold whitespace-nowrap">{msg}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COUNTDOWN WIDGET
───────────────────────────────────────────────────────────────── */
function CountdownWidget() {
  const { d, h, m, s, done } = useCountdown(EVENT_DATE);
  const boxes = [
    { v: d, l: "Hari" }, { v: h, l: "Jam" }, { v: m, l: "Menit" }, { v: s, l: "Detik" },
  ];
  if (done) return (
    <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-sm font-extrabold">
      <Swords className="h-4 w-4" /> Event Sedang Berlangsung!
    </div>
  );
  return (
    <div className="mt-4">
      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Mundur Waktu</p>
      <div className="flex gap-2">
        {boxes.map(({ v, l }, i) => (
          <div key={i} className={`flex flex-col items-center px-3 py-2.5 rounded-2xl border-2 min-w-[52px] transition-colors ${
            i === boxes.length - 1
              ? "border-[#0194f3] bg-[#0194f3] text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}>
            <span className={`text-xl font-extrabold leading-none tabular-nums ${i === boxes.length - 1 ? "text-white" : "text-gray-900"}`}>
              {String(v).padStart(2, "0")}
            </span>
            <span className={`text-[9px] font-bold mt-0.5 ${i === boxes.length - 1 ? "text-white/80" : "text-gray-500"}`}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MODULE GRID
───────────────────────────────────────────────────────────────── */
function ModuleGrid({ onNav }: { onNav: (tab: string) => void }) {
  const [page, setPage] = useState(0);
  const modules = MODULE_PAGES[page];

  function handleModule(action: string) {
    if (action === "info") onNav("info");
    else if (action === "talkshow") onNav("talkshow");
    else if (action === "rundown") onNav("rundown");
    else if (action === "skema") onNav("skema");
    else if (action === "scan") onNav("scan");
    else if (action === "vvip") onNav("vvip");
    else if (action === "kontak") onNav("kontak");
    else if (action === "panitia") onNav("kontak");
    else if (action === "fightmalam") onNav("rundown");
    else if (action === "panco") onNav("panco");
    else if (action === "konsumsi") onNav("konsumsi");
    else if (action === "akomodasi") onNav("akomodasi");
    else if (action === "tiket") onNav("tiket");
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-0">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <button
                key={i}
                onClick={() => handleModule(mod.action)}
                className="flex flex-col items-center gap-2 py-4 px-2 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-2xl"
              >
                <Icon className="h-6 w-6 text-gray-700 stroke-[1.5]" />
                <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 pb-3">
        {MODULE_PAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`rounded-full transition-all ${i === page ? "w-5 h-1.5 bg-[#0194f3]" : "w-1.5 h-1.5 bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STATS CARDS
───────────────────────────────────────────────────────────────── */
function StatsSection() {
  const { matches } = useMatchContext();
  const selesai = matches.filter(m => m.status === "selesai").length;
  const stats = [
    { n: matches.filter(m => getTypeLabel(m.kategori) !== "Panco").length, l: "Total Match", c: "#0194f3", bg: "#eff6ff" },
    { n: 2, l: "Hari Tanding", c: "#0194f3", bg: "#eff6ff" },
    { n: 1, l: "Octagon Arena", c: "#f59e0b", bg: "#fffbeb" },
    { n: 65, l: "Personel LO", c: "#10b981", bg: "#ecfdf5" },
  ];
  return (
    <div>
      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2.5">Ringkasan Acara</p>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl px-2 py-3 text-center" style={{ background: s.bg }}>
            <p className="text-xl font-extrabold leading-none" style={{ color: s.c }}>{s.n}</p>
            <p className="text-[9px] font-bold text-gray-500 mt-1 leading-tight uppercase tracking-wide">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EVENT BANNER
───────────────────────────────────────────────────────────────── */
function MainEventBanner() {
  const { matches } = useMatchContext();
  const live = matches.find(m => m.status === "berlangsung");
  const next = matches.find(m => m.status === "belum");
  const m = live || next;
  if (!m) return null;
  const isLive = m.status === "berlangsung";
  return (
    <div className={`rounded-3xl overflow-hidden border ${isLive ? "border-amber-200" : "border-gray-100"}`}>
      <div className={`px-4 py-2 flex items-center justify-between ${isLive ? "bg-amber-500" : "bg-gray-100"}`}>
        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isLive ? "text-white" : "text-gray-500"}`}>
          {isLive ? "● LIVE NOW" : "MAIN EVENT · DAY 2 · 22.40 WIB"}
        </span>
        <span className={`text-[10px] font-semibold ${isLive ? "text-white/80" : "text-gray-400"}`}>Match {String(m.no).padStart(3,"0")} · Pro Fight</span>
      </div>
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-1 w-full rounded-full bg-red-500 mb-2" />
            <p className="font-extrabold text-sm text-gray-900 truncate">{m.merah}</p>
            <p className="text-[10px] text-gray-400">{m.campMerah}</p>
          </div>
          <div className="shrink-0 text-center">
            <p className="text-[10px] font-extrabold text-gray-400">{m.berat}</p>
            <p className="text-xl font-extrabold text-gray-200 leading-none my-1">VS</p>
          </div>
          <div className="flex-1 text-right">
            <div className="h-1 w-full rounded-full bg-blue-500 mb-2" />
            <p className="font-extrabold text-sm text-gray-900 truncate">{m.biru}</p>
            <p className="text-[10px] text-gray-400">{m.campBiru}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PENGUMUMAN CARD
───────────────────────────────────────────────────────────────── */
const PENGUMUMAN = [
  { tag: "WAJIB", text: "Kumpul panitia pukul 06.30 WIB di venue (Hari H, 21 Juni 2026). Absensi dilakukan sebelum peserta datang.", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  { tag: "INFO", text: "ID Card panitia wajib dipakai selama acara berlangsung. Tanpa ID Card tidak diizinkan masuk area restricted.", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { tag: "INFO", text: "Semua perubahan jadwal dan match dikomunikasikan lewat WA Grup Panitia. Pantau terus grup!", color: "#0194f3", bg: "#EFF6FF", border: "#BFDBFE" },
  { tag: "TEKNIS", text: "Masalah teknis aplikasi? Hubungi Admin Nempo melalui DM Instagram di tab Kontak.", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

function PengumumanCard() {
  const [open, setOpen] = useState(false);
  const visible = open ? PENGUMUMAN : PENGUMUMAN.slice(0, 2);
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-[13px] font-extrabold text-gray-800">Pengumuman Panitia</span>
        </div>
        <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{PENGUMUMAN.length} info</span>
      </div>
      <div className="px-4 pb-3 space-y-2">
        {visible.map((p, i) => (
          <div key={i} className="rounded-2xl border px-3 py-2.5" style={{ background: p.bg, borderColor: p.border }}>
            <div className="flex items-start gap-2">
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5" style={{ background: p.color, color: "#fff" }}>{p.tag}</span>
              <p className="text-[11px] text-gray-700 leading-snug">{p.text}</p>
            </div>
          </div>
        ))}
        {PENGUMUMAN.length > 2 && (
          <button onClick={() => setOpen(v => !v)} className="w-full text-center text-[11px] font-bold text-[#0194f3] py-1">
            {open ? "Sembunyikan ▲" : `Lihat ${PENGUMUMAN.length - 2} lainnya ▼`}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   JADWAL TERDEKAT CARD
───────────────────────────────────────────────────────────────── */
const TYPE_COLOR: Record<string, { dot: string; bg: string; text: string }> = {
  admin:    { dot: "#64748B", bg: "#F8FAFC", text: "#475569" },
  meeting:  { dot: "#3B82F6", bg: "#EFF6FF", text: "#1D4ED8" },
  break:    { dot: "#F59E0B", bg: "#FFFBEB", text: "#92400E" },
  ceremony: { dot: "#8B5CF6", bg: "#F5F3FF", text: "#6D28D9" },
  special:  { dot: "#EC4899", bg: "#FDF2F8", text: "#BE185D" },
  match:    { dot: "#EF4444", bg: "#FEF2F2", text: "#B91C1C" },
};

function JadwalTerdekatCard({ onNav }: { onNav: (tab: string) => void }) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const today = now.getDate();
  const isDay1 = today <= 20;
  const isDay2 = today === 21;
  const rawList = isDay2 ? RUNDOWN_DAY2 : RUNDOWN_DAY1;

  function toMins(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  }

  const upcoming = rawList.filter(r => {
    const endMins = toMins(r.end === "Selesai" ? "23:59" : r.end);
    return endMins >= nowMins;
  }).slice(0, 4);

  const dayLabel = isDay2 ? "Hari H · 21 Jun 2026" : "H-1 · 20 Jun 2026";
  const showLabel = !isDay1 && !isDay2 ? "H-1 · 20 Jun 2026" : dayLabel;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center">
            <Clock3 className="h-4 w-4 text-[#0194f3]" />
          </div>
          <span className="text-[13px] font-extrabold text-gray-800">Agenda Terdekat</span>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{showLabel}</span>
      </div>
      <div className="px-4 pb-3">
        {upcoming.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[12px] font-semibold text-gray-400">Semua agenda hari ini sudah selesai 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((item, i) => {
              const c = TYPE_COLOR[item.type] ?? TYPE_COLOR.admin;
              const isCurrent = toMins(item.time) <= nowMins && toMins(item.end === "Selesai" ? "23:59" : item.end) >= nowMins;
              return (
                <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-2xl border ${isCurrent ? "border-amber-300 bg-amber-50" : "border-gray-100"}`} style={!isCurrent ? { background: c.bg } : {}}>
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
                    <span className="text-[11px] font-extrabold text-gray-900 tabular-nums">{item.time}</span>
                    {isCurrent && <span className="text-[8px] font-extrabold text-amber-600 bg-amber-100 px-1 rounded">NOW</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-800 leading-snug truncate">{item.activity}</p>
                    <p className="text-[10px] text-gray-400 truncate">{item.loc}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: c.dot }} />
                </div>
              );
            })}
          </div>
        )}
        <button
          onClick={() => onNav("rundown")}
          className="w-full mt-3 py-2 rounded-2xl border border-gray-100 text-[11px] font-bold text-[#0194f3] hover:bg-blue-50 active:bg-blue-100 transition-colors"
        >
          Lihat Rundown Lengkap →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   KONTAK DARURAT CEPAT
───────────────────────────────────────────────────────────────── */
const DARURAT_KONTAK = [
  { role: "Posko Medis", icon: "🚑", wa: "", color: "#EF4444", bg: "#FEF2F2" },
  { role: "LO Keamanan", icon: "🛡️", wa: "", color: "#D97706", bg: "#FFFBEB" },
  { role: "Admin Teknis", icon: "⚙️", wa: "", instagram: true, color: "#0194f3", bg: "#EFF6FF" },
];

function KontakDaruratCard({ onNav }: { onNav: (tab: string) => void }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center">
            <Phone className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-[13px] font-extrabold text-gray-800">Kontak Darurat</span>
        </div>
        <button onClick={() => onNav("kontak")} className="text-[11px] font-bold text-[#0194f3]">Semua →</button>
      </div>
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {DARURAT_KONTAK.map((k, i) => (
          <div
            key={i}
            onClick={() => (k as any).instagram
              ? window.open(NEMPO_CONSULT_URL, "_blank", "noopener,noreferrer")
              : k.wa
                ? window.open(`https://wa.me/${k.wa}`, "_blank")
                : onNav("kontak")}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border cursor-pointer active:scale-95 transition-all"
            style={{ background: k.bg, borderColor: k.color + "33" }}
          >
            <span className="text-xl">{k.icon}</span>
            <span className="text-[10px] font-extrabold text-center leading-tight" style={{ color: k.color }}>{k.role}</span>
            <span className="text-[9px] font-semibold" style={{ color: k.color + "aa" }}>{(k as any).instagram ? "Instagram" : k.wa ? "WA" : "Lihat"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SESI MALAM CARD (beranda crew)
───────────────────────────────────────────────────────────────── */
interface NightMatchCrew {
  order: number;
  label: string;
  tier: "super-elite" | "pro" | "main";
  time: string;
  merah: string;
  campMerah: string;
  biru: string;
  campBiru: string;
  kategori: string;
  berat: string;
  piala?: string;
  note?: string;
}
const NIGHT_MATCHES_CREW: NightMatchCrew[] = [
  { order:1, label:"Super Elite 1", tier:"super-elite", time:"19:15", merah:"Exsel Vernaldo",       campMerah:"Satria Negara / IBCA",       biru:"Feanaldo",                  campBiru:"Walasungsang",          kategori:"MMA Putra",                     berat:"65 kg" },
  { order:2, label:"Super Elite 2", tier:"super-elite", time:"19:38", merah:"Agil Septian",          campMerah:"Baja Fight Academy",         biru:"Satria Nazarheksa Nandika", campBiru:"B.O.S.S Kick Boxing",   kategori:"Stand Up Fight Senior Putra",   berat:"52 kg" },
  { order:3, label:"Super Elite 3", tier:"super-elite", time:"20:01", merah:"Muhammad Fhajar",       campMerah:"Muaythai Boxing Majalaya",   biru:"Darrell Narendra",          campBiru:"Baja X Dulur",          kategori:"Stand Up Fight Putra Junior",   berat:"52 kg" },
  { order:4, label:"Pro Match 1",   tier:"pro",         time:"20:24", merah:"Resnu Sundava",         campMerah:"Bandung",                    biru:"Ifandi Saputra",            campBiru:"Sumatera Selatan",      kategori:"Stand Up Fight Putra Senior",   berat:"—" },
  { order:5, label:"Pro Match 2",   tier:"pro",         time:"20:47", merah:"Aziz Yousofi",          campMerah:"—",                          biru:"Ahmad Fathurrohman",        campBiru:"—",                     kategori:"Stand Up Fight Putra Senior",   berat:"—",   piala:"Piala Dandim" },
  { order:6, label:"Pro Match 3",   tier:"pro",         time:"21:30", merah:"Bimo Catur Prasetyo",   campMerah:"IBCA Kota Bekasi",           biru:"Rio Cahyadi",               campBiru:"Mushajuku MMA",         kategori:"MMA Putra Senior",              berat:"70 kg" },
  { order:7, label:"Pro Match 4",   tier:"pro",         time:"21:53", merah:"Fauzzan Hasanuddin",    campMerah:"Bandung",                    biru:"Albi Dianto",               campBiru:"Garut",                 kategori:"Stand Up Fight Putra Senior",   berat:"—",   piala:"Piala Kapolres" },
  { order:8, label:"Pro Match 5",   tier:"pro",         time:"22:36", merah:"Finalis A",             campMerah:"—",                          biru:"Finalis B",                 campBiru:"—",                     kategori:"For Men Putra Senior",          berat:"—",   piala:"Piala Bupati",  note:"4 Finalis · TBD" },
  { order:9, label:"★ MAIN EVENT",  tier:"main",        time:"23:14", merah:"Papi Malik 🇵🇰",        campMerah:"Influencer Pakistan",         biru:"Hoordad Golpour 🇮🇷",       campBiru:"Influencer Iran",       kategori:"For Men / Influencer Fighters", berat:"—",   piala:"Piala Biduri" },
];

function SesiMalamCard() {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 pt-4 pb-3 active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
            <Moon className="h-4 w-4 text-violet-600" />
          </div>
          <div className="text-left">
            <span className="text-[13px] font-extrabold text-gray-800 block">Sesi Malam Puncak</span>
            <span className="text-[10px] text-gray-400 font-medium">Super Elite & Pro Night · 21 Juni · Ab. Isya</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">9 match</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          {/* Legend */}
          <div className="flex gap-2 pb-1 flex-wrap">
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">● Super Elite</span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">● Pro Match</span>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">★ Main Event</span>
          </div>
          {NIGHT_MATCHES_CREW.map(m => {
            const isMain = m.tier === "main";
            const isSE   = m.tier === "super-elite";
            const topBg  = isMain ? "bg-rose-600" : isSE ? "bg-amber-500" : "bg-violet-600";
            const badgeSt = isMain
              ? { background: "#fee2e2", color: "#b91c1c" }
              : isSE
              ? { background: "#fef3c7", color: "#92400e" }
              : { background: "#ede9fe", color: "#6d28d9" };
            return (
              <div key={m.order} className={`rounded-2xl overflow-hidden border ${
                isMain ? "border-rose-300" : isSE ? "border-amber-200" : "border-violet-100"
              }`}>
                {/* Top bar */}
                <div className={`flex items-center justify-between px-3 py-1.5 ${topBg}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold text-white tabular-nums">#{String(m.order).padStart(2,"0")}</span>
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full" style={badgeSt}>{m.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-white/70 font-bold tabular-nums">⏱ {m.time}</span>
                    {m.berat !== "—" && (
                      <span className="text-[8px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full">{m.berat}</span>
                    )}
                  </div>
                </div>
                {/* Sub info */}
                <div className="bg-white px-3 pt-1 pb-0">
                  <p className="text-[8px] text-gray-400 truncate">
                    {m.kategori}{m.piala ? ` · 🏆 ${m.piala}` : ""}{m.note ? ` · ${m.note}` : ""}
                  </p>
                </div>
                {/* VS row */}
                <div className="bg-white px-2.5 pt-1 pb-2">
                  <div className="flex items-stretch gap-1.5">
                    <div className="flex-1 min-w-0 rounded-lg p-2 border bg-red-50/40 border-red-100">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-[7px] font-extrabold text-red-500 uppercase tracking-wider">Red</span>
                      </div>
                      <p className="text-[10px] font-extrabold text-gray-900 leading-snug">{m.merah}</p>
                      <p className="text-[7px] text-gray-400 mt-0.5 line-clamp-1">{m.campMerah}</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center w-5">
                      <span className="text-[8px] font-extrabold text-gray-300">VS</span>
                    </div>
                    <div className="flex-1 min-w-0 rounded-lg p-2 border bg-blue-50/40 border-blue-100 text-right">
                      <div className="flex items-center justify-end gap-1 mb-0.5">
                        <span className="text-[7px] font-extrabold text-blue-500 uppercase tracking-wider">Blue</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                      <p className="text-[10px] font-extrabold text-gray-900 leading-snug">{m.biru}</p>
                      <p className="text-[7px] text-gray-400 mt-0.5 line-clamp-1">{m.campBiru}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BERANDA TAB
───────────────────────────────────────────────────────────────── */
function BerandaTab({ onNav }: { onNav: (tab: string) => void }) {
  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="bg-[#f3f4f6] px-5 pt-6 pb-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#0194f3]" />
          <span className="text-[11px] font-bold text-gray-500">Dokumen Internal Panitia</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Temu <span className="text-[#0194f3]">Tarung</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">Turnamen Bela Diri Nasional · GOR Adiwijaya, Garut</p>
        <CountdownWidget />
      </div>

      {/* Module Grid */}
      <div className="px-4 mt-3 space-y-3">
        <ModuleGrid onNav={onNav} />
        <StatsSection />
        <PengumumanCard />
        <JadwalTerdekatCard onNav={onNav} />
        <MainEventBanner />
        <SesiMalamCard />
        <KontakDaruratCard onNav={onNav} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   RUNDOWN TAB
───────────────────────────────────────────────────────────────── */

const CAT_LABEL: Record<string, string> = {
  admin:    "ADMIN",
  meeting:  "RAPAT",
  break:    "JEDA",
  ceremony: "SEREMONI",
  special:  "SHOW",
  match:    "TANDING",
};

const BLOCK_PALETTE = [
  { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1", dot: "#64748B" },  // 0 slate
  { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD", dot: "#0EA5E9" },  // 1 sky
  { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", dot: "#3B82F6" },  // 2 blue
  { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", dot: "#F59E0B" },  // 3 amber
  { bg: "#FFF7ED", text: "#C2410C", border: "#FDBA74", dot: "#F97316" },  // 4 orange
  { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE", dot: "#8B5CF6" },  // 5 purple
  { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA", dot: "#EF4444" },  // 6 red
  { bg: "#F9FAFB", text: "#374151", border: "#D1D5DB", dot: "#9CA3AF" },  // 7 neutral
  { bg: "#EDE9FE", text: "#5B21B6", border: "#C4B5FD", dot: "#7C3AED" },  // 8 violet
  { bg: "#EEF2FF", text: "#3730A3", border: "#C7D2FE", dot: "#6366F1" },  // 9 indigo
];

function RundownTab() {
  const [day, setDay] = useState<1 | 2>(1);
  const [alurOpen, setAlurOpen] = useState(false);
  const [talkshowOpen, setTalkshowOpen] = useState(false);
  const raw = day === 1 ? RUNDOWN_DAY1 : RUNDOWN_DAY2;

  type Grp = { bn: number; bt: string; block: string; items: typeof raw };
  const grouped: Grp[] = [];
  for (const item of raw) {
    const last = grouped[grouped.length - 1];
    const curBn = "bn" in item ? (item as typeof RUNDOWN_DAY1[0]).bn : 0;
    if (!last || last.block !== item.block) {
      grouped.push({
        bn: curBn,
        bt: "bt" in item ? (item as typeof RUNDOWN_DAY1[0]).bt : "",
        block: item.block,
        items: [item],
      });
    } else {
      last.items.push(item);
    }
  }

  const totalItems = raw.length;
  const dayLabel   = day === 1 ? "H-1 · Sabtu, 20 Juni 2026" : "Hari H · Minggu, 21 Juni 2026";
  const dayShort   = day === 1 ? "H1_20Jun2026" : "HariH_21Jun2026";

  const catCounts = Object.fromEntries(
    Object.keys(CAT_LABEL).map(t => [t, raw.filter(r => r.type === t).length])
  );

  function downloadCSV() {
    const cols = ["Blok", "Waktu", "Selesai", "Kategori", "Kegiatan", "Lokasi", "PIC"];
    const rows = raw.map(item => [
      item.block,
      item.time,
      item.end,
      CAT_LABEL[item.type] ?? item.type.toUpperCase(),
      item.activity,
      ("loc" in item ? (item as typeof RUNDOWN_DAY1[0]).loc : "") ?? "",
      item.div,
    ]);
    const csv  = [cols, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url;
    a.download = `Rundown_TemuTarung_${dayShort}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-3.5 pb-3 shadow-[0_1px_8px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3">
          {/* Left: icon + title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg,#0194f3,#0170c2)" }}>
              <ListChecks className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-[15px] leading-tight tracking-tight">Rundown Operasional</p>
              <p className="text-[11px] font-semibold leading-tight" style={{ color: day === 1 ? "#d97706" : "#dc2626" }}>{dayLabel}</p>
            </div>
          </div>
          {/* Right: badge + CSV */}
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
              day === 1 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-600 border-red-200"
            }`}>
              {totalItems} agenda
            </div>
            <button
              onClick={downloadCSV}
              title="Unduh rundown CSV (buka di Excel/Sheets)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold text-white shadow-sm active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", boxShadow: "0 2px 8px -2px #16a34a70" }}
            >
              <FileSpreadsheet className="h-[14px] w-[14px]" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Day tabs */}
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          {([1, 2] as const).map(d => (
            <button key={d} onClick={() => setDay(d)}
              className={`flex-1 py-2 rounded-xl text-[13px] font-bold transition-all ${
                day === d ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {d === 1 ? "H-1 · 20 Juni" : "Hari H · 21 Juni"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category stats strip ── */}
      <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto scrollbar-none">
        {Object.entries(CAT_LABEL).filter(([t]) => catCounts[t] > 0).map(([type, label]) => {
          const tc = RUNDOWN_COLORS[type] ?? RUNDOWN_COLORS.admin;
          return (
            <div key={type} className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1.5 rounded-xl border"
              style={{ background: tc.bg, borderColor: tc.bar + "30" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tc.bar }} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: tc.bar }}>{label}</span>
              <span className="text-[10px] font-black ml-0.5" style={{ color: tc.bar }}>{catCounts[type]}</span>
            </div>
          );
        })}
      </div>

      {/* ── Blocks ── */}
      <div className="px-4 pt-2 pb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {grouped.map((g, gi) => {
          const palette = BLOCK_PALETTE[gi % BLOCK_PALETTE.length];
          return (
            <div key={gi} className="rounded-2xl overflow-hidden border shadow-[0_1px_6px_0_rgba(0,0,0,0.06)]"
              style={{ borderColor: palette.border + "90" }}>

              {/* Block header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ background: palette.bg, borderColor: palette.border + "70" }}>
                {/* Number badge */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[14px] text-white flex-shrink-0 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${palette.dot}, ${palette.dot}cc)`, boxShadow: `0 3px 8px -2px ${palette.dot}60` }}>
                  {g.bn || gi + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-[13px] leading-tight" style={{ color: palette.text }}>{g.block}</p>
                  {g.bt && (
                    <p className="text-[10px] font-semibold mt-0.5 flex items-center gap-1" style={{ color: palette.dot }}>
                      <Clock className="h-2.5 w-2.5 shrink-0" />{g.bt}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex-shrink-0"
                  style={{ background: palette.dot + "18", color: palette.dot, border: `1px solid ${palette.dot}25` }}>
                  {g.items.length} agenda
                </span>
              </div>

              {/* Items */}
              <div className="bg-white divide-y divide-gray-50/80">
                {g.items.map((item, ii) => {
                  const tc = RUNDOWN_COLORS[item.type] ?? RUNDOWN_COLORS.admin;
                  const cat = CAT_LABEL[item.type] ?? item.type.toUpperCase();
                  const isMatch    = item.type === "match";
                  const isSpecial  = item.type === "special";
                  const isCeremony = item.type === "ceremony";
                  const isBreak    = item.type === "break";
                  const loc = "loc" in item ? (item as typeof RUNDOWN_DAY1[0]).loc : "";
                  const rowBg = isMatch ? "#FFF5F5" : isSpecial ? "#FAF5FF" : isCeremony ? "#FFFDF0" : isBreak ? "#FFF8F1" : "white";

                  return (
                    <div key={ii} className="flex items-stretch transition-colors" style={{ background: rowBg }}>

                      {/* Left accent bar */}
                      <div className="w-[3px] flex-shrink-0 rounded-r-sm" style={{ background: tc.bar }} />

                      {/* Content */}
                      <div className="flex-1 px-3 py-3 flex gap-3 min-w-0">

                        {/* Time column */}
                        <div className="flex-shrink-0 w-[50px] pt-0.5">
                          <p className="font-black text-[13px] leading-tight tabular-nums"
                            style={{ color: isMatch ? tc.bar : "#111827" }}>
                            {item.time}
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 leading-tight tabular-nums">–{item.end}</p>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                          {/* Category pill */}
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1.5 tracking-widest uppercase"
                            style={{ background: tc.bg, color: tc.bar, border: `1px solid ${tc.bar}30` }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tc.bar }} />
                            {cat}
                          </span>

                          {/* Activity title */}
                          {item.div === "DJ & Sound Engineer" ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                  <circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                </svg>
                              </div>
                              <p className="font-extrabold text-[13px] leading-snug" style={{ color: "#7c3aed" }}>{item.activity}</p>
                            </div>
                          ) : (
                            <p className={`font-extrabold leading-snug ${isMatch ? "text-[13.5px]" : "text-[13px] text-gray-900"}`}
                              style={isMatch ? { color: tc.bar } : {}}>
                              {item.activity}
                            </p>
                          )}

                          {/* Location + PIC */}
                          <div className="mt-1.5 flex flex-col gap-0.5">
                            {loc && (
                              <p className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 leading-tight">
                                <MapPin className="h-2.5 w-2.5 flex-shrink-0 text-gray-400" />
                                <span>{loc}</span>
                              </p>
                            )}
                            <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1 leading-tight">
                              <UserCheck className="h-2.5 w-2.5 flex-shrink-0 text-gray-300" />
                              <span>{item.div}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Dropdown Talkshow Detail (Day 1 only) ── */}
              {day === 1 && g.block === "Talkshow Panel Edukasi" && (
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setTalkshowOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-violet-50 hover:bg-violet-100 transition-colors active:bg-violet-200"
                  >
                    <div className="flex items-center gap-2">
                      <Mic className="h-3.5 w-3.5 text-violet-600" />
                      <span className="text-[11px] font-extrabold text-violet-800">Lihat Detail Talkshow</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-violet-400 transition-transform duration-200 ${talkshowOpen ? "rotate-180" : ""}`} />
                  </button>

                  {talkshowOpen && (
                    <div className="border-t border-gray-100">
                      {/* Tema */}
                      <div className="px-4 py-3 bg-violet-50 border-b border-violet-100">
                        <p className="text-[9px] font-extrabold text-violet-500 uppercase tracking-widest mb-1">Tema</p>
                        <p className="text-[11px] font-semibold text-violet-900 leading-snug italic">"{TALKSHOW_DETAIL.tema}"</p>
                      </div>

                      {/* Setup */}
                      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex flex-col gap-1.5">
                        <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Setup Panggung</p>
                        {TALKSHOW_DETAIL.setup.map((s, i) => (
                          <p key={i} className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                            <Wrench className="h-3 w-3 text-gray-400 flex-shrink-0" />{s}
                          </p>
                        ))}
                      </div>

                      {/* Moderator + Pembicara */}
                      <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
                        {/* Moderator */}
                        <div className="px-3 py-2.5">
                          <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Moderator</p>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                              <Mic className="h-2.5 w-2.5 text-violet-600" />
                            </div>
                            <p className="text-[11px] font-bold text-gray-800">{TALKSHOW_DETAIL.moderator}</p>
                          </div>
                        </div>

                        {/* Pembicara */}
                        <div className="px-3 py-2.5">
                          <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Pembicara</p>
                          <div className="flex flex-col gap-1.5">
                            {TALKSHOW_DETAIL.pembicara.map((p, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-[9px] font-black text-violet-400 mt-0.5">{i + 1}.</span>
                                <p className="text-[10px] font-bold text-gray-800 leading-snug">{p}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Dropdown Alur Timbang Badan (Blok 1, Day 1 only) ── */}
              {day === 1 && g.block === "Timbang Badan & Cek Medis" && (
                <div className="border-t border-gray-100">
                  {/* Toggle button */}
                  <button
                    onClick={() => setAlurOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 hover:bg-amber-100 transition-colors active:bg-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-[11px] font-extrabold text-amber-800">Lihat Alur Timbang Badan — 8 Meja</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-amber-500 transition-transform duration-200 ${alurOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Collapsible content */}
                  {alurOpen && (
                    <div>
                      {/* Entry note */}
                      <div className="px-4 py-2.5 flex items-center gap-2.5 border-t border-gray-100 bg-slate-50">
                        <UserCheck className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-700">
                            Pengarah Masuk: <span className="text-slate-900">{ALUR_TIMBANG_BADAN.entry.pengarah}</span>
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            PJ Merah: <span className="text-red-600 font-bold">{ALUR_TIMBANG_BADAN.entry.pjMerah}</span>
                            <span className="mx-1.5 text-slate-300">·</span>
                            PJ Biru: <span className="text-blue-600 font-bold">{ALUR_TIMBANG_BADAN.entry.pjBiru}</span>
                          </p>
                        </div>
                      </div>

                      {/* Two columns */}
                      <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-white">
                        {/* Sudut Merah */}
                        <div>
                          <div className="px-3 py-1.5 border-b border-red-100 bg-red-50 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                            <p className="text-[10px] font-extrabold text-red-700 uppercase tracking-wide">Sudut Merah</p>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {ALUR_TIMBANG_BADAN.merah.map((s) => (
                              <div key={s.meja} className="px-3 py-2 flex gap-2">
                                <div className="w-4 h-4 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[9px] font-black text-red-600">{s.meja}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-gray-800 leading-snug">{s.step}</p>
                                  <p className="text-[9px] font-semibold text-red-500 mt-0.5">{s.pj}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sudut Biru */}
                        <div>
                          <div className="px-3 py-1.5 border-b border-blue-100 bg-blue-50 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide">Sudut Biru</p>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {ALUR_TIMBANG_BADAN.biru.map((s) => (
                              <div key={s.meja} className="px-3 py-2 flex gap-2">
                                <div className="w-4 h-4 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[9px] font-black text-blue-600">{s.meja}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-gray-800 leading-snug">{s.step}</p>
                                  <p className="text-[9px] font-semibold text-blue-500 mt-0.5">{s.pj}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Catatan */}
                      <div className="px-4 py-2 border-t border-amber-100 bg-amber-50 flex flex-col gap-1">
                        {ALUR_TIMBANG_BADAN.catatan.map((c, i) => (
                          <p key={i} className="text-[10px] font-semibold text-amber-800 flex items-start gap-1.5 leading-snug">
                            <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   INFO TAB
───────────────────────────────────────────────────────────────── */
function InfoTab({ onBack }: { onBack: () => void }) {
  const protokol = [
    {
      title: "Dress Code Panitia",
      desc: "Kaos polo hitam panitia, celana panjang kargo hitam/gelap, sepatu kets tertutup. Dilarang pakai sandal di area pertandingan.",
    },
    {
      title: "Komunikasi HT",
      desc: "Saluran 1 untuk koordinasi umum. Saluran 2 khusus medis darurat. HT wajib stand-by sepanjang acara.",
    },
    {
      title: "Kehadiran",
      desc: "Seluruh panitia wajib berada di pos masing-masing 30 menit sebelum jadwal dimulai.",
    },
    {
      title: "ID Card",
      desc: "ID Card panitia wajib dikenakan setiap saat dan terlihat jelas untuk akses zona VIP / Ring 1.",
    },
    {
      title: "Dokumentasi",
      desc: "Panitia media wajib dokumentasi setiap sesi. Upload ke grup WA dalam 15 menit setelah sesi selesai.",
    },
    {
      title: "Kedaruratan",
      desc: "Jika ada insiden, segera laporkan ke koordinator keamanan dan tim medis. Jangan tangani sendiri.",
    },
  ];

  const warnaTanding = [
    { dot: "#ef4444", label: "TANDING" },
    { dot: "#94a3b8", label: "JEDA" },
    { dot: "#f59e0b", label: "SEREMON" },
    { dot: "#0194f3", label: "RAPAT" },
    { dot: "#cbd5e1", label: "ADMIN" },
    { dot: "#8b5cf6", label: "SHOW" },
  ];

  const summary = [
    { icon: <LayoutGrid className="h-4 w-4 text-gray-500" />, label: "Arena", value: "3 Gelanggang" },
    { icon: <Swords className="h-4 w-4 text-gray-500" />, label: "Kelas", value: "Semua Kelas" },
    { icon: <Clock className="h-4 w-4 text-gray-500" />, label: "Mulai", value: "08.00 WIB" },
    { icon: <Calendar className="h-4 w-4 text-gray-500" />, label: "Durasi", value: "2 Hari" },
  ];

  const eventRows = [
    { icon: <Calendar className="h-4 w-4 text-gray-500" />, label: "Tanggal", value: "20–21 Juni 2026" },
    { icon: <MapPin className="h-4 w-4 text-gray-500" />, label: "Lokasi",  value: "GOR Adiwijaya, Garut" },
    { icon: <Clock className="h-4 w-4 text-gray-500" />, label: "Mulai",   value: "08.00 WIB" },
    { icon: <Shield className="h-4 w-4 text-green-500" />, label: "Status",  value: "Siap Operasional" },
  ];

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 active:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div>
          <h2 className="font-extrabold text-gray-900 text-sm leading-none">Informasi Acara</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Temu Tarung 2026 · GOR Adiwijaya</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Event Detail Rows ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {eventRows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 ${i < eventRows.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className="text-base w-6 text-center shrink-0">{row.icon}</span>
              <span className="text-[11px] font-semibold text-gray-400 w-14 shrink-0">{row.label}</span>
              <span className="text-[12px] font-bold text-gray-800">{row.value}</span>
            </div>
          ))}
        </div>

        {/* ── Dua kolom: Protokol + Legend + Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Protokol & Catatan Penting */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Info className="h-3 w-3 shrink-0" />
              PROTOKOL &amp; CATATAN PENTING
            </p>
            <div className="space-y-3">
              {protokol.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-gray-800">{p.title}: </span>
                    <span className="text-[11px] text-gray-600 leading-snug">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: legend + summary */}
          <div className="space-y-4">

            {/* Keterangan Warna Jadwal */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">
                KETERANGAN WARNA JADWAL
              </p>
              <div className="space-y-2">
                {warnaTanding.map((w, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: w.dot }} />
                    <span className="text-[11px] font-bold text-gray-700">{w.label}</span>
                  </div>
                ))}
              </div>

              {/* Summary rows */}
              <div className="mt-4 pt-3 border-t border-gray-50 space-y-2">
                {summary.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-sm w-5 text-center">{s.icon}</span>
                    <span className="text-[10px] font-semibold text-gray-400 w-10 shrink-0">{s.label}</span>
                    <span className="text-[11px] font-bold text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SOP Singkat */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-3">⚠️ SOP DARURAT</p>
              <div className="space-y-2 text-[11px] text-gray-700 leading-snug">
                <p>🚑 <span className="font-bold">Medical:</span> Tim medis standby di posko belakang ring.</p>
                <p>🔥 <span className="font-bold">Kebakaran:</span> Evakuasi ke titik kumpul parkir selatan.</p>
                <p>📞 <span className="font-bold">Darurat:</span> Hubungi koordinator atau Admin Nempo langsung.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Denah area singkat */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">ZONA &amp; AREA</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { zona: "Ring 1", desc: "Octagon Arena Utama", color: "#ef4444" },
              { zona: "Ring 2", desc: "Gelanggang Panco", color: "#f59e0b" },
              { zona: "Ring 3", desc: "Area Junior / Anak", color: "#0194f3" },
              { zona: "VVIP", desc: "Sofa & Protokol Utama", color: "#8b5cf6" },
              { zona: "Medis", desc: "Belakang Ring, Pintu Barat", color: "#10b981" },
              { zona: "Posko", desc: "Komando & Koordinator", color: "#64748b" },
            ].map((z, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                <span
                  className="text-[9px] font-black px-2 py-0.5 rounded-full text-white shrink-0"
                  style={{ background: z.color }}
                >
                  {z.zona}
                </span>
                <span className="text-[11px] text-gray-600 leading-tight">{z.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   VVIP TAB
───────────────────────────────────────────────────────────────── */
type VvipStatus = "konfirmasi" | "tbc" | "diundang";
interface VvipGuest {
  name: string;
  jabatan: string;
  zona: string;
  lo: string;
  status: VvipStatus;
}
interface VvipGroup {
  label: string;
  tier: "utama" | "forkopimda" | "opd" | "khusus";
  guests: VvipGuest[];
}

const VVIP_DATA: VvipGroup[] = [
  {
    label: "VVIP Utama",
    tier: "utama",
    guests: [
      { name: "Dr. ir. H. Abdusy Syakir Amin, M.Eng., IPU", jabatan: "Bupati Garut",        zona: "VVIP Front-Row Tengah", lo: "LO-03", status: "konfirmasi" },
      { name: "drg. hj. Lutfianisa Putri Karlina, M.BA",    jabatan: "Wakil Bupati Garut",   zona: "VVIP Front-Row Tengah", lo: "LO-03", status: "konfirmasi" },
    ],
  },
  {
    label: "Forkopimda",
    tier: "forkopimda",
    guests: [
      { name: "AKBP Bayu Hendarto, S.IK., M.A.P",      jabatan: "Kapolres Garut",                      zona: "VIP Sayap Kanan", lo: "LO-04", status: "konfirmasi" },
      { name: "Letkol Infantri Andrik Fahrizal",        jabatan: "Dandim Garut",                        zona: "VIP Sayap Kanan", lo: "LO-04", status: "konfirmasi" },
    ],
  },
  {
    label: "Mitra Daerah / OPD",
    tier: "opd",
    guests: [
      { name: "Asep Mulyana, S.i.P., M.Si",            jabatan: "Kadispora Garut",                     zona: "VIP No. 11", lo: "LO-15", status: "konfirmasi" },
      { name: "Rizky Ridznurdhin, S.H., M.Ak",         jabatan: "Kepala Bapenda Garut",                zona: "VIP No. 12", lo: "LO-15", status: "konfirmasi" },
      { name: "Drs. H. Nurdin Yana, M.H",              jabatan: "Setda Garut",                         zona: "VIP No. 13", lo: "LO-15", status: "konfirmasi" },
      { name: "Muchtarul Wildan",                      jabatan: "Anggota DPRD Garut",                  zona: "VIP",        lo: "LO-15", status: "konfirmasi" },
      { name: "H. Iden Sambas",                        jabatan: "Anggota DPRD Garut",                  zona: "VIP",        lo: "LO-15", status: "konfirmasi" },
    ],
  },
  {
    label: "IBCA & Organisasi Olahraga",
    tier: "khusus",
    guests: [
      { name: "Ridwansyah beserta jajaran",            jabatan: "Ketua Umum IBCA MMA Prov. Jabar",      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "Samsakti Alamsyah",                     jabatan: "Kades Jayaraga",                       zona: "VIP",            lo: "LO-08", status: "konfirmasi" },
    ],
  },
  {
    label: "Keluarga & Internal Inti",
    tier: "khusus",
    guests: [
      { name: "A Zaka Umaran & Istri",                 jabatan: "Ketua IBCA MMA Kab. Garut",            zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "A Rangga & Keluarga",                   jabatan: "Founder Baja & Promotor Temu Tarung",  zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "A Bobby Pamungkas & Istri",             jabatan: "Pelatih Baja F A (adik A Rangga)",     zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
    ],
  },
  {
    label: "Keluarga Biduri",
    tier: "khusus",
    guests: [
      { name: "Indra Rosada Biduri",                   jabatan: "Keluarga Biduri",                      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "Oci Biduri",                            jabatan: "Keluarga Biduri",                      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "Ica Biduri",                            jabatan: "Keluarga Biduri",                      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "Ibu Lilis Biduri",                      jabatan: "Keluarga Biduri",                      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
      { name: "Pak Ujang Biduri",                      jabatan: "Keluarga Biduri",                      zona: "VIP Sayap Kiri", lo: "LO-08", status: "konfirmasi" },
    ],
  },
  {
    label: "Tamu Undangan Khusus",
    tier: "khusus",
    guests: [
      { name: "H. Ade Jembar",                        jabatan: "Penasihat Baja F A",                   zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Mizan",                                 jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Pak Gangan Husnul Muamar",              jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Jonathan Kwee & Ci Yovie",              jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Wing Perwira & Mey Alkohar",            jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "H. Delit",                              jabatan: "Ketua PP Garut",                       zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Pak Hilman",                            jabatan: "Ketua HIPMI",                          zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Faikar",                                jabatan: "Sekjen HIPMI",                         zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Agil Sahrizal",                         jabatan: "Ketua KNPI",                           zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Rendi Destra",                          jabatan: "PLT Ketua Sapma",                      zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Yuda Prawira",                          jabatan: "Ketua IMI",                            zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Okke M. Hadist",                        jabatan: "Ketua 234 SC",                         zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Cacan Cahyadi",                         jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "H. Rajab",                              jabatan: "Ketua Kadin",                          zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Aldi Pradita",                          jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Aldi Sastra",                           jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Lutfi Hendro",                          jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Nizam",                                 jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Ceng Ilham Nur Faqih",                  jabatan: "Penasihat Baja",                       zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Angki Predian",                         jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Billy Renaldi",                         jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Naufal Faiz",                           jabatan: "Tamu Undangan Khusus",                 zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Aryansyah Eka",                         jabatan: "Wakil Ketua Sapma Jabar",              zona: "VIP", lo: "LO-08", status: "konfirmasi" },
      { name: "Cecep Hendra Erawan, S.H",              jabatan: "Ketua Brigez Pusat",                   zona: "VIP", lo: "LO-08", status: "konfirmasi" },
    ],
  },
];

const TIER_STYLE: Record<string, { accent: string; headerBg: string; headerText: string; icon: React.ReactNode }> = {
  utama:      { accent: "#d97706", headerBg: "#fffbeb", headerText: "#92400e", icon: <Crown className="h-3.5 w-3.5" /> },
  forkopimda: { accent: "#dc2626", headerBg: "#fef2f2", headerText: "#991b1b", icon: <Medal className="h-3.5 w-3.5" /> },
  opd:        { accent: "#1d4ed8", headerBg: "#eff6ff", headerText: "#1e3a8a", icon: <Building2 className="h-3.5 w-3.5" /> },
  khusus:     { accent: "#7c3aed", headerBg: "#f5f3ff", headerText: "#4c1d95", icon: <Star className="h-3.5 w-3.5" /> },
};

const LO_COLOR: Record<string, { bg: string; text: string }> = {
  "LO-03": { bg: "#fef3c7", text: "#92400e" },
  "LO-04": { bg: "#fee2e2", text: "#991b1b" },
  "LO-08": { bg: "#ede9fe", text: "#5b21b6" },
  "LO-15": { bg: "#dbeafe", text: "#1e40af" },
};

const STATUS_STYLE: Record<VvipStatus, { bg: string; text: string; border: string; label: string }> = {
  konfirmasi: { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0", label: "Konfirmasi" },
  tbc:        { bg: "#fef3c7", text: "#b45309", border: "#fde68a", label: "TBC" },
  diundang:   { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", label: "Diundang" },
};

function VvipTab({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<"semua" | VvipStatus>("semua");

  const allGuests = VVIP_DATA.flatMap(g => g.guests);
  const totalKonfirmasi = allGuests.filter(g => g.status === "konfirmasi").length;
  const totalTbc        = allGuests.filter(g => g.status === "tbc").length;
  const totalDiundang   = allGuests.filter(g => g.status === "diundang").length;
  const total           = allGuests.length;

  const filteredGroups = VVIP_DATA.map(group => ({
    ...group,
    guests: filter === "semua" ? group.guests : group.guests.filter(g => g.status === filter),
  })).filter(group => group.guests.length > 0);

  return (
    <div className="pb-8">

      {/* ── Premium Header Banner ── */}
      <div
        className="relative overflow-hidden px-4 pt-5 pb-6"
        style={{ background: "linear-gradient(135deg, #78350f 0%, #92400e 35%, #b45309 65%, #d97706 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(0,0,0,0.1)" }} />

        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">Temu Tarung 2026</p>
            <h2 className="text-white font-black text-lg leading-tight">VVIP &amp; Undangan Khusus</h2>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="flex-1 rounded-xl px-3 py-2 text-center" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
            <p className="text-white font-black text-xl leading-none">{total}</p>
            <p className="text-white/70 text-[9px] font-bold mt-0.5">Total Tamu</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2 text-center" style={{ background: "rgba(134,239,172,0.2)", backdropFilter: "blur(8px)" }}>
            <p className="text-white font-black text-xl leading-none">{totalKonfirmasi}</p>
            <p className="text-white/70 text-[9px] font-bold mt-0.5">Konfirmasi</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2 text-center" style={{ background: "rgba(253,230,138,0.2)", backdropFilter: "blur(8px)" }}>
            <p className="text-white font-black text-xl leading-none">{totalTbc}</p>
            <p className="text-white/70 text-[9px] font-bold mt-0.5">TBC</p>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2 text-center" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
            <p className="text-white font-black text-xl leading-none">{totalDiundang}</p>
            <p className="text-white/70 text-[9px] font-bold mt-0.5">Diundang</p>
          </div>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="sticky top-0 z-10 bg-[#f3f4f6] px-4 py-2.5 flex gap-2 overflow-x-auto border-b border-gray-200" style={{ scrollbarWidth: "none" }}>
        {([
          { key: "semua",      label: "Semua", count: total },
          { key: "konfirmasi", label: "✓ Konfirmasi", count: totalKonfirmasi },
          { key: "tbc",        label: "? TBC", count: totalTbc },
          { key: "diundang",   label: "Diundang", count: totalDiundang },
        ] as { key: "semua" | VvipStatus; label: string; count: number }[]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95"
            style={filter === f.key
              ? { background: "#92400e", color: "white" }
              : { background: "white", color: "#64748b", border: "1px solid #e5e7eb" }
            }
          >
            {f.label}
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
              style={filter === f.key
                ? { background: "rgba(255,255,255,0.25)", color: "white" }
                : { background: "#f1f5f9", color: "#94a3b8" }
              }
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Legend row ── */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-3 flex-wrap">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">LO = Penanggung Jawab</span>
        {(["LO-03","LO-04","LO-08","LO-15"] as const).map(lo => (
          <span key={lo} className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: LO_COLOR[lo].bg, color: LO_COLOR[lo].text }}>{lo}</span>
        ))}
      </div>

      {/* ── Guest Groups ── */}
      <div className="px-4 pt-3 space-y-5">
        {filteredGroups.map((group) => {
          const st = TIER_STYLE[group.tier];
          return (
            <div key={group.label}>
              {/* Group header */}
              <div
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-2"
                style={{ background: st.headerBg, borderLeft: `3px solid ${st.accent}` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{st.icon}</span>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: st.headerText }}>
                    {group.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: st.accent }}>
                  {group.guests.length} tamu
                </span>
              </div>

              {/* Guest cards */}
              <div className="space-y-2">
                {group.guests.map((guest, i) => {
                  const ss = STATUS_STYLE[guest.status];
                  const lo = LO_COLOR[guest.lo] ?? { bg: "#f1f5f9", text: "#64748b" };
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                      style={{ borderLeft: `3px solid ${st.accent}` }}
                    >
                      {/* Name + jabatan */}
                      <div className="px-4 pt-3 pb-2">
                        <p className="font-extrabold text-gray-900 text-[14px] leading-snug">{guest.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{guest.jabatan}</p>
                      </div>

                      {/* Footer row */}
                      <div
                        className="flex items-center gap-2 px-4 py-2 border-t"
                        style={{ borderColor: "#f8fafc", background: "#fafafa" }}
                      >
                        {/* Zona */}
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <MapPin className="h-3 w-3 shrink-0 text-gray-300" />
                          <span className="text-[10px] text-gray-500 font-semibold truncate">{guest.zona}</span>
                        </div>
                        {/* LO badge */}
                        <span
                          className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: lo.bg, color: lo.text }}
                        >
                          {guest.lo}
                        </span>
                        {/* Status pill */}
                        <span
                          className="shrink-0 text-[9px] font-black px-2.5 py-0.5 rounded-full border"
                          style={{ background: ss.bg, color: ss.text, borderColor: ss.border }}
                        >
                          {ss.label.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <SearchX className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 font-semibold text-sm">Tidak ada tamu dengan status ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TALKSHOW TAB
───────────────────────────────────────────────────────────────── */
const TALKSHOW_SESSIONS = [
  {
    hari: "H-1",
    tanggal: "20 Juni 2026",
    jam: "15.30 – 16.30",
    durasi: "60 menit",
    venue: "Panggung Ekspresi Luar",
    tema: "Bertarung dengan Prestasi",
    subtema: "Saatnya menjadi generasi yang berani berkata tidak pada bullying, judi online, dan narkoba — serta meraih masa depan melalui wirausaha.",
    format: "Panel Diskusi Outdoor",
    accent: "#7c3aed",
    headerBg: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)",
    moderator: {
      name: "Annisa N",
      jabatan: "Moderator Panel",
      initial: "A",
      color: "#7c3aed",
    },
    pembicara: [
      {
        no: "01",
        name: "Muchtarul Wildan",
        jabatan: "Pembicara 1",
        topik: "Anti Bullying & Judi Online",
        poin: [],
        color: "#dc2626",
      },
      {
        no: "02",
        name: "Dila Nurul Fadilah, S.E.",
        jabatan: "Pembicara 2",
        topik: "Perlindungan Perempuan",
        poin: [],
        color: "#8b5cf6",
      },
      {
        no: "03",
        name: "Hilman Hegar, S.E.",
        jabatan: "Pembicara 3",
        topik: "Peluang Wirausaha & Masa Depan",
        poin: [],
        color: "#0194f3",
      },
      {
        no: "04",
        name: "Kasat Narkoba",
        jabatan: "Opsional",
        topik: "Bahaya Narkoba bagi Generasi Muda",
        poin: [],
        color: "#f59e0b",
        opsional: true,
      },
    ],
    setup: ["4 sofa + 1 meja panjang", "Set up kursi penonton", "Transit pembicara: Ruang Logistik"],
    inti: [
      "Berani berkata tidak pada bullying, judi online, dan narkoba",
      "Perlindungan perempuan sebagai hak yang harus diperjuangkan",
      "Wirausaha sebagai jalur masa depan generasi muda",
    ],
  },
  {
    hari: "Hari H",
    tanggal: "21 Juni 2026",
    jam: "15:30 – 16:00",
    durasi: "30 menit",
    venue: "Panggung Indoor · GOR Adiwijaya",
    tema: "Bela Diri & Kesehatan: Mental dan Fisik Sang Juara",
    subtema: "Rahasia di balik performa puncak atlet bela diri",
    format: "Dialog Dua Pembicara",
    accent: "#0194f3",
    headerBg: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
    moderator: {
      name: "MC Indoor",
      jabatan: "Stage Manager · GOR Adiwijaya",
      initial: "M",
      color: "#1d4ed8",
    },
    pembicara: [
      {
        no: "01",
        name: "dr. Restu",
        jabatan: "Dokter Olahraga · Tim Medis Event",
        topik: "Manajemen Cedera & Recovery Atlet Bela Diri",
        poin: [
          "Jenis cedera umum dalam bela diri & cara pencegahannya",
          "Protokol recovery pasca pertandingan yang benar",
          "Nutrisi & hidrasi optimal untuk atlet kontak",
        ],
        color: "#dc2626",
      },
      {
        no: "02",
        name: "Syahrizal",
        jabatan: "Pelatih Senior · Ketua Sapma Destra",
        topik: "Mental Juara: Dari Gym ke Ring",
        poin: [
          "Teknik visualisasi & kontrol emosi sebelum bertanding",
          "Membangun mental baja dalam latihan harian",
          "Cara bangkit dari kekalahan dan tetap kompetitif",
        ],
        color: "#7c3aed",
      },
    ],
    inti: [
      "Fisik kuat tanpa mental juara tidak cukup untuk meraih puncak",
      "Recovery yang benar adalah bagian dari latihan, bukan liburan",
      "Atlet yang mengerti tubuhnya sendiri akan lebih panjang berkarir",
      "Mental dilatih sama kerasnya dengan fisik — setiap hari",
    ],
  },
];

function TalkshowTab({ onBack }: { onBack: () => void }) {
  const [activeSession, setActiveSession] = useState(0);
  const session = TALKSHOW_SESSIONS[activeSession];

  return (
    <div className="pb-8">
      {/* ── Header ── */}
      <div className="relative overflow-hidden px-4 pt-5 pb-6" style={{ background: session.headerBg }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(0,0,0,0.12)" }} />

        {/* Back + title */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-none">Temu Tarung 2026</p>
            <h2 className="text-white font-black text-lg leading-tight">Talkshow Panel</h2>
          </div>
          <div className="ml-auto shrink-0">
            <span className="text-white/80 text-[10px] font-bold">{TALKSHOW_SESSIONS.length} Sesi</span>
          </div>
        </div>

        {/* Session switcher pills */}
        <div className="flex gap-2 relative z-10">
          {TALKSHOW_SESSIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSession(i)}
              className="flex-1 rounded-xl px-3 py-2 text-left transition-all active:scale-95"
              style={activeSession === i
                ? { background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.5)" }
                : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }
              }
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-white/60">{s.hari}</p>
              <p className="text-white font-bold text-[11px] leading-tight">{s.jam}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Session Info Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Theme banner */}
          <div className="px-4 py-3 border-b" style={{ borderColor: "#f8fafc", background: `${session.accent}0d` }}>
            <span
              className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white mb-2 inline-block"
              style={{ background: session.accent }}
            >
              {session.format}
            </span>
            <h3 className="font-black text-gray-900 text-[15px] leading-snug mt-1">{session.tema}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{session.subtema}</p>
          </div>

          {/* Meta rows */}
          {[
            { Icon: CalendarDays, label: "Tanggal", value: session.tanggal },
            { Icon: Clock,        label: "Jam",     value: `${session.jam} (${session.durasi})` },
            { Icon: MapPin,       label: "Venue",   value: session.venue },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0">
              <span className="w-5 flex items-center justify-center shrink-0">
                <r.Icon className="h-4 w-4" style={{ color: session.accent }} />
              </span>
              <span className="text-[10px] font-semibold text-gray-400 w-14 shrink-0">{r.label}</span>
              <span className="text-[12px] font-bold text-gray-800">{r.value}</span>
            </div>
          ))}
        </div>

        {/* ── Moderator ── */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Moderator</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-sm"
              style={{ background: session.moderator.color }}
            >
              {session.moderator.initial}
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-[13px] leading-none">{session.moderator.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{session.moderator.jabatan}</p>
            </div>
            <span
              className="ml-auto shrink-0 text-[9px] font-black px-2 py-1 rounded-full text-white"
              style={{ background: session.moderator.color + "22", color: session.moderator.color }}
            >
              MODERATOR
            </span>
          </div>
        </div>

        {/* ── Speakers ── */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
            Pembicara — {session.pembicara.length} Narasumber
          </p>
          <div className="space-y-3">
            {session.pembicara.map((p) => (
              <div
                key={p.no}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                style={{ borderLeft: `3px solid ${"opsional" in p ? p.color + "88" : p.color}`, opacity: "opsional" in p ? 0.85 : 1 }}
              >
                {/* Speaker header */}
                <div className="px-4 pt-3 pb-2 flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-white text-sm"
                    style={{ background: "opsional" in p ? p.color + "99" : p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shrink-0"
                        style={{ background: p.color + "cc" }}
                      >
                        #{p.no}
                      </span>
                      <p className="font-extrabold text-gray-900 text-[13px] leading-none truncate">{p.name}</p>
                      {"opsional" in p && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full border shrink-0" style={{ color: "#f59e0b", borderColor: "#fde68a", background: "#fffbeb" }}>OPSIONAL</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.jabatan}</p>
                  </div>
                </div>

                {/* Topik */}
                <div className="px-4 pb-1">
                  <div className="flex items-start gap-1.5">
                    <Megaphone className="h-3 w-3 shrink-0 mt-0.5" style={{ color: p.color }} />
                    <p className="text-[11px] font-bold text-gray-700 italic leading-snug">"{p.topik}"</p>
                  </div>
                </div>

                {/* Poin pembahasan */}
                {p.poin.length > 0 && (
                  <div className="mx-4 my-2 rounded-xl p-2.5" style={{ background: p.color + "0a" }}>
                    <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: p.color }}>Poin Pembahasan</p>
                    <div className="space-y-1">
                      {p.poin.map((pt, j) => (
                        <div key={j} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ background: p.color }} />
                          <p className="text-[10px] text-gray-600 leading-snug">{pt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Inti Pembahasan ── */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Inti Pembahasan</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="space-y-2.5">
              {session.inti.map((poin, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black text-white"
                    style={{ background: session.accent }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug font-medium">{poin}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Setup Panggung ── */}
        {"setup" in session && (session as any).setup?.length > 0 && (
          <div>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Setup Panggung</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 space-y-2">
              {(session as any).setup.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Wrench className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <p className="text-[12px] font-semibold text-gray-700">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Catatan Panitia ── */}
        <div className="rounded-2xl px-4 py-3.5 border" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
          <p className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ClipboardList className="h-3 w-3" />Catatan Panitia</p>
          <div className="space-y-1.5 text-[11px] text-amber-800">
            <p>• Koordinasi dengan <span className="font-bold">Divisi Acara & Stage Manager</span> 30 menit sebelum sesi dimulai.</p>
            <p>• Pastikan mic, podium, dan backdrop talkshow sudah terpasang.</p>
            <p>• LO narasumber: sambut di pintu masuk & arahkan ke ruang tunggu.</p>
            <p>• Sesi Q&A dibuka 10 menit terakhir jika waktu memungkinkan.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   AKOMODASI TAB
───────────────────────────────────────────────────────────────── */

const LO_A_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "LO-20":  { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "LO-09":  { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
  "LO-03":  { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
};
const STATUS_A: Record<string, { bg: string; text: string; border: string; label: string }> = {
  konfirmasi: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC", label: "KONFIRMASI" },
  tbc:        { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D", label: "TBC"        },
  pending:    { bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB", label: "PENDING"    },
};

const TAMU_MENGINAP = [
  {
    grup: "Atlet Internasional",
    warna: "#dc2626",
    items: [
      { nama: "Eslam Ahmed Mohammed", asal: "Mesir 🇪🇬", checkin: "18 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-20", status: "konfirmasi" },
      { nama: "Papi Malik",           asal: "Pakistan 🇵🇰", checkin: "18 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-20", status: "konfirmasi" },
      { nama: "Hoordad",              asal: "Iran 🇮🇷",    checkin: "18 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-20", status: "konfirmasi" },
    ],
  },
  {
    grup: "Atlet Pro Lokal",
    warna: "#059669",
    items: [
      { nama: "Jeremia Hutahaean",   asal: "Jakarta", checkin: "20 Jun", checkout: "21 Jun", kamar: "—", lo: "LO-20", status: "konfirmasi" },
      { nama: "Darrell Narendra",    asal: "Jakarta", checkin: "20 Jun", checkout: "21 Jun", kamar: "—", lo: "LO-20", status: "konfirmasi" },
      { nama: "Muhammad Fhajar",     asal: "Bandung", checkin: "20 Jun", checkout: "21 Jun", kamar: "—", lo: "LO-20", status: "tbc"        },
      { nama: "Azis",                asal: "Jakarta", checkin: "20 Jun", checkout: "21 Jun", kamar: "—", lo: "LO-20", status: "tbc"        },
      { nama: "Fathur",              asal: "Jakarta", checkin: "20 Jun", checkout: "21 Jun", kamar: "—", lo: "LO-20", status: "tbc"        },
    ],
  },
  {
    grup: "Juri & Wasit",
    warna: "#7c3aed",
    items: [
      { nama: "Wasit Kepala",        asal: "Jakarta", checkin: "19 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-09", status: "konfirmasi" },
      { nama: "Juri 1",              asal: "Jakarta", checkin: "19 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-09", status: "konfirmasi" },
      { nama: "Juri 2",              asal: "Bandung", checkin: "19 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-09", status: "tbc"        },
      { nama: "Juri 3",              asal: "Jakarta", checkin: "19 Jun", checkout: "22 Jun", kamar: "—", lo: "LO-09", status: "tbc"        },
    ],
  },
];

const SHUTTLE_JADWAL = [
  {
    hari: "H-2 (Kamis 19 Juni)", warna: "#6366f1",
    rute: [
      { waktu: "12.00", rute: "Bandara Husein → Hotel", keterangan: "Jemput Eslam, Papi Malik, Hoordad", status: "konfirmasi" },
      { waktu: "18.00", rute: "Bandara Husein → Hotel", keterangan: "Jemput Wasit Kepala + Juri 1 (flight sore)", status: "konfirmasi" },
    ],
  },
  {
    hari: "H-1 (Jumat 20 Juni)", warna: "#f59e0b",
    rute: [
      { waktu: "07.30", rute: "Hotel → GOR Adiwijaya", keterangan: "Atlet internasional + Juri (timbang badan 08.00)", status: "konfirmasi" },
      { waktu: "11.30", rute: "Stasiun/Terminal → Hotel", keterangan: "Jemput atlet lokal (Jeremia, Darrell, dll.)", status: "tbc" },
      { waktu: "13.00", rute: "Hotel → GOR Adiwijaya", keterangan: "Atlet lokal + Juri 2 & 3 (briefing 11.00)", status: "tbc" },
      { waktu: "22.30", rute: "GOR Adiwijaya → Hotel", keterangan: "Seluruh tamu (selesai gala dinner)", status: "konfirmasi" },
    ],
  },
  {
    hari: "Hari H (Sabtu 21 Juni)", warna: "#059669",
    rute: [
      { waktu: "06.30", rute: "Hotel → GOR Adiwijaya", keterangan: "Seluruh atlet & juri (gate buka 07.00)", status: "konfirmasi" },
      { waktu: "24.00+", rute: "GOR Adiwijaya → Hotel", keterangan: "Seluruh tamu selesai pertandingan malam", status: "konfirmasi" },
    ],
  },
  {
    hari: "H+1 (Minggu 22 Juni)", warna: "#6b7280",
    rute: [
      { waktu: "08.00", rute: "Hotel → Bandara Husein", keterangan: "Kepulangan atlet internasional", status: "tbc" },
      { waktu: "10.00", rute: "Hotel → Stasiun/Terminal", keterangan: "Kepulangan atlet lokal + juri", status: "tbc" },
    ],
  },
];

const LO20_TEAM = [
  { role: "Leader LO-20", tugas: "Kelola checklist jadwal driver shuttle, koordinasi dengan Korlap Pool Sonagar" },
  { role: "Anggota 1",    tugas: "Standby di Hotel penginapan, koordinasikan penjemputan berkala atlet & juri" },
  { role: "Anggota 2",    tugas: "Standby di Drop Zone SOR Garut, atur ketertiban parkir kendaraan operasional" },
];

function AkomodasiTab({ onBack }: { onBack: () => void }) {
  const [view, setView]             = useState<"tamu" | "shuttle">("tamu");
  const [statusFilter, setStatusFilter] = useState("semua");

  const totalTamu = TAMU_MENGINAP.reduce((s, g) => s + g.items.length, 0);

  const filteredGrup = TAMU_MENGINAP.map(g => ({
    ...g,
    items: statusFilter === "semua" ? g.items : g.items.filter(i => i.status === statusFilter),
  })).filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-900 text-[15px] leading-tight">Akomodasi</p>
          <p className="text-[11px] text-gray-400 truncate">Hotel & Transportasi Tamu · Temu Tarung Vol. 12</p>
        </div>
        <div className="bg-blue-100 text-blue-700 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0">
          {totalTamu} tamu
        </div>
      </div>

      {/* ── View switcher ── */}
      <div className="px-4 pt-3 pb-2">
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          {([
            { id: "tamu",    label: "Tamu Menginap" },
            { id: "shuttle", label: "Jadwal Shuttle" },
          ] as const).map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                view === v.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATUS FILTER (only in tamu view) ── */}
      {view === "tamu" && (
        <div className="px-4 py-2 flex items-center gap-2 flex-wrap border-b border-gray-100 pb-3">
          {[
            { id: "semua",      label: "SEMUA",      bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
            { id: "konfirmasi", label: "KONFIRMASI", bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
            { id: "tbc",        label: "TBC",        bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
            { id: "pending",    label: "PENDING",    bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all"
              style={{
                background:  statusFilter === f.id ? f.bg    : "white",
                color:       statusFilter === f.id ? f.text  : "#9CA3AF",
                borderColor: statusFilter === f.id ? f.border : "#E5E7EB",
              }}
            >
              {f.label}
            </button>
          ))}
          <span className="text-[10px] text-gray-400 ml-1 hidden sm:inline">· LO = penanggung jawab akomodasi</span>
        </div>
      )}

      <div className="pb-24">

        {/* ═══════════════════ TAMU VIEW ═══════════════════ */}
        {view === "tamu" && (
          <>
            {filteredGrup.map((grup, gi) => (
              <div key={gi}>
                {/* Section header */}
                <div
                  className="px-4 py-2.5 flex items-center gap-2.5 sticky bg-white border-b border-gray-100"
                  style={{ top: 61, zIndex: 10 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: grup.warna }} />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest flex-1" style={{ color: grup.warna }}>
                    {grup.grup}
                  </span>
                  <span className="text-[10px] font-extrabold text-gray-300">{grup.items.length} tamu</span>
                </div>

                {/* Column headers */}
                <div
                  className="px-4 py-1.5 grid bg-gray-50 border-b border-gray-100"
                  style={{ gridTemplateColumns: "1fr 100px 64px 72px" }}
                >
                  {["NAMA / ASAL", "TANGGAL", "LO PJ", "STATUS"].map(h => (
                    <span key={h} className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{h}</span>
                  ))}
                </div>

                {/* Rows */}
                {grup.items.map((row, ri) => {
                  const lo  = LO_A_BADGES[row.lo] ?? { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
                  const st  = STATUS_A[row.status];
                  return (
                    <div
                      key={ri}
                      className="px-4 py-3 grid border-b border-gray-50 active:bg-gray-50"
                      style={{ gridTemplateColumns: "1fr 100px 64px 72px" }}
                    >
                      <div className="pr-2">
                        <p className="font-bold text-gray-900 text-[13px] leading-tight">{row.nama}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{row.asal}</p>
                      </div>
                      <div className="self-center pr-2">
                        <p className="text-[10px] text-gray-700 font-semibold leading-tight">In: {row.checkin}</p>
                        <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Out: {row.checkout}</p>
                      </div>
                      <div className="self-center flex justify-start">
                        <span
                          className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border whitespace-nowrap"
                          style={{ background: lo.bg, color: lo.text, borderColor: lo.border }}
                        >
                          {row.lo}
                        </span>
                      </div>
                      <div className="self-center flex justify-start">
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border whitespace-nowrap"
                          style={{ background: st.bg, color: st.text, borderColor: st.border }}
                        >
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredGrup.length === 0 && (
              <div className="px-4 py-16 text-center">
                <p className="text-gray-400 text-sm font-semibold">Tidak ada tamu dengan status ini.</p>
              </div>
            )}

            {/* LO Team Box */}
            <div className="mx-4 mt-5 mb-3 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100 flex items-center gap-2">
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border"
                  style={{ background: LO_A_BADGES["LO-20"].bg, color: LO_A_BADGES["LO-20"].text, borderColor: LO_A_BADGES["LO-20"].border }}
                >
                  LO-20
                </span>
                <p className="text-[11px] font-extrabold text-blue-800">Tim Transportasi & Akomodasi</p>
                <span className="ml-auto text-[10px] text-blue-400 font-bold">3 orang</span>
              </div>
              {LO20_TEAM.map((m, i) => (
                <div
                  key={i}
                  className={`px-4 py-2.5 flex items-start gap-2.5 ${i < LO20_TEAM.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <span className="text-[10px] font-extrabold text-blue-600 min-w-[70px] mt-0.5">{m.role}</span>
                  <span className="text-[11px] text-gray-600">{m.tugas}</span>
                </div>
              ))}
            </div>

            {/* SOP Note */}
            <div className="mx-4 mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">SOP Akomodasi</p>
              {[
                "Atlet internasional: wajib didampingi LO-20 dari bandara hingga check-in hotel",
                "Kamar hotel dikunci maksimal H-3 (17 Juni 2026) via Koordinator Promotor",
                "Kunci kamar diserahkan LO-20 saat atlet tiba, bukan panitia lapangan",
                "Semua biaya transport shuttle dicover panitia — atlet tidak membayar mandiri",
                "Cek jadwal shuttle via HT Channel 2 sebelum penjemputan",
              ].map((s, i) => (
                <p key={i} className="text-[11px] text-gray-600 flex items-start gap-1.5 mt-1.5">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  {s}
                </p>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════ SHUTTLE VIEW ═══════════════════ */}
        {view === "shuttle" && (
          <>
            {SHUTTLE_JADWAL.map((hari, hi) => (
              <div key={hi}>
                {/* Hari header */}
                <div
                  className="px-4 py-2.5 flex items-center gap-2.5 sticky bg-white border-b border-gray-100"
                  style={{ top: 61, zIndex: 10 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: hari.warna }} />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest flex-1" style={{ color: hari.warna }}>
                    {hari.hari}
                  </span>
                  <span className="text-[10px] font-extrabold text-gray-300">{hari.rute.length} trip</span>
                </div>

                {/* Column headers */}
                <div
                  className="px-4 py-1.5 grid bg-gray-50 border-b border-gray-100"
                  style={{ gridTemplateColumns: "56px 1fr 68px" }}
                >
                  {["WAKTU", "RUTE & KETERANGAN", "STATUS"].map(h => (
                    <span key={h} className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{h}</span>
                  ))}
                </div>

                {hari.rute.map((trip, ri) => {
                  const st = STATUS_A[trip.status];
                  return (
                    <div
                      key={ri}
                      className="px-4 py-3 grid border-b border-gray-50 items-start"
                      style={{ gridTemplateColumns: "56px 1fr 68px" }}
                    >
                      <div>
                        <p className="font-extrabold text-gray-800 text-[13px]">{trip.waktu}</p>
                      </div>
                      <div className="pr-2">
                        <p className="font-bold text-gray-900 text-[13px] leading-tight">{trip.rute}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{trip.keterangan}</p>
                      </div>
                      <div className="flex justify-start">
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border whitespace-nowrap"
                          style={{ background: st.bg, color: st.text, borderColor: st.border }}
                        >
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Vehicle note */}
            <div className="mx-4 mt-5 mb-3 bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base leading-none">🚌</span>
                <p className="font-extrabold text-indigo-800 text-sm">Armada Shuttle — Pool Sonagar</p>
              </div>
              {[
                "2 unit Bus Sonagar Disparbud — kapasitas 30 pax/unit",
                "1 unit MPV operasional untuk tamu VVIP & atlet internasional",
                "Driver wajib standby 30 menit sebelum jadwal jemput",
                "Koordinasi trip via HT Channel 2 — lapor LO-20 setiap tiba & berangkat",
              ].map((n, i) => (
                <p key={i} className="text-[11px] text-indigo-700 flex items-start gap-1.5 mt-1">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                  {n}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   KONSUMSI TAB
───────────────────────────────────────────────────────────────── */

const LO_K_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  "LO-04":    { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  "LO-15":    { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" },
  "LO-16":    { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  "LO-16 A1": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "LO-16 A2": { bg: "#F0FDF4", text: "#14532D", border: "#86EFAC" },
  "LO-24":    { bg: "#EFF6FF", text: "#1E3A8A", border: "#BFDBFE" },
};
const STATUS_K: Record<string, { bg: string; text: string; border: string; label: string }> = {
  siap:    { bg: "#DCFCE7", text: "#166534", border: "#86EFAC",  label: "SIAP"    },
  proses:  { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D",  label: "PROSES"  },
  pending: { bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB",  label: "PENDING" },
};

const SPONSOR_KOTAK = { h1: 50, harih: 110 };

const REKAP_KONSUMSI_H1 = [
  { kategori: "Volunteer",  jumlah: 40, warna: "#0194f3" },
  { kategori: "MC",         jumlah: 2,  warna: "#8b5cf6" },
  { kategori: "DJ",         jumlah: 2,  warna: "#7c3aed" },
  { kategori: "Baja",       jumlah: 10, warna: "#64748b" },
  { kategori: "Polri",      jumlah: 5,  warna: "#1d4ed8" },
  { kategori: "TNI",        jumlah: 5,  warna: "#15803d" },
  { kategori: "Medis",      jumlah: 2,  warna: "#dc2626" },
  { kategori: "Tim Show",   jumlah: 3,  warna: "#d97706" },
];

const DIST_H1 = [
  {
    sesi: "Makan Siang Panitia", waktu: "12.00 – 12.30", warna: "#f59e0b",
    items: [
      { item: "Nasi Box Panitia",      tipe: "Panitia",       area: "Tenda Logistik",    lo: "LO-16 A2", status: "siap"    },
      { item: "Nasi Box Kru Teknis",   tipe: "Kru Teknis",    area: "Tenda Logistik",    lo: "LO-16 A2", status: "siap"    },
      { item: "Air Mineral 600ml",     tipe: "Panitia + Kru", area: "Tenda Logistik",    lo: "LO-16 A2", status: "siap"    },
    ],
  },
  {
    sesi: "Istirahat Kuliner Malam", waktu: "18.20 – 18.45", warna: "#6366f1",
    items: [
      { item: "Nasi Box Malam Panitia", tipe: "Panitia",             area: "Area Festival UMKM", lo: "LO-16 A2", status: "proses" },
      { item: "Nasi Box Malam Kru",     tipe: "Kru",                 area: "Area Festival UMKM", lo: "LO-16 A2", status: "proses" },
      { item: "Nasi Box Security",      tipe: "Security",            area: "Pos Security",        lo: "LO-16 A2", status: "proses" },
      { item: "Air Mineral 600ml",      tipe: "Panitia+Kru+Security",area: "Tenda Distribusi",    lo: "LO-16 A2", status: "proses" },
    ],
  },
  {
    sesi: "Gala Dinner VIP", waktu: "20.15 – 21.15", warna: "#d97706",
    items: [
      { item: "Paket Makan Berat VVIP",    tipe: "VVIP",    area: "Tenda Lounge (Sarnafil)", lo: "LO-04",    status: "siap" },
      { item: "Snack Box Eksklusif VVIP",  tipe: "VVIP",    area: "Meja VVIP",               lo: "LO-04",    status: "siap" },
      { item: "Minuman Hangat VVIP",        tipe: "VVIP",    area: "Meja VVIP",               lo: "LO-04",    status: "siap" },
      { item: "Paket VIP Box OPD",          tipe: "VIP/OPD", area: "Tenda Lounge (Sarnafil)", lo: "LO-15",    status: "siap" },
      { item: "Snack + Minuman Dingin VIP", tipe: "VIP",     area: "Kursi VIP",               lo: "LO-15",    status: "siap" },
    ],
  },
  {
    sesi: "Gala Dinner Panitia & Tamu", waktu: "21.15 – 21.30", warna: "#7c3aed",
    items: [
      { item: "Makan Malam Panitia Inti",   tipe: "Panitia Inti",    area: "Tenda Lounge VIP", lo: "LO-16", status: "pending" },
      { item: "Makan Malam Tamu Undangan",  tipe: "Tamu Undangan",   area: "Tenda Lounge VIP", lo: "LO-16", status: "pending" },
    ],
  },
];

const DIST_HARIH = [
  {
    sesi: "ISHOMA Zuhur", waktu: "13.00 – 13.30", warna: "#059669",
    items: [
      { item: "Nasi Box Panitia Siang",  tipe: "Panitia",   area: "Area Luar Festival",    lo: "LO-16 A2", status: "proses" },
      { item: "Nasi Box Kru Ring",       tipe: "Kru Ring",  area: "Belakang Ring/Backstage",lo: "LO-16 A2", status: "proses" },
      { item: "Nasi Box Security",       tipe: "Security",  area: "Pos Masing-masing",     lo: "LO-16 A2", status: "proses" },
      { item: "Nasi Box Juri & Wasit",   tipe: "Juri/Wasit",area: "Kamar Wasit",            lo: "LO-16 A1", status: "proses" },
      { item: "Air Mineral 600ml",       tipe: "Semua Kru", area: "Seluruh Area",           lo: "LO-16 A2", status: "proses" },
    ],
  },
];

const LO_K_LEGEND = [
  { lo: "LO-04",    keterangan: "LO VIP Utama — distribusi langsung ke meja VVIP" },
  { lo: "LO-15",    keterangan: "LO VIP 2 — konsumsi box VIP daerah & OPD" },
  { lo: "LO-16",    keterangan: "LO Konsumsi — koordinator & Leader distribusi makan" },
  { lo: "LO-16 A1", keterangan: "Anggota 1 — area VIP, Juri & Kamar Wasit" },
  { lo: "LO-16 A2", keterangan: "Anggota 2 — kru panitia, security, area umum" },
];

function KonsumsiTab({ onBack }: { onBack: () => void }) {
  const [activeDay, setActiveDay]       = useState<"h1" | "harih">("h1");
  const [statusFilter, setStatusFilter] = useState("semua");

  const raw = activeDay === "h1" ? DIST_H1 : DIST_HARIH;
  const totalItems = raw.reduce((s, g) => s + g.items.length, 0);

  const sesiList = raw
    .map(g => ({
      ...g,
      items: statusFilter === "semua" ? g.items : g.items.filter(i => i.status === statusFilter),
    }))
    .filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky header bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-gray-900 text-[15px] leading-tight">Konsumsi</p>
          <p className="text-[11px] text-gray-400 truncate">Distribusi Makan & Logistik Pangan · 2 Hari</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0">
          {totalItems} item
        </div>
      </div>

      {/* ── Day switcher ── */}
      <div className="px-4 pt-3 pb-2">
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          {(["h1", "harih"] as const).map(d => (
            <button
              key={d}
              onClick={() => { setActiveDay(d); setStatusFilter("semua"); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                activeDay === d ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {d === "h1" ? "H-1 · 20 Juni" : "Hari H · 21 Juni"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Legend + status filter ── */}
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap border-b border-gray-100 pb-3">
        {[
          { id: "semua",   label: "SEMUA",   bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
          { id: "siap",    label: "SIAP",    bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
          { id: "proses",  label: "PROSES",  bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
          { id: "pending", label: "PENDING", bg: "#F9FAFB", text: "#6B7280", border: "#D1D5DB" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all"
            style={{
              background:  statusFilter === f.id ? f.bg    : "white",
              color:       statusFilter === f.id ? f.text  : "#9CA3AF",
              borderColor: statusFilter === f.id ? f.border : "#E5E7EB",
            }}
          >
            {f.label}
          </button>
        ))}
        <span className="text-[10px] text-gray-400 ml-1 hidden sm:inline">· LO = penanggung jawab distribusi</span>
      </div>

      {/* ── Banner Sponsor ── */}
      <div className="px-4 pt-3">
        <div className="rounded-xl flex items-center gap-3 px-4 py-3 border border-amber-200 bg-amber-50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            <Star className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-extrabold text-amber-800">Konsumsi dari Sponsor</p>
            <p className="text-[10px] font-semibold text-amber-600 mt-0.5">
              {activeDay === "h1" ? "H-1 · 20 Juni" : "Hari H · 21 Juni"}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[26px] font-black tabular-nums leading-none" style={{ color: "#d97706" }}>
              {activeDay === "h1" ? SPONSOR_KOTAK.h1 : SPONSOR_KOTAK.harih}
            </p>
            <p className="text-[10px] font-extrabold text-amber-600">kotak</p>
          </div>
        </div>
      </div>

      {/* ── Rekap Penerima Konsumsi H-1 ── */}
      {activeDay === "h1" && (
        <div className="px-4 pt-3 pb-1">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-[0_1px_6px_0_rgba(0,0,0,0.06)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-emerald-500">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-white" />
                <p className="font-black text-white text-[13px]">Rekap Penerima Konsumsi H-1</p>
              </div>
              <div className="bg-white/20 px-2.5 py-1 rounded-lg">
                <span className="text-white font-black text-[12px]">
                  Total {REKAP_KONSUMSI_H1.reduce((s, r) => s + r.jumlah, 0)} orang
                </span>
              </div>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-4 divide-x divide-y divide-gray-100 bg-white">
              {REKAP_KONSUMSI_H1.map((r, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-3 px-2 gap-1">
                  <span className="text-[22px] font-black tabular-nums" style={{ color: r.warna }}>{r.jumlah}</span>
                  <span className="text-[10px] font-extrabold text-gray-500 text-center leading-tight">{r.kategori}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Table sections ── */}
      <div className="pb-20">
        {sesiList.map((sesi, si) => (
          <div key={si}>
            {/* Section header */}
            <div
              className="px-4 py-2.5 flex items-center gap-2.5 sticky bg-white border-b border-gray-100"
              style={{ top: 61, zIndex: 10 }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sesi.warna }} />
              <span className="text-[11px] font-extrabold uppercase tracking-widest flex-1" style={{ color: sesi.warna }}>
                {sesi.sesi}
              </span>
              <span className="text-[11px] text-gray-400">{sesi.waktu}</span>
              <span className="text-[10px] font-extrabold text-gray-300 ml-1">{sesi.items.length} item</span>
            </div>

            {/* Column header */}
            <div
              className="px-4 py-1.5 grid bg-gray-50 border-b border-gray-100"
              style={{ gridTemplateColumns: "1fr 88px 64px 58px" }}
            >
              {["ITEM / PENERIMA", "AREA", "LO PJ", "STATUS"].map(h => (
                <span key={h} className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {sesi.items.map((row, ri) => {
              const lo  = LO_K_BADGES[row.lo]   ?? { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
              const st  = STATUS_K[row.status];
              return (
                <div
                  key={ri}
                  className="px-4 py-3 grid border-b border-gray-50 active:bg-gray-50"
                  style={{ gridTemplateColumns: "1fr 88px 64px 58px" }}
                >
                  <div className="pr-2">
                    <p className="font-bold text-gray-900 text-[13px] leading-tight">{row.item}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{row.tipe}</p>
                  </div>
                  <div className="self-center pr-2">
                    <p className="text-[11px] text-gray-600 leading-tight">{row.area}</p>
                  </div>
                  <div className="self-center flex justify-start">
                    <span
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border whitespace-nowrap"
                      style={{ background: lo.bg, color: lo.text, borderColor: lo.border }}
                    >
                      {row.lo}
                    </span>
                  </div>
                  <div className="self-center flex justify-start">
                    <span
                      className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border whitespace-nowrap"
                      style={{ background: st.bg, color: st.text, borderColor: st.border }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {sesiList.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-gray-400 text-sm font-semibold">Tidak ada item dengan status ini.</p>
          </div>
        )}

        {/* ── LO Legend ── */}
        <div className="mx-4 mt-5 mb-3 rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Keterangan LO Penanggung Jawab
            </p>
          </div>
          {LO_K_LEGEND.map((l, i) => {
            const badge = LO_K_BADGES[l.lo] ?? { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
            return (
              <div
                key={i}
                className={`px-4 py-2.5 flex items-center gap-3 ${i < LO_K_LEGEND.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex-shrink-0 min-w-[60px] text-center"
                  style={{ background: badge.bg, color: badge.text, borderColor: badge.border }}
                >
                  {l.lo}
                </span>
                <span className="text-[11px] text-gray-600">{l.keterangan}</span>
              </div>
            );
          })}
        </div>

        {/* ── Gala Dinner note ── */}
        <div className="mx-4 mb-4 bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base leading-none">🎻</span>
            <p className="font-extrabold text-amber-800 text-sm">Gala Dinner VIP — Protokol Khusus</p>
          </div>
          {[
            "Tenda Roder/Sarnafil TERPISAH TOTAL dari area publik",
            "Live Kecapi Suling Klasik — volume maks 50 dB",
            "Gunakan nampan & sarung tangan putih di area VVIP",
            "LO-04 tidak meninggalkan area VVIP sebelum sesi selesai",
          ].map((n, i) => (
            <p key={i} className="text-[11px] text-amber-700 flex items-start gap-1.5 mt-1">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
              {n}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PANCO TAB
───────────────────────────────────────────────────────────────── */

/* SVG Kustom */
const SvgArm = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <defs>
      <linearGradient id="armL" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fecaca"/>
        <stop offset="100%" stopColor="#f87171"/>
      </linearGradient>
      <linearGradient id="armR" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fed7aa"/>
        <stop offset="100%" stopColor="#fb923c"/>
      </linearGradient>
      <linearGradient id="tableG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#374151"/>
        <stop offset="100%" stopColor="#1f2937"/>
      </linearGradient>
    </defs>
    {/* Table surface */}
    <rect x="4" y="36" width="56" height="6" rx="3" fill="url(#tableG)"/>
    <rect x="4" y="38" width="56" height="2" rx="1" fill="white" opacity="0.08"/>
    {/* Left arm (red corner) */}
    <path d="M8 36 C8 28 12 22 18 20 L22 19 C24 18.5 25 19 25 20 L25 36 Z" fill="url(#armL)" stroke="#ef4444" strokeWidth="0.5"/>
    <path d="M18 28 C16 26 15 24 17 22" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    {/* Right arm (blue corner) */}
    <path d="M56 36 C56 28 52 22 46 20 L42 19 C40 18.5 39 19 39 20 L39 36 Z" fill="url(#armR)" stroke="#f97316" strokeWidth="0.5"/>
    <path d="M46 28 C48 26 49 24 47 22" stroke="#ea580c" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    {/* Clasped hands — left */}
    <path d="M25 20 C25 17 27 15 29 15 L30 15 C31 15 31 16 31 17 L31 23 L25 23 Z" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.8"/>
    {/* Clasped hands — right */}
    <path d="M39 20 C39 17 37 15 35 15 L34 15 C33 15 33 16 33 17 L33 23 L39 23 Z" fill="#fdba74" stroke="#f97316" strokeWidth="0.8"/>
    {/* Grip lock */}
    <path d="M29 15 C29 13 30.5 12 32 12 C33.5 12 35 13 35 15" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="32" cy="17" rx="3" ry="4" fill="#fecdd3" stroke="#ef4444" strokeWidth="1"/>
    {/* Knuckle lines */}
    <path d="M30 16 L30 18 M32 15.5 L32 18 M34 16 L34 18" stroke="#dc2626" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
    {/* Energy sparks */}
    <path d="M32 10 L33 7 M28 11 L26 8 M36 11 L38 8" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="32" cy="6" r="1" fill="#fbbf24" opacity="0.8"/>
    <circle cx="25" cy="7" r="0.8" fill="#fb923c" opacity="0.7"/>
    <circle cx="39" cy="7" r="0.8" fill="#ef4444" opacity="0.7"/>
  </svg>
);

const SvgTable = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <defs>
      <linearGradient id="tblG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4b5563"/>
        <stop offset="100%" stopColor="#1f2937"/>
      </linearGradient>
    </defs>
    <rect x="3" y="20" width="42" height="6" rx="3" fill="url(#tblG)"/>
    <rect x="3" y="20" width="42" height="2" rx="1" fill="white" opacity="0.1"/>
    <rect x="7" y="26" width="5" height="14" rx="2.5" fill="#374151"/>
    <rect x="36" y="26" width="5" height="14" rx="2.5" fill="#374151"/>
    <rect x="14" y="7" width="20" height="13" rx="3" fill="#ef4444"/>
    <rect x="14" y="7" width="20" height="3" rx="2" fill="#dc2626"/>
    <rect x="18" y="11" width="12" height="2" rx="1" fill="white" opacity="0.5"/>
    <rect x="18" y="15" width="8" height="1.5" rx="0.75" fill="white" opacity="0.3"/>
  </svg>
);

const SvgBracket = () => (
  <svg viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <defs>
      <linearGradient id="brR" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#dc2626"/>
      </linearGradient>
      <linearGradient id="brG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
    </defs>
    {/* R1 nodes */}
    <rect x="1" y="4"  width="13" height="7" rx="2" fill="url(#brR)"/>
    <rect x="1" y="15" width="13" height="7" rx="2" fill="url(#brR)"/>
    <rect x="1" y="28" width="13" height="7" rx="2" fill="url(#brR)"/>
    <rect x="1" y="39" width="13" height="7" rx="2" fill="url(#brR)"/>
    {/* Connectors R1→SF */}
    <path d="M14 7.5 H20 V18.5 M14 18.5 H20" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 31.5 H20 V42.5 M14 42.5 H20" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* SF nodes */}
    <rect x="20" y="13" width="13" height="7" rx="2" fill="url(#brG)"/>
    <rect x="20" y="37" width="13" height="7" rx="2" fill="url(#brG)"/>
    {/* Connectors SF→F */}
    <path d="M33 16.5 H39 V40.5 M33 40.5 H39" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Final node */}
    <rect x="39" y="24" width="15" height="8" rx="2.5" fill="#dc2626"/>
    {/* Crown on final */}
    <path d="M42 24 L43.5 21 L45 23 L46.5 20 L48 23 L49.5 21 L51 24" fill="#fbbf24" stroke="none"/>
  </svg>
);

const SvgMagnesium = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <defs>
      <radialGradient id="chalkG" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="white"/>
        <stop offset="100%" stopColor="#e5e7eb"/>
      </radialGradient>
    </defs>
    {/* Chalk block */}
    <rect x="10" y="22" width="28" height="16" rx="3" fill="url(#chalkG)" stroke="#d1d5db" strokeWidth="1.5"/>
    <rect x="10" y="22" width="28" height="5" rx="3" fill="white" opacity="0.8"/>
    {/* Chalk lines texture */}
    <line x1="18" y1="27" x2="18" y2="36" stroke="#d1d5db" strokeWidth="1"/>
    <line x1="26" y1="27" x2="26" y2="36" stroke="#d1d5db" strokeWidth="1"/>
    {/* Powder puff cloud */}
    <circle cx="20" cy="16" r="4" fill="white" opacity="0.7"/>
    <circle cx="26" cy="13" r="5" fill="white" opacity="0.6"/>
    <circle cx="32" cy="16" r="3.5" fill="white" opacity="0.5"/>
    <circle cx="24" cy="11" r="3" fill="white" opacity="0.5"/>
    {/* Hand silhouette */}
    <path d="M22 22 C22 19 23 17 24 17 C25 17 26 19 26 22" fill="#d1d5db" opacity="0.5"/>
  </svg>
);

const SvgFlag = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    {/* Pole */}
    <rect x="9" y="6" width="3" height="36" rx="1.5" fill="#6b7280"/>
    <circle cx="10.5" cy="5" r="2" fill="#9ca3af"/>
    {/* Checkered flag body */}
    <path d="M12 8 L40 11 L12 24 Z" fill="#1f2937"/>
    {/* Checker squares */}
    <path d="M12 8 L20 9.5 L20 16.5 L12 15 Z" fill="white" opacity="0.9"/>
    <path d="M20 9.5 L28 11 L28 18 L20 16.5 Z" fill="#1f2937"/>
    <path d="M28 11 L36 12.5 L36 19.5 L28 18 Z" fill="white" opacity="0.9"/>
    <path d="M12 15 L20 16.5 L20 23.5 L12 22 Z" fill="#1f2937"/>
    <path d="M20 16.5 L28 18 L28 25 L20 23.5 Z" fill="white" opacity="0.9"/>
    <path d="M28 18 L36 19.5 L36 24 L28 25 Z" fill="#1f2937"/>
  </svg>
);

const SvgWhistle = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <defs>
      <linearGradient id="wG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#d97706"/>
      </linearGradient>
    </defs>
    {/* Whistle body */}
    <ellipse cx="19" cy="30" rx="12" ry="10" fill="url(#wG)" stroke="#b45309" strokeWidth="1.2"/>
    <ellipse cx="19" cy="30" rx="12" ry="10" fill="url(#wG)"/>
    {/* Hole */}
    <circle cx="19" cy="30" r="4.5" fill="white"/>
    <circle cx="19" cy="30" r="2.5" fill="#fde68a"/>
    {/* Mouthpiece */}
    <path d="M29 26 L43 18 L45 22 L31 30" fill="#92400e" stroke="#78350f" strokeWidth="0.8"/>
    <rect x="29" y="24" width="14" height="7" rx="3.5" fill="#a16207" transform="rotate(-25 29 24)"/>
    {/* Air peas/ball */}
    <circle cx="19" cy="30" r="1.5" fill="#d97706"/>
    {/* Sound waves */}
    <path d="M6 24 C4 26 4 30 6 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M3 21 C0 24 0 32 3 35" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3"/>
    {/* Lanyard ring */}
    <circle cx="43" cy="17" r="3" fill="none" stroke="#ef4444" strokeWidth="2"/>
  </svg>
);

const SvgLocation = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <defs>
      <linearGradient id="pinG" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#f87171"/>
        <stop offset="100%" stopColor="#b91c1c"/>
      </linearGradient>
    </defs>
    <path d="M24 4 C15.2 4 8 11.2 8 20 C8 30.5 24 46 24 46 C24 46 40 30.5 40 20 C40 11.2 32.8 4 24 4 Z" fill="url(#pinG)"/>
    <path d="M24 4 C15.2 4 8 11.2 8 20 C8 14 15.2 9 24 9 C32.8 9 40 14 40 20 C40 11.2 32.8 4 24 4 Z" fill="white" opacity="0.15"/>
    <circle cx="24" cy="20" r="7.5" fill="white"/>
    <circle cx="24" cy="20" r="4" fill="#ef4444" opacity="0.25"/>
    <circle cx="24" cy="20" r="2" fill="#dc2626"/>
  </svg>
);

const SvgClock = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <defs>
      <linearGradient id="clockG" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#f9fafb"/>
        <stop offset="100%" stopColor="#f3f4f6"/>
      </linearGradient>
    </defs>
    {/* Stopwatch body */}
    <circle cx="24" cy="27" r="17" fill="url(#clockG)" stroke="#d1d5db" strokeWidth="2"/>
    <circle cx="24" cy="27" r="17" fill="none" stroke="white" strokeWidth="1" opacity="0.8"/>
    {/* Crown/button */}
    <rect x="21" y="8" width="6" height="4" rx="2" fill="#9ca3af"/>
    <rect x="20" y="11" width="8" height="3" rx="1.5" fill="#6b7280"/>
    {/* Tick marks */}
    <line x1="24" y1="13" x2="24" y2="15" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="24" y1="39" x2="24" y2="41" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="27" x2="12" y2="27" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="36" y1="27" x2="38" y2="27" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Hands */}
    <line x1="24" y1="27" x2="24" y2="18" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="27" x2="31" y2="27" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="27" r="2.5" fill="#1f2937"/>
    <circle cx="24" cy="27" r="1" fill="#ef4444"/>
  </svg>
);

const SvgTrophy = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <defs>
      <linearGradient id="trophyG" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#fde68a"/>
        <stop offset="100%" stopColor="#f59e0b"/>
      </linearGradient>
      <linearGradient id="trophyStem" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d97706"/>
        <stop offset="100%" stopColor="#b45309"/>
      </linearGradient>
    </defs>
    {/* Cup body */}
    <path d="M15 5 H33 V26 C33 34 15 34 15 26 Z" fill="url(#trophyG)"/>
    <path d="M15 5 H33 V10 H15 Z" fill="#fbbf24"/>
    {/* Shine */}
    <path d="M18 8 C18 6 20 5.5 22 5.5 L22 20 C20 20 18 18 18 14 Z" fill="white" opacity="0.2"/>
    {/* Handles */}
    <path d="M15 12 C9 12 6 17 9 22 C11 25 15 26 15 26" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M33 12 C39 12 42 17 39 22 C37 25 33 26 33 26" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    {/* Star on cup */}
    <path d="M24 13 L25 17 L29 17 L26 19 L27 23 L24 21 L21 23 L22 19 L19 17 L23 17 Z" fill="white" opacity="0.7"/>
    {/* Stem */}
    <rect x="20" y="34" width="8" height="6" rx="1" fill="url(#trophyStem)"/>
    {/* Base */}
    <rect x="13" y="40" width="22" height="4" rx="2" fill="url(#trophyStem)"/>
    <rect x="13" y="40" width="22" height="1.5" rx="1" fill="#fbbf24" opacity="0.4"/>
  </svg>
);

const SvgShield = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <defs>
      <linearGradient id="shieldG" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#991b1b"/>
      </linearGradient>
    </defs>
    <path d="M24 3 L41 9 V24 C41 35 24 45 24 45 C24 45 7 35 7 24 V9 Z" fill="url(#shieldG)"/>
    <path d="M24 3 L41 9 V14 C41 9 32 6 24 6 C16 6 7 9 7 14 V9 Z" fill="white" opacity="0.15"/>
    {/* Inner border */}
    <path d="M24 7 L38 12 V24 C38 33 24 42 24 42 C24 42 10 33 10 24 V12 Z" fill="none" stroke="white" strokeWidth="1" opacity="0.25"/>
    {/* Crossed fists / arm wrestling icon inside shield */}
    <path d="M17 22 C17 19 19 17 21 17 L22 17 L22 27 L17 27 Z" fill="white" opacity="0.8"/>
    <path d="M31 22 C31 19 29 17 27 17 L26 17 L26 27 L31 27 Z" fill="white" opacity="0.8"/>
    <ellipse cx="24" cy="17" rx="2.5" ry="3" fill="white" opacity="0.9"/>
    <path d="M22 17 C22 15 23 14 24 14 C25 14 26 15 26 17" fill="none" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* Data */
const PANCO_BABAK = [
  {
    no: "01",
    label: "Babak Penyisihan",
    hari: "H-1 · Sabtu, 20 Juni 2026",
    jam: "16.05 – 16.25",
    durasi: "20 menit",
    lokasi: "Meja Panco · Sirkuit Moge",
    pic: "MC Outdoor & Wasit Panco",
    keterangan: "Pengundian bracket, peserta bertanding secara cepat — sistem eliminasi langsung.",
    fase: "penyisihan",
  },
  {
    no: "02",
    label: "Babak Semifinal",
    hari: "H-1 · Sabtu, 20 Juni 2026",
    jam: "16.45 – 17.05",
    durasi: "20 menit",
    lokasi: "Meja Panco · Sirkuit Moge",
    pic: "MC Outdoor & Wasit Panco",
    keterangan: "4 peserta terbaik bertarung memperebutkan tiket Final. Dipimpin wasit terlatih.",
    fase: "semifinal",
  },
  {
    no: "03",
    label: "Grand Final & Open Challenge",
    hari: "H-1 · Sabtu, 20 Juni 2026",
    jam: "17.25 – 17.45",
    durasi: "20 menit",
    lokasi: "Meja Panco · Sirkuit Moge",
    pic: "MC Outdoor & Wasit Panco",
    keterangan: "Duel puncak + sesi Open Challenge: siapa saja boleh tantang sang juara untuk reputasi!",
    fase: "final",
  },
];

const PANCO_FORMAT = [
  { poin: "Sistem Eliminasi Langsung (Single Elimination)", sub: "Kalah 1x langsung gugur" },
  { poin: "Best of 3 per babak", sub: "Menang 2 dari 3 ronde = melaju" },
  { poin: "Open Challenge setelah Final", sub: "Penonton boleh tantang juara" },
  { poin: "Posisi tangan: di atas meja standar panco", sub: "Tangan lain pegang tiang meja" },
  { poin: "Wasit memimpin setiap duel", sub: "Keputusan wasit mutlak" },
];

const PANCO_LOGISTIK = [
  { item: "Meja Panco Standar", qty: "2 unit", note: "Sudah disiapkan di Sirkuit Moge & Ring 2" },
  { item: "Kapur Magnesium (chalk)", qty: "Secukupnya", note: "Dibawa LO-22 Anggota 1 — standby selama acara" },
  { item: "Lembar Bracket Kosong", qty: "10 lembar", note: "Leader LO-22 kelola dan isi sesuai pengundian" },
  { item: "Papan Skor / Marker", qty: "1 set", note: "Tulis nama peserta tiap babak" },
  { item: "HT Channel 2", qty: "1 unit", note: "Koordinasi dengan PJ Lapangan & MC Outdoor" },
];

const PANCO_SOP = [
  "Datang ke area Meja Panco ≥ 30 menit sebelum babak pertama (paling lambat 15.35 WIB).",
  "Leader LO-22 lakukan pengundian bracket segera saat peserta terdaftar.",
  "Panggil nama peserta sesuai urutan bracket — pastikan hadir sebelum bel.",
  "Jika peserta tidak hadir 2 menit setelah dipanggil → dinyatakan WO oleh wasit.",
  "Anggota LO-22 atur antrean fisik, pastikan tangan peserta bersih sebelum meja.",
  "Koordinasi lewat HT Ch.2 jika ada perubahan jadwal atau gangguan teknis.",
  "Dokumentasikan hasil tiap babak di lembar bracket — serahkan ke sekretariat setelah selesai.",
];

const PANCO_HADIAH = [
  { juara: "Juara 1", icon: "🥇", items: ["Medali Emas", "Sertifikat", "Uang Pembinaan", "Merchandise"], color: "#f59e0b" },
  { juara: "Juara 2", icon: "🥈", items: ["Medali Perak", "Sertifikat", "Uang Pembinaan", "Merchandise"], color: "#9ca3af" },
];

/* ─── Crew Bracket diagram ──────────────────────────────────────────── */
const CBK = { MH: 60, MW: 116, G: 12, CW: 28 };
const CBK_U    = CBK.MH + CBK.G;
const CBK_HALF = CBK.MH / 2;
const CBK_H    = 4 * CBK_U - CBK.G;

function cbkTop(i: number)  { return i * CBK_U; }
function cbkCtr(top: number){ return top + CBK_HALF; }
function cbkSfTop(pair: number) {
  return (cbkCtr(cbkTop(pair * 2)) + cbkCtr(cbkTop(pair * 2 + 1))) / 2 - CBK_HALF;
}
function cbkFinalTop() {
  return (cbkCtr(cbkSfTop(0)) + cbkCtr(cbkSfTop(1))) / 2 - CBK_HALF;
}
function cbkCol(n: number) { return n * (CBK.MW + CBK.CW); }

function CrewBracketCard({ m, matchMap, color, onUpdate }: {
  m: MatchItem; matchMap: Map<number, MatchItem>; color: string;
  onUpdate?: (pemenang: "merah" | "biru" | null) => void;
}) {
  function resolve(name: string): string {
    const mx = name.match(/^Winner Match (\d+)$/);
    if (!mx) return name;
    const src = matchMap.get(Number(mx[1]));
    if (!src || !src.pemenang) return "TBD";
    return resolve(src.pemenang === "merah" ? src.merah : src.biru);
  }
  const mr = resolve(m.merah);
  const br = resolve(m.biru);
  const mw = m.pemenang === "merah";
  const bw = m.pemenang === "biru";
  const isTbd = mr === "TBD" || br === "TBD";
  function trim(n: string) {
    if (n === "TBD") return "…";
    const p = n.split(" ");
    return p.length > 2 ? p[0] + " " + p[1] : n;
  }
  const handleHalf = (side: "merah" | "biru") => {
    if (!onUpdate || isTbd) return;
    if (m.pemenang === side) onUpdate(null);
    else onUpdate(side);
  };
  return (
    <div style={{ width: CBK.MW, height: CBK.MH }}
      className="absolute bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {m.pemenang && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />
      )}
      {m.status === "berlangsung" && !m.pemenang && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-400 animate-pulse" />
      )}
      <div className={`flex items-center gap-1.5 px-2 border-b border-gray-100 ${onUpdate && !isTbd ? "cursor-pointer active:opacity-70" : ""}`}
        style={{ height: CBK_HALF, background: mw ? "#fef2f2" : undefined }}
        onClick={() => handleHalf("merah")}>
        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
        <span className={`text-[9.5px] font-semibold truncate flex-1 ${
          mr === "TBD" ? "text-gray-300 italic" : mw ? "text-red-700 font-bold" : "text-gray-800"}`}>
          {trim(mr)}
        </span>
        {mw && <span className="text-[10px] leading-none">👑</span>}
      </div>
      <div className={`flex items-center gap-1.5 px-2 ${onUpdate && !isTbd ? "cursor-pointer active:opacity-70" : ""}`}
        style={{ height: CBK_HALF, background: bw ? "#eff6ff" : undefined }}
        onClick={() => handleHalf("biru")}>
        <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
        <span className={`text-[9.5px] font-semibold truncate flex-1 ${
          br === "TBD" ? "text-gray-300 italic" : bw ? "text-blue-700 font-bold" : "text-gray-800"}`}>
          {trim(br)}
        </span>
        {bw && <span className="text-[10px] leading-none">👑</span>}
      </div>
      <div className="absolute bottom-0 right-1 text-[7px] text-gray-300 font-bold leading-tight">
        #{m.no}
      </div>
    </div>
  );
}

function CrewBracketConn({ ax, ay, bx, by, tx, ty, dash }: {
  ax: number; ay: number; bx: number; by: number; tx: number; ty: number; dash?: boolean;
}) {
  const midX = (ax + tx) / 2;
  return (
    <g stroke="#c7ccd4" strokeWidth="1.5" fill="none" strokeLinecap="round"
      strokeDasharray={dash ? "3,3" : undefined}>
      <line x1={ax} y1={ay} x2={midX} y2={ay} />
      <line x1={bx} y1={by} x2={midX} y2={by} />
      <line x1={midX} y1={ay} x2={midX} y2={by} />
      <line x1={midX} y1={ty} x2={tx} y2={ty} />
    </g>
  );
}

function CrewBracketDiagram({ kelasMtch, matchMap, color, isRingan, onUpdate }: {
  kelasMtch: MatchItem[]; matchMap: Map<number, MatchItem>; color: string; isRingan: boolean;
  onUpdate?: (no: number, pemenang: "merah" | "biru" | null) => void;
}) {
  const prelim = kelasMtch.filter(m => m.kategori.includes("Preliminary"));
  const b1     = kelasMtch.filter(m => m.kategori.includes("Babak 1"));
  const sf     = kelasMtch.filter(m => m.kategori.includes("Semifinal"));
  const fi     = kelasMtch.filter(m => m.kategori.includes("Final") && !m.kategori.includes("Semi"));

  const hasPrelim  = prelim.length > 0;
  const offset     = hasPrelim ? 1 : 0;
  const numCols    = hasPrelim ? 4 : 3;
  const totalW     = numCols * CBK.MW + numCols * CBK.CW;

  /* cari di slot b1 mana prelim mengalirkan pemenangnya */
  const prelimB1Idx = hasPrelim
    ? b1.findIndex(m => m.merah.includes(String(prelim[0].no)) || m.biru.includes(String(prelim[0].no)))
    : -1;

  const b1Tops = [0,1,2,3].map(cbkTop);
  const sfTops = [0,1].map(cbkSfTop);
  const fiTop  = cbkFinalTop();

  const rEdge = (col: number) => cbkCol(col) + CBK.MW;
  const lEdge = (col: number) => cbkCol(col);

  const LABEL_H = 20;
  const labels = hasPrelim
    ? ["Prelim", "Babak 1", "Semifinal", "Final"]
    : ["Babak 1", "Semifinal", "Final"];

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div style={{ width: totalW, minWidth: totalW, position: "relative", height: CBK_H + LABEL_H + 4 }}>
        {labels.map((lbl, i) => (
          <div key={lbl} style={{ position: "absolute", left: cbkCol(i), top: 0, width: CBK.MW, textAlign: "center" }}
            className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
            {lbl}
          </div>
        ))}
        <div style={{ position: "absolute", top: LABEL_H }}>
          {hasPrelim && prelim.map(pm => (
            <div key={pm.no} style={{ position: "absolute", left: cbkCol(0), top: cbkTop(prelimB1Idx >= 0 ? prelimB1Idx : 3) }}>
              <CrewBracketCard m={pm} matchMap={matchMap} color="#8b5cf6" onUpdate={onUpdate ? (p) => onUpdate(pm.no, p) : undefined} />
            </div>
          ))}
          {b1.map((m, i) => (
            <div key={m.no} style={{ position: "absolute", left: cbkCol(offset), top: b1Tops[i] }}>
              <CrewBracketCard m={m} matchMap={matchMap} color={color} onUpdate={onUpdate ? (p) => onUpdate(m.no, p) : undefined} />
            </div>
          ))}
          {sf.map((m, i) => (
            <div key={m.no} style={{ position: "absolute", left: cbkCol(offset + 1), top: sfTops[i] }}>
              <CrewBracketCard m={m} matchMap={matchMap} color={color} onUpdate={onUpdate ? (p) => onUpdate(m.no, p) : undefined} />
            </div>
          ))}
          {fi.map(m => (
            <div key={m.no} style={{ position: "absolute", left: cbkCol(offset + 2), top: fiTop }}>
              <CrewBracketCard m={m} matchMap={matchMap} color={color} onUpdate={onUpdate ? (p) => onUpdate(m.no, p) : undefined} />
            </div>
          ))}
        </div>
        <svg style={{ position: "absolute", top: LABEL_H, left: 0, pointerEvents: "none" }}
          width={totalW} height={CBK_H} overflow="visible">
          {hasPrelim && prelimB1Idx >= 0 && (
            <g stroke="#c7ccd4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3,3">
              <line x1={rEdge(0)} y1={cbkCtr(cbkTop(prelimB1Idx))} x2={lEdge(1)} y2={cbkCtr(b1Tops[prelimB1Idx])} />
            </g>
          )}
          <CrewBracketConn
            ax={rEdge(offset)} ay={cbkCtr(b1Tops[0])}
            bx={rEdge(offset)} by={cbkCtr(b1Tops[1])}
            tx={lEdge(offset+1)} ty={cbkCtr(sfTops[0])} />
          <CrewBracketConn
            ax={rEdge(offset)} ay={cbkCtr(b1Tops[2])}
            bx={rEdge(offset)} by={cbkCtr(b1Tops[3])}
            tx={lEdge(offset+1)} ty={cbkCtr(sfTops[1])} />
          <CrewBracketConn
            ax={rEdge(offset+1)} ay={cbkCtr(sfTops[0])}
            bx={rEdge(offset+1)} by={cbkCtr(sfTops[1])}
            tx={lEdge(offset+2)} ty={cbkCtr(fiTop)} />
        </svg>
      </div>
    </div>
  );
}

function resolveWinner(name: string, matchMap: Map<number, MatchItem>): { name: string; resolved: boolean } {
  const m = name.match(/^Winner Match (\d+)$/);
  if (!m) return { name, resolved: true };
  const src = matchMap.get(Number(m[1]));
  if (!src || !src.pemenang) return { name: `TBD`, resolved: false };
  const winner = src.pemenang === "merah" ? src.merah : src.biru;
  return resolveWinner(winner, matchMap);
}

function PancoTab({ onBack }: { onBack: () => void }) {
  const { pancoMatches, updatePanco, resetAllPanco } = usePancoContext();
  const [activeKelas, setActiveKelas] = useState<"ringan" | "berat">("ringan");
  const matchMap = new Map(pancoMatches.map(m => [m.no, m]));
  const bracketRef = useRef<HTMLDivElement>(null);

  const KELAS_CFG = [
    { key: "ringan" as const, label: "Putra Ringan", sub: "≤ 60 kg",    prefix: "Panco Putra Ringan", color: "#f59e0b", bg: "#fffbeb" },
    { key: "berat"  as const, label: "Putra Berat",  sub: "> 61–85 kg", prefix: "Panco Putra Berat",  color: "#dc2626", bg: "#fef2f2" },
  ];
  const activeKfg  = KELAS_CFG.find(k => k.key === activeKelas)!;
  const kelasMtch  = pancoMatches.filter(m => m.kategori.startsWith(activeKfg.prefix));
  const rounds     = Array.from(new Set(kelasMtch.map(m => m.kategori.replace(activeKfg.prefix + " — ", ""))));

  const ROUND_CFG: Record<string, { color: string; bg: string; icon: string }> = {
    "Preliminary": { color: "#8b5cf6", bg: "#f5f3ff", icon: "🎯" },
    "Babak 1":     { color: "#6b7280", bg: "#f9fafb", icon: "⚔️"  },
    "Semifinal":   { color: "#f59e0b", bg: "#fffbeb", icon: "🔥"  },
    "Final":       { color: "#dc2626", bg: "#fef2f2", icon: "👑"  },
  };

  const faseColors: Record<string, { bar: string; badge: string; text: string }> = {
    penyisihan: { bar: "#6b7280", badge: "#f3f4f6", text: "#374151" },
    semifinal:  { bar: "#f59e0b", badge: "#fffbeb", text: "#d97706" },
    final:      { bar: "#ef4444", badge: "#fef2f2", text: "#dc2626" },
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 40%, #ef4444 80%, #f97316 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.15) 20px, rgba(255,255,255,0.15) 22px)" }} />
        <div className="relative px-4 pt-12 pb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/70 text-sm mb-4 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>

          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/20">
              <SvgArm />
            </div>
            <div>
              <p className="text-red-200 text-xs font-bold uppercase tracking-widest mb-0.5">Modul Panitia</p>
              <h1 className="text-white text-2xl font-extrabold leading-tight">Panco Battle</h1>
              <p className="text-red-100 text-sm mt-1 opacity-90">Turnamen Adu Kekuatan Lengan · GOR Adiwijaya</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { val: String(pancoMatches.length), sub: "Total Match" },
              { val: "17",                        sub: "Peserta" },
              { val: "LO-22",                     sub: "Tim Panco" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl py-2.5 text-center border border-white/15">
                <p className="text-white font-extrabold text-lg leading-none">{s.val}</p>
                <p className="text-red-200 text-[10px] font-semibold mt-0.5 uppercase tracking-wide">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">

        {/* Jadwal babak */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Jadwal Pertandingan · H-1 · 20 Juni</p>
          <div className="space-y-3">
            {PANCO_BABAK.map((babak) => {
              const c = faseColors[babak.fase];
              return (
                <div key={babak.no} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="flex">
                    <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ background: c.bar }} />
                    <div className="flex-1 p-4">
                      {/* Badge + nomor */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 rounded-lg px-2 py-0.5">#{babak.no}</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest rounded-lg px-2 py-0.5" style={{ background: c.badge, color: c.text }}>{babak.label}</span>
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-[15px] leading-snug">{babak.label}</h3>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <SvgClock />
                          <span className="text-xs font-bold text-gray-700">{babak.jam}</span>
                          <span className="text-[10px] text-gray-400">({babak.durasi})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <SvgLocation />
                          <span className="text-xs font-semibold text-gray-600">{babak.lokasi}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-2.5 leading-relaxed">{babak.keterangan}</p>

                      <div className="mt-2.5 pt-2.5 border-t border-gray-50 flex items-center gap-1.5">
                        <SvgWhistle />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">PIC:</span>
                        <span className="text-[11px] font-semibold text-gray-600">{babak.pic}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format pertandingan */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Format Pertandingan</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-4 pt-4 pb-1 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <SvgBracket />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-sm">Single Elimination Bracket</p>
                <p className="text-[11px] text-gray-500">Kalah sekali langsung gugur</p>
              </div>
            </div>
            <div className="px-4 pb-4 mt-3 space-y-0">
              {PANCO_FORMAT.map((f, i) => (
                <div key={i} className={`py-3 flex items-start gap-3 ${i < PANCO_FORMAT.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[9px] font-extrabold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-800 leading-snug">{f.poin}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bracket Peserta */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Bracket Peserta</p>

          {/* Kelas tab switcher */}
          <div className="flex gap-2 mb-4">
            {KELAS_CFG.map(k => {
              const isActive = activeKelas === k.key;
              const cnt = pancoMatches.filter(m => m.kategori.startsWith(k.prefix));
              return (
                <button key={k.key} onClick={() => setActiveKelas(k.key)}
                  className="flex-1 py-2.5 rounded-2xl text-[11px] font-extrabold border-2 transition-all active:scale-95"
                  style={isActive
                    ? { background: k.color, color: "#fff", borderColor: k.color, boxShadow: `0 4px 12px ${k.color}40` }
                    : { background: "#fff",   color: "#9ca3af", borderColor: "#e5e7eb" }
                  }>
                  <span className="block">{k.label}</span>
                  <span className="block text-[9px] mt-0.5 font-semibold opacity-80">{k.sub} · {cnt.length} match</span>
                </button>
              );
            })}
          </div>

          {/* Progress bar for active kelas */}
          {(() => {
            const done = kelasMtch.filter(m => m.status === "selesai").length;
            const pct  = kelasMtch.length ? Math.round(done / kelasMtch.length * 100) : 0;
            return (
              <div className="bg-white rounded-2xl p-3 mb-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-gray-600">Progress {activeKfg.label}</span>
                  <span className="text-[10px] font-bold text-gray-400">{done}/{kelasMtch.length} selesai</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: activeKfg.color }} />
                </div>
              </div>
            );
          })()}

          {/* Bracket diagram — crew bisa tap nama untuk set pemenang */}
          <div ref={bracketRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] text-gray-400 font-semibold">Tap nama atlet untuk set pemenang · tap lagi untuk batal</p>
              <DownloadMenu
                elRef={bracketRef}
                filename={`Bracket_Panco_${activeKelas === "ringan" ? "Ringan" : "Berat"}_TemuTarung`}
              />
            </div>
            <CrewBracketDiagram
              kelasMtch={kelasMtch}
              matchMap={matchMap}
              color={activeKfg.color}
              isRingan={activeKelas === "ringan"}
              onUpdate={(no, pemenang) => {
                if (pemenang === null) updatePanco(no, { status: "belum", pemenang: undefined });
                else updatePanco(no, { status: "selesai", pemenang });
              }}
            />
          </div>

          {/* Champion footer */}
          {(() => {
            const finalMatch = kelasMtch.find(m => m.kategori.includes("Final") && !m.kategori.includes("Semi"));
            if (!finalMatch?.pemenang) return null;
            function resolveChamp(name: string): string {
              const mx = name.match(/^Winner Match (\d+)$/);
              if (!mx) return name;
              const src = matchMap.get(Number(mx[1]));
              if (!src || !src.pemenang) return name;
              return resolveChamp(src.pemenang === "merah" ? src.merah : src.biru);
            }
            const champ = resolveChamp(finalMatch.pemenang === "merah" ? finalMatch.merah : finalMatch.biru);
            return (
              <div className="rounded-2xl overflow-hidden border border-yellow-200 shadow-sm">
                <div className="px-5 py-4 flex items-center gap-4"
                  style={{ background: "linear-gradient(135deg, #78350f, #d97706)" }}>
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="text-yellow-200 text-[10px] font-bold uppercase tracking-wider">Juara {activeKfg.label}</p>
                    <p className="text-white font-extrabold text-base leading-tight mt-0.5">{champ}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* LO Panco */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Tim LO Panco</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Header LO */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                <SvgShield />
              </div>
              <div>
                <p className="text-white font-extrabold text-sm">LO-22 — LO Peserta Panco</p>
                <p className="text-gray-300 text-[11px]">2 Orang · Area Meja Teknis Panco Samping Ring</p>
              </div>
              <div className="ml-auto bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">CH 2</div>
            </div>

            {/* Tugas */}
            <div className="p-4 space-y-3">
              {[
                {
                  posisi: "Leader",
                  tugas: [
                    "Kelola lembar bracket panco sesuai pengundian",
                    "Panggil nama peserta sesuai urutan bracket",
                    "Koordinasi langsung dengan Wasit Panco & MC Outdoor",
                  ],
                  color: "#ef4444",
                },
                {
                  posisi: "Anggota 1",
                  tugas: [
                    "Atur antrean fisik peserta panco",
                    "Standby logistik kapur magnesium (chalk) di meja",
                    "Pastikan peserta siap 2 menit sebelum giliran",
                  ],
                  color: "#f59e0b",
                },
              ].map((lo, i) => (
                <div key={i} className={`rounded-xl p-3.5 ${i === 0 ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: lo.color }}>
                      <span className="text-white text-[9px] font-extrabold">{i === 0 ? "L" : "A1"}</span>
                    </div>
                    <p className="font-extrabold text-gray-800 text-sm">{lo.posisi}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {lo.tugas.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px] text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: lo.color }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lokasi */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Lokasi Tanding</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { hari: "H-1", tanggal: "20 Juni", lokasi: "Meja Panco\nSirkuit Moge", warna: "#dc2626", bg: "#fef2f2" },
              { hari: "Hari H", tanggal: "21 Juni", lokasi: "Ring 2\nGOR Adiwijaya", warna: "#7c3aed", bg: "#f5f3ff" },
            ].map((l, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center" style={{ background: l.bg }}>
                  <SvgLocation />
                </div>
                <p className="font-extrabold text-xs uppercase tracking-widest" style={{ color: l.warna }}>{l.hari} · {l.tanggal}</p>
                <p className="font-bold text-gray-800 text-sm mt-1 whitespace-pre-line leading-snug">{l.lokasi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logistik */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Logistik & Perlengkapan</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
              <SvgMagnesium />
              <p className="font-extrabold text-gray-700 text-sm">Daftar Logistik Panco</p>
            </div>
            {PANCO_LOGISTIK.map((l, i) => (
              <div key={i} className={`px-4 py-3 flex items-start gap-3 ${i < PANCO_LOGISTIK.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 text-[10px] font-extrabold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-gray-800 text-[13px]">{l.item}</p>
                    <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg whitespace-nowrap flex-shrink-0">{l.qty}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{l.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOP Panitia */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">SOP Panitia Panco</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-gradient-to-r from-red-700 to-red-600 px-4 py-3 flex items-center gap-2">
              <SvgFlag />
              <p className="text-white font-extrabold text-sm">Standard Operating Procedure</p>
            </div>
            <div className="p-4 space-y-0">
              {PANCO_SOP.map((sop, i) => (
                <div key={i} className={`flex items-start gap-3 py-3 ${i < PANCO_SOP.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[9px] font-extrabold">{i + 1}</span>
                  </div>
                  <p className="text-[12px] text-gray-700 leading-relaxed">{sop}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hadiah */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-3 px-1">Hadiah Pemenang</p>
          <div className="grid grid-cols-3 gap-2">
            {PANCO_HADIAH.map((h, i) => (
              <div key={i} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: h.color + "44" }}>
                <div className="px-3 py-2.5 text-center border-b" style={{ background: h.color + "12", borderColor: h.color + "33" }}>
                  <p className="text-[20px] leading-none mb-1">{h.icon}</p>
                  <p className="text-[10px] font-black" style={{ color: h.color }}>{h.juara}</p>
                </div>
                <div className="px-2 py-2 space-y-1">
                  {h.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: h.color }} />
                      <p className="text-[10px] text-gray-600 font-semibold leading-tight">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trophy section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <SvgTrophy />
            <div>
              <p className="font-extrabold text-amber-800 text-sm">Open Challenge — Siapa Berani?</p>
              <p className="text-amber-600 text-[11px]">Setelah Final · Terbuka untuk semua</p>
            </div>
          </div>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            Penonton dari komunitas boleh tantang juara Panco secara langsung. MC mengatur giliran — maksimal 5 challenger per sesi. Hadiah gimmick dari sponsor tersedia untuk challenger berani!
          </p>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SKEMA TAB (MATCH TABLE)
───────────────────────────────────────────────────────────────── */

/* ── Boxing bell + TTS announcer ─────────────────────────────── */
function playBell(ctx: AudioContext, t: number, freq = 1320, dur = 2.2) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  const dist = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x));
  }
  dist.curve = curve;
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t + dur);
  gain.gain.setValueAtTime(0.55, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(dist); dist.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + dur);
}

async function callMatchAudio(match: MatchItem) {
  /* ── Teks pemanggilan ── */
  const kategori = match.kategori
    .replace(/\(|\)/g, "")
    .replace(/0-1 X Main/i, "nol satu kali main");

  const text = [
    `Match nomor ${match.no}.`,
    `Kategori ${kategori}, kelas ${match.berat}.`,
    `Sudut Merah: ${match.merah} dari ${match.campMerah}.`,
    `Melawan Sudut Biru: ${match.biru} dari ${match.campBiru}.`,
  ].join(" ");

  /* ── Coba Google TTS via proxy API (suara bulat) ── */
  const API = window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "/api";

  try {
    const res = await fetch(`${API}/tts/announce`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Crew-Key": "nempo-crew-2024" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`tts ${res.status}`);
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = 1;
    audio.onended = () => URL.revokeObjectURL(url);
    await audio.play();
    return;
  } catch { /* fallback ke Web Speech */ }

  /* ── 4. Fallback: Web Speech API ── */
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utter  = new SpeechSynthesisUtterance(text);
  utter.lang   = "id-ID";
  utter.rate   = 0.88;
  utter.pitch  = 0.4;
  utter.volume = 1;

  const voices  = window.speechSynthesis.getVoices();
  const maleId  = voices.find(v => v.lang === "id-ID" && /male|laki|man|pria/i.test(v.name));
  const maleAny = voices.find(v => /male|man/i.test(v.name) && !/fe?male/i.test(v.name));
  const anyId   = voices.find(v => v.lang === "id-ID") || voices.find(v => v.lang.startsWith("id"));
  const chosen  = maleId || maleAny || anyId;
  if (chosen) utter.voice = chosen;
  window.speechSynthesis.speak(utter);
}

function MatchUpdateSheet({ matchNo, onClose }: { matchNo: number; onClose: () => void }) {
  const { matches, updateMatch, resetMatch } = useMatchContext();
  const [calling, setCalling] = useState(false);
  const match = matches.find(m => m.no === matchNo);
  if (!match) return null;
  const isDone = match.status === "selesai";

  function handleCall() {
    setCalling(true);
    callMatchAudio(match!);
    setTimeout(() => setCalling(false), 4500);
  }
  return (
    <>
      <div className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white rounded-t-3xl px-5 pt-4 pb-8 shadow-2xl" style={{ maxHeight: "82dvh", overflowY: "auto" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        {/* ── Panggil ke Gelanggang ── */}
        <button
          onClick={handleCall}
          disabled={calling}
          className={`w-full mb-5 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold text-[14px] transition-all active:scale-[0.97] ${
            calling
              ? "bg-amber-400 text-white shadow-lg shadow-amber-200 animate-pulse"
              : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
          }`}
        >
          <span className={`text-[18px] leading-none ${calling ? "animate-bounce" : ""}`}>🎙️</span>
          <span>{calling ? "Memanggil…" : "Panggil ke Gelanggang"}</span>
          {calling && <span className="text-[10px] font-bold opacity-70">🔔🔔🔔</span>}
        </button>

        <div className="mb-5">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Match #{String(match.no).padStart(3,"0")} · {match.berat}</p>
          <p className="text-sm font-extrabold text-gray-900 mt-0.5 leading-snug">{match.merah} <span className="text-gray-300 font-normal">vs</span> {match.biru}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight truncate">{match.campMerah} · {match.campBiru}</p>
        </div>

        <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Status</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {([
            { s: "belum"       as MatchStatus, label: "Belum",     clr: "#64748b" },
            { s: "berlangsung" as MatchStatus, label: "🔴 Live",   clr: "#f59e0b" },
            { s: "selesai"     as MatchStatus, label: "✓ Selesai", clr: "#10b981" },
          ]).map(({ s, label, clr }) => (
            <button key={s}
              onClick={() => updateMatch(match.no, {
                status: s,
                pemenang: s === "selesai" ? match.pemenang : undefined,
                metode:   s === "selesai" ? match.metode   : undefined,
              })}
              className="py-2.5 rounded-2xl text-[11px] font-extrabold border transition-all"
              style={match.status === s
                ? { background: clr, color: "#fff", borderColor: clr }
                : { background: "#f8fafc", color: clr, borderColor: `${clr}50` }}>
              {label}
            </button>
          ))}
        </div>

        {isDone && (
          <>
            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Pemenang</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {([
                { corner: "merah" as const, name: match.merah, clr: "#ef4444" },
                { corner: "biru"  as const, name: match.biru,  clr: "#3b82f6" },
              ]).map(({ corner, name, clr }) => (
                <button key={corner}
                  onClick={() => updateMatch(match.no, { status: "selesai", pemenang: corner, metode: match.metode })}
                  className="py-3 rounded-2xl text-[11px] font-extrabold border-2 transition-all px-2 leading-snug"
                  style={match.pemenang === corner
                    ? { background: clr, color: "#fff", borderColor: clr }
                    : { background: `${clr}12`, color: clr, borderColor: `${clr}40` }}>
                  {corner === "merah" ? "🔴" : "🔵"} {name}
                </button>
              ))}
            </div>

            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Metode</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["KO", "TKO", "Submission", "Decision", "Split Decision", "DQ", "NC"].map(mt => (
                <button key={mt}
                  onClick={() => updateMatch(match.no, { status: "selesai", pemenang: match.pemenang, metode: mt })}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all"
                  style={match.metode === mt
                    ? { background: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                    : { background: "#f8fafc", color: "#475569", borderColor: "#e2e8f0" }}>
                  {mt}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 pt-3 border-t border-gray-100">
          <button onClick={() => { resetMatch(match.no); onClose(); }}
            className="flex-1 py-3 rounded-2xl text-[12px] font-extrabold text-gray-500 bg-gray-100">
            Reset
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-[12px] font-extrabold text-white"
            style={{ background: "#0194f3" }}>
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SCAN TAB — Scan Tiket Masuk
───────────────────────────────────────────────────────────────── */
const SCAN_API_KEY = "nempo-crew-2024";

type ScanStatus = "success" | "duplicate" | "invalid" | "error";
interface ScanResult {
  status: ScanStatus;
  order?: any;
  message?: string;
}
interface ScanRecord {
  code: string;
  status: ScanStatus;
  name?: string;
  ticket?: string;
  time: Date;
}

interface CheckinEntry { id: number; order_code: string; buyer_name: string; buyer_phone?: string; qty: number; checked_in_at: string; ticket_name?: string; }

function ScanTab({ onBack }: { onBack: () => void }) {
  const API = "/api";
  const [mode, setMode]         = useState<"camera" | "manual">("camera");
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<ScanResult | null>(null);
  const [history, setHistory]   = useState<ScanRecord[]>([]);
  const [manualCode, setManualCode] = useState("");
  const [checkins, setCheckins] = useState<CheckinEntry[]>([]);
  const [loadingCheckins, setLoadingCheckins] = useState(false);
  const [showCheckins, setShowCheckins] = useState(false);
  const scannerRef  = useRef<any>(null);
  const didScanRef  = useRef(false);

  const fetchCheckins = useCallback(async () => {
    setLoadingCheckins(true);
    try {
      const res = await fetch(`${API}/event-orders/crew-checkins`, {
        headers: { "X-Crew-Key": SCAN_API_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        setCheckins(data.checkins ?? []);
        setShowCheckins(true);
      }
    } catch {}
    finally { setLoadingCheckins(false); }
  }, [API]);

  useEffect(() => { fetchCheckins(); }, [fetchCheckins]);

  const pushHistory = useCallback((rec: ScanRecord) => {
    setHistory(prev => [rec, ...prev.slice(0, 29)]);
  }, []);

  const processCode = useCallback(async (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/event-orders/crew-scan/${code}`, {
        method: "POST",
        headers: { "X-Crew-Key": SCAN_API_KEY },
      });
      const data = await res.json();
      if (res.ok) {
        const r: ScanResult = { status: "success", order: data.order };
        setResult(r);
        pushHistory({ code, status: "success", name: data.order?.buyer_name, ticket: data.order?.ticket_name, time: new Date() });
        fetchCheckins();
      } else if (res.status === 409) {
        const r: ScanResult = { status: "duplicate", order: data.order, message: data.error };
        setResult(r);
        pushHistory({ code, status: "duplicate", name: data.order?.buyer_name, ticket: data.order?.ticket_name, time: new Date() });
      } else if (res.status === 404) {
        setResult({ status: "invalid", message: data.error });
        pushHistory({ code, status: "invalid", time: new Date() });
      } else {
        setResult({ status: "error", message: data.error });
        pushHistory({ code, status: "error", time: new Date() });
      }
    } catch {
      setResult({ status: "error", message: "Koneksi gagal — cek jaringan" });
    } finally {
      setLoading(false);
    }
  }, [API, pushHistory, fetchCheckins]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      try { scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return;
    didScanRef.current = false;
    setResult(null);
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader-div");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decoded: string) => {
          if (didScanRef.current) return;
          didScanRef.current = true;
          processCode(decoded);
          stopScanner();
        },
        () => {}
      );
    } catch {
      setScanning(false);
      setResult({ status: "error", message: "Kamera tidak tersedia atau izin ditolak" });
    }
  }, [processCode, stopScanner]);

  useEffect(() => { return () => { stopScanner(); }; }, [stopScanner]);

  const statusCfg: Record<ScanStatus, { bg: string; border: string; icon: React.ReactNode; title: string; textColor: string }> = {
    success:   { bg: "#f0fdf4", border: "#86efac", icon: <CheckCheck className="h-8 w-8 text-green-500" />, title: "Tiket Valid — Masuk!", textColor: "#166534" },
    duplicate: { bg: "#fffbeb", border: "#fcd34d", icon: <Ban className="h-8 w-8 text-amber-500" />,       title: "Tiket Sudah Dipakai",   textColor: "#92400e" },
    invalid:   { bg: "#fef2f2", border: "#fca5a5", icon: <XCircle className="h-8 w-8 text-red-500" />,     title: "Tiket Tidak Valid",     textColor: "#991b1b" },
    error:     { bg: "#fef2f2", border: "#fca5a5", icon: <XCircle className="h-8 w-8 text-red-500" />,     title: "Terjadi Kesalahan",     textColor: "#991b1b" },
  };

  const histBadge: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    duplicate: "bg-amber-100 text-amber-700",
    invalid: "bg-red-100 text-red-700",
    error: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-8">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-5 pb-6" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#0194f3 100%)" }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <button onClick={onBack} className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-95 transition-transform" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Crew · Temu Tarung</p>
            <h2 className="text-white font-black text-lg leading-tight">Scan Tiket Masuk</h2>
          </div>
        </div>
        {/* Mode switcher */}
        <div className="flex gap-2 relative z-10">
          {([["camera", <Camera className="h-3.5 w-3.5" />, "Kamera"], ["manual", <KeyRound className="h-3.5 w-3.5" />, "Manual"]] as const).map(([m, icon, label]) => (
            <button key={m} onClick={() => { stopScanner(); setMode(m as any); setResult(null); }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all active:scale-95"
              style={mode === m ? { background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff" } : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
            >
              {icon}{label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Kamera Mode ── */}
        {mode === "camera" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Viewfinder */}
            <div className="relative bg-black" style={{ minHeight: 280 }}>
              <div id="qr-reader-div" className="w-full" />
              {!scanning && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-white/60" />
                  </div>
                  <button onClick={startScanner}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white active:scale-95 transition-all"
                    style={{ background: "#0194f3" }}
                  >
                    <Camera className="h-4 w-4" />Buka Kamera
                  </button>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                  <p className="text-white font-semibold text-sm">Memproses tiket…</p>
                </div>
              )}
              {/* Corner guides */}
              {scanning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-56 h-56">
                    {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]].map(([pos,cls],i) => (
                      <div key={i} className={`absolute w-6 h-6 ${pos} ${cls} border-[#0194f3] rounded-sm`} />
                    ))}
                    <ScanLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-full text-[#0194f3] opacity-70 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
            {scanning && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-[12px] font-semibold text-gray-600 animate-pulse">Arahkan kamera ke QR Code tiket…</p>
                <button onClick={stopScanner} className="text-[11px] font-bold text-red-500 active:scale-95 flex items-center gap-1"><X className="h-3 w-3" />Stop</button>
              </div>
            )}
          </div>
        )}

        {/* ── Manual Mode ── */}
        {mode === "manual" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Kode Tiket (NGT…)</p>
            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={e => setManualCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && processCode(manualCode)}
                placeholder="Contoh: NGTA1B2C3D"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest outline-none focus:border-[#0194f3] transition-colors"
                autoCapitalize="characters"
                autoCorrect="off"
              />
              <button
                onClick={() => processCode(manualCode)}
                disabled={!manualCode.trim() || loading}
                className="px-4 py-3 rounded-xl font-bold text-white flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
                style={{ background: "#0194f3" }}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                Cek
              </button>
            </div>
          </div>
        )}

        {/* ── Result Card ── */}
        {result && (() => {
          const cfg = statusCfg[result.status];
          return (
            <div className="rounded-2xl border-2 p-5 flex flex-col gap-3" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[15px] leading-tight" style={{ color: cfg.textColor }}>{cfg.title}</p>
                  {result.order && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[13px] font-bold text-gray-800">{result.order.buyer_name}</p>
                      <p className="text-[11px] text-gray-500">{result.order.ticket_name} · {result.order.qty} tiket</p>
                      {result.order.event_name && <p className="text-[11px] text-gray-400">{result.order.event_name}</p>}
                      {result.status === "duplicate" && result.order.checked_in_at && (
                        <p className="text-[10px] font-bold" style={{ color: cfg.textColor }}>
                          Masuk: {new Date(result.order.checked_in_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  )}
                  {result.message && !result.order && <p className="text-[12px] text-gray-600 mt-1">{result.message}</p>}
                </div>
              </div>
              <button
                onClick={() => { setResult(null); setManualCode(""); if (mode === "camera") { didScanRef.current = false; startScanner(); } }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-all border"
                style={{ borderColor: cfg.border, color: cfg.textColor, background: "rgba(255,255,255,0.7)" }}
              >
                <ScanLine className="h-4 w-4" />Scan Berikutnya
              </button>
            </div>
          );
        })()}

        {/* ── Riwayat Scan ── */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <History className="h-3.5 w-3.5 text-gray-400" />
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Riwayat Sesi · {history.length} scan</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {history.map((rec, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${histBadge[rec.status]}`}>
                    {rec.status === "success" ? "MASUK" : rec.status === "duplicate" ? "DUPLIKAT" : rec.status === "invalid" ? "INVALID" : "ERROR"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-800 truncate">{rec.name || rec.code}</p>
                    {rec.ticket && <p className="text-[10px] text-gray-400 truncate">{rec.ticket}</p>}
                  </div>
                  <p className="text-[10px] text-gray-400 flex-shrink-0 font-mono">
                    {rec.time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sudah Masuk (dari DB) ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-green-500" />
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                Sudah Masuk
                {checkins.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-extrabold">{checkins.length}</span>
                )}
              </p>
            </div>
            <button
              onClick={fetchCheckins}
              disabled={loadingCheckins}
              className="flex items-center gap-1 text-[10px] font-bold text-[#0194f3] active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${loadingCheckins ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loadingCheckins && checkins.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-8 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-gray-300 animate-spin" />
            </div>
          ) : checkins.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-8 text-center">
              <Users className="h-7 w-7 mx-auto mb-2 text-gray-200" />
              <p className="text-[12px] font-semibold text-gray-400">Belum ada tamu yang masuk</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {checkins.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-extrabold text-green-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-800 truncate">{c.buyer_name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{c.ticket_name || "—"} · {c.qty} tiket</p>
                  </div>
                  <p className="text-[10px] text-gray-400 flex-shrink-0 font-mono tabular-nums">
                    {new Date(c.checked_in_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function SkemaTab() {
  const { matches } = useMatchContext();
  const [editMatchNo, setEditMatchNo] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const skemaRef = useRef<HTMLDivElement>(null);

  const types = ["Semua", "Stand Up Fight", "MMA", "For Men", "Tunggu"];
  const nonPancoMatches = matches.filter(m => getTypeLabel(m.kategori) !== "Panco");

  function downloadExcel() {
    const STATUS_LABEL: Record<string, string> = {
      belum: "Belum", berlangsung: "Berlangsung", selesai: "Selesai"
    };
    const PEMENANG_LABEL: Record<string, string> = {
      merah: "Sudut Merah", biru: "Sudut Biru"
    };

    const rows = nonPancoMatches.map((m, idx) => ({
      "No": m.no,
      "Jam (Est.)": getMatchJam(m.no),
      "Kategori": m.kategori,
      "Berat": m.berat,
      "Sudut Merah": m.merah,
      "Camp Merah": m.campMerah,
      "Sudut Biru": m.biru,
      "Camp Biru": m.campBiru,
      "Status": STATUS_LABEL[m.status] ?? m.status,
      "Pemenang": m.pemenang ? PEMENANG_LABEL[m.pemenang] + ` (${m.pemenang === "merah" ? m.merah : m.biru})` : "",
      "Metode": m.metode ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 5 }, { wch: 10 }, { wch: 36 }, { wch: 8 },
      { wch: 26 }, { wch: 28 }, { wch: 26 }, { wch: 28 },
      { wch: 14 }, { wch: 32 }, { wch: 18 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bagan Match");
    XLSX.writeFile(wb, "Bagan_Match_TemuTarung.xlsx");
  }

  const countByType: Record<string, number> = {};
  for (const t of types.slice(1)) {
    if (t === "Tunggu") countByType[t] = daftarTunggu.length;
    else countByType[t] = nonPancoMatches.filter(m => getTypeLabel(m.kategori) === t).length;
  }

  const filtered = nonPancoMatches.filter(m => {
    if (typeFilter !== "Semua" && getTypeLabel(m.kategori) !== typeFilter) return false;
    if (statusFilter === "Selesai" && m.status !== "selesai") return false;
    if (statusFilter === "Berlangsung" && m.status !== "berlangsung") return false;
    if (statusFilter === "Belum" && m.status !== "belum") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.merah.toLowerCase().includes(q) || m.biru.toLowerCase().includes(q) ||
        m.campMerah.toLowerCase().includes(q) || m.campBiru.toLowerCase().includes(q) ||
        m.kategori.toLowerCase().includes(q) || m.berat.includes(q)
      );
    }
    return true;
  });

  const selesai     = nonPancoMatches.filter(m => m.status === "selesai").length;
  const berlangsung = nonPancoMatches.filter(m => m.status === "berlangsung").length;
  const belum       = nonPancoMatches.filter(m => m.status === "belum").length;
  const pct         = Math.round((selesai / (nonPancoMatches.length || 1)) * 100);

  return (
    <>
    <div ref={skemaRef} className="pb-6">
      {/* ── Sticky header ── */}
      <div className="bg-white sticky top-14 z-40 border-b border-gray-100 px-4 py-3 space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-extrabold text-gray-700">Progress Pertandingan</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">{selesai}/{nonPancoMatches.length}</span>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl bg-green-600 text-white active:bg-green-700"
              >
                ⬇ Excel
              </button>
              <DownloadMenu elRef={skemaRef} filename="Skema_Match_TemuTarung" />
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#0194f3] transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {/* Status counters */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: selesai,     l: "Selesai",     c: "#10b981", bg: "#ecfdf5", k: "Selesai"     },
            { v: berlangsung, l: "Live",         c: "#f59e0b", bg: "#fffbeb", k: "Berlangsung" },
            { v: belum,       l: "Belum",        c: "#94a3b8", bg: "#f8fafc", k: "Belum"       },
          ].map(s => (
            <button key={s.k}
              onClick={() => setStatusFilter(sf => sf === s.k ? "Semua" : s.k)}
              className={`py-2 rounded-2xl text-center transition-all ${statusFilter === s.k ? "ring-2" : ""}`}
              style={{ background: s.bg, ringColor: s.c } as React.CSSProperties}>
              <p className="text-base font-extrabold leading-none" style={{ color: s.c }}>{s.v}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{s.l}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* ── Type filter chips ── */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {types.map(t => {
            const isActive = typeFilter === t;
            const isWaiting = t === "Tunggu";
            const tc = (!isWaiting && t !== "Semua") ? TYPE_COLORS[t] : null;
            const activeBg    = isWaiting ? "#d97706" : (tc?.text ?? "#0194f3");
            const activeBorder = activeBg;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition-all whitespace-nowrap"
                style={isActive
                  ? { background: activeBg, color: "#fff", borderColor: activeBorder }
                  : isWaiting
                    ? { background: "#fffbeb", color: "#d97706", borderColor: "#fde68a" }
                    : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
                }>
                {t}{t !== "Semua" && ` · ${countByType[t]}`}
              </button>
            );
          })}
        </div>

        {/* ── Search ── */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 shadow-sm">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama fighter atau camp…"
            className="flex-1 text-xs outline-none bg-transparent text-gray-800 placeholder-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0">
              <X className="h-3.5 w-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* ── Result count ── */}
        <p className="text-[10px] text-gray-400 font-semibold">
          {typeFilter === "Tunggu"
            ? <>{daftarTunggu.length} atlet menunggu lawan</>
            : <>{filtered.length} dari {nonPancoMatches.length} match ditampilkan</>
          }
          {(typeFilter !== "Semua" || search || statusFilter !== "Semua") && (
            <button onClick={() => { setTypeFilter("Semua"); setSearch(""); setStatusFilter("Semua"); }}
              className="ml-2 text-[#0194f3] font-bold">× Reset</button>
          )}
        </p>

        {/* ── Waitlist cards (saat filter "Tunggu" aktif) ── */}
        {typeFilter === "Tunggu" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {daftarTunggu.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-sm font-bold text-amber-400">Tidak ada atlet di daftar tunggu</p>
              </div>
            ) : daftarTunggu.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-extrabold text-gray-900 leading-snug">{w.nama}</p>
                  <p className="text-[10px] text-amber-700 font-semibold">{w.camp}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{w.kategori} · {w.berat}</p>
                </div>
                <span className="shrink-0 text-[9px] font-extrabold bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Tunggu</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Match cards — 1 col mobile, 2 col md+ ── */}
        {typeFilter !== "Tunggu" && (() => {
          const isFiltering = typeFilter !== "Semua" || search || statusFilter !== "Semua";
          const AGE_LABELS: Record<number, string> = { 1: "ANAK", 7: "JUNIOR", 43: "SENIOR", 69: "STAND UP FIGHT SENIOR + MMA" };

          const items: React.ReactNode[] = [];

          filtered.forEach((m, idx) => {
            const isLive = m.status === "berlangsung";
            const isDone = m.status === "selesai";
            const tl     = getTypeLabel(m.kategori);
            const tc     = TYPE_COLORS[tl];
            const jam    = getMatchJam(m.no);

            /* ── Separator kelompok umur (hanya saat tidak filter) ── */
            if (!isFiltering && AGE_LABELS[m.no]) {
              items.push(
                <div key={`sep-${m.no}`} className="col-span-full flex items-center gap-3 mt-2 mb-1">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] font-extrabold text-gray-500 shrink-0 tracking-wide">{AGE_LABELS[m.no]}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              );
            }

            /* ── Kartu match ── */
            items.push(
              <div key={m.no}
                onClick={() => setEditMatchNo(m.no)}
                className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-shadow hover:shadow-md cursor-pointer ${
                  isLive ? "border-amber-300" : "border-gray-100"
                }`}>
                {/* Card header */}
                <div className={`flex items-center justify-between px-3 py-2 ${
                  isLive ? "bg-amber-500" : isDone ? "bg-[#0194f3]" : "bg-gray-50 border-b border-gray-100"
                }`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-[10px] font-extrabold shrink-0 tabular-nums ${
                      isLive || isDone ? "text-white" : "text-gray-500"
                    }`}>#{String(m.no).padStart(3,"0")}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0"
                      style={isLive || isDone
                        ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                        : { background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }
                      }>
                      {getAgeLabel(m.kategori)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Jam tanding */}
                    <span className={`flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
                      isLive || isDone ? "bg-white/20 text-white" : "bg-white border border-gray-200 text-[#0194f3]"
                    }`}>
                      <svg className="w-2 h-2 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                      </svg>
                      {jam}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isLive || isDone ? "bg-white/20 text-white" : "bg-white border border-gray-200 text-gray-500"
                    }`}>{m.berat}</span>
                    {isLive && (
                      <span className="flex items-center gap-0.5 bg-white/25 rounded-full px-1.5 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[8px] text-white font-extrabold">LIVE</span>
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[8px] text-white font-bold bg-white/20 px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                  </div>
                </div>

                {/* Category label */}
                <div className="px-3 pt-1.5 pb-0">
                  <p className="text-[9px] text-gray-400 font-semibold leading-tight truncate">{m.kategori}</p>
                </div>

                {/* VS section */}
                <div className="px-3 pt-2 pb-3">
                  <div className="flex items-stretch gap-2">
                    {/* Red corner */}
                    <div className={`flex-1 min-w-0 rounded-xl p-2.5 border ${
                      m.pemenang === "merah" ? "bg-red-50 border-red-200" :
                      m.pemenang === "biru"  ? "bg-gray-50 border-gray-100 opacity-55" :
                      "bg-red-50/40 border-red-100"
                    }`}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-[8px] font-extrabold text-red-500 uppercase tracking-wider">Merah</span>
                        {m.pemenang === "merah" && <Trophy className="h-2.5 w-2.5 text-red-500 ml-auto shrink-0" />}
                      </div>
                      <p className="text-[11px] font-extrabold text-gray-900 leading-snug capitalize">{m.merah}</p>
                      <p className="text-[8px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{m.campMerah}</p>
                    </div>

                    {/* VS */}
                    <div className="shrink-0 flex items-center justify-center w-6">
                      <span className="text-[9px] font-extrabold text-gray-300">VS</span>
                    </div>

                    {/* Blue corner */}
                    <div className={`flex-1 min-w-0 rounded-xl p-2.5 border text-right ${
                      m.pemenang === "biru"  ? "bg-blue-50 border-blue-200" :
                      m.pemenang === "merah" ? "bg-gray-50 border-gray-100 opacity-55" :
                      "bg-blue-50/40 border-blue-100"
                    }`}>
                      <div className="flex items-center justify-end gap-1 mb-1">
                        {m.pemenang === "biru" && <Trophy className="h-2.5 w-2.5 text-blue-500 mr-auto shrink-0" />}
                        <span className="text-[8px] font-extrabold text-blue-500 uppercase tracking-wider">Biru</span>
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      </div>
                      <p className="text-[11px] font-extrabold text-gray-900 leading-snug capitalize">{m.biru}</p>
                      <p className="text-[8px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{m.campBiru}</p>
                    </div>
                  </div>

                  {isDone && m.metode && (
                    <div className="mt-2 text-center">
                      <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                        Hasil: {m.metode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );

            /* ── Kartu istirahat (setelah match tertentu, hanya saat tidak filter) ── */
            if (!isFiltering) {
              const br = MATCH_BREAKS.find(b => b.afterMatch === m.no);
              if (br) {
                items.push(
                  <div key={`break-${m.no}`} className="col-span-full">
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-amber-200" />
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 shrink-0">
                        <span className="text-base">🕌</span>
                        <div>
                          <p className="text-[11px] font-extrabold text-amber-700">{br.label}</p>
                          <p className="text-[9px] text-amber-500 font-semibold tabular-nums">{br.jamMulai} – {br.jamSelesai} &nbsp;·&nbsp; {br.duration}</p>
                        </div>
                      </div>
                      <div className="flex-1 h-px bg-amber-200" />
                    </div>
                  </div>
                );
              }
            }
          });

          return <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">{items}</div>;
        })()}

        {typeFilter !== "Tunggu" && filtered.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-100">
            <SearchX className="h-9 w-9 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-bold text-gray-400">Tidak ada match ditemukan</p>
            <button
              onClick={() => { setTypeFilter("Semua"); setSearch(""); setStatusFilter("Semua"); }}
              className="mt-3 text-[11px] text-[#0194f3] font-extrabold">
              Reset semua filter
            </button>
          </div>
        )}
      </div>
    </div>

    {editMatchNo !== null && (
      <MatchUpdateSheet matchNo={editMatchNo} onClose={() => setEditMatchNo(null)} />
    )}
  </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   KONTAK TAB
───────────────────────────────────────────────────────────────── */
function KontakTab() {
  const [checkStates, setCheckStates] = useState<Record<string, boolean>>({});
  const urgent = KONTAK.filter(k => (k as any).urgent);
  const regular = KONTAK.filter(k => !(k as any).urgent);

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 space-y-4">
        {/* Urgent contacts */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Kontak Darurat</p>
          </div>
          <div className="space-y-2">
            {urgent.map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-red-100 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-gray-900 leading-none">{k.role}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{k.note}</p>
                </div>
                {(k.wa || (k as any).instagram) && (
                  <a href={(k as any).instagram ? NEMPO_CONSULT_URL : `https://wa.me/${k.wa}`} target="_blank" rel="noopener noreferrer"
                    aria-label={(k as any).instagram ? `Hubungi ${k.role} via DM Instagram` : `Hubungi ${k.role} via WhatsApp`}
                    className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${(k as any).instagram ? "bg-gradient-to-br from-pink-500 to-violet-600 shadow-pink-200" : "bg-green-500 shadow-green-200"}`}>
                    {(k as any).instagram ? <Instagram className="h-3.5 w-3.5 text-white" /> : <Phone className="h-3.5 w-3.5 text-white" />}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divisi */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Pembagian Divisi & Anggota</p>
          <div className="space-y-2">
            {DIVISI.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 flex items-center gap-3" style={{ background: d.bg }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: d.color + "20" }}>
                      <Icon className="h-4 w-4" style={{ color: d.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 text-xs leading-tight">Divisi {d.name}</p>
                      <p className="text-[10px] mt-0.5 leading-tight font-semibold" style={{ color: d.color }}>{d.anggota.length} posisi</p>
                    </div>
                  </div>
                  {/* Tugas */}
                  <div className="px-4 pt-3 pb-2 space-y-1.5">
                    {d.tugas.map((t, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <p className="text-[11px] text-gray-600 leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>
                  {/* Anggota */}
                  <div className="px-4 pb-3 pt-2 border-t border-gray-50">
                    <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Anggota</p>
                    <div className="space-y-1.5">
                      {d.anggota.map((a, j) => {
                        const [label, names] = a.includes(":") ? [a.split(":")[0].trim(), a.split(":")[1].trim()] : [null, a];
                        return (
                          <div key={j} className="flex items-start gap-2">
                            {label && (
                              <span className="shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-white mt-0.5"
                                style={{ background: d.color }}>
                                {label}
                              </span>
                            )}
                            <p className="text-[11px] font-semibold text-gray-700 leading-snug">{names}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regular contacts */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Daftar Kontak Panitia</p>
          <div className="space-y-1.5">
            {regular.map((k, i) => {
              const hasName = k.name && k.name !== "—";
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: hasName ? "#EFF6FF" : "#F9FAFB" }}>
                    <Users className="h-3.5 w-3.5" style={{ color: hasName ? "#0194f3" : "#9CA3AF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-extrabold text-gray-500 leading-none uppercase tracking-wide">{k.role}</p>
                    <p className={`text-xs font-extrabold mt-0.5 leading-snug ${hasName ? "text-gray-900" : "text-gray-300 italic"}`}>
                      {hasName ? k.name : "Belum ditentukan"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{k.note}</p>
                  </div>
                  {(k.wa || (k as any).instagram) && (
                    <a href={(k as any).instagram ? NEMPO_CONSULT_URL : `https://wa.me/${k.wa}`} target="_blank" rel="noopener noreferrer"
                      aria-label={(k as any).instagram ? `Hubungi ${k.role} via DM Instagram` : `Hubungi ${k.role} via WhatsApp`}
                      className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${(k as any).instagram ? "bg-gradient-to-br from-pink-500 to-violet-600 shadow-pink-200" : "bg-green-500 shadow-green-200"}`}>
                      {(k as any).instagram ? <Instagram className="h-3.5 w-3.5 text-white" /> : <Phone className="h-3.5 w-3.5 text-white" />}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Checklist Panitia</p>
          <div className="space-y-3">
            {CHECKLIST_GROUPS.map((g, gi) => (
              <div key={gi} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-50" style={{ background: g.bg }}>
                  <p className="text-xs font-extrabold" style={{ color: g.color }}>{g.label}</p>
                </div>
                <div className="px-4 py-2.5 space-y-2">
                  {g.items.map((item, j) => {
                    const key = `${gi}-${j}`;
                    const done = checkStates[key];
                    return (
                      <button key={j} onClick={() => setCheckStates(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="w-full flex items-start gap-2.5 text-left">
                        {done
                          ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: g.color }} />
                          : <Circle className="h-4 w-4 shrink-0 mt-0.5 text-gray-300" />}
                        <p className={`text-xs leading-relaxed transition-colors ${done ? "text-gray-400 line-through" : "text-gray-700"}`}>{item}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TIKET TAB
───────────────────────────────────────────────────────────────── */
interface TicketOrder {
  id: number;
  order_code: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  qty: number;
  total_amount: number;
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  attendee_names: string[];
  created_at: string;
  confirmed_at: string | null;
  notes: string | null;
  ticket_name: string;
  ticket_price: number;
  event_name: string;
  event_date: string | null;
}

interface TicketType { id: number; name: string; price: number; quota: number; sold: number; }

const BLANK_FORM = { buyer_name: "", buyer_phone: "", buyer_email: "", ticket_id: "" };

const OTS_TICKETS = [
  { name: "Reguler", price: 30000, color: "#0194f3", bg: "#eff6ff" },
  { name: "AB",      price: 40000, color: "#7c3aed", bg: "#f5f3ff" },
  { name: "OTS",     price: 60000, color: "#dc2626", bg: "#fef2f2" },
];

function genOTSCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let c = "OTS";
  for (let i = 0; i < 7; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

function TiketTab() {
  const API = "/api";
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("semua");
  const [filterCheckin, setFilterCheckin] = useState<"semua" | "masuk" | "belum">("semua");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  /* ── form state ── */
  const [showForm, setShowForm] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [form, setForm] = useState(BLANK_FORM);
  const [qty, setQty] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [attendeeNames, setAttendeeNames] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [successCode, setSuccessCode] = useState("");

  /* ── OTS Tiketing state ── */
  const [otsOpen, setOtsOpen] = useState(false);
  const [otsPhase, setOtsPhase] = useState<"form" | "preview" | "success">("form");
  const [otsName, setOtsName] = useState("");
  const [otsPhone, setOtsPhone] = useState("");
  const [otsTicket, setOtsTicket] = useState<typeof OTS_TICKETS[0] | null>(null);
  const [otsPrice, setOtsPrice] = useState("");
  const [otsQty, setOtsQty] = useState(1);
  const [otsCode, setOtsCode] = useState("");
  const [otsSaving, setOtsSaving] = useState(false);
  const [otsErr, setOtsErr] = useState("");

  /* helper: strip non-digit, format Indonesian (300000 → "300.000") */
  function fmtAngka(raw: string): string {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("id-ID");
  }
  function parseAngka(val: string): number {
    return Number(val.replace(/[^\d]/g, "")) || 0;
  }

  function openOTS() {
    setOtsName(""); setOtsPhone(""); setOtsTicket(null);
    setOtsPrice(""); setOtsQty(1); setOtsCode(""); setOtsErr(""); setOtsPhase("form"); setOtsOpen(true);
  }

  function otsToPreview(e: React.FormEvent) {
    e.preventDefault();
    if (!otsName.trim() || !otsPhone.trim() || !otsTicket) {
      setOtsErr("Nama, No WA, dan jenis tiket wajib dipilih."); return;
    }
    setOtsErr("");
    setOtsCode(genOTSCode());
    setOtsPhase("preview");
  }

  async function otsSelesaikan() {
    if (!otsTicket) return;
    setOtsSaving(true); setOtsErr("");
    try {
      const res = await fetch(`${API}/event-orders/ots-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Crew-Key": SCAN_API_KEY },
        body: JSON.stringify({
          order_code: otsCode,
          buyer_name: otsName.trim(),
          buyer_phone: otsPhone.trim(),
          ticket_name: otsTicket.name,
          ticket_price: parseAngka(otsPrice) > 0 ? parseAngka(otsPrice) : otsTicket.price,
          qty: otsQty,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setOtsErr(d.error || "Gagal menyimpan"); setOtsPhase("preview"); return; }
      setOtsPhase("success");
      fetchOrders(true);
    } catch { setOtsErr("Koneksi gagal, coba lagi."); setOtsPhase("preview"); }
    finally { setOtsSaving(false); }
  }

  const fetchTicketTypes = useCallback(async () => {
    if (ticketTypes.length > 0) return;
    try {
      const res = await fetch(`${API}/event-orders/crew-ticket-types`, {
        headers: { "X-Crew-Key": SCAN_API_KEY },
      });
      if (res.ok) {
        const d = await res.json();
        setTicketTypes(d.tickets ?? []);
      }
    } catch {}
  }, [API, ticketTypes.length]);

  function openForm() {
    setForm(BLANK_FORM);
    setQty(1);
    setAttendeeNames([]);
    setFormErr("");
    setSuccessCode("");
    setShowForm(true);
    fetchTicketTypes();
  }

  function changeQty(n: number) {
    const v = Math.max(1, Math.min(10, n));
    setQty(v);
    setAttendeeNames(prev => {
      const arr = [...prev];
      while (arr.length < v - 1) arr.push("");
      return arr.slice(0, v - 1);
    });
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.buyer_name.trim() || !form.buyer_phone.trim() || !form.ticket_id) {
      setFormErr("Nama pemesan, No WA, dan jenis tiket wajib diisi.");
      return;
    }
    setFormErr("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/event-orders/crew-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Crew-Key": SCAN_API_KEY },
        body: JSON.stringify({
          ticket_id: Number(form.ticket_id),
          qty,
          buyer_name: form.buyer_name.trim(),
          buyer_phone: form.buyer_phone.trim(),
          buyer_email: form.buyer_email.trim(),
          attendee_names: attendeeNames.filter(Boolean),
          ...(parseAngka(customPrice) > 0 ? { custom_price: parseAngka(customPrice) } : {}),
        }),
      });
      const d = await res.json();
      if (!res.ok) { setFormErr(d.error || "Gagal menyimpan"); return; }
      setSuccessCode(d.order_code);
      await fetchOrders(true);
    } catch {
      setFormErr("Koneksi gagal, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API}/event-orders/crew-tickets`, {
        headers: { "X-Crew-Key": SCAN_API_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
        setLastSync(new Date());
      }
    } catch {}
    finally { if (!silent) setLoading(false); }
  }, [API]);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(() => fetchOrders(true), 20000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const categories = ["semua", ...Array.from(new Set(orders.map(o => o.ticket_name || "—"))).sort()];

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.buyer_name.toLowerCase().includes(q) || o.order_code.toLowerCase().includes(q) || o.buyer_phone.includes(q);
    const matchCat = filterCat === "semua" || o.ticket_name === filterCat;
    const matchCheckin = filterCheckin === "semua" || (filterCheckin === "masuk" ? o.checked_in : !o.checked_in);
    return matchSearch && matchCat && matchCheckin;
  });

  const totalQty = orders.reduce((s, o) => s + o.qty, 0);
  const totalMasuk = orders.filter(o => o.checked_in).length;
  const byCategory = categories.slice(1).map(cat => ({
    name: cat,
    count: orders.filter(o => o.ticket_name === cat).length,
    qty: orders.reduce((s, o) => s + (o.ticket_name === cat ? o.qty : 0), 0),
  }));

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#0194f3]" />
            <h2 className="text-lg font-extrabold text-gray-900">Data Tiket</h2>
          </div>
          <button onClick={() => fetchOrders()} className="flex items-center gap-1 text-[11px] font-bold text-[#0194f3]">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Sync
          </button>
        </div>
        {lastSync && (
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Auto-sync · {lastSync.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        )}

        {/* Stats row */}
        {!loading && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { n: orders.length, l: "Pemesan", c: "#0194f3", bg: "#eff6ff" },
              { n: totalQty,      l: "Total Tiket", c: "#7c3aed", bg: "#f5f3ff" },
              { n: totalMasuk,    l: "Sudah Masuk", c: "#10b981", bg: "#ecfdf5" },
              { n: orders.length - totalMasuk, l: "Belum Masuk", c: "#f59e0b", bg: "#fffbeb" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl px-2 py-2.5 text-center" style={{ background: s.bg }}>
                <p className="text-xl font-extrabold leading-none" style={{ color: s.c }}>{s.n}</p>
                <p className="text-[9px] font-bold text-gray-500 mt-0.5 leading-tight">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        {/* Kategori ringkasan */}
        {!loading && byCategory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {byCategory.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilterCat(filterCat === cat.name ? "semua" : cat.name)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  filterCat === cat.name ? "bg-[#0194f3] text-white border-[#0194f3]" : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {cat.name} <span className="opacity-70">({cat.qty} tiket)</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search + filter check-in */}
      <div className="px-4 pt-3 pb-2 space-y-2">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-3 py-2.5">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kode, atau no HP…"
            className="flex-1 text-[13px] font-medium outline-none text-gray-800 placeholder-gray-400 bg-transparent"
          />
          {search && <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex gap-1.5">
          {(["semua", "masuk", "belum"] as const).map(v => (
            <button
              key={v}
              onClick={() => setFilterCheckin(v)}
              className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                filterCheckin === v
                  ? v === "masuk" ? "bg-green-500 text-white" : v === "belum" ? "bg-amber-500 text-white" : "bg-gray-800 text-white"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {v === "semua" ? `Semua (${orders.length})` : v === "masuk" ? `✓ Masuk (${totalMasuk})` : `Belum (${orders.length - totalMasuk})`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-2">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-12 flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 text-gray-300 animate-spin" />
            <p className="text-[12px] text-gray-400">Memuat data tiket…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center">
            <SearchX className="h-8 w-8 mx-auto mb-2 text-gray-200" />
            <p className="text-[13px] font-semibold text-gray-400">Tidak ada data ditemukan</p>
            {(search || filterCat !== "semua" || filterCheckin !== "semua") && (
              <button
                onClick={() => { setSearch(""); setFilterCat("semua"); setFilterCheckin("semua"); }}
                className="mt-2 text-[11px] font-bold text-[#0194f3]"
              >
                Reset filter
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-1">
              {filtered.length} pemesan · {filtered.reduce((s, o) => s + o.qty, 0)} tiket
            </p>
            {filtered.map((o, idx) => {
              const isExpanded = expandedId === o.id;
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : o.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-gray-50 transition-colors"
                  >
                    {/* Nomor urut */}
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-[11px]"
                      style={{ background: o.checked_in ? "#dcfce7" : "#f3f4f6", color: o.checked_in ? "#16a34a" : "#9ca3af" }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-extrabold text-gray-900 truncate">{o.buyer_name}</p>
                        {o.checked_in ? (
                          <span className="flex-shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">✓ MASUK</span>
                        ) : o.status === "pending" ? (
                          <span className="flex-shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">⏳ MENUNGGU</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-[#0194f3] bg-blue-50 px-1.5 py-0.5 rounded-md">{o.ticket_name || "—"}</span>
                        <span className="text-[10px] text-gray-400">× {o.qty} tiket</span>
                        {o.notes === "ots-tiketing" && <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 py-0.5 rounded">OTS</span>}
                        {o.notes === "offline-crew" && <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1 py-0.5 rounded">OFFLINE</span>}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-300 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">Kode Pesanan</p>
                          <p className="font-extrabold font-mono text-gray-800">{o.order_code}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">No. HP</p>
                          <a href={`tel:${o.buyer_phone}`} className="font-bold text-[#0194f3]">{o.buyer_phone || "—"}</a>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">Kategori Tiket</p>
                          <p className="font-bold text-gray-800">{o.ticket_name || "—"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">Jumlah</p>
                          <p className="font-bold text-gray-800">{o.qty} tiket</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">Status Masuk</p>
                          {o.checked_in ? (
                            <p className="font-bold text-green-600">✓ Sudah Masuk</p>
                          ) : (
                            <p className="font-semibold text-gray-400">Belum Masuk</p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold mb-0.5">Dikonfirmasi</p>
                          <p className="font-bold text-gray-800">
                            {o.confirmed_at ? new Date(o.confirmed_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                          </p>
                        </div>
                      </div>
                      {o.checked_in_at && (
                        <div className="bg-green-50 rounded-xl px-3 py-2 text-[11px]">
                          <span className="font-semibold text-green-700">Scan masuk: </span>
                          <span className="font-bold text-green-800">
                            {new Date(o.checked_in_at).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      )}
                      {o.attendee_names?.length > 0 && (
                        <div className="bg-white rounded-xl px-3 py-2">
                          <p className="text-[10px] font-bold text-gray-400 mb-1">Peserta Lainnya</p>
                          {o.attendee_names.map((n, i) => (
                            <p key={i} className="text-[11px] font-semibold text-gray-700">• {n}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ── FAB stack ── */}
      <div className="fixed bottom-[72px] right-4 z-40 flex flex-col items-end gap-2">
        <button
          onClick={openOTS}
          className="flex items-center gap-2 bg-[#16a34a] text-white px-4 py-3 rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition-transform"
        >
          <QrCode className="h-4 w-4" />
          <span className="text-[12px] font-extrabold">OTS Tiketing</span>
        </button>
        <button
          onClick={openForm}
          className="flex items-center gap-2 bg-[#0194f3] text-white px-4 py-3 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[12px] font-extrabold">Tiket Offline</span>
        </button>
      </div>

      {/* ── Bottom Sheet: form tiket offline ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pb-14">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && setShowForm(false)} />

          <div className="relative bg-white rounded-t-3xl max-h-[calc(92dvh-3.5rem)] flex flex-col">
            {/* handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-[#0194f3]" />
                <h3 className="text-[15px] font-extrabold text-gray-900">Input Tiket Offline</h3>
              </div>
              <button onClick={() => !submitting && setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* sukses state */}
            {successCode ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-extrabold text-gray-900 mb-1">Tiket Berhasil Disimpan!</p>
                  <p className="text-[12px] text-gray-500 mb-3">Data langsung masuk ke daftar pemesan.</p>
                  <div className="bg-gray-50 rounded-2xl px-4 py-2 inline-block">
                    <p className="text-[10px] font-semibold text-gray-400">Kode Pesanan</p>
                    <p className="text-[16px] font-extrabold font-mono text-[#0194f3] tracking-wider">{successCode}</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => { setSuccessCode(""); setForm(BLANK_FORM); setQty(1); setAttendeeNames([]); }}
                    className="flex-1 py-3 rounded-2xl border-2 border-[#0194f3] text-[#0194f3] text-[13px] font-extrabold"
                  >
                    + Input Lagi
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-2xl bg-[#0194f3] text-white text-[13px] font-extrabold"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              /* form */
              <form onSubmit={submitForm} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                {/* Nama Pemesan */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    Nama Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.buyer_name}
                    onChange={e => setForm(f => ({ ...f, buyer_name: e.target.value }))}
                    placeholder="Nama lengkap pembeli"
                    className="w-full bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-[#0194f3] placeholder-gray-300"
                  />
                </div>

                {/* No WA */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.buyer_phone}
                    onChange={e => setForm(f => ({ ...f, buyer_phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-[#0194f3] placeholder-gray-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    Email <span className="text-gray-300 font-medium normal-case">(opsional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.buyer_email}
                    onChange={e => setForm(f => ({ ...f, buyer_email: e.target.value }))}
                    placeholder="email@contoh.com"
                    className="w-full bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-[#0194f3] placeholder-gray-300"
                  />
                </div>

                {/* Jenis Tiket */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    Jenis Tiket <span className="text-red-500">*</span>
                  </label>
                  {ticketTypes.length === 0 ? (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3">
                      <RefreshCw className="h-3.5 w-3.5 text-gray-300 animate-spin" />
                      <span className="text-[12px] text-gray-400">Memuat kategori tiket…</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ticketTypes.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => { setForm(f => ({ ...f, ticket_id: String(t.id) })); setCustomPrice(String(t.price)); }}
                          className={`w-full px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                            form.ticket_id === String(t.id)
                              ? "border-[#0194f3] bg-blue-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <span className={`text-[13px] font-extrabold ${form.ticket_id === String(t.id) ? "text-[#0194f3]" : "text-gray-700"}`}>
                            {t.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Harga Dibayar */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    Harga Dibayar <span className="text-red-500">*</span>
                    <span className="normal-case font-medium text-gray-300 ml-1">(ubah jika ada diskon)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customPrice}
                      onChange={e => setCustomPrice(fmtAngka(e.target.value))}
                      placeholder="Masukkan harga"
                      className="w-full bg-gray-50 rounded-2xl border border-gray-200 pl-10 pr-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-[#0194f3] placeholder-gray-300"
                    />
                  </div>
                </div>

                {/* Jumlah Tiket */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                    Jumlah Tiket
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => changeQty(qty - 1)}
                      disabled={qty <= 1}
                      className="w-10 h-10 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 active:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-[22px] font-extrabold text-gray-900 w-8 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(qty + 1)}
                      disabled={qty >= 10}
                      className="w-10 h-10 rounded-2xl border-2 border-[#0194f3] bg-blue-50 flex items-center justify-center text-[#0194f3] disabled:opacity-30 active:bg-blue-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] text-gray-400 font-semibold">tiket (maks. 10)</span>
                  </div>
                  {form.ticket_id && qty > 0 && (
                    <p className="mt-1.5 text-[11px] font-bold text-gray-500">
                      Total: <span className="text-gray-900">
                        Rp{((ticketTypes.find(t => String(t.id) === form.ticket_id)?.price ?? 0) * qty).toLocaleString("id-ID")}
                      </span>
                    </p>
                  )}
                </div>

                {/* Nama Peserta (jika qty > 1) */}
                {qty > 1 && (
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                      Nama Peserta Lain
                      <span className="normal-case font-medium text-gray-400 ml-1">(opsional tapi dianjurkan)</span>
                    </label>
                    <div className="space-y-2">
                      {attendeeNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#0194f3] text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                            {i + 2}
                          </div>
                          <input
                            value={name}
                            onChange={e => {
                              const arr = [...attendeeNames];
                              arr[i] = e.target.value;
                              setAttendeeNames(arr);
                            }}
                            placeholder={`Nama peserta ${i + 2}`}
                            className="flex-1 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-[12px] font-semibold text-gray-800 outline-none focus:border-[#0194f3] placeholder-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error */}
                {formErr && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <p className="text-[12px] font-semibold text-red-600">{formErr}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="pb-6 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-[#0194f3] text-white text-[14px] font-extrabold shadow-md shadow-blue-200 disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    {submitting ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan…</>
                    ) : (
                      <><Ticket className="h-4 w-4" /> Simpan Pesanan</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── OTS Tiketing Bottom Sheet ── */}
      {otsOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end pb-14">
          <div className="absolute inset-0 bg-black/50" onClick={() => !otsSaving && otsPhase !== "preview" && setOtsOpen(false)} />

          <div className="relative bg-white rounded-t-3xl max-h-[calc(95dvh-3.5rem)] flex flex-col">
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* ─── PHASE: FORM ─── */}
            {otsPhase === "form" && (
              <>
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                      <QrCode className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="text-[15px] font-extrabold text-gray-900">OTS Tiketing</h3>
                  </div>
                  <button onClick={() => setOtsOpen(false)} className="p-1 text-gray-400"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={otsToPreview} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                      Nama Pembeli <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={otsName}
                      onChange={e => setOtsName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-green-500 placeholder-gray-300"
                      autoFocus
                    />
                  </div>

                  {/* No WA */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={otsPhone}
                      onChange={e => setOtsPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-green-500 placeholder-gray-300"
                    />
                  </div>

                  {/* Pilih Tiket */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-2">
                      Jenis Tiket OTS <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {OTS_TICKETS.map(t => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => { setOtsTicket(t); setOtsPrice(String(t.price)); }}
                          className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${
                            otsTicket?.name === t.name
                              ? "border-[3px] shadow-md"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          style={otsTicket?.name === t.name ? { borderColor: t.color, background: t.bg } : {}}
                        >
                          <span className="text-[14px] font-extrabold" style={{ color: otsTicket?.name === t.name ? t.color : "#374151" }}>
                            {t.name}
                          </span>
                          <span className="text-[11px] font-bold mt-0.5" style={{ color: otsTicket?.name === t.name ? t.color : "#9ca3af" }}>
                            Rp{(t.price / 1000).toFixed(0)}k
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jumlah Tiket OTS */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                      Jumlah Tiket
                    </label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setOtsQty(q => Math.max(1, q - 1))} disabled={otsQty <= 1}
                        className="w-10 h-10 rounded-2xl border-2 border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 active:bg-gray-100">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-[22px] font-extrabold text-gray-900 w-8 text-center">{otsQty}</span>
                      <button type="button" onClick={() => setOtsQty(q => Math.min(20, q + 1))} disabled={otsQty >= 20}
                        className="w-10 h-10 rounded-2xl border-2 border-green-500 bg-green-50 flex items-center justify-center text-green-600 disabled:opacity-30 active:bg-green-100">
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] text-gray-400 font-semibold">tiket (maks. 20)</span>
                    </div>
                    {otsTicket && otsQty > 1 && (
                      <p className="mt-1.5 text-[11px] font-bold text-gray-500">
                        Total: <span className="text-gray-900">
                          Rp{((parseAngka(otsPrice) > 0 ? parseAngka(otsPrice) : otsTicket.price) * otsQty).toLocaleString("id-ID")}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Harga Aktual */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wide mb-1.5">
                      Harga per Tiket <span className="text-red-500">*</span>
                      <span className="normal-case font-medium text-gray-300 ml-1">(ubah jika ada diskon)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">Rp</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otsPrice}
                        onChange={e => setOtsPrice(fmtAngka(e.target.value))}
                        placeholder="0"
                        className="w-full bg-gray-50 rounded-2xl border border-gray-200 pl-10 pr-4 py-3 text-[13px] font-semibold text-gray-800 outline-none focus:border-green-500 placeholder-gray-300"
                      />
                    </div>
                  </div>

                  {otsErr && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <p className="text-[12px] font-semibold text-red-600">{otsErr}</p>
                    </div>
                  )}

                  <div className="pb-6">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-green-500 text-white text-[14px] font-extrabold shadow-md shadow-green-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <QrCode className="h-4 w-4" /> Buat Barcode Tiket
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ─── PHASE: QR PREVIEW ─── */}
            {otsPhase === "preview" && otsTicket && (
              <div className="flex-1 overflow-y-auto">
                {/* Branded header */}
                <div className="bg-gradient-to-br from-[#0194f3] to-[#0066cc] px-6 pt-5 pb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Temu Tarung Vol. 2</p>
                      <p className="text-white text-[18px] font-extrabold leading-tight">Nempo Organizer</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl px-3 py-1.5">
                      <span className="text-white text-[11px] font-extrabold">E-TICKET</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex-1">
                      <p className="text-white/70 text-[10px] font-semibold">Nama Pembeli</p>
                      <p className="text-white font-extrabold text-[14px]">{otsName}</p>
                    </div>
                    <div
                      className="rounded-xl px-3 py-1.5 text-center"
                      style={{ background: otsTicket.bg }}
                    >
                      <p className="text-[10px] font-bold" style={{ color: otsTicket.color }}>TIKET</p>
                      <p className="text-[13px] font-extrabold" style={{ color: otsTicket.color }}>{otsTicket.name}</p>
                      <p className="text-[10px] font-bold" style={{ color: otsTicket.color }}>Rp{otsTicket.price.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code area */}
                <div className="flex flex-col items-center px-6 py-6">
                  <div className="bg-white rounded-3xl p-4 shadow-xl shadow-gray-200 border border-gray-100 mb-4">
                    <QRCode
                      value={otsCode}
                      size={180}
                      bgColor="#ffffff"
                      fgColor="#0a0a0a"
                      level="M"
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-400 mb-1">Kode Tiket</p>
                  <p className="text-[16px] font-extrabold font-mono text-gray-800 tracking-widest mb-1">{otsCode}</p>
                  <p className="text-[10px] text-gray-400 text-center">Scan kode di atas untuk verifikasi masuk</p>
                </div>

                {/* Info strip */}
                <div className="mx-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
                  <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    Tiket belum tersimpan. Klik <strong>Selesaikan</strong> setelah pembeli membayar.
                  </p>
                </div>

                {otsErr && (
                  <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <p className="text-[12px] font-semibold text-red-600">{otsErr}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 px-6 pb-8">
                  <button
                    onClick={() => setOtsPhase("form")}
                    disabled={otsSaving}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 text-[13px] font-extrabold active:bg-gray-50 disabled:opacity-40"
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={otsSelesaikan}
                    disabled={otsSaving}
                    className="flex-[2] py-3.5 rounded-2xl bg-green-500 text-white text-[13px] font-extrabold shadow-md shadow-green-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
                  >
                    {otsSaving ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan…</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4" /> Selesaikan</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ─── PHASE: SUCCESS ─── */}
            {otsPhase === "success" && otsTicket && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-extrabold text-gray-900 mb-1">Tiket Berhasil Disimpan!</p>
                  <p className="text-[12px] text-gray-500 mb-4">Data masuk ke sistem dan siap untuk scan masuk.</p>
                  <div className="bg-gray-50 rounded-2xl px-5 py-3 inline-block mb-2">
                    <p className="text-[10px] font-semibold text-gray-400">Kode Tiket</p>
                    <p className="text-[18px] font-extrabold font-mono text-green-600 tracking-widest">{otsCode}</p>
                  </div>
                  <p className="text-[11px] text-gray-400">{otsName} · Tiket {otsTicket.name}</p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => { setOtsPhase("form"); setOtsName(""); setOtsPhone(""); setOtsTicket(null); setOtsCode(""); }}
                    className="flex-1 py-3 rounded-2xl border-2 border-green-500 text-green-600 text-[13px] font-extrabold"
                  >
                    + Pembeli Berikutnya
                  </button>
                  <button
                    onClick={() => setOtsOpen(false)}
                    className="flex-1 py-3 rounded-2xl bg-green-500 text-white text-[13px] font-extrabold"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BOTTOM NAV
───────────────────────────────────────────────────────────────── */
type Tab = "beranda" | "rundown" | "skema" | "kontak" | "info" | "vvip" | "talkshow" | "panco" | "konsumsi" | "akomodasi" | "scan" | "tiket";
const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "tiket",   label: "Tiket",   icon: Ticket },
  { id: "rundown", label: "Rundown", icon: Calendar },
  { id: "scan",    label: "Scan",    icon: QrCode },
  { id: "kontak",  label: "Kontak",  icon: Phone },
];

function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-inset-bottom">
      <div className="max-w-6xl mx-auto flex">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors"
            >
              <Icon className={`h-5 w-5 stroke-[2] ${isActive ? "text-[#0194f3]" : "text-gray-400"}`} />
              <span className={`text-[10px] font-bold ${isActive ? "text-[#0194f3]" : "text-gray-400"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PORTAL APP
───────────────────────────────────────────────────────────────── */
function TemuTarungPortal({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("beranda");

  return (
    <div className="min-h-[100dvh] bg-[#f3f4f6]">
      <TopBar onLogout={onLogout} />
      <InfoTicker />

      <div className="pb-20 max-w-6xl mx-auto">
        {tab === "beranda" && <BerandaTab onNav={t => setTab(t as Tab)} />}
        {tab === "info"     && <InfoTab onBack={() => setTab("beranda")} />}
        {tab === "vvip"     && <VvipTab onBack={() => setTab("beranda")} />}
        {tab === "talkshow" && <TalkshowTab onBack={() => setTab("beranda")} />}
        {tab === "panco"      && <PancoTab onBack={() => setTab("beranda")} />}
        {tab === "konsumsi"   && <KonsumsiTab onBack={() => setTab("beranda")} />}
        {tab === "akomodasi"  && <AkomodasiTab onBack={() => setTab("beranda")} />}
        {tab === "scan"       && <ScanTab onBack={() => setTab("beranda")} />}
        {tab === "tiket"      && <TiketTab />}
        {tab === "rundown"  && <RundownTab />}
        {tab === "skema" && <SkemaTab />}
        {tab === "kontak" && <KontakTab />}
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ROOT PAGE
───────────────────────────────────────────────────────────────── */
export default function CrewPage() {
  const [auth, setAuth] = useState(() => !!localStorage.getItem(CREW_KEY));
  const isPreview = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";

  useEffect(() => {
    if (isPreview && !auth) setAuth(true);
  }, [isPreview]);

  if (!auth) return <CrewGate onUnlock={() => setAuth(true)} />;
  return <TemuTarungPortal onLogout={() => { localStorage.removeItem(CREW_KEY); setAuth(false); }} />;
}
