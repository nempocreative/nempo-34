import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { DigitalPreviewGate } from "@/components/digital-preview-gate";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./digital-demo-super-app.css";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  GraduationCap,
  Heart,
  Image,
  Menu,
  MessageCircle,
  Quote,
  Send,
  Users,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "@/lib/wouter";

type Student = {
  name: string;
  role: string;
  initials: string;
  color: string;
  quote: string;
};

const students: Student[] = [
  { name: "Nadia Putri", role: "Ketua angkatan", initials: "NP", color: "#edb8ae", quote: "Kita mungkin punya arah yang berbeda, tapi pernah tumbuh di halaman yang sama." },
  { name: "Rayhan Aditya", role: "The strategist", initials: "RA", color: "#aec8dc", quote: "Hal paling seru dari sekolah adalah tidak pernah tahu cerita apa yang menunggu besok." },
  { name: "Salsa Nuraini", role: "Creative soul", initials: "SN", color: "#d6c0dc", quote: "Terima kasih untuk semua tawa yang membuat hari biasa terasa istimewa." },
  { name: "Dimas Pratama", role: "The connector", initials: "DP", color: "#e5c889", quote: "Kelas ini mengajarkan bahwa teman baik selalu punya cara untuk tinggal." },
  { name: "Aulia Rahman", role: "Quiet achiever", initials: "AR", color: "#b8d3c8", quote: "Kita selesai di sini, tapi cerita kita tidak pernah benar-benar selesai." },
  { name: "Maya Kirana", role: "The optimist", initials: "MK", color: "#c7badb", quote: "Simpan yang baik-baik. Nanti kita akan rindu semuanya." },
];

const chapters = [
  { number: "01", title: "Hari pertama", date: "Juli 2023", text: "Seragam baru, nama-nama yang belum hafal, dan bangku yang akhirnya menjadi tempat pulang." },
  { number: "02", title: "Tumbuh bersama", date: "2024 — 2025", text: "Dari tugas kelompok sampai obrolan setelah bel pulang, pelan-pelan kita menjadi satu angkatan." },
  { number: "03", title: "Sampai jumpa", date: "April 2026", text: "Kita menutup satu bab dengan bangga, membawa lebih banyak cerita daripada yang bisa ditulis di sini." },
];

const gallery = [
  { label: "Field trip", className: "bg-gradient-to-br from-[#9fbdd4] via-[#6d7fa9] to-[#414c7d]", mark: "01" },
  { label: "Class project", className: "bg-gradient-to-br from-[#e6c88e] via-[#d78971] to-[#8c586c]", mark: "02" },
  { label: "After class", className: "bg-gradient-to-br from-[#b9d3c6] via-[#6c9b91] to-[#3e666b]", mark: "03" },
  { label: "Graduation day", className: "bg-gradient-to-br from-[#d5bfdc] via-[#9483bb] to-[#5968b7]", mark: "04" },
];

export default function DigitalYearbookDemoPage() {
  return (
    <DigitalPreviewGate
      title="Memories Book"
      description="Masukkan password untuk membuka preview yearbook digital Nempo."
    >
      <YearbookWorkspace />
    </DigitalPreviewGate>
  );
}

function YearbookWorkspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [sent, setSent] = useState(false);
  const [messageCount, setMessageCount] = useState(128);
  const [selectedMemory, setSelectedMemory] = useState<typeof gallery[number] | null>(null);
  const selected = students[selectedStudent];

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    setMessageCount((count) => count + 1);
    event.currentTarget.reset();
  }

  return (
    <Layout>
      <SEO
        title="Memories Book Demo — Digi Nempo"
        description="Preview yearbook digital yang menyimpan wajah, cerita, dan pesan satu angkatan."
        keywords="demo yearbook digital, memories book, buku tahunan digital, yearbook sekolah, Digi Nempo"
        path="/digital-services/yearbook"
      />

      <main className="nempo-demo-green nempo-yearbook-preview min-h-screen bg-[#f4f7f7] text-[#183b43]">
        <section className="overflow-hidden bg-[#123f47] text-[#f8ffff]">
          <div className="mx-auto max-w-7xl px-5 pb-8 pt-4 sm:px-8 lg:px-10">
            <nav className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-4">
                <Link href="/digital-services" className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white">← Digi Nempo</Link>
                <Link href="/digital-services/super-app?module=yearbook" className="hidden text-[10px] font-black text-[#a2e4dc] transition-colors hover:text-white sm:inline-flex">Business OS <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              </div>
              <div className="hidden items-center gap-8 text-[11px] font-bold text-white/65 md:flex">
                <a href="#angkatan" className="transition-colors hover:text-white">Angkatan</a>
                <a href="#cerita" className="transition-colors hover:text-white">Cerita</a>
                <a href="#galeri" className="transition-colors hover:text-white">Galeri</a>
                <a href="#pesan" className="transition-colors hover:text-white">Pesan</a>
              </div>
              <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Buka menu" className="grid h-8 w-8 place-items-center border border-white/20 md:hidden">
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </nav>
            {menuOpen && (
              <div className="grid gap-2 border-b border-white/15 py-4 text-xs font-bold md:hidden">
                {[
                  ["angkatan", "Angkatan"],
                  ["cerita", "Cerita"],
                  ["galeri", "Galeri"],
                  ["pesan", "Pesan"],
                ].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="py-1 text-white/70 hover:text-white">{label}</a>)}
              </div>
            )}

            <div className="flex items-center justify-between border-b border-white/15 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span>Memories Book / XII IPA 2</span>
              <span className="hidden sm:inline">SMA Nempo — 2026</span>
              <span>Keep the feeling</span>
            </div>

            <div className="grid items-center gap-12 pb-16 pt-16 lg:grid-cols-[1fr_1fr] lg:pb-24 lg:pt-24">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a2e4dc]"><span className="h-1.5 w-1.5 rounded-full bg-[#a2e4dc]" /> Yearbook digital / class of 2026</div>
                <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">We came.<br /><span className="text-[#a2e4dc]">We grew.</span><br />We remember.</h1>
                <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">Satu ruang untuk menyimpan wajah, suara, dan momen kecil yang membuat satu angkatan terasa seperti rumah.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#angkatan" className="inline-flex items-center justify-center gap-2 bg-[#e6f6f3] px-5 py-3.5 text-sm font-black text-[#123f47] transition-transform hover:-translate-y-0.5">Kenalan dengan angkatan <ArrowRight className="h-4 w-4" /></a>
                  <a href="#galeri" className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/10">Buka galeri <Image className="h-4 w-4" /></a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[510px]">
                <div className="absolute -left-7 top-5 h-32 w-32 rounded-full bg-[#a2e4dc]/30 blur-3xl" />
                <div className="absolute -bottom-8 -right-6 h-36 w-36 rounded-full bg-[#8292df]/40 blur-3xl" />
                <div className="relative rotate-2 border border-white/20 bg-white p-3 text-[#183b43] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#e3eeed] px-3 pb-3 text-[9px] font-black uppercase tracking-[0.15em]"><span>Memories / 2026</span><span>Vol. 01</span></div>
                  <div className="grid min-h-[280px] grid-cols-1 gap-3 p-2 sm:min-h-[320px] sm:grid-cols-[1.1fr_.9fr] sm:p-3">
                    <div className="relative min-h-[210px] overflow-hidden bg-[#0f766e] p-4 text-[#f8ffff] sm:min-h-0 sm:p-5"><div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-full border-[22px] border-[#a2e4dc]/65" /><Image className="relative h-5 w-5 text-[#a2e4dc]" /><p className="relative mt-12 max-w-[11rem] text-3xl font-black leading-[0.88] tracking-[-0.06em] sm:mt-20 sm:text-4xl">The<br />people<br />we<br />became.</p><p className="absolute bottom-5 left-5 text-[9px] font-black uppercase tracking-[0.16em] text-white/60">XII IPA 2</p></div>
                    <div className="grid grid-rows-[1.2fr_.8fr] gap-3">
                      <div className="relative overflow-hidden bg-[#e6f6f3] p-3"><div className="absolute -right-8 -top-5 h-28 w-28 rounded-full bg-[#123f47]/15" /><div className="absolute bottom-4 left-4 right-4 h-24 border border-white/80 p-2"><div className="h-full bg-gradient-to-br from-[#8ed3ca] to-[#0f766e]" /></div><span className="absolute bottom-3 left-3 text-[8px] font-black uppercase tracking-[0.13em] text-[#123f47]">Chapter 01</span></div>
                      <div className="bg-[#d4efeb] p-3"><div className="flex h-full flex-col justify-between border border-[#72bdb4]/60 p-2"><Users className="h-4 w-4 text-[#0f766e]" /><p className="text-[10px] font-black leading-3">36 stories.<br />One chapter.</p></div></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#e3eeed] px-3 pt-3 text-[9px] font-bold text-[#8aa1a3]"><span>Curated with Digi Nempo</span><span>↗</span></div>
                </div>
                <div className="absolute -bottom-7 -left-3 z-10 flex items-center gap-3 border border-[#d8e9e7] bg-white px-4 py-3 text-[#183b43] shadow-xl sm:-left-8"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e6f6f3]"><Heart className="h-4 w-4 text-[#0f766e]" /></div><div><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#8aa1a3]">Made to keep</p><p className="mt-0.5 text-sm font-black">Every little moment.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e3eeed] bg-[#f4f7f7]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#e3eeed] px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
            {[["36", "siswa"], ["03", "tahun bersama"], ["14", "cerita pilihan"], ["128", "pesan teman"]].map(([value, label]) => (
              <div key={label} className="px-4 py-6 first:pl-0 sm:px-6 lg:py-8"><p className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8aa1a3]">{label}</p></div>
            ))}
          </div>
        </section>

        <section id="angkatan" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">The people</p><h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Kenalan dengan angkatan.</h2></div><p className="max-w-xs text-sm leading-6 text-[#6f8a8c]">Setiap orang punya suara, kebiasaan, dan satu halaman yang layak diingat.</p></div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {students.map((student, index) => (
                <button key={student.name} type="button" onClick={() => setSelectedStudent(index)} className={`group relative overflow-hidden p-3 text-left transition-all hover:-translate-y-1 ${selectedStudent === index ? "ring-2 ring-[#0f766e] ring-offset-2 ring-offset-[#f4f7f7]" : ""}`} style={{ backgroundColor: student.color }}>
                  <div className="flex aspect-[.82] flex-col justify-between border border-white/55 p-3">
                    <span className="self-end text-[9px] font-black text-[#272b59]/50">0{index + 1}</span>
                    <div><div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-white/55 text-xs font-black text-[#272b59]">{student.initials}</div><p className="text-sm font-black leading-tight text-[#272b59]">{student.name}</p><p className="mt-1 text-[10px] font-bold text-[#272b59]/55">{student.role}</p></div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex flex-col justify-between bg-[#123f47] p-6 text-[#f8ffff] sm:p-8">
              <div><Quote className="h-8 w-8 text-[#a2e4dc]" /><p className="mt-8 text-2xl font-black leading-tight tracking-[-0.04em]">“{selected.quote}”</p></div>
              <div className="mt-10 flex items-end justify-between border-t border-white/15 pt-5"><div><p className="text-lg font-black">{selected.name}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/45">{selected.role}</p></div><span className="text-[10px] font-black text-[#a2e4dc]">Profile 0{selectedStudent + 1}</span></div>
            </div>
          </div>
        </section>

        <section id="cerita" className="bg-[#e6f6f3]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Our chapters</p><h2 className="mt-4 max-w-sm text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">Tiga tahun, lebih banyak cerita.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#6f8a8c]">Bukan hanya tanggal dan foto. Setiap bab menyimpan rasa yang berbeda dari perjalanan kita.</p></div><div className="divide-y divide-[#b9ded8] border-y border-[#b9ded8]">{chapters.map((chapter) => <div key={chapter.number} className="grid gap-3 py-6 sm:grid-cols-[3rem_10rem_1fr] sm:items-center"><span className="text-xs font-black text-[#0f766e]">{chapter.number}</span><div><h3 className="text-lg font-black">{chapter.title}</h3><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8a8c]">{chapter.date}</p></div><p className="text-sm leading-6 text-[#6f8a8c]">{chapter.text}</p></div>)}</div></div>
          </div>
        </section>

        <section id="galeri" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">Photo archive</p><h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Yang ingin kita ulang.</h2></div><span className="hidden items-center gap-2 text-xs font-black text-[#0f766e] sm:flex">Pilih memory <ArrowUpRight className="h-4 w-4" /></span></div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((item, index) => <button type="button" key={item.label} onClick={() => setSelectedMemory(item)} aria-label={`Buka memory ${item.label}`} className={`group relative overflow-hidden text-left ${index === 1 ? "sm:mt-8" : index === 3 ? "sm:-mt-5" : ""}`}><div className={`aspect-[.78] ${item.className} p-3 transition-transform duration-500 group-hover:scale-105`}><div className="flex h-full flex-col justify-between border border-white/45 p-3 text-white"><span className="text-[9px] font-black">{item.mark}</span><div><p className="text-lg font-black">{item.label}</p><span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-white/65">Open memory <ChevronRight className="h-3 w-3" /></span></div></div></div></button>)}
          </div>
        </section>

        <section id="pesan" className="bg-[#123f47] text-[#f8ffff]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:px-10 lg:py-24">
            <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a2e4dc]">Leave a note</p><h2 className="mt-4 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Satu kalimat untuk dibawa pulang.</h2><p className="mt-6 max-w-md text-sm leading-7 text-white/60">Tulis pesan untuk teman-temanmu. Pesan ini akan menjadi bagian dari halaman terakhir yearbook angkatan.</p><div className="mt-8 flex items-center gap-3 text-xs font-black text-[#a2e4dc]"><MessageCircle className="h-4 w-4" /> {messageCount} pesan sudah terkumpul</div></div>
            <form onSubmit={submitMessage} className="bg-white/10 p-5 backdrop-blur-sm sm:p-7"><div className="mb-5 flex items-center gap-2 text-xs font-black"><Send className="h-4 w-4 text-[#a2e4dc]" /> Tulis pesan angkatan</div><div className="grid gap-3"><input required name="name" placeholder="Namamu" className="border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#a2e4dc]" /><textarea required name="message" rows={5} placeholder="Terima kasih untuk..." className="resize-none border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#a2e4dc]" /></div><button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 bg-[#e6f6f3] px-4 py-3 text-sm font-black text-[#123f47] transition-colors hover:bg-white">{sent ? "Pesan tersimpan di demo" : "Kirim pesan"} <Check className="h-4 w-4" /></button></form>
          </div>
        </section>

        <section className="bg-[#e6f6f3] text-[#183b43]"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8 lg:px-10"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f766e]">For the next chapter</p><h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Buat Memories Book untuk angkatanmu.</h2></div><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#123f47] px-5 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5">Konsultasi dengan Nempo <ArrowUpRight className="h-4 w-4" /></a></div></section>

        <footer className="bg-[#123f47] px-5 py-7 text-[#f8ffff] sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 sm:flex-row"><span>Digi Nempo / Memories Book preview</span><span>Keep the feeling.</span></div></footer>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-[#123f47]/70 p-5 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMemory(null); }}>
            <div role="dialog" aria-modal="true" aria-label={`${selectedMemory.label} memory`} className="w-full max-w-lg overflow-hidden bg-white shadow-2xl">
              <div className={`relative aspect-[1.7] ${selectedMemory.className} p-5`}>
                <button type="button" onClick={() => setSelectedMemory(null)} aria-label="Tutup memory" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35"><X className="h-4 w-4" /></button>
                <div className="flex h-full flex-col justify-between border border-white/50 p-5 text-white"><span className="text-xs font-black">{selectedMemory.mark}</span><div><p className="text-3xl font-black">{selectedMemory.label}</p><p className="mt-1 text-xs font-bold text-white/70">Memory tersimpan di Memories Book / 2026</p></div></div>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f766e]">Open memory</p><p className="mt-1 text-xs text-[#6f8a8c]">Preview galeri digital siap dibagikan ke satu angkatan.</p></div><button type="button" onClick={() => setSelectedMemory(null)} className="rounded-xl bg-[#0f766e] px-4 py-2.5 text-xs font-black text-white hover:bg-[#0b625c]">Selesai</button></div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}