import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookHeart, CalendarHeart, CalendarPlus, Clock, Flower2, Gift, Heart, Leaf, MapPin, MessageCircle, Quote, Send, Shirt, ShieldCheck, Users, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { NEMPO_WA_URL } from "@/lib/contact";
import { Nempo01Guestbook } from "./nempo-01-guestbook";
import { Nempo01Gifts } from "./nempo-01-gifts";
import musicAsset from "@/assets/nempo-01-beautiful-in-white.mp3.asset.json";
import coupleIllustration from "@/assets/nempo-02-couple-illustration.png";
import "./nempo-01-invitation.css";
import "./nempo-02-invitation.css";

function Blooms() {
  return <><Flower2 aria-hidden="true" className="n02-bloom n02-bloom-tl size-24" strokeWidth={.6}/><Flower2 aria-hidden="true" className="n02-bloom n02-bloom-br size-28" strokeWidth={.6}/></>;
}

function Stage() {
  return <div className="n02-stage" aria-hidden="true">
    <span className="n02-corner n02-corner-tl"/><span className="n02-corner n02-corner-tr"/><span className="n02-corner n02-corner-bl"/><span className="n02-corner n02-corner-br"/>
    <Flower2 className="n02-sprig n02-sprig-l" strokeWidth={.5}/>
    <Flower2 className="n02-sprig n02-sprig-r" strokeWidth={.5}/>
    <span className="n02-watermark">H&amp;A</span>
  </div>;
}

const events = [
  { name: "Akad Nikah", time: "08.00 – 10.00 WIB", place: "Masjid Agung Garut (contoh)" },
  { name: "Resepsi", time: "11.00 – 14.00 WIB", place: "Gedung Serbaguna, Garut (contoh)" },
];
const rundown = [
  ["08.00", "Akad nikah & doa bersama"], ["10.00", "Sungkeman keluarga"], ["11.00", "Kirab & penyambutan tamu"], ["12.00", "Ramah tamah & hiburan"], ["13.30", "Sesi foto bersama"],
];
const story = [
  { year: "2021", title: "Berawal dari satu percakapan", text: "Dari obrolan singkat di sebuah acara keluarga, kami belajar saling mendengarkan." },
  { year: "2023", title: "Belajar saling menjaga", text: "Melewati jarak dan kesibukan, kami memilih untuk tetap jujur dan saling mendukung." },
  { year: "2026", title: "Melangkah dengan restu", text: "Dengan doa kedua keluarga, kami siap memulai satu rumah tangga yang penuh kasih." },
];
const palette = ["#2f5e8a", "#9fbcd4", "#f7f4ec", "#b8975a"];

export function Nempo02Invitation() {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const [guest, setGuest] = useState("Bapak/Ibu/Saudara/i");
  const [now, setNow] = useState(() => Date.now());
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    audio.volume = .35;
    try { await audio.play(); } catch { setPlaying(false); }
  }
  function openInvitation() {
    setStage("opening");
    void toggleMusic();
    window.setTimeout(() => { setStage("open"); window.scrollTo({ top: 0, behavior: "instant" }); }, 900);
  }
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to");
    if (name?.trim()) setGuest(name.trim());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (stage !== "open") return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("n01-visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll(".nempo-two main section").forEach((el) => { el.classList.add("n01-reveal"); observer.observe(el); });
    return () => observer.disconnect();
  }, [stage]);

  const remaining = Math.max(0, new Date("2026-12-20T08:00:00+07:00").getTime() - now);
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  const consult = `${NEMPO_WA_URL}?text=${encodeURIComponent("Halo Nempo, saya tertarik undangan NEMPO 02 — Biru Bunga (Spesial Tanpa Foto).")}`;
  const calendar = "data:text/calendar;charset=utf-8," + encodeURIComponent("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:nempo02-demo@nempo\r\nDTSTAMP:20261031T000000Z\r\nDTSTART:20261220T010000Z\r\nDTEND:20261220T070000Z\r\nSUMMARY:Pernikahan Habib dan Adiba (Contoh)\r\nLOCATION:Garut - lokasi contoh\r\nEND:VEVENT\r\nEND:VCALENDAR");

  return <div className="nempo-one nempo-two relative min-h-screen overflow-x-hidden">
    <audio ref={audioRef} src={musicAsset.url} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <div className="n01-petals" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i} className={`n01-petal n01-petal-${i}`}><Flower2 strokeWidth={1}/></span>)}</div>

    {stage !== "open" ? <section className={`n02-cover relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-16 text-center ${stage === "opening" ? "n02-opening" : "n01-enter"}`}>
      <Stage/>
      <Link href="/wedding-invitation#tema" className="n02-back n01-blue n01-body absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-xs"><ArrowLeft className="size-4"/> Pilihan tema</Link>
      <div className="n02-frame n02-paper relative z-[1] w-full max-w-md overflow-hidden rounded-sm px-6 py-12 sm:px-12 sm:py-20">
        <Blooms/>
        <div className="n02-garland mx-auto flex items-center justify-center gap-2 opacity-75"><Leaf className="n01-blue size-4 -scale-x-100" strokeWidth={1}/><Flower2 className="n01-blue size-5" strokeWidth={1}/><Leaf className="n01-blue size-4" strokeWidth={1}/></div>
        <p className="n01-label n01-blue mt-6">NEMPO 02 · Biru Bunga</p>
        <div className="n02-illu n02-illu-cover mx-auto mt-8"><img src={coupleIllustration} alt="Ilustrasi pasangan pengantin" width={768} height={1024}/></div>
        <p className="n01-label mt-8 opacity-70">The wedding of</p>
        <h1 className="n01-blue mt-3 text-4xl leading-tight sm:text-5xl">Habib <span className="n02-gold italic">&</span> Adiba</h1>
        <p className="mt-3 text-base">Minggu, 20 . 12 . 2026</p>
        <div className="n01-line mx-auto my-6 h-px w-16 border-t"/>
        <p className="n01-body text-xs opacity-70">Kepada Yth.</p>
        <p className="mt-2 break-words text-xl">{guest}</p>
        <button type="button" onClick={openInvitation} aria-label="Buka Undangan" className="n02-seal n01-body mx-auto mt-8 text-[10px] font-semibold uppercase tracking-wider">Buka</button>
        <p className="n01-body mt-3 text-[11px] opacity-70">Ketuk segel untuk membuka undangan</p>
        <p className="n01-body mt-6 text-[10px] opacity-60">Contoh undangan · Spesial Tanpa Foto</p>
      </div>
    </section> : <><main className="n01-enter">
      <section id="mempelai" className="n02-cover relative mx-auto max-w-5xl scroll-mt-20 overflow-hidden px-6 py-20 text-center">
        <Blooms/>
        <p className="n01-label n01-blue">Bismillahirrahmanirrahim</p>
        <div className="n02-monogram mx-auto mt-8"><span className="n01-blue text-4xl">H<span className="n02-gold italic">&</span>A</span></div>
        <h2 className="mt-8 text-3xl sm:text-4xl">Dua hati, satu doa</h2>
        <p className="n01-body mx-auto mt-4 max-w-md text-xs leading-7">Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:</p>
        <div className="mx-auto mt-10 grid max-w-3xl items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
          <div className="n02-arch px-6 py-10"><Flower2 className="n01-blue mx-auto size-6" strokeWidth={1}/><h3 className="n01-blue mt-4 text-3xl">Habib Ramadhan</h3><p className="n01-body mt-3 text-xs leading-6">Putra pertama dari<br/>Bapak Ahmad & Ibu Siti</p></div>
          <div className="flex flex-col items-center gap-3"><div className="n02-illu n02-illu-arch"><img src={coupleIllustration} alt="Ilustrasi pasangan pengantin" loading="lazy" width={768} height={1024}/></div><span className="n02-gold text-4xl italic">&</span></div>
          <div className="n02-arch px-6 py-10"><Flower2 className="n01-blue mx-auto size-6" strokeWidth={1}/><h3 className="n01-blue mt-4 text-3xl">Adiba Nurul</h3><p className="n01-body mt-3 text-xs leading-6">Putri kedua dari<br/>Bapak Hasan & Ibu Aisyah</p></div>
        </div>
        <blockquote className="n01-line mx-auto mt-12 max-w-xl border-t pt-8 text-base italic leading-8">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</blockquote>
        <p className="n01-label n02-gold mt-3">QS. Ar-Rum: 21</p>
      </section>

      <section id="acara" className="n01-soft relative scroll-mt-20 px-6 py-16 text-center">
        <p className="n01-label n01-blue">Save the date</p><h2 className="mt-3 text-3xl sm:text-4xl">Menuju hari bahagia</h2>
        <div className="mx-auto mt-8 grid max-w-sm grid-cols-4 gap-2">{countdown.map((v, i) => <div key={i} className="n02-paper n01-line rounded-md border py-3"><p className="n01-blue text-2xl tabular-nums">{String(v).padStart(2, "0")}</p><p className="n01-label mt-1">{["Hari", "Jam", "Menit", "Detik"][i]}</p></div>)}</div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">{events.map((e) => <article key={e.name} className="n02-paper n01-line rounded-lg border p-6"><CalendarHeart className="n01-blue mx-auto size-6" strokeWidth={1}/><h3 className="mt-3 text-2xl">{e.name}</h3><p className="n01-body mt-3 text-xs leading-7">Minggu, 20 Desember 2026<br/>{e.time}<br/>{e.place}</p></article>)}</div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="n01-body rounded-md text-xs"><a href="https://www.google.com/maps/search/?api=1&query=Garut+Jawa+Barat" target="_blank" rel="noopener noreferrer"><MapPin/> Lihat area lokasi</a></Button>
          <Button asChild variant="outline" className="n01-body rounded-md text-xs"><a href={calendar} download="NEMPO-02-kalender-contoh.ics"><CalendarPlus/> Simpan tanggal</a></Button>
        </div>
      </section>

      <section id="cerita" className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
        <div className="text-center"><BookHeart className="n01-blue mx-auto size-6" strokeWidth={1}/><p className="n01-label n01-blue mt-3">Every love has a story</p><h2 className="mt-3 text-3xl">Cerita yang bersemi</h2><p className="n01-body mt-3 text-[11px] opacity-70">Contoh cerita pasangan</p></div>
        <ol className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">{story.map((item) => <li key={item.year} className="n02-paper n01-line rounded-lg border p-6 text-center"><p className="n01-label n02-gold">{item.year}</p><h3 className="mt-3 text-xl leading-snug">{item.title}</h3><p className="n01-body mt-3 text-xs leading-7">{item.text}</p></li>)}</ol>
      </section>

      <section id="susunan" className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
        <div className="text-center"><Clock className="n01-blue mx-auto size-6" strokeWidth={1}/><p className="n01-label n01-blue mt-3">Rundown</p><h2 className="mt-3 text-3xl">Susunan acara</h2></div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-[1fr_260px] sm:items-center">
          <ol className="n01-line w-full max-w-md space-y-6 border-l pl-7 sm:mx-auto">{rundown.map(([t, label]) => <li key={t} className="relative"><span className="n01-timeline-dot absolute -left-9 top-1 size-4 rounded-full"/><p className="n01-label n02-gold">{t} WIB</p><p className="mt-1 text-lg">{label}</p></li>)}</ol>
          <aside className="n02-paper n01-line rounded-lg border p-6 text-center"><Quote className="n02-gold mx-auto size-5" strokeWidth={1}/><p className="n01-label n01-blue mt-4">Catatan tamu</p><p className="n01-body mt-3 text-xs leading-7">Acara dimulai tepat waktu. Mohon berkenan hadir 15 menit lebih awal agar kami dapat menyambut Anda dengan hangat.</p></aside>
        </div>
      </section>

      <section id="dresscode" className="n01-soft px-6 py-16 text-center">
        <Shirt className="n01-blue mx-auto size-6" strokeWidth={1}/><p className="n01-label n01-blue mt-3">Dress code</p><h2 className="mt-3 text-3xl">Nuansa biru & ivory</h2>
        <div className="mt-6 flex justify-center gap-3">{palette.map((c) => <span key={c} className="n02-swatch" style={{ background: c }} aria-label={`Warna ${c}`}/>)}</div>
        <p className="n01-body mx-auto mt-5 max-w-sm text-xs leading-7">Kami akan senang bila Anda berkenan memakai warna senada agar foto bersama terasa harmonis.</p>
      </section>

      <section id="protokol" className="mx-auto max-w-5xl px-6 py-16 text-center">
        <ShieldCheck className="n01-blue mx-auto size-6" strokeWidth={1}/><p className="n01-label n01-blue mt-3">Etika tamu</p><h2 className="mt-3 text-3xl">Agar acara nyaman</h2>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">{[{ Icon: Clock, t: "Hadir tepat waktu" }, { Icon: Users, t: "Ikuti arahan penerima tamu" }, { Icon: Gift, t: "Doa restu adalah hadiah terbaik" }].map(({ Icon, t }) => <div key={t} className="n02-paper n01-line rounded-lg border p-5"><Icon className="n02-gold mx-auto size-5"/><p className="n01-body mt-3 text-xs">{t}</p></div>)}</div>
      </section>

      <Nempo01Guestbook guest={guest}/>
      <Nempo01Gifts/>

      <section className="n01-soft px-6 py-14 text-center">
        <p className="n01-label n01-blue">Turut mengundang</p>
        <p className="n01-body mx-auto mt-4 max-w-md text-xs leading-7">Keluarga Besar Bapak Ahmad & Ibu Siti<br/>Keluarga Besar Bapak Hasan & Ibu Aisyah</p>
        <p className="mt-8 text-2xl italic">Terima kasih atas doa & kehadiran Anda</p>
        <p className="n01-blue mt-3 text-3xl">Habib <span className="n02-gold">&</span> Adiba</p>
      </section>

      <footer className="px-6 pb-24 pt-10 text-center"><p className="n01-label n01-blue">NEMPO 02 · Biru Bunga Tanpa Foto</p><Button asChild className="n01-body mt-4 rounded-md text-xs"><a href={consult} target="_blank" rel="noopener noreferrer"><Send/> Pesan tema ini</a></Button><p className="n01-body mt-5 text-[10px] leading-5 opacity-70">Nama, tanggal, lokasi, dan data hadiah merupakan contoh.<br/>Musik: Beautiful In White (Saxophone Cover) · Dori Wirawan<br/>Nempo Garut Organizer</p></footer>
    </main><nav aria-label="Bagian undangan" className="n01-nav n01-line n01-body fixed inset-x-0 bottom-0 z-30 flex justify-center gap-3 border-t px-3 py-4 sm:gap-8"><a href="#mempelai" className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2"><Heart className="size-4"/>Mempelai</a><a href="#acara" className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2"><CalendarHeart className="size-4"/>Acara</a><a href="#cerita" className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2"><BookHeart className="size-4"/>Cerita</a><a href="#susunan" className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2"><Clock className="size-4"/>Rundown</a><a href="#rsvp" className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2"><MessageCircle className="size-4"/>RSVP</a><button type="button" onClick={toggleMusic} aria-label={playing ? "Matikan musik" : "Putar musik"} className="n01-blue flex flex-col items-center gap-1 text-[10px] sm:flex-row sm:gap-2">{playing ? <Volume2 className="size-4"/> : <VolumeX className="size-4"/>}Musik</button></nav></>}
  </div>;
}
