import { useState } from 'react';
import { Link, useLocation } from '@/lib/wouter';
import { Activity, Archive, Bell, BookOpen, Building2, CalendarDays, ChevronDown, CircleDollarSign, Coffee, DatabaseBackup, FileText, Globe2, Handshake, Hotel, Image, LayoutDashboard, LogOut, MapPin, Menu, Newspaper, ScanLine, Settings, ShoppingBag, Ticket, Utensils, Users, X, BusFront, BriefcaseBusiness, Star, Sprout } from 'lucide-react';
import { getStoredUser } from '@/apps/cms/lib/api';
import { navGroups } from '@/apps/cms/lib/modules';

const iconFor: Record<string, typeof LayoutDashboard> = {
  '/':LayoutDashboard,'/banners':Image,'/promo-banners':Image,'/partners':Building2,'/wisata':MapPin,'/kuliner':Utensils,'/cafe':Coffee,
  '/penginapan':Hotel,'/events':CalendarDays,'/event-orders':Ticket,'/ticket-scanner':ScanLine,'/berita':Newspaper,'/influencers':Users,
  '/influencer-banner-photos':Image,'/talent':BriefcaseBusiness,'/talent-portfolio':FileText,'/talent-banner':Image,'/partnership':Handshake,
  '/jajan-yuk':ShoppingBag,'/vouchers':Ticket,'/kamus-sunda':BookOpen,'/transportasi':BusFront,'/price-list':CircleDollarSign,
  '/digital-services':Globe2,'/donations':Sprout,'/users':Users,'/mitra':Building2,'/user-rewards':Star,'/reviews':Activity,
  '/notifications':Bell,'/backup':DatabaseBackup,'/settings':Settings,
};
export function Sidebar({ onLogout }: { onLogout:()=>void }) {
  const [path] = useLocation();
  const [open,setOpen] = useState(false);
  const user = getStoredUser();
  const nav = <div className="flex h-full min-h-0 flex-col">
    <Link href="/" onClick={()=>setOpen(false)} className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2e5d2] text-[#70452b] shadow-sm">
        <img src={`${"/cms/"}Assets/Logo/nempo-new.webp`} alt="" className="h-7 w-7 object-contain" onError={e=>{e.currentTarget.style.display='none';}} />
        <span className="absolute text-xs font-bold">N</span>
      </div>
      <div><div className="text-[15px] font-bold tracking-tight text-[#fffaf3]">NEMPO <span className="text-[#d8b982]">ORGANIZER</span></div><div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.2em] text-[#c9b9a6]">Admin CMS Garut</div></div>
    </Link>
    <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-5">
      {navGroups.map((group,i)=><section key={group.label}>
        <div className="mb-2 px-3 text-[9px] font-bold tracking-[.2em] text-[#a99680]">{group.label}</div>
        <div className="space-y-0.5">{group.items.map(([label,href])=>{const Icon=iconFor[href]||Archive;const active=path===href;return <Link key={href} href={href} onClick={()=>setOpen(false)} className={`group flex items-center gap-3 rounded-lg px-3 py-[9px] text-[12px] font-medium transition-colors ${active?'bg-[#d9bd91] text-[#3b2b1d] shadow-sm':'text-[#d7cbbc] hover:bg-white/8 hover:text-white'}`}>
          <Icon size={15} strokeWidth={active?2.4:1.8}/><span className="flex-1">{label}</span>{active&&<span className="h-1.5 w-1.5 rounded-full bg-[#775133]"/>}
        </Link>;})}</div>
      </section>)}
    </nav>
    <div className="border-t border-white/10 p-3">
      <div className="mb-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#4b685a] text-[11px] font-bold text-white">{user.slice(0,1).toUpperCase()}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white">{user}</p><p className="text-[10px] text-[#b5a48e]">Petugas CMS</p></div>
        <span className="h-2 w-2 rounded-full bg-[#8cc6a2]" title="Sesi aktif"/>
      </div>
      <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#d6c6b4] hover:bg-[#533b31] hover:text-white"><LogOut size={15}/> Keluar</button>
    </div>
  </div>;
  return <>
    <button onClick={()=>setOpen(v=>!v)} className="fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-xl border border-[#dfd4c4] bg-[#f9f5ee] text-[#46362a] shadow-sm lg:hidden" aria-label="Buka navigasi">{open?<X size={18}/>:<Menu size={18}/>}</button>
    {open&&<button onClick={()=>setOpen(false)} aria-label="Tutup navigasi" className="fixed inset-0 z-40 bg-[#201811]/45 lg:hidden"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 w-[264px] -translate-x-full bg-[#362b23] transition-transform duration-200 lg:sticky lg:top-0 lg:z-10 lg:flex lg:h-[100dvh] lg:shrink-0 lg:translate-x-0 ${open?'translate-x-0':''}`}>{nav}</aside>
  </>;
}
