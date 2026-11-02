import { Layout } from "@/components/layout";
import { CafeReservation } from "@/components/cafe-reservation";
import { EventShare } from "@/components/event-share";
import { EventLocation } from "@/components/event-location";
import { EventSaweran } from "@/components/event-saweran";
import { Button } from "@/components/ui/button";
import { GOOD_STORY_CAFE_MAP } from "@/data/event-location";
import { cafeJamRange } from "@/data/cafe-layout";
import { SEO } from "@/components/seo";
import { useState, useEffect, useRef } from "react";
import { toSnake } from "@/lib/api-keys";
import { extractPosterPalette, type PosterPalette } from "@/lib/poster-palette";

import { useRoute, Link } from "@/lib/wouter";
import { getTypeLabel, getAgeLabel, TYPE_COLORS, getMatchJam, streetFightDay1, streetFightDay1Peserta, RUNDOWN_DAY1, RUNDOWN_DAY2 } from "@/data/temu-tarung";
import { useMatchContext } from "@/contexts/match-context";
import { usePancoContext } from "@/contexts/panco-context";
import type { MatchItem, RundownItem } from "@/data/temu-tarung";
import {
  MapPin, Calendar, ArrowLeft, Ticket,
  Users, Star, ShieldAlert, Clock, Car, Train, Navigation,
  Crown, CheckCircle2, Info, Minus, Plus,
  Swords, HeartPulse, SearchX, Dumbbell, Flame, Moon, HandHeart, ArrowDown,
} from "lucide-react";

const API = "/api";

const catMeta: Record<string, { from: string; to: string; light: string; chip: string }> = {
  Budaya:      { from: "#7c3aed", to: "#a78bfa", light: "#f5f3ff", chip: "#ede9fe" },
  Musik:       { from: "#db2777", to: "#f472b6", light: "#fdf2f8", chip: "#fce7f3" },
  Olahraga:   { from: "#059669", to: "#34d399", light: "#f0fdf4", chip: "#dcfce7" },
  Edukasi:    { from: "#2563eb", to: "#60a5fa", light: "#eff6ff", chip: "#dbeafe" },
  Kuliner:    { from: "#d97706", to: "#fbbf24", light: "#fffbeb", chip: "#fef3c7" },
  Perlombaan: { from: "#dc2626", to: "#f87171", light: "#fff1f2", chip: "#ffe4e6" },
};
const DEFAULT_G = { from: "#6b7280", to: "#9ca3af", light: "#f9fafb", chip: "#f3f4f6" };

interface GuestStar   { name: string; role: string; note?: string; photo?: string }
interface RundownSession { time: string; title: string; note?: string }
interface RundownDay  { day: number; date: string; sessions: RundownSession[] }
interface TransRoute  { from: string; duration: string; icon: string; options: string[] }

interface ApiEvent {
  id: number; slug: string; name: string; category: string; date: string; date_end?: string;
  time_start?: string; time_end?: string;
  location: string; image: string; description: string; price: number;
  organizer: string; organizer_ig?: string; featured: boolean; allow_voucher?: boolean;
  guest_stars?: GuestStar[]; prohibited_items?: string[];
  rundown?: RundownDay[]; maps_url?: string; transportation_info?: TransRoute[];
  menu_items?: { name: string; price: number; note?: string }[];
  payment_info?: { bank_name?: string; bank_account_no?: string; bank_account_name?: string; qr_image?: string };
}
interface EventTicket {
  id: number; event_id: number; name: string; description: string;
  price: number; quota: number; sold: number;
  sale_start: string | null; sale_end: string | null;
  sort_order: number; active: boolean;
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}
function fmtEventDate(d?: string, dEnd?: string) {
  if (!d) return "TBA";
  const fmt = (s: string) => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const fmtDay = (s: string) => new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long" });
  if (!dEnd || dEnd === d || dEnd === "") return fmt(d);
  const startD = new Date(d), endD = new Date(dEnd);
  if (startD.getMonth() === endD.getMonth() && startD.getFullYear() === endD.getFullYear())
    return `${startD.getDate()}–${fmt(dEnd)}`;
  return `${fmtDay(d)} – ${fmt(dEnd)}`;
}

function getPhaseMeta(name: string): { label: string; bg: string; text: string } | null {
  const n = name.toLowerCase();
  if (n.includes("early bird")) return { label: "Early Bird", bg: "#dcfce7", text: "#15803d" };
  if (n.includes("presale 2"))  return { label: "Presale 2",  bg: "#dbeafe", text: "#1d4ed8" };
  if (n.includes("ots"))        return { label: "On The Spot", bg: "#f3f4f6", text: "#374151" };
  return null;
}

/* ─── Ticket Card (light theme) ─── */
function TicketCard({ t, isActive, disabled, qty, onSelect, onQtyChange, sisa, accent, isVipGroup, isPast }: {
  t: EventTicket; isActive: boolean; disabled: boolean; qty: number;
  onSelect: () => void; onQtyChange: (n: number) => void; sisa: number;
  accent: string; isVipGroup: boolean; isPast?: boolean;
}) {
  const now        = new Date();
  const start      = t.sale_start ? new Date(t.sale_start) : null;
  const end        = t.sale_end   ? new Date(t.sale_end + "T23:59:59") : null;
  const habis      = t.sold >= t.quota;
  const belumBuka  = !!start && now < start;
  const sudahTutup = !!end && now > end;

  const statusBg   = isPast ? "#f3f4f6" : habis ? "#fee2e2" : belumBuka ? "#dbeafe" : "#f3f4f6";
  const statusText = isPast ? "#6b7280" : habis ? "#b91c1c" : belumBuka ? "#1d4ed8" : "#6b7280";
  const statusLabel = isPast ? "Event Selesai" : habis ? "Habis" : belumBuka ? "Belum Dibuka" : sudahTutup ? "Berakhir" : null;

  const phase = getPhaseMeta(t.name);
  const displayName = t.name.replace(/^vip\s*/i, "");

  const vipAccent = "#b45309";
  const borderColor = disabled ? "#e5e7eb" : isActive ? (isVipGroup ? vipAccent : accent) : "#e5e7eb";
  const bgColor = isActive
    ? (isVipGroup ? "#fffbeb" : `${accent}0d`)
    : isVipGroup ? "#fefce8" : "#ffffff";

  return (
    <div
      onClick={() => !disabled && onSelect()}
      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 ${disabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}`}
      style={{ borderColor, background: bgColor }}
    >
      {isActive && !disabled && (
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: isVipGroup ? vipAccent : accent }} />
      )}

      <div className="px-4 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <p className="font-extrabold text-sm text-gray-900 leading-tight">{displayName}</p>
            {phase && !statusLabel && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: phase.bg, color: phase.text }}>{phase.label}</span>
            )}
            {statusLabel && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: statusBg, color: statusText }}>{statusLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(t.sale_start || t.sale_end) && (
              <p className="text-gray-400 text-[10px] flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5 shrink-0" />
                {t.sale_start && t.sale_end
                  ? `${fmtDateShort(t.sale_start)} – ${fmtDateShort(t.sale_end)}`
                  : t.sale_start ? `Mulai ${fmtDateShort(t.sale_start)}` : `s/d ${fmtDateShort(t.sale_end!)}`}
              </p>
            )}
            {!disabled && sisa > 0 && (
              <p className="text-gray-300 text-[10px]">· Sisa {sisa.toLocaleString("id")}</p>
            )}
            {belumBuka && start && (
              <p className="text-blue-400 text-[10px]">Dibuka {fmtDateShort(t.sale_start!)}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-extrabold text-base tabular-nums text-gray-900">
            {t.price === 0 ? "Gratis" : `Rp${t.price.toLocaleString("id")}`}
          </p>
          {isActive && !disabled && (
            <div className="flex items-center gap-1.5 mt-2 justify-end">
              <button onClick={e => { e.stopPropagation(); onQtyChange(Math.max(0, qty - 1)); }}
                className="w-6 h-6 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                <Minus className="h-3 w-3 text-gray-500" />
              </button>
              <span className="font-extrabold text-sm text-gray-900 w-5 text-center tabular-nums">{qty}</span>
              <button onClick={e => { e.stopPropagation(); onQtyChange(Math.min(Math.max(1, sisa), qty + 1)); }}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm text-white"
                style={{ background: isVipGroup ? vipAccent : accent }}>
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isActive && !disabled && (
        <div className="mx-4 mb-3 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ background: isVipGroup ? "#fef3c7" : `${accent}15` }}>
          <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: isVipGroup ? vipAccent : accent }} />
          <p className="text-[11px] font-bold" style={{ color: isVipGroup ? vipAccent : accent }}>
            Terpilih · {qty} tiket · Total Rp{(t.price * qty).toLocaleString("id")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar Widget (light) ─── */
function BookingWidget({ event, tickets, selTicket, qty, g, isPast }: {
  event: ApiEvent; tickets: EventTicket[]; selTicket: number | null; qty: number;
  g: typeof DEFAULT_G; isPast: boolean;
}) {
  const ticket = tickets.find(t => t.id === selTicket) ?? null;
  const total  = ticket ? ticket.price * qty : 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg sticky top-28 bg-white">
      {/* Color top bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(to right, ${g.from}, ${g.to})` }} />

      <div className="px-5 pt-5 pb-3">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Harga Tiket</p>
        <p className="font-extrabold text-2xl text-gray-900">
          {ticket
            ? (ticket.price === 0 ? "GRATIS" : `Rp ${ticket.price.toLocaleString("id")}`)
            : tickets.length > 0 ? "Pilih Tiket ↓"
            : (event.price === 0 ? "GRATIS" : `Rp ${event.price.toLocaleString("id")}`)}
        </p>
        {ticket && ticket.price > 0 && <p className="text-gray-400 text-xs mt-0.5">per orang</p>}
      </div>

      {/* Perforation */}
      <div className="relative h-5 mx-0">
        <div className="absolute inset-y-0 left-4 right-4 flex items-center">
          <div className="flex-1 border-t-2 border-dashed border-gray-100" />
        </div>
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-50 border border-gray-100" />
        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-50 border border-gray-100" />
      </div>

      <div className="px-5 pb-3 space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <span className="text-gray-400">Event</span>
          <span className="text-gray-800 font-semibold text-right truncate max-w-[55%]">{event.name}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-gray-400">Tanggal</span>
          <span className="text-gray-800 font-semibold">{fmtEventDate(event.date, event.date_end)}</span>
        </div>
        {ticket && qty > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-400">Tiket</span>
            <span className="text-gray-800 font-semibold">{ticket.name} × {qty}</span>
          </div>
        )}
        {ticket && ticket.price > 0 && (
          <div className="flex justify-between gap-2 pt-2 border-t border-gray-100">
            <span className="text-gray-600 font-semibold">Total</span>
            <span className="font-extrabold text-base" style={{ color: g.from }}>Rp {total.toLocaleString("id")}</span>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-2">
        {isPast ? (
          <button disabled className="w-full py-3.5 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed">
            <Ticket className="h-4 w-4 text-gray-400" />
            <p className="text-gray-400 text-sm font-extrabold">Event Telah Berakhir</p>
          </button>
        ) : ticket && qty === 0 ? (
          <div className="w-full py-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center gap-2">
            <p className="text-gray-400 text-xs font-semibold">Tambah jumlah tiket terlebih dulu</p>
          </div>
        ) : (
          <Link href={`/event/${event.slug}/checkout${ticket ? `?ticket=${ticket.id}&qty=${qty}` : ""}`}>
            <button className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] shadow-lg"
              style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: `0 8px 20px -6px ${g.from}60` }}>
              <Ticket className="h-4 w-4" />
              {!ticket ? "Pesan Tiket" : ticket.price === 0 ? "Daftar Gratis" : `Pesan ${qty} Tiket`}
            </button>
          </Link>
        )}
        <p className="text-gray-300 text-[10px] text-center mt-2 leading-relaxed">
          {isPast ? "Penjualan tiket ditutup karena event sudah selesai" : "Tiket dikirim via WhatsApp · Refund sesuai kebijakan"}
        </p>
      </div>
    </div>
  );
}


/* ─── AtletTab constants ───────────────────────────────────────────── */
const JENIS_PEKERJAAN = [
  { kode:"P060", nama:"ATLET" },
  { kode:"P072", nama:"PESERTA BAKAT DAN MINAT" },
  { kode:"P052", nama:"PESERTA MAGANG" },
  { kode:"P053", nama:"SISWA KELAS PRAKTEK" },
  { kode:"P035", nama:"GURU" },
  { kode:"P034", nama:"DOSEN" },
  { kode:"P040", nama:"DOKTER" },
  { kode:"P041", nama:"BIDAN" },
  { kode:"P042", nama:"APOTEKER" },
  { kode:"P076", nama:"PERAWAT" },
  { kode:"P043", nama:"PSIKIATER/PSIKOLOG" },
  { kode:"P074", nama:"DOKTER GIGI" },
  { kode:"P080", nama:"TEKNISI LAB MEDIK" },
  { kode:"P081", nama:"TENAGA KESEHATAN LINGKUNGAN" },
  { kode:"P082", nama:"TENAGA TEKNIS KEFARMASIAN" },
  { kode:"P078", nama:"PSIKOLOGI KLINIS" },
  { kode:"P050", nama:"PEDAGANG" },
  { kode:"P110", nama:"PEMASAR" },
  { kode:"P121", nama:"PEKERJA DIGITAL" },
  { kode:"P047", nama:"SOPIR" },
  { kode:"P111", nama:"OJEK PANGKALAN" },
  { kode:"P071", nama:"MITRA GOJEK-GO LIFE" },
  { kode:"P112", nama:"MITRA LALAMOVE" },
  { kode:"P113", nama:"MITRA INDRIVER" },
  { kode:"P128", nama:"MITRA MAXIM" },
  { kode:"P132", nama:"MITRA GRAB" },
  { kode:"P095", nama:"MITRA SHOPEE" },
  { kode:"P114", nama:"KURIR" },
  { kode:"P062", nama:"TUKANG PARKIR" },
  { kode:"P063", nama:"TUKANG PIJAT" },
  { kode:"P010", nama:"TUKANG CUKUR" },
  { kode:"P011", nama:"TUKANG LISTRIK" },
  { kode:"P012", nama:"TUKANG BATU" },
  { kode:"P013", nama:"TUKANG KAYU" },
  { kode:"P099", nama:"TUKANG BANGUNAN" },
  { kode:"P014", nama:"TUKANG SOL SEPATU" },
  { kode:"P015", nama:"TUKANG LAS/PANDAI BESI" },
  { kode:"P016", nama:"TUKANG JAHIT" },
  { kode:"P109", nama:"TUKANG CUCI" },
  { kode:"P100", nama:"TUKANG KEBUN/PETUGAS RUMPUT" },
  { kode:"P068", nama:"TUKANG SAMPAH" },
  { kode:"P020", nama:"PENATA RAMBUT" },
  { kode:"P019", nama:"PENATA BUSANA" },
  { kode:"P018", nama:"PENATA RIAS" },
  { kode:"P021", nama:"MEKANIK" },
  { kode:"P103", nama:"PENGRAJIN" },
  { kode:"P102", nama:"PENENUN" },
  { kode:"P022", nama:"SENIMAN" },
  { kode:"P032", nama:"JURU MASAK" },
  { kode:"P033", nama:"PROMOTOR ACARA" },
  { kode:"P044", nama:"PENYIAR RADIO" },
  { kode:"P036", nama:"PENGACARA" },
  { kode:"P037", nama:"NOTARIS" },
  { kode:"P038", nama:"ARSITEK" },
  { kode:"P039", nama:"KONSULTAN" },
  { kode:"P046", nama:"PENELITI" },
  { kode:"P030", nama:"WARTAWAN" },
  { kode:"P084", nama:"SEKRETARIS" },
  { kode:"P083", nama:"ADMINISTRASI" },
  { kode:"P085", nama:"LOGISTIK" },
  { kode:"P086", nama:"PETUGAS KEAMANAN" },
  { kode:"P101", nama:"PETUGAS KEBERSIHAN" },
  { kode:"P130", nama:"PETUGAS PEMAKAMAN" },
  { kode:"P131", nama:"PETANI" },
  { kode:"P006", nama:"BURUH TANI/PERKEBUNAN" },
  { kode:"P007", nama:"BURUH NELAYAN/PERIKANAN" },
  { kode:"P008", nama:"BURUH PETERNAKAN" },
  { kode:"P066", nama:"BURUH BONGKAR MUAT/BAGASI" },
  { kode:"P089", nama:"PENGOLAH IKAN" },
  { kode:"P090", nama:"PEMBUDIDAYA IKAN" },
  { kode:"P091", nama:"PETAMBAK GARAM" },
  { kode:"P069", nama:"PEMULUNG" },
  { kode:"P064", nama:"PENGAMEN" },
  { kode:"P070", nama:"MARBOT MASJID" },
  { kode:"P009", nama:"PEKERJA RUMAH TANGGA" },
  { kode:"P108", nama:"DAILY WORKER HOTEL" },
  { kode:"P054", nama:"TENAGA HONORER" },
  { kode:"P067", nama:"RELAWAN TAGANA/RELAWAN BENCANA" },
  { kode:"P107", nama:"RELAWAN BAZNAS" },
  { kode:"P118", nama:"PEMANDU WISATA" },
  { kode:"P027", nama:"IMAM MASJID" },
  { kode:"P028", nama:"PENDETA" },
  { kode:"P029", nama:"PASTOR" },
  { kode:"P031", nama:"USTADZ/MUBALIGH" },
  { kode:"P023", nama:"TABIB" },
  { kode:"P024", nama:"PARAJI" },
  { kode:"P105", nama:"PANDITA/PEMANGKU" },
  { kode:"P025", nama:"PERANCANG BUSANA" },
  { kode:"P045", nama:"PELAUT" },
  { kode:"P048", nama:"PIALANG" },
  { kode:"P049", nama:"PARANORMAL" },
  { kode:"P026", nama:"PENTERJEMAH" },
  { kode:"P092", nama:"AGENSI" },
  { kode:"P096", nama:"AGEN BULOG" },
  { kode:"P098", nama:"MANDIRI AGEN" },
  { kode:"P106", nama:"AGEN POS" },
  { kode:"P116", nama:"AGEN BRI LAKU PANDAI" },
  { kode:"P117", nama:"CS RANGER POS INDONESIA" },
  { kode:"P017", nama:"TUKANG GIGI" },
  { kode:"P004", nama:"TRANSPORTASI" },
  { kode:"P055", nama:"NARAPIDANA DALAM PROSES ASIMILASI" },
];
const LOKASI_PEKERJAAN = [
  { kode:"3205", nama:"Kab. Garut" },
  { kode:"3273", nama:"Kota Bandung" },
  { kode:"3204", nama:"Kab. Bandung" },
  { kode:"3217", nama:"Kab. Bandung Barat" },
  { kode:"3277", nama:"Kota Cimahi" },
  { kode:"3275", nama:"Kota Bekasi" },
  { kode:"3216", nama:"Kab. Bekasi" },
  { kode:"3271", nama:"Kota Bogor" },
  { kode:"3201", nama:"Kab. Bogor" },
  { kode:"3276", nama:"Kota Depok" },
  { kode:"3272", nama:"Kota Sukabumi" },
  { kode:"3202", nama:"Kab. Sukabumi" },
  { kode:"3203", nama:"Kab. Cianjur" },
  { kode:"3215", nama:"Kab. Karawang" },
  { kode:"3214", nama:"Kab. Purwakarta" },
  { kode:"3213", nama:"Kab. Subang" },
  { kode:"3211", nama:"Kab. Sumedang" },
  { kode:"3206", nama:"Kab. Tasikmalaya" },
  { kode:"3278", nama:"Kota Tasikmalaya" },
  { kode:"3207", nama:"Kab. Ciamis" },
  { kode:"3279", nama:"Kota Banjar" },
  { kode:"3218", nama:"Kab. Pangandaran" },
  { kode:"3209", nama:"Kab. Cirebon" },
  { kode:"3274", nama:"Kota Cirebon" },
  { kode:"3210", nama:"Kab. Majalengka" },
  { kode:"3208", nama:"Kab. Kuningan" },
  { kode:"3212", nama:"Kab. Indramayu" },
  { kode:"3171", nama:"Jakarta Selatan" },
  { kode:"3172", nama:"Jakarta Timur" },
  { kode:"3173", nama:"Jakarta Pusat" },
  { kode:"3174", nama:"Jakarta Barat" },
  { kode:"3175", nama:"Jakarta Utara" },
  { kode:"0000", nama:"Lainnya" },
];
const KODE_PAKET = [
  { kode:"T", ket:"JKM, JKK" },
  { kode:"L", ket:"JKM, JKK, JHT" },
];
const BULAN_IURAN = [
  { kode:"1",  ket:"1 BLN" },
  { kode:"2",  ket:"2 BLN" },
  { kode:"3",  ket:"3 BLN" },
  { kode:"6",  ket:"6 BLN" },
  { kode:"12", ket:"12 BLN" },
];
const NAMA_BANK_LIST = [
  { kode:"002", nama:"BANK BRI" },
  { kode:"008", nama:"BANK MANDIRI" },
  { kode:"009", nama:"BANK BNI" },
  { kode:"019", nama:"BANK BCA" },
  { kode:"200", nama:"BTN (BANK TABUNGAN NEGARA)" },
  { kode:"011", nama:"BANK DANAMON" },
  { kode:"013", nama:"BANK DANAMON UNIT SYARIAH" },
  { kode:"014", nama:"BANK PERMATA SYARIAH" },
  { kode:"018", nama:"BANK PERMATA" },
  { kode:"022", nama:"CIMB NIAGA" },
  { kode:"032", nama:"CIMB NIAGA UNIT USAHA SYARIAH" },
  { kode:"023", nama:"MAYBANK INDONESIA" },
  { kode:"022", nama:"MAYBANK INDONESIA UNIT SYARIAH" },
  { kode:"028", nama:"BANK PANIN" },
  { kode:"031", nama:"BANK PANIN DUBAI SYARIAH" },
  { kode:"033", nama:"BANK UOB INDONESIA" },
  { kode:"037", nama:"BANK OCBC NISP" },
  { kode:"040", nama:"AMERICAN EXPRESS BANK LTD" },
  { kode:"041", nama:"CITIBANK" },
  { kode:"042", nama:"JPMORGAN CHASE BANK" },
  { kode:"050", nama:"BANK OF AMERICA" },
  { kode:"054", nama:"BANK ARTHA GRAHA INTERNASIONAL" },
  { kode:"060", nama:"BANGKOK BANK PUBLIC CO. LTD." },
  { kode:"076", nama:"BANK BUMI ARTHA" },
  { kode:"095", nama:"BANK MIZUHO INDONESIA" },
  { kode:"097", nama:"STANDARD CHARTERED BANK" },
  { kode:"098", nama:"BANK MAYAPADA" },
  { kode:"110", nama:"BANK BJB" },
  { kode:"111", nama:"BANK DKI JAKARTA" },
  { kode:"112", nama:"BANK DKI JAKARTA UNIT SYARIAH" },
  { kode:"113", nama:"BANK BPD DIY" },
  { kode:"114", nama:"BANK BPD DIY UNIT SYARIAH" },
  { kode:"115", nama:"BANK JATENG" },
  { kode:"116", nama:"BANK JATENG UNIT SYARIAH" },
  { kode:"117", nama:"BANK JATIM" },
  { kode:"118", nama:"BANK JATIM UNIT SYARIAH" },
  { kode:"119", nama:"BANK JAMBI UNIT SYARIAH" },
  { kode:"120", nama:"BANK JAMBI" },
  { kode:"121", nama:"BANK ACEH" },
  { kode:"122", nama:"BANK ACEH SYARIAH" },
  { kode:"123", nama:"BANK SUMBAR (BANK NAGARI)" },
  { kode:"124", nama:"BANK RIAU KEPRI SYARIAH" },
  { kode:"125", nama:"BANK SUMSEL BABEL" },
  { kode:"126", nama:"BANK SUMSEL BABEL UNIT SYARIAH" },
  { kode:"127", nama:"BANK LAMPUNG" },
  { kode:"128", nama:"BANK KALSEL UNIT SYARIAH" },
  { kode:"129", nama:"BANK KALSEL" },
  { kode:"130", nama:"BANK KALBAR UNIT SYARIAH" },
  { kode:"131", nama:"BANK KALBAR" },
  { kode:"132", nama:"BANK KALTIMTARA" },
  { kode:"133", nama:"BANK KALTIMTARA UNIT SYARIAH" },
  { kode:"134", nama:"BANK KALTENG" },
  { kode:"135", nama:"BANK SULUTGO" },
  { kode:"136", nama:"BANK NTB SYARIAH" },
  { kode:"137", nama:"BANK BPD BALI" },
  { kode:"138", nama:"BANK NTT" },
  { kode:"139", nama:"BANK MALUKU" },
  { kode:"140", nama:"BANK SULTENG" },
  { kode:"141", nama:"BANK BENGKULU" },
  { kode:"142", nama:"BANK BANTEN" },
  { kode:"143", nama:"BANK OF INDIA INDONESIA" },
  { kode:"147", nama:"BANK MUAMALAT" },
  { kode:"150", nama:"BANK MESTIKA" },
  { kode:"151", nama:"SHINHAN INDONESIA" },
  { kode:"152", nama:"BANK SINARMAS" },
  { kode:"153", nama:"NANOBANK SYARIAH" },
  { kode:"154", nama:"BANK MASPION" },
  { kode:"164", nama:"BANK GANESHA" },
  { kode:"184", nama:"BANK ICBC" },
  { kode:"212", nama:"BANK WOORI SAUDARA" },
  { kode:"426", nama:"BANK MEGA" },
  { kode:"431", nama:"BANK KB BUKOPIN" },
  { kode:"451", nama:"BCA SYARIAH JAKARTA" },
  { kode:"490", nama:"BANK NEO COMMERCE" },
  { kode:"501", nama:"NOBU (NATIONAL NOBU BANK)" },
  { kode:"513", nama:"BANK JAGO" },
  { kode:"517", nama:"BANK DIGITAL BCA" },
  { kode:"535", nama:"SEABANK INDONESIA" },
  { kode:"536", nama:"BANK ALADIN SYARIAH" },
  { kode:"558", nama:"BANK INDEX SELINDO" },
  { kode:"562", nama:"BANK FAMA INTERNATIONAL" },
  { kode:"564", nama:"BANK VICTORIA INTERNATIONAL" },
  { kode:"567", nama:"ALLO BANK INDONESIA" },
  { kode:"587", nama:"BPR IBK INDONESIA" },
  { kode:"549", nama:"CTBC (CHINATRUST) INDONESIA" },
  { kode:"000", nama:"LAINNYA" },
];
const BPJS_EMPTY = {
  match_no: "",
  jenis_peserta: "dewasa",
  nomor_identitas: "",
  nama_lengkap: "",
  tempat_lahir: "",
  tgl_lahir: "",
  handphone: "",
  email: "",
};

/* ─── PancoPublicTab ─────────────────────────────────────────────────── */
function resolveWinnerPublic(name: string, matchMap: Map<number, MatchItem>): string {
  const m = name.match(/^Winner Match (\d+)$/);
  if (!m) return name;
  const src = matchMap.get(Number(m[1]));
  if (!src || !src.pemenang) return "TBD";
  const winner = src.pemenang === "merah" ? src.merah : src.biru;
  return resolveWinnerPublic(winner, matchMap);
}

/* ─── Bracket diagram layout constants ─────────────────────────────── */
const BK = { MH: 54, MW: 104, G: 10, CW: 26 };
const BK_U    = BK.MH + BK.G;           // 64
const BK_HALF = BK.MH / 2;              // 27
const BK_H    = 4 * BK_U - BK.G;        // 246

function bkTop(i: number) { return i * BK_U; }
function bkCtr(top: number) { return top + BK_HALF; }
function bkSfTop(pair: number) {
  return (bkCtr(bkTop(pair * 2)) + bkCtr(bkTop(pair * 2 + 1))) / 2 - BK_HALF;
}
function bkFinalTop() {
  return (bkCtr(bkSfTop(0)) + bkCtr(bkSfTop(1))) / 2 - BK_HALF;
}
function bkCol(n: number) { return n * (BK.MW + BK.CW); }

function BracketCard({ m, matchMap, color }: {
  m: MatchItem; matchMap: Map<number, MatchItem>; color: string;
}) {
  const mr = resolveWinnerPublic(m.merah, matchMap);
  const br = resolveWinnerPublic(m.biru,  matchMap);
  const mw = m.pemenang === "merah";
  const bw = m.pemenang === "biru";
  function trim(n: string) {
    if (n === "TBD") return "…";
    const p = n.split(" ");
    return p.length > 2 ? p[0] + " " + p[1] : n;
  }
  return (
    <div style={{ width: BK.MW, height: BK.MH }}
      className="absolute bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {m.pemenang && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />
      )}
      {m.status === "berlangsung" && !m.pemenang && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-orange-400 animate-pulse" />
      )}
      {/* Merah */}
      <div className="flex items-center gap-1 px-1.5 border-b border-gray-100"
        style={{ height: BK_HALF, background: mw ? "#fef2f2" : undefined }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
        <span className={`text-[8.5px] font-semibold truncate flex-1 ${
          mr === "TBD" ? "text-gray-300 italic" : mw ? "text-red-700 font-bold" : "text-gray-800"}`}>
          {trim(mr)}
        </span>
        {mw && <span className="text-[9px] leading-none">👑</span>}
      </div>
      {/* Biru */}
      <div className="flex items-center gap-1 px-1.5"
        style={{ height: BK_HALF, background: bw ? "#eff6ff" : undefined }}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
        <span className={`text-[8.5px] font-semibold truncate flex-1 ${
          br === "TBD" ? "text-gray-300 italic" : bw ? "text-blue-700 font-bold" : "text-gray-800"}`}>
          {trim(br)}
        </span>
        {bw && <span className="text-[9px] leading-none">👑</span>}
      </div>
      <div className="absolute bottom-0 right-1 text-[6px] text-gray-300 font-bold leading-tight">
        #{m.no}
      </div>
    </div>
  );
}

function BracketConnSvg({ ax, ay, bx, by, tx, ty, dash }: {
  ax: number; ay: number; bx: number; by: number; tx: number; ty: number; dash?: boolean;
}) {
  const midX = (ax + tx) / 2;
  return (
    <g stroke="#c7ccd4" strokeWidth="1.4" fill="none" strokeLinecap="round"
      strokeDasharray={dash ? "3,3" : undefined}>
      <line x1={ax} y1={ay} x2={midX} y2={ay} />
      <line x1={bx} y1={by} x2={midX} y2={by} />
      <line x1={midX} y1={ay} x2={midX} y2={by} />
      <line x1={midX} y1={ty} x2={tx} y2={ty} />
    </g>
  );
}

const KELAS_CFG_PUB = [
  { key: "ringan" as const, label: "Putra Ringan", sub: "≤ 60 kg",    prefix: "Panco Putra Ringan", color: "#f59e0b" },
  { key: "berat"  as const, label: "Putra Berat",  sub: "> 61–85 kg", prefix: "Panco Putra Berat",  color: "#dc2626" },
];

function BracketDiagram({ kelasMtch, matchMap, color, isRingan }: {
  kelasMtch: MatchItem[]; matchMap: Map<number, MatchItem>; color: string; isRingan: boolean;
}) {
  const prelim = kelasMtch.filter(m => m.kategori.includes("Preliminary"));
  const b1     = kelasMtch.filter(m => m.kategori.includes("Babak 1"));
  const sf     = kelasMtch.filter(m => m.kategori.includes("Semifinal"));
  const fi     = kelasMtch.filter(m => m.kategori.includes("Final") && !m.kategori.includes("Semi"));

  const offset  = isRingan ? 1 : 0;
  const numCols = isRingan ? 4 : 3;
  const totalW  = numCols * BK.MW + numCols * BK.CW;

  const b1Tops = [0,1,2,3].map(bkTop);
  const sfTops = [0,1].map(bkSfTop);
  const fiTop  = bkFinalTop();

  // SVG right-edge and left-edge helpers
  const rEdge = (col: number) => bkCol(col) + BK.MW;
  const lEdge = (col: number) => bkCol(col);

  const LABEL_H = 18;
  const labels = isRingan
    ? ["Prelim", "Babak 1", "Semifinal", "Final"]
    : ["Babak 1", "Semifinal", "Final"];

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div style={{ width: totalW, minWidth: totalW, position: "relative", height: BK_H + LABEL_H + 4 }}>
        {/* Round labels */}
        {labels.map((lbl, i) => (
          <div key={lbl} style={{
            position: "absolute",
            left: bkCol(i),
            top: 0,
            width: BK.MW,
            textAlign: "center",
          }} className="text-[8px] font-extrabold uppercase tracking-wider text-gray-400">
            {lbl}
          </div>
        ))}

        {/* Cards */}
        <div style={{ position: "absolute", top: LABEL_H }}>
          {isRingan && prelim.length > 0 && (
            <div style={{ position: "absolute", left: bkCol(0), top: bkTop(3) }}>
              <BracketCard m={prelim[0]} matchMap={matchMap} color="#8b5cf6" />
            </div>
          )}
          {b1.map((m, i) => (
            <div key={m.no} style={{ position: "absolute", left: bkCol(offset), top: b1Tops[i] }}>
              <BracketCard m={m} matchMap={matchMap} color={color} />
            </div>
          ))}
          {sf.map((m, i) => (
            <div key={m.no} style={{ position: "absolute", left: bkCol(offset + 1), top: sfTops[i] }}>
              <BracketCard m={m} matchMap={matchMap} color={color} />
            </div>
          ))}
          {fi.map(m => (
            <div key={m.no} style={{ position: "absolute", left: bkCol(offset + 2), top: fiTop }}>
              <BracketCard m={m} matchMap={matchMap} color={color} />
            </div>
          ))}
        </div>

        {/* SVG connector lines */}
        <svg style={{ position: "absolute", top: LABEL_H, left: 0, pointerEvents: "none" }}
          width={totalW} height={BK_H} overflow="visible">

          {/* Prelim → B1[3] (Ringan only) */}
          {isRingan && (
            <g stroke="#c7ccd4" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3,3">
              <line
                x1={rEdge(0)} y1={bkCtr(bkTop(3))}
                x2={lEdge(1)} y2={bkCtr(bkTop(3))}
              />
            </g>
          )}

          {/* B1[0,1] → SF[0] */}
          <BracketConnSvg
            ax={rEdge(offset)} ay={bkCtr(b1Tops[0])}
            bx={rEdge(offset)} by={bkCtr(b1Tops[1])}
            tx={lEdge(offset+1)} ty={bkCtr(sfTops[0])}
          />
          {/* B1[2,3] → SF[1] */}
          <BracketConnSvg
            ax={rEdge(offset)} ay={bkCtr(b1Tops[2])}
            bx={rEdge(offset)} by={bkCtr(b1Tops[3])}
            tx={lEdge(offset+1)} ty={bkCtr(sfTops[1])}
          />
          {/* SF[0,1] → Final */}
          <BracketConnSvg
            ax={rEdge(offset+1)} ay={bkCtr(sfTops[0])}
            bx={rEdge(offset+1)} by={bkCtr(sfTops[1])}
            tx={lEdge(offset+2)} ty={bkCtr(fiTop)}
          />
        </svg>
      </div>
    </div>
  );
}

/* ─── StreetFightPublicTab ─────────────────────────────────────────── */
function StreetFightPublicTab() {
  const [showPeserta, setShowPeserta] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100"
        style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #3b82f6 100%)" }}>
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl shrink-0">🥊</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-base leading-tight">Street Fight — Day 1</p>
            <p className="text-white/70 text-xs mt-0.5">Fun Match · 20 Juni · Area Outdoor</p>
          </div>
          <div className="shrink-0 bg-white/20 rounded-xl px-3 py-1.5 text-center">
            <p className="text-white font-extrabold text-lg leading-none">{streetFightDay1.length}</p>
            <p className="text-white/70 text-[9px] font-semibold uppercase tracking-wide">Match</p>
          </div>
        </div>
      </div>

      {/* Match cards */}
      <div className="space-y-3">
        {streetFightDay1.map((m) => {
          const done = !!m.pemenang;
          const merahWin = m.pemenang === "merah";
          const biruWin  = m.pemenang === "biru";
          return (
            <div key={m.no} className={`bg-white rounded-2xl overflow-hidden border shadow-sm ${
              done ? "border-blue-200" : "border-gray-100"
            }`}>
              {done && <div className="h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />}
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-[9px] font-extrabold text-gray-400 bg-gray-100 rounded-lg px-2 py-0.5">MATCH #{m.no}</span>
                <span className="text-[9px] font-bold text-gray-400">{m.berat}</span>
              </div>
              {/* VS row */}
              <div className="flex items-stretch">
                {/* Merah */}
                <div className={`flex-1 p-3 ${merahWin ? "bg-red-50" : biruWin ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-[8px] font-extrabold text-red-400 uppercase tracking-widest">Merah</span>
                  </div>
                  <p className={`text-[13px] font-extrabold leading-snug ${merahWin ? "text-red-700" : "text-gray-800"}`}>
                    {m.merah}
                  </p>
                  {merahWin && <p className="text-[9px] font-extrabold text-amber-600 mt-1">👑 Menang</p>}
                </div>
                {/* VS */}
                <div className="flex items-center justify-center px-2 bg-white">
                  <span className="text-[10px] font-black text-gray-200">VS</span>
                </div>
                {/* Biru */}
                <div className={`flex-1 p-3 text-right ${biruWin ? "bg-blue-50" : merahWin ? "opacity-40" : ""}`}>
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <span className="text-[8px] font-extrabold text-blue-400 uppercase tracking-widest">Biru</span>
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  </div>
                  <p className={`text-[13px] font-extrabold leading-snug ${biruWin ? "text-blue-700" : "text-gray-800"}`}>
                    {m.biru}
                  </p>
                  {biruWin && <p className="text-[9px] font-extrabold text-amber-600 mt-1">👑 Menang</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Peserta toggle */}
      <button
        onClick={() => setShowPeserta(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-extrabold text-gray-700"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">📋</span> Daftar Peserta ({streetFightDay1Peserta.length} orang)
        </span>
        <span className="text-gray-400 text-xs">{showPeserta ? "▲" : "▼"}</span>
      </button>

      {showPeserta && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[28px_1fr_36px_52px] text-[9px] font-extrabold text-gray-400 uppercase tracking-widest px-3 py-2 border-b border-gray-50 bg-gray-50">
            <span>No</span><span>Nama</span><span className="text-center">Usia</span><span className="text-right">BB/TB</span>
          </div>
          {streetFightDay1Peserta.map((p, i) => (
            <div key={p.no} className={`grid grid-cols-[28px_1fr_36px_52px] px-3 py-2 text-[11px] items-center ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}>
              <span className="font-bold text-gray-400">{p.no}.</span>
              <span className="font-semibold text-gray-800 truncate pr-1">{p.nama}</span>
              <span className="text-center text-gray-500">{p.usia}</span>
              <span className="text-right text-gray-500">{p.bb}/{p.tb || "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PancoPublicTab() {
  const { pancoMatches } = usePancoContext();
  const [activeKelas, setActiveKelas] = useState<"ringan" | "berat">("ringan");
  const matchMap = new Map(pancoMatches.map(m => [m.no, m]));
  const cfg = KELAS_CFG_PUB.find(k => k.key === activeKelas)!;
  const kelasMtch = pancoMatches.filter(m => m.kategori.startsWith(cfg.prefix));

  const done  = kelasMtch.filter(m => m.pemenang).length;
  const total = kelasMtch.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100"
        style={{ background: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 60%, #f97316 100%)" }}>
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl shrink-0">💪</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-base leading-tight">Bracket Panco</p>
            <p className="text-white/70 text-xs mt-0.5">Arm Wrestling Temu Tarung Laskar Suryakencana</p>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-white/80 text-xs font-semibold">Progress Pertandingan</span>
            <span className="text-white font-extrabold text-xs">{done}/{total} selesai · {pct}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Kelas switcher */}
      <div className="flex gap-2">
        {KELAS_CFG_PUB.map(k => (
          <button key={k.key} onClick={() => setActiveKelas(k.key)}
            className="flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all border"
            style={activeKelas === k.key
              ? { background: k.color, color: "white", borderColor: k.color }
              : { background: "white", color: "#6b7280", borderColor: "#e5e7eb" }}>
            <span className="block">{k.label}</span>
            <span className="block font-normal opacity-70 mt-0.5">{k.sub}</span>
          </button>
        ))}
      </div>

      {/* Bracket diagram */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
        <BracketDiagram
          kelasMtch={kelasMtch}
          matchMap={matchMap}
          color={cfg.color}
          isRingan={activeKelas === "ringan"}
        />
      </div>

      {/* Champion footer */}
      {(() => {
        const finalMatch = kelasMtch.find(m => m.kategori.includes("Final") && !m.kategori.includes("Semi"));
        if (!finalMatch?.pemenang) return null;
        const champ = finalMatch.pemenang === "merah" ? finalMatch.merah : finalMatch.biru;
        const champR = resolveWinnerPublic(champ, matchMap);
        return (
          <div className="rounded-2xl overflow-hidden border border-yellow-200 shadow-sm">
            <div className="px-5 py-4 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #78350f, #d97706)" }}>
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-200 text-[10px] font-bold uppercase tracking-wider">Juara {cfg.label}</p>
                <p className="text-white font-extrabold text-base leading-tight mt-0.5">{champR}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── AtletTab component ────────────────────────────────────────────── */
function AtletTab({ accent, light }: { accent: string; light: string }) {
  const { matches } = useMatchContext();
  const [matchSearch, setMatchSearch] = useState("");
  const [form, setForm] = useState({ ...BPJS_EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const foundMatches = matches.filter(m =>
    matchSearch.trim().length >= 2 &&
    (
      m.merah.toLowerCase().includes(matchSearch.toLowerCase()) ||
      m.biru.toLowerCase().includes(matchSearch.toLowerCase()) ||
      m.campMerah.toLowerCase().includes(matchSearch.toLowerCase()) ||
      m.campBiru.toLowerCase().includes(matchSearch.toLowerCase())
    )
  );

  const f = (k: keyof typeof BPJS_EMPTY) =>
    (e: { target: { value: string } }) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  function handleTglLahir(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    let jenis = form.jenis_peserta;
    if (val) {
      const today = new Date();
      const dob   = new Date(val);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      jenis = age >= 17 ? "dewasa" : "anak";
    }
    setForm(p => ({ ...p, tgl_lahir: val, jenis_peserta: jenis, nomor_identitas: jenis === "anak" ? "" : p.nomor_identitas }));
  }

  const selectBank = (bank: { nama: string; kode: string }) =>
    setForm(p => ({ ...p, nama_bank: bank.nama, kode_bank: bank.kode }));

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bpjs-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, match_no: form.match_no ? Number(form.match_no) : null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as { error?: string }).error || "Gagal mengirim");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  const inp = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all";
  const sel = "w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all bg-white";
  const lbl = "block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1";

  return (
    <div className="space-y-4">

      {/* ── Match Search ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-gray-50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: light }}><Swords className="h-4 w-4" style={{ color: accent }} /></div>
          <div>
            <p className="font-extrabold text-gray-900 text-sm">Cari Match Kamu</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Ketik nama untuk melihat jadwal pertandinganmu</p>
          </div>
        </div>
        <div className="p-4">
          <input
            type="text" value={matchSearch}
            onChange={e => setMatchSearch(e.target.value)}
            placeholder="Ketik nama fighter atau camp…"
            className={inp}
          />
          {matchSearch.trim().length >= 2 && (
            <div className="mt-3 space-y-2">
              {foundMatches.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4 font-medium">Nama tidak ditemukan</p>
              ) : (
                foundMatches.slice(0, 5).map(m => {
                  const jam  = getMatchJam(m.no);
                  const tl   = getTypeLabel(m.kategori);
                  const tc   = TYPE_COLORS[tl];
                  const isSel = form.match_no === String(m.no);
                  return (
                    <div
                      key={m.no}
                      className="rounded-xl border overflow-hidden cursor-pointer transition-all"
                      onClick={() => setForm(p => ({ ...p, match_no: String(m.no) }))}
                      style={isSel ? { borderColor: accent, background: `${accent}08` } : { borderColor: "#f3f4f6" }}
                    >
                      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold text-gray-500">#{String(m.no).padStart(3,"0")}</span>
                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text }}>{tl}</span>
                          <span className="text-[8px] text-gray-400 font-bold">{m.berat}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold">⏱ {jam}</span>
                      </div>
                      <div className="px-3 py-2 flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="text-[11px] font-extrabold text-gray-900 truncate">{m.merah}</span>
                          </div>
                          <p className="text-[9px] text-gray-400 truncate ml-2.5">{m.campMerah}</p>
                        </div>
                        <span className="text-[9px] font-extrabold text-gray-300 shrink-0">VS</span>
                        <div className="flex-1 min-w-0 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-[11px] font-extrabold text-gray-900 truncate">{m.biru}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          </div>
                          <p className="text-[9px] text-gray-400 truncate mr-2.5">{m.campBiru}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {form.match_no && (
                <p className="text-[10px] font-bold text-center mt-1" style={{ color: accent }}>✓ Match #{form.match_no} dipilih</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Formulir Atlet ── */}
      {submitted ? (
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: light }}>
            <CheckCircle2 className="h-7 w-7" style={{ color: accent }} />
          </div>
          <p className="font-black text-gray-900 text-base mb-1">Data Berhasil Dikirim!</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Data kamu sudah kami terima.<br />Tim akan menghubungi via HP/Email.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ ...BPJS_EMPTY }); }}
            className="mt-5 px-5 py-2 text-xs font-extrabold rounded-xl text-white transition-all"
            style={{ background: accent }}
          >
            Daftar Lagi
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-gray-50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: light }}>
              <HeartPulse className="h-4 w-4" style={{ color: accent }} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">Formulir Atlet</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Isi data diri untuk keperluan administrasi event</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl px-4 py-2.5">{error}</div>
            )}

            {/* Nama Lengkap */}
            <div>
              <label className={lbl}>Nama Lengkap <span className="text-red-400">*</span></label>
              <input type="text" value={form.nama_lengkap} onChange={f("nama_lengkap")} placeholder="Nama sesuai KTP / Kartu Keluarga" className={inp} required />
            </div>

            {/* Jenis Peserta */}
            <div>
              <label className={lbl}>Jenis Peserta <span className="text-red-400">*</span> <span className="text-gray-300 font-normal normal-case">(anak = dibawah 17 tahun)</span></label>
              <div className="flex gap-2 mt-1">
                {(["dewasa","anak"] as const).map(v => (
                  <button key={v} type="button"
                    onClick={() => setForm(p => ({ ...p, jenis_peserta: v, nomor_identitas: "" }))}
                    className="flex-1 py-2.5 rounded-xl text-xs font-extrabold border-2 transition-all"
                    style={form.jenis_peserta === v
                      ? { background: accent, borderColor: accent, color: "#fff" }
                      : { background: "#f9fafb", borderColor: "#e5e7eb", color: "#6b7280" }
                    }
                  >
                    {v === "dewasa" ? "Dewasa (KTP)" : "Anak / Dibawah Umur"}
                  </button>
                ))}
              </div>
              {form.jenis_peserta === "anak" && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-amber-800 text-[11px] font-semibold leading-relaxed">
                    ⚠️ <span className="font-extrabold">Peserta dibawah umur</span> wajib melampirkan surat pernyataan orang tua/wali.
                    Formulir surat pernyataan dapat diunduh di <span className="font-extrabold underline">Group WhatsApp Atlit</span>.
                  </p>
                </div>
              )}
            </div>

            {/* NIK — hanya jika Dewasa */}
            {form.jenis_peserta === "dewasa" && (
              <div>
                <label className={lbl}>NIK (Nomor Induk Kependudukan) <span className="text-red-400">*</span></label>
                <input type="text" inputMode="numeric" maxLength={16} value={form.nomor_identitas} onChange={f("nomor_identitas")} placeholder="16 digit NIK sesuai KTP" className={inp} required />
              </div>
            )}

            {/* Tempat & Tanggal Lahir */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Tempat Lahir <span className="text-red-400">*</span></label>
                <input type="text" value={form.tempat_lahir} onChange={f("tempat_lahir")} placeholder="cth: Garut" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Tanggal Lahir <span className="text-red-400">*</span></label>
                <input type="date" value={form.tgl_lahir} onChange={handleTglLahir} className={inp} required />
              </div>
            </div>

            {/* No HP */}
            <div>
              <label className={lbl}>No. HP Aktif <span className="text-red-400">*</span></label>
              <input type="tel" inputMode="numeric" value={form.handphone} onChange={f("handphone")} placeholder="cth: 0812-xxxx-xxxx" className={inp} required />
            </div>

            {/* Email */}
            <div>
              <label className={lbl}>Email <span className="text-gray-300 font-normal normal-case">(opsional)</span></label>
              <input type="email" value={form.email} onChange={f("email")} placeholder="email@contoh.com" className={inp} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 font-extrabold text-sm text-white rounded-xl transition-all active:scale-95 disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 6px 20px -6px ${accent}60` }}
            >
              {submitting ? "Mengirim…" : "Kirim Data"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ─── Rolling Match Spotlight ─── */
const SPOTLIGHT_NOS = [5, 42];

function RollingMatchSpotlight({ matches }: { matches: MatchItem[] }) {
  const spots = SPOTLIGHT_NOS.map(no => matches.find(m => m.no === no)).filter(Boolean) as MatchItem[];
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (spots.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % spots.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, [spots.length]);

  if (spots.length === 0) return null;
  const m = spots[idx];
  const tl = getTypeLabel(m.kategori);
  const tc = TYPE_COLORS[tl];
  const isLive = m.status === "berlangsung";
  const isDone = m.status === "selesai";

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-900 shadow-lg"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%)" }}>
      {/* Label */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-extrabold text-white/60 uppercase tracking-widest">Match Spotlight</span>
        </div>
        <div className="flex gap-1">
          {spots.map((_, i) => (
            <button key={i} onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true); }, 200); }}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-white" : "w-2 bg-white/30"}`} />
          ))}
        </div>
      </div>

      {/* Match card */}
      <div className="px-3 pb-3" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl"
          style={{ background: isLive ? "#f59e0b" : isDone ? "#374151" : "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-extrabold text-white tabular-nums">#{String(m.no).padStart(3,"0")}</span>
            <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full"
              style={{ background: tc.bg, color: tc.text }}>{getAgeLabel(m.kategori)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-white/60 font-bold tabular-nums">⏱ {getMatchJam(m.no)}</span>
            <span className="text-[8px] font-bold text-white/70">{m.berat}</span>
          </div>
        </div>
        {/* Sub-category */}
        <div className="px-3 py-1" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-[8px] text-white/40 truncate">{m.kategori}</p>
        </div>
        {/* VS */}
        <div className="px-2 pt-2 pb-1 rounded-b-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-stretch gap-2">
            <div className="flex-1 min-w-0 rounded-lg p-2.5 border border-red-800/40 bg-red-950/40">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[7px] font-extrabold text-red-400 uppercase tracking-wider">Merah</span>
                {isDone && m.pemenang === "merah" && <span className="text-[8px] ml-auto">👑</span>}
              </div>
              <p className="text-[11px] font-extrabold text-white leading-snug">{m.merah}</p>
              <p className="text-[7px] text-white/40 mt-0.5 line-clamp-1">{m.campMerah || "—"}</p>
            </div>
            <div className="shrink-0 flex items-center justify-center w-6">
              <span className="text-[10px] font-extrabold text-white/30">VS</span>
            </div>
            <div className="flex-1 min-w-0 rounded-lg p-2.5 border border-blue-800/40 bg-blue-950/40 text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                {isDone && m.pemenang === "biru" && <span className="text-[8px] mr-auto">👑</span>}
                <span className="text-[7px] font-extrabold text-blue-400 uppercase tracking-wider">Biru</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-[11px] font-extrabold text-white leading-snug">{m.biru}</p>
              <p className="text-[7px] text-white/40 mt-0.5 line-clamp-1">{m.campBiru || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ProNightTab — Sesi Malam Puncak ──────────────────────────────── */
interface NightMatch {
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
const NIGHT_MATCHES: NightMatch[] = [
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

function ProNightTab({ accent, light }: { accent: string; light: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: light }}>
              <Moon className="h-4 w-4" style={{ color: accent }} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">Sesi Malam Puncak</p>
              <p className="text-gray-400 text-[10px] mt-0.5">Super Elite & Pro Night · 21 Juni 2026</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: accent }}>
            Ab. Isya · 19:00+
          </span>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-amber-100 text-amber-700">● Super Elite</span>
          <span className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-violet-100 text-violet-700">● Pro Match</span>
          <span className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-rose-100 text-rose-700">★ Main Event</span>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[680px] overflow-y-auto">
        {NIGHT_MATCHES.map(m => {
          const isMain = m.tier === "main";
          const isSE   = m.tier === "super-elite";
          const topBg  = isMain ? "bg-rose-600" : isSE ? "bg-amber-500" : "bg-violet-600";
          const badgeSt = isMain
            ? { background: "#fee2e2", color: "#b91c1c" }
            : isSE
            ? { background: "#fef3c7", color: "#92400e" }
            : { background: "#ede9fe", color: "#6d28d9" };
          return (
            <div key={m.order} className={`rounded-xl overflow-hidden border ${
              isMain ? "border-rose-300 md:col-span-2" : isSE ? "border-amber-200" : "border-violet-100"
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
              <div className="bg-white px-3 pt-1.5 pb-0">
                <p className="text-[8px] text-gray-400 truncate">
                  {m.kategori}{m.piala ? ` · 🏆 ${m.piala}` : ""}{m.note ? ` · ${m.note}` : ""}
                </p>
              </div>
              {/* VS row */}
              <div className="bg-white px-2.5 pt-1.5 pb-2.5">
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
    </div>
  );
}

/* ─── FightCard (Temu Tarung match table) ─── */
function FightCard({ accent, light }: { accent: string; light: string }) {
  const { matches } = useMatchContext();
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [search, setSearch]         = useState("");

  const types = ["Semua", "Stand Up Fight", "MMA", "For Men"];
  const countByType: Record<string, number> = {};
  for (const t of types.slice(1)) countByType[t] = matches.filter(m => getTypeLabel(m.kategori) === t).length;

  const filtered = matches.filter(m => {
    if (getTypeLabel(m.kategori) === "Panco") return false;
    if (typeFilter !== "Semua" && getTypeLabel(m.kategori) !== typeFilter) return false;
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

  return (
    <div className="flex flex-col gap-3">
    <RollingMatchSpotlight matches={matches} />
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: light }}>
              <Swords className="h-4 w-4" style={{ color: accent }} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">Fight Card</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{matches.filter(m => getTypeLabel(m.kategori) !== "Panco").length} pertandingan · Temu Tarung 2026</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: accent }}>
            20–21 Juni 2026
          </span>
        </div>

        {/* Type chips */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {types.map(t => {
            const isActive = typeFilter === t;
            const tc = t !== "Semua" ? TYPE_COLORS[t] : null;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all whitespace-nowrap"
                style={isActive
                  ? { background: tc?.text ?? accent, color: "#fff", borderColor: tc?.text ?? accent }
                  : { background: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }
                }>
                {t}{t !== "Semua" && ` (${countByType[t]})`}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mt-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <svg className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama fighter atau camp…"
            className="flex-1 text-xs outline-none bg-transparent text-gray-800 placeholder-gray-300" />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0 text-gray-400 text-xs font-bold">✕</button>
          )}
        </div>
        <p className="text-gray-400 text-[10px] mt-2">{filtered.length} match ditampilkan</p>
      </div>

      {/* Cards — 1 col mobile, 2 col md+ */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[680px] overflow-y-auto">
        {filtered.map(m => {
          const tl = getTypeLabel(m.kategori);
          const tc = TYPE_COLORS[tl];
          const isLive = m.status === "berlangsung";
          const isDone = m.status === "selesai";
          return (
            <div key={m.no} className={`rounded-xl overflow-hidden border ${
              isLive ? "border-amber-300" : "border-gray-100"
            }`}>
              {/* Card top bar */}
              <div className={`flex items-center justify-between px-3 py-1.5 ${
                isLive ? "bg-amber-500" : isDone ? "bg-gray-600" : "bg-gray-50 border-b border-gray-100"
              }`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-[9px] font-extrabold tabular-nums shrink-0 ${
                    isLive || isDone ? "text-white" : "text-gray-500"
                  }`}>#{String(m.no).padStart(3,"0")}</span>
                  <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 max-w-[100px] truncate"
                    style={isLive || isDone
                      ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                      : { background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }
                    }>{getAgeLabel(m.kategori)}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[8px] font-bold tabular-nums ${
                    isLive || isDone ? "text-white/80" : "text-gray-400"
                  }`}>⏱ {getMatchJam(m.no)}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    isLive || isDone ? "bg-white/20 text-white" : "bg-white border border-gray-200 text-gray-500"
                  }`}>{m.berat}</span>
                </div>
              </div>

              {/* Sub-category */}
              <div className="bg-white px-3 pt-1.5 pb-0">
                <p className="text-[8px] text-gray-400 truncate">{m.kategori}</p>
              </div>

              {/* VS row */}
              <div className="bg-white px-2.5 pt-1.5 pb-2.5">
                <div className="flex items-stretch gap-1.5">
                  <div className={`flex-1 min-w-0 rounded-lg p-2 border ${
                    m.pemenang === "merah" ? "bg-red-50 border-red-200" :
                    m.pemenang === "biru"  ? "bg-gray-50 border-gray-100 opacity-55" :
                    "bg-red-50/40 border-red-100"
                  }`}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[7px] font-extrabold text-red-500 uppercase tracking-wider">Red</span>
                    </div>
                    <p className="text-[10px] font-extrabold text-gray-900 leading-snug capitalize">{m.merah}</p>
                    <p className="text-[7px] text-gray-400 mt-0.5 line-clamp-1">{m.campMerah}</p>
                  </div>
                  <div className="shrink-0 flex items-center justify-center w-5">
                    <span className="text-[8px] font-extrabold text-gray-300">VS</span>
                  </div>
                  <div className={`flex-1 min-w-0 rounded-lg p-2 border text-right ${
                    m.pemenang === "biru"  ? "bg-blue-50 border-blue-200" :
                    m.pemenang === "merah" ? "bg-gray-50 border-gray-100 opacity-55" :
                    "bg-blue-50/40 border-blue-100"
                  }`}>
                    <div className="flex items-center justify-end gap-1 mb-0.5">
                      <span className="text-[7px] font-extrabold text-blue-500 uppercase tracking-wider">Blue</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                    <p className="text-[10px] font-extrabold text-gray-900 leading-snug capitalize">{m.biru}</p>
                    <p className="text-[7px] text-gray-400 mt-0.5 line-clamp-1">{m.campBiru}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10">
            <SearchX className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-bold text-gray-400">Tidak ada match ditemukan</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, icon: Icon, accent, children }: { title: string; icon: React.ComponentType<{className?: string; style?: React.CSSProperties}>; accent: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}15` }}>
          <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
        <p className="font-extrabold text-gray-900 text-sm">{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ─── Main ─── */
export default function EventDetail() {
  const [, params]  = useRoute("/event/:slug");
  const [event, setEvent]     = useState<ApiEvent | null>(null);
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selTicket, setSel]   = useState<number | null>(null);
  const [qty, setQty]         = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const [rundownDay, setRundownDay] = useState(0);
  const [activeTab, setActiveTab] = useState<"info" | "fightcard" | "panco" | "street" | "malam">("info");
  const [rdDay, setRdDay] = useState<1|2>(1);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!params?.slug) return;
    Promise.all([
      fetch(`${API}/events/${params.slug}`).then(r => r.ok ? r.json() : null),
      fetch(`${API}/events/${params.slug}/tickets`).then(r => r.ok ? r.json() : []),
    ]).then(([ev, tix]) => {
      setEvent(toSnake<ApiEvent>(ev));
      const active = toSnake<EventTicket[]>(tix).filter(t => t.active);

      setTickets(active);
      const first = active.find(t => {
        const now   = new Date();
        const start = t.sale_start ? new Date(t.sale_start) : null;
        const end   = t.sale_end   ? new Date(t.sale_end + "T23:59:59") : null;
        return t.sold < t.quota && !(start && now < start) && !(end && now > end);
      });
      if (first) setSel(first.id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [params?.slug]);

  useEffect(() => {
    const el = ticketRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setShowSticky(!e.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  // Warna bingkai acara diambil dari posternya sendiri, supaya panel keterangan
  // ikut satu nada dengan poster dan tidak terlihat pudar di bawah lapisan hitam.
  const posterRef = useRef<HTMLImageElement | null>(null);
  const [posterPal, setPosterPal] = useState<PosterPalette | null>(null);

  useEffect(() => {
    setPosterPal(null);
    const img = posterRef.current;
    if (!img?.complete) return;
    const palette = extractPosterPalette(img);
    if (palette) setPosterPal(palette);
  }, [event?.image]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      </div>
    </Layout>
  );
  if (!event) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
        <p className="text-gray-700 font-bold">Event tidak ditemukan</p>
        <button onClick={() => window.history.back()} className="text-gray-400 text-sm underline">Kembali</button>
      </div>
    </Layout>
  );

  const g      = catMeta[event.category] ?? DEFAULT_G;
  const isTemuTarung = !!(event.name?.toLowerCase().includes("temu tarung") || event.name?.toLowerCase().includes("temu-tarung"));

  const _today = new Date().toISOString().slice(0, 10);
  const _end   = event.date_end && event.date_end > event.date ? event.date_end : event.date;
  const isPast = _end <= _today;
  const ticket = tickets.find(t => t.id === selTicket) ?? null;
  const total  = ticket ? ticket.price * qty : 0;

  const standardTickets = tickets.filter(t => { const n = t.name.toLowerCase(); return !n.includes("vip") && !n.includes("reguler"); });
  const regulerTickets  = tickets.filter(t => t.name.toLowerCase().includes("reguler"));
  const vipTickets      = tickets.filter(t => t.name.toLowerCase().includes("vip"));

  function renderGroup(group: EventTicket[], isVipGroup: boolean) {
    return group.map(t => {
      const now        = new Date();
      const start      = t.sale_start ? new Date(t.sale_start) : null;
      const end        = t.sale_end   ? new Date(t.sale_end + "T23:59:59") : null;
      const habis      = t.sold >= t.quota;
      const belumBuka  = !!start && now < start;
      const sudahTutup = !!end && now > end;
      return (
        <TicketCard
          key={t.id} t={t}
          isActive={selTicket === t.id}
          disabled={isPast || habis || belumBuka || sudahTutup}
          qty={qty} sisa={t.quota - t.sold}
          accent={g.from} isVipGroup={isVipGroup} isPast={isPast}
          onSelect={() => { setSel(t.id); setQty(0); }}
          onQtyChange={setQty}
        />
      );
    });
  }

  return (
    <Layout>
      <SEO
        title={event.name}
        description={event.description?.slice(0, 160) || `${event.name} — ${event.category} di ${event.location}. Cek jadwal, tiket, dan informasi lengkap event Garut.`}
        image={event.image || undefined}
        path={`/event/${event.slug}`}
      />
      <div className="bg-gray-50 min-h-screen">

        {/* ── HERO ── */}
        <div className="relative w-full overflow-hidden bg-gray-900" style={event.image ? (posterPal ? { background: posterPal.baseDeep } : undefined) : { height: "58vw", maxHeight: 360, minHeight: 220 }}>
          {event.image
            ? /* Poster di kiri, keterangan di kanan: poster tampil utuh (tidak dipotong),
                 sisi kanan diisi panel keterangan, dan di HP poster tetap lebar penuh. */
              <div className="relative w-full overflow-hidden sm:h-[clamp(420px,46vw,540px)]">
                <img
                  src={event.image}
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
                />
                <div className="relative flex h-full w-full flex-col sm:flex-row">
                  <img
                    ref={posterRef}
                    src={event.image}
                    alt={event.name}
                    className="block h-auto w-full shrink-0 sm:h-full sm:w-auto"
                    onLoad={(e) => {
                      const palette = extractPosterPalette(e.currentTarget);
                      if (palette) setPosterPal(palette);
                    }}
                  />
                  <div
                    className="hidden min-w-0 flex-1 flex-col justify-center gap-3 px-6 py-6 sm:flex lg:px-10"
                    style={posterPal ? { background: posterPal.panel } : undefined}
                  >
                    <span
                      className="inline-block w-fit rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white"
                      style={posterPal ? { background: posterPal.accent, color: posterPal.onAccent } : { background: `${g.from}cc` }}
                    >
                      {event.category}
                    </span>
                    <h1 className="text-2xl font-extrabold leading-tight text-white drop-shadow-sm lg:text-4xl" style={posterPal ? { color: posterPal.cream } : undefined}>
                      {event.name}
                    </h1>
                    {event.description && (
                      <p className="line-clamp-3 max-w-md text-[13px] leading-relaxed text-white/75 lg:text-sm" style={posterPal ? { color: posterPal.cream, opacity: 0.92 } : undefined}>
                        {event.description}
                      </p>
                    )}
                    <div className="mt-1 grid gap-2.5 sm:grid-cols-2">
                      {[
                        { Icon: Calendar, label: "Tanggal", val: fmtEventDate(event.date, event.date_end) },
                        { Icon: MapPin, label: "Lokasi", val: event.location || "TBA" },
                        ...(event.guest_stars && event.guest_stars.length > 0
                          ? [{ Icon: Star, label: "Bintang Tamu", val: event.guest_stars.map((gs) => gs.name).join(", ") }]
                          : []),
                        { Icon: Ticket, label: "Harga", val: event.price === 0 ? "Gratis, langsung datang aja" : `Rp ${event.price.toLocaleString("id")}` },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-start gap-2.5 rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur-sm"
                          style={posterPal ? { background: posterPal.soft } : undefined}
                        >
                          <row.Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/80" strokeWidth={2} style={posterPal ? { color: posterPal.cream } : undefined} />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/50" style={posterPal ? { color: posterPal.muted } : undefined}>{row.label}</p>
                            <p className="text-[12px] font-bold leading-snug text-white lg:text-[13px]" style={posterPal ? { color: posterPal.cream } : undefined}>{row.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }} />
          }
          <div className="absolute inset-0" style={{ background: posterPal ? posterPal.scrim : "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 45%, rgba(0,0,0,0.65) 100%)" }} />

          {/* Nav */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <button onClick={() => window.history.back()} className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <EventShare title={event.name} />
          </div>

          {/* Bottom title: HP saja — di desktop nama event tampil di panel kanan */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 sm:hidden">
            <span className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white mb-2 uppercase tracking-wide" style={posterPal ? { background: posterPal.accent, color: posterPal.onAccent } : { background: `${g.from}cc` }}>
              {event.category}
            </span>
            <p className="text-xl font-extrabold text-white leading-tight drop-shadow-sm">{event.name}</p>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-32 lg:pb-12">

          {event.slug === "musicomedy-night" && (
            <div className="event-saweran mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-border bg-card px-4 py-4 text-foreground">
              <div className="min-w-0 flex-1 basis-48">
                <p className="font-bold text-sm">Suka penampilannya? Yuk, sawer talent!</p>
                <p className="mt-1 text-xs text-muted-foreground">Apresiasi kamu berarti untuk karya lokal.</p>
              </div>
              <Button asChild><a href="#saweran" onClick={(e) => {
                const target = document.getElementById("saweran");
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
                target.focus({ preventScroll: true });
              }}><HandHeart />Sawer Talent<ArrowDown /></a></Button>
            </div>
          )}

          {/* ── Thank You Banner (event selesai) ── */}
          {isPast && (
            <div className="mb-5 rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>
              {/* decorative circles */}
              <div className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
              <div className="pointer-events-none absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #c084fc, transparent)" }} />
              <div className="relative px-5 py-6 flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
                  🙏
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-extrabold text-base leading-tight">
                    Terima kasih sudah hadir!
                  </p>
                  <p className="text-white/60 text-[12px] font-medium mt-1 leading-relaxed">
                    {event.name} telah selesai diselenggarakan. Terima kasih atas antusiasme dan kehadiran kalian — sampai jumpa di event berikutnya! 🎉
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white/90" style={{ background: "rgba(255,255,255,0.12)" }}>
                      <CheckCircle2 className="w-3 h-3" /> Event Selesai
                    </span>
                    <span className="text-white/35 text-[10px] font-semibold">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── LEFT ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* ── Tab bar (Temu Tarung only) ── */}
              {isTemuTarung && (
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto scrollbar-hide">
                  {(["info", "fightcard", "panco", "street", "malam"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 px-4 py-1.5 text-[10px] font-extrabold rounded-lg transition-all whitespace-nowrap ${
                        activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab === "info"
                        ? "Info"
                        : tab === "fightcard"
                        ? "Fight Card"
                        : tab === "panco"
                        ? "Panco"
                        : tab === "street"
                        ? "Street"
                        : "Malam"
                      }
                    </button>
                  ))}
                </div>
              )}

              {isTemuTarung && activeTab === "panco" && (
                <PancoPublicTab />
              )}

              {isTemuTarung && activeTab === "street" && (
                <StreetFightPublicTab />
              )}

              {isTemuTarung && activeTab === "malam" && (
                <ProNightTab accent={g.from} light={g.light} />
              )}

              {(!isTemuTarung || activeTab === "info") && (<>
              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { Icon: Calendar, label: "Tanggal", val: fmtEventDate(event.date, event.date_end) },
                  { Icon: MapPin,   label: "Lokasi",  val: event.location || "TBA" },
                ].map(i => (
                  <div key={i.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: g.light }}>
                      <i.Icon className="h-4 w-4" style={{ color: g.from }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wide">{i.label}</p>
                      <p className="text-gray-900 font-bold text-xs mt-0.5 leading-snug line-clamp-3">{i.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(event.time_start || event.time_end) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: g.light }}>
                    <Clock className="h-4 w-4" style={{ color: g.from }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wide">Jam Pelaksanaan</p>
                    <p className="text-gray-900 font-bold text-xs mt-0.5">
                      {cafeJamRange(event.time_start, event.time_end)}
                    </p>
                  </div>
                </div>
              )}

              {/* Organizer */}
              {event.organizer && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: g.light }}>
                    <Users className="h-4 w-4" style={{ color: g.from }} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wide">Penyelenggara</p>
                    <p className="text-gray-900 font-bold text-sm mt-0.5">{event.organizer}</p>
                  </div>
                </div>
              )}

              {/* Reservasi kursi & pilih meja (Good Story Cafe) */}
              {!isPast && (event.location || "").toLowerCase().includes("good story cafe") && (
                <CafeReservation
                  eventName={event.name}
                  eventDate={event.date}
                  timeStart={event.time_start}
                  timeEnd={event.time_end}
                  location={event.location}
                />
              )}

              {/* ── Rundown Jadwal Acara (hanya Temu Tarung) ── */}
              {isTemuTarung && (() => {
                const rdData = rdDay === 1 ? RUNDOWN_DAY1 : RUNDOWN_DAY2;
                const blockGroups: { bn: number; block: string; bt: string; types: RundownItem["type"][] }[] = [];
                for (const r of rdData) {
                  if (!blockGroups.find(b => b.bn === r.bn)) {
                    const items = rdData.filter(x => x.bn === r.bn);
                    const types = [...new Set(items.map(x => x.type))] as RundownItem["type"][];
                    blockGroups.push({ bn: r.bn, block: r.block, bt: r.bt, types });
                  }
                }
                const typeTag: Partial<Record<RundownItem["type"], { label: string; cls: string }>> = {
                  match:    { label: "Pertandingan", cls: "bg-red-50 text-red-500 border border-red-100" },
                  special:  { label: "Hiburan",      cls: "bg-purple-50 text-purple-500 border border-purple-100" },
                  ceremony: { label: "Seremoni",     cls: "bg-blue-50 text-blue-500 border border-blue-100" },
                  break:    { label: "Jeda",         cls: "bg-green-50 text-green-600 border border-green-100" },
                };
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: g.light }}>
                        <Clock className="h-3.5 w-3.5" style={{ color: g.from }} />
                      </div>
                      <p className="font-extrabold text-gray-900 text-sm">Jadwal Acara</p>
                    </div>
                    <div className="flex gap-2 px-5 pt-4">
                      {([1,2] as const).map(d => (
                        <button key={d} onClick={() => setRdDay(d)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${rdDay === d ? "text-white shadow-sm" : "text-gray-500 bg-gray-50"}`}
                          style={rdDay === d ? { background: g.from } : {}}>
                          <span>Hari {d} — {d === 1 ? "20 Jun" : "21 Jun"}</span>
                          {d === 2 && (
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${rdDay === 2 ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"}`}>
                              🎟 Berbayar
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-4 space-y-2">
                      {blockGroups.map((b, i) => (
                        <div key={b.bn} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white shrink-0" style={{ background: g.from }}>{b.bn}</div>
                            {i < blockGroups.length - 1 && <div className="w-px flex-1 bg-gray-100 min-h-[12px]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 leading-snug">{b.block}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{b.bt}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {b.types.filter(t => typeTag[t]).map(t => (
                                <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${typeTag[t]!.cls}`}>{typeTag[t]!.label}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ── Ticket section ── */}
              {tickets.length > 0 && (
                <div ref={ticketRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: g.light }}>
                      <Ticket className="h-3.5 w-3.5" style={{ color: g.from }} />
                    </div>
                    <p className="font-extrabold text-gray-900 text-sm">Pilih Tiket</p>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Standard */}
                    {standardTickets.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50">
                            <Ticket className="h-3 w-3 text-gray-500" />
                            <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wide">Standard</span>
                          </div>
                          <p className="text-gray-400 text-[10px] font-semibold">Tiket masuk umum</p>
                        </div>
                        <div className="space-y-2">{renderGroup(standardTickets, false)}</div>
                      </div>
                    )}

                    {/* Divider Standard–Reguler */}
                    {standardTickets.length > 0 && regulerTickets.length > 0 && (
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-gray-300 text-[10px] font-semibold">atau</span>
                        </div>
                      </div>
                    )}

                    {/* Reguler */}
                    {regulerTickets.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50">
                            <Ticket className="h-3 w-3 text-gray-500" />
                            <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wide">Reguler</span>
                          </div>
                          <p className="text-gray-400 text-[10px] font-semibold">Tiket masuk standar</p>
                        </div>
                        <div className="space-y-2">{renderGroup(regulerTickets, false)}</div>
                      </div>
                    )}

                    {/* Divider Reguler–VIP */}
                    {vipTickets.length > 0 && (standardTickets.length > 0 || regulerTickets.length > 0) && (
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-gray-300 text-[10px] font-semibold">atau</span>
                        </div>
                      </div>
                    )}

                    {/* VIP */}
                    {vipTickets.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shadow-sm" style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}>
                            <Crown className="h-3 w-3 text-amber-100" />
                            <span className="text-[10px] font-extrabold text-amber-100 uppercase tracking-wide">VIP</span>
                          </div>
                          <p className="text-amber-700/60 text-[10px] font-semibold">Akses eksklusif · area khusus</p>
                        </div>
                        <div className="space-y-2">{renderGroup(vipTickets, true)}</div>
                      </div>
                    )}
                  </div>

                  <div className="mx-5 mb-5 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-gray-300" />
                    <p className="text-gray-400 text-[11px] leading-relaxed">
                      Tiket dikirim via WhatsApp & email setelah pembayaran dikonfirmasi oleh admin.
                    </p>
                  </div>
                </div>
              )}

              {tickets.some(t => t.price === 0) && !isPast && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-extrabold text-gray-900 text-sm">Reservasi Kursi (Gratis)</p>
                  <p className="text-gray-500 text-xs mt-1 mb-3">Tiket gratis, tapi kamu bisa reservasi buat amankan kursi dengan spot terbaik.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["VIP", "Lantai 2", "Lantai 3"].map(area => (
                      <a
                        key={area}
                        href={`https://wa.me/6285724981356?text=${encodeURIComponent(`Halo NEMPO, saya mau reservasi kursi area ${area} untuk event ${event.name}.\nNama: \nJumlah orang: `)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-gray-200 py-2.5 text-center text-xs font-bold text-gray-800 hover:border-gray-400"
                      >
                        {area}
                      </a>
                    ))}
                  </div>
                  <p className="text-gray-400 text-[11px] mt-2">Pilih area, lalu kirim reservasimu lewat WhatsApp.</p>
                </div>
              )}

              {tickets.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: g.light }}>
                    <Ticket className="h-4 w-4" style={{ color: g.from }} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">Tiket Tersedia</p>
                    <p className="text-gray-400 text-xs mt-0.5">Hubungi penyelenggara untuk info tiket</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Tentang Event</p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
                </div>
              )}


              {/* Guest Stars */}
              {event.guest_stars && event.guest_stars.length > 0 && (
                <Section title="Bintang Tamu" icon={Star} accent={g.from}>
                  <div className="p-5 space-y-3">
                    {event.guest_stars.map((gs, i) => (
                      <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                          {gs.photo
                            ? <img src={gs.photo} alt={gs.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>{gs.name.charAt(0)}</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-extrabold text-sm">{gs.name}</p>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 text-white" style={{ background: g.from }}>{gs.role}</span>
                          {gs.note && <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{gs.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Rundown */}
              {event.rundown && event.rundown.length > 0 && (
                <Section title="Rundown Acara" icon={Clock} accent={g.from}>
                  {event.rundown.length > 1 && (
                    <div className="flex border-b border-gray-100">
                      {event.rundown.map((d, i) => (
                        <button key={i} onClick={() => setRundownDay(i)}
                          className="flex-1 py-2.5 text-xs font-bold transition-all border-b-2"
                          style={rundownDay === i
                            ? { borderColor: g.from, color: g.from }
                            : { borderColor: "transparent", color: "#9ca3af" }
                          }
                        >Hari {d.day}</button>
                      ))}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-gray-400 text-[11px] font-semibold mb-4">{event.rundown[rundownDay]?.date}</p>
                    <div className="space-y-0">
                      {event.rundown[rundownDay]?.sessions.map((s, i, arr) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center shrink-0">
                            <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: g.from }} />
                            {i < arr.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: `${g.from}25`, minHeight: 20 }} />}
                          </div>
                          <div className="pb-4 flex-1">
                            <span className="text-[11px] font-extrabold tabular-nums" style={{ color: g.from }}>{s.time}</span>
                            <span className="text-gray-800 text-sm font-bold ml-2">{s.title}</span>
                            {s.note && <p className="text-gray-400 text-[11px] mt-0.5">{s.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {/* Prohibited */}
              {event.prohibited_items && event.prohibited_items.length > 0 && (
                <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
                  <div className="px-5 pt-5 pb-4 border-b border-red-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                      <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <p className="font-extrabold text-red-700 text-sm">Larangan di Lokasi</p>
                  </div>
                  <div className="p-5 grid gap-2">
                    {event.prohibited_items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-red-400 font-extrabold text-xs shrink-0 mt-0.5">✕</span>
                        <p className="text-red-700/70 text-xs leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.slug === "musicomedy-night" && <EventSaweran />}

              {/* Maps */}
              {(event.maps_url || event.slug === "musicomedy-night") && (
                <EventLocation
                  location={event.location}
                  embedUrl={event.slug === "musicomedy-night" ? GOOD_STORY_CAFE_MAP.embedUrl : event.maps_url || ""}
                  directionsUrl={event.slug === "musicomedy-night" ? GOOD_STORY_CAFE_MAP.directionsUrl : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`}
                />
              )}

              {/* Transportation */}
              {event.transportation_info && event.transportation_info.length > 0 && (
                <Section title="Cara Menuju Lokasi" icon={Navigation} accent={g.from}>
                  <div className="p-5 space-y-5">
                    {event.transportation_info.map((route, i) => {
                      const Icon = route.icon === "train" ? Train : route.icon === "local" ? MapPin : Car;
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: g.light }}>
                            <Icon className="h-4 w-4" style={{ color: g.from }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <p className="text-gray-800 font-bold text-sm">Dari {route.from}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: g.chip, color: g.from }}>{route.duration}</span>
                            </div>
                            <ul className="space-y-1">
                              {route.options.map((opt, j) => (
                                <li key={j} className="flex items-start gap-1.5">
                                  <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: g.from }} />
                                  <p className="text-gray-500 text-xs leading-relaxed">{opt}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}
              </>)}

              {/* ── Fight Card tab ── */}
              {isTemuTarung && activeTab === "fightcard" && (
                <FightCard accent={g.from} light={g.light} />
              )}

            </div>

            {/* ── SIDEBAR ── */}
            <div className="hidden lg:block lg:col-span-1">
              <BookingWidget event={event} tickets={tickets} selTicket={selTicket} qty={qty} g={g} isPast={isPast} />
            </div>
          </div>
        </div>

        {/* ── Mobile Sticky CTA ── */}
        <div
          className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-2"
          style={{
            transform: (!isPast && !!ticket && qty > 0) ? "translateY(0)" : "translateY(130%)",
            opacity: (!isPast && !!ticket && qty > 0) ? 1 : 0,
            transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease",
            pointerEvents: (!isPast && !!ticket && qty > 0) ? "auto" : "none",
          }}
        >
          {ticket && (
            <div className="flex items-center justify-between bg-white px-4 pt-3 pb-2.5 rounded-t-2xl border border-b-0 border-gray-200 shadow-lg">
              <div>
                <p className="text-gray-400 text-[10px] font-semibold">Tiket dipilih</p>
                <p className="text-gray-900 font-extrabold text-xs">{ticket.name} × {qty}</p>
              </div>
              {ticket.price > 0 && (
                <p className="font-extrabold text-sm" style={{ color: g.from }}>
                  Rp {total.toLocaleString("id")}
                </p>
              )}
            </div>
          )}
          <Link href={isPast ? "#" : `/event/${event.slug}/checkout?ticket=${ticket?.id ?? ""}&qty=${qty}`}>
            <button
              disabled={isPast}
              className="w-full py-3.5 font-extrabold text-sm text-white flex items-center justify-center gap-2 active:brightness-90 transition-all shadow-xl disabled:cursor-not-allowed"
              style={{
                background: isPast ? "#9ca3af" : `linear-gradient(135deg, ${g.from}, ${g.to})`,
                boxShadow: isPast ? "none" : `0 8px 24px -6px ${g.from}60`,
                borderRadius: ticket ? "0 0 1rem 1rem" : "1rem",
              }}
            >
              <Ticket className="h-4 w-4" />
              {isPast ? "Event Telah Berakhir" : !ticket ? "Pesan Tiket" : ticket.price === 0 ? "Daftar Gratis" : `Pesan — Rp ${total.toLocaleString("id")}`}
            </button>
          </Link>
        </div>

      </div>
    </Layout>
  );
}
