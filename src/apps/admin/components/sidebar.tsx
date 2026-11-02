import { Link, useLocation } from "@/lib/wouter";
import {
  LayoutDashboard, MapPin, Utensils, Coffee, Hotel, Calendar, Newspaper,
  Settings, LogOut, Menu, X, Globe, ChevronRight,
  Ticket, BookOpen, Bus, List, Laptop, Image, Bell, ScanLine,
  Users, KeyRound, Trash2, Activity, Star, Sprout, Coins, ClipboardList, Building2, Wallet,
  Megaphone, Mic2, MailWarning, DatabaseBackup, Handshake, ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/apps/admin/lib/api";

const navGroups = [
  {
    label: "NEMPO Garut",
    items: [
      { label: "Dashboard Garut", path: "/", icon: LayoutDashboard },
      { label: "Banner Beranda", path: "/banners", icon: Image },
      { label: "Banner Promo (Kecil)", path: "/promo-banners", icon: Image },
      { label: "Mitra Kami", path: "/partners", icon: Building2 },
      { label: "Wisata", path: "/wisata", icon: MapPin },
      { label: "Kuliner", path: "/kuliner", icon: Utensils },
      { label: "Cafe", path: "/cafe", icon: Coffee },
      { label: "Penginapan", path: "/penginapan", icon: Hotel },
      { label: "Event", path: "/events", icon: Calendar },
      { label: "Pesanan Tiket", path: "/event-orders", icon: Ticket },
      { label: "Scan Tiket Masuk", path: "/ticket-scanner", icon: ScanLine },
      { label: "Berita & Artikel", path: "/berita", icon: Newspaper },
      { label: "Influencer & Kreator", path: "/influencers", icon: Megaphone },
      { label: "Foto Banner Influencer", path: "/influencer-banner-photos", icon: Image },
      { label: "Talent Studio", path: "/talent", icon: Mic2 },
      { label: "Karya Talent", path: "/talent-portfolio", icon: Mic2 },
      { label: "Banner Talent", path: "/talent-banner", icon: Image },
      { label: "Kerja Sama", path: "/partnership", icon: Handshake },
    ],
  },
    {
      label: "Operasional NEMPO Garut",
      items: [
        { label: "Pesanan & Menu", path: "/jajan-yuk", icon: ShoppingBag },
      ],
    },
  {
    label: "Fitur NEMPO Garut",
    items: [
      { label: "Voucher & Kupon", path: "/vouchers", icon: Ticket },
      { label: "BPJS Atlet", path: "/bpjs-registrations", icon: ClipboardList },
      { label: "Kamus Sunda", path: "/kamus-sunda", icon: BookOpen },
      { label: "Transportasi", path: "/transportasi", icon: Bus },
      { label: "Daftar Harga", path: "/price-list", icon: List },
      { label: "Layanan Digital", path: "/digital-services", icon: Laptop },
      { label: "Donasi Bibit", path: "/donations", icon: Sprout },
    ],
  },
  {
    label: "Manajemen User",
    items: [
      { label: "Daftar User", path: "/users", icon: Users },
      { label: "Akun Mitra", path: "/mitra", icon: Building2 },
      { label: "Penarikan Saldo Mitra", path: "/withdrawals", icon: Wallet },
      { label: "Poin & Reward", path: "/user-rewards", icon: Coins },
      { label: "Ganti Password", path: "/password-reset-requests", icon: KeyRound },
      { label: "Hapus Akun", path: "/delete-account-requests", icon: Trash2 },
      { label: "Aktivitas User", path: "/user-activities", icon: Activity },
      { label: "Ulasan & Rating", path: "/reviews", icon: Star },
    ],
  },
  {
    label: "Sistem",
    items: [
      { label: "Email Gagal Kirim", path: "/email-failures", icon: MailWarning },
      { label: "Notifikasi", path: "/notifications", icon: Bell },
      { label: "Backup Data", path: "/backup", icon: DatabaseBackup },
      { label: "Pengaturan", path: "/settings", icon: Settings },
    ],
  },
];

function NavItem({ item, active, onClick, badge }: { item: { label: string; path: string; icon: React.ElementType }; active: boolean; onClick?: () => void; badge?: number }) {
  return (
    <Link href={item.path} onClick={onClick}>
      <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}>
        <item.icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
        <span className={`text-sm flex-1 ${active ? "font-semibold" : "font-medium"}`}>{item.label}</span>
        {badge != null && badge > 0 && (
          <span className={`min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center leading-none ${active ? "bg-white text-red-600" : "bg-red-500 text-white"}`}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
        {active && !badge && <ChevronRight className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />}
      </div>
    </Link>
  );
}

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emailFailureCount, setEmailFailureCount] = useState(0);
  const adminUser = localStorage.getItem("nempo_admin_user") || "Admin";

  useEffect(() => {
    let cancelled = false;
    const fetchCount = () => {
      api.emailFailures.count()
        .then(d => { if (!cancelled) setEmailFailureCount(d.count ?? 0); })
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60_000); // refresh setiap 1 menit
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white border border-blue-100 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
            <img src="/Assets/Logo/nempo-new.webp" alt="Nempo" className="w-7 h-7 object-contain rounded-lg" onError={e => { e.currentTarget.style.display = "none"; }} />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 leading-tight">NEMPO Garut</p>
            <p className="text-[11px] text-blue-500 font-semibold">Admin CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavItem
                  key={item.path}
                  item={item}
                  active={location === item.path}
                  onClick={() => setMobileOpen(false)}
                  badge={item.path === "/email-failures" ? emailFailureCount : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3 shrink-0">
        <div className="px-3 py-2.5 rounded-xl bg-gray-50 mb-2">
          <p className="text-xs text-gray-400">Masuk sebagai</p>
          <p className="text-sm font-semibold text-gray-800 capitalize">{adminUser}</p>
        </div>
        <a
          href="https://nempo.id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
        >
          <Globe className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm font-medium">Buka Website</span>
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-40 border-r border-gray-100 shadow-2xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebar}
      </div>

      <div className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 shrink-0 h-screen sticky top-0 shadow-sm">
        {sidebar}
      </div>
    </>
  );
}
