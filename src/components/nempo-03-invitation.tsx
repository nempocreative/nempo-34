import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookHeart, CalendarHeart, CalendarPlus, Flower2, Heart, Images, Leaf, MailOpen, MapPin, MessageCircle, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@/lib/wouter";
import { NEMPO_WA_URL } from "@/lib/contact";
import { Nempo01Guestbook } from "./nempo-01-guestbook";
import { Nempo01Gifts } from "./nempo-01-gifts";
import coverPhoto from "@/assets/nempo-03-wedding-cover.jpg";
import storyPhoto from "@/assets/nempo-03-wedding-story.jpg";
import musicAsset from "@/assets/nempo-01-beautiful-in-white.mp3.asset.json";
import "./nempo-01-invitation.css";
import "./nempo-03-invitation.css";

const moments = [
  { year: "2021", title: "Pertemuan pertama", text: "Sebuah pertemuan sederhana menjadi awal percakapan yang tak pernah ingin kami akhiri." },
  { year: "2023", title: "Memilih bersama", text: "Dalam banyak cerita dan perjalanan, kami menemukan rumah pada satu sama lain." },
  { year: "2026", title: "Satu janji, selamanya", text: "Dengan restu kedua keluarga, kami melangkah menuju babak baru sebagai pasangan." },
];

export function Nempo03Invitation() {
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState("Bapak/Ibu/Saudara/i");
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to")?.trim();
    if (name) setGuest(name);
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!open) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("n01-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.15 });
    document.querySelectorAll(".nempo-three main section").forEach((element) => { element.classList.add("n01-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, [open]);
  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try { audio.volume = .35; await audio.play(); setMusicUnavailable(false); }
    catch { setMusicUnavailable(true); setPlaying(false); }
  }
  const remaining = now ? Math.max(0, new Date("2026-12-20T08:00:00+07:00").getTime() - now) : 0;
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  const consult = `${NEMPO_WA_URL}?text=${encodeURIComponent("Halo Nempo, saya tertarik undangan NEMPO 03 — Peach Klasik (Premium Vintage Foto).")}`;
  const calendar = "data:text/calendar;charset=utf-8," + encodeURIComponent("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:nempo03-demo@nempo\r\nDTSTAMP:20261031T000000Z\r\nDTSTART:20261220T010000Z\r\nDTEND:20261220T070000Z\r\nSUMMARY:Pernikahan Habib dan Adiba (Contoh)\r\nLOCATION:Garut - lokasi contoh\r\nEND:VEVENT\r\nEND:VCALENDAR");

  return <div className="nempo-one nempo-three min-h-screen overflow-x-hidden">
    <audio ref={audioRef} src={musicAsset.url} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <section className="n03-cover" id="sampul">
      <img className="n03-cover-photo" src={coverPhoto} alt="Contoh foto pasangan pengantin di taman klasik" width={1024} height={1536}/>
      <Link href="/wedding-invitation#tema" className="n03-back"><ArrowLeft className="size-4"/> Pilihan tema</Link>
      <div className="n03-cover-content n03-reveal">
        <p className="n01-label">NEMPO 03 · Peach Klasik</p>
        <p className="n01-label mt-5">The wedding of</p>
        <h1 className="n03-title">Habib &amp; Adiba</h1>
        <p className="text-lg">Minggu, 20 Desember 2026</p>
        {!open && <><div className="n03-divider"/><p className="n01-body text-xs">Kepada Yth.</p><p className="mt-2 break-words text-xl">{guest}</p>
          <Button onClick={() => { setOpen(true); window.scrollTo({ top: 0, behavior: "instant" }); }} className="n01-body mt-6 rounded-sm px-6 text-xs"><MailOpen/> Buka Undangan</Button></>}
      </div>
    </section>
    {!open ? <div className="n03-peach px-5 py-5 text-center"><p className="n01-label">Premium Vintage Foto · Contoh undangan</p></div> : <><main className="n03-reveal">
      <section id="mempelai" className="scroll-mt-10 px-6 py-20">
        <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-[.85fr_1fr]">
          <img src={coverPhoto} alt="Contoh foto Habib dan Adiba" className="n03-arch mx-auto max-w-sm" width={1024} height={1536} loading="lazy"/>
          <div className="text-center"><Leaf className="n03-leaf mx-auto size-8" strokeWidth={1}/><p className="n01-label n01-blue mt-5">Bismillahirrahmanirrahim</p><h2 className="mt-4 text-4xl">Bersama, selamanya</h2><p className="n01-body mt-5 text-xs leading-7">Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Anda untuk merayakan pernikahan kami.</p>
            <h3 className="n01-blue mt-8 text-3xl">Habib Ramadhan</h3><p className="n01-body mt-2 text-xs leading-6">Putra Bapak Ahmad &amp; Ibu Siti</p><p className="n03-rose my-4 text-3xl italic">&amp;</p><h3 className="n01-blue text-3xl">Adiba Nurul</h3><p className="n01-body mt-2 text-xs leading-6">Putri Bapak Hasan &amp; Ibu Aisyah</p>
          </div>
        </div>
        <blockquote className="mx-auto mt-14 max-w-2xl text-center text-lg italic leading-8">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</blockquote><p className="n01-label n03-rose mt-4 text-center">QS. Ar-Rum: 21</p>
      </section>
      <section id="acara" className="n01-soft scroll-mt-10 px-6 py-16 text-center"><Flower2 className="n03-leaf mx-auto size-8" strokeWidth={1}/><p className="n01-label n01-blue mt-4">Save the date</p><h2 className="mt-3 text-4xl">Hari yang dinanti</h2><p className="mt-4 text-lg">20 . 12 . 2026</p>
        <div className="n01-line mx-auto mt-8 grid max-w-sm grid-cols-4 border-y py-5">{countdown.map((value, i) => <div key={i}><p className="n01-blue text-3xl tabular-nums">{String(value).padStart(2, "0")}</p><p className="n01-label mt-2">{["Hari", "Jam", "Menit", "Detik"][i]}</p></div>)}</div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">{[{ title: "Akad Nikah", time: "08.00 – 10.00 WIB", place: "Masjid Agung Garut (contoh)" }, { title: "Resepsi", time: "11.00 – 14.00 WIB", place: "Gedung Serbaguna, Garut (contoh)" }].map((event) => <article className="n03-event" key={event.title}><CalendarHeart className="n01-blue mx-auto size-6" strokeWidth={1}/><h3 className="mt-4 text-3xl">{event.title}</h3><p className="n01-body mt-4 text-xs leading-7">Minggu, 20 Desember 2026<br/>{event.time}<br/>{event.place}</p></article>)}</div>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild variant="outline" className="n01-body rounded-sm text-xs"><a href="https://www.google.com/maps/search/?api=1&query=Garut+Jawa+Barat" target="_blank" rel="noopener noreferrer"><MapPin/> Lihat area lokasi</a></Button><Button asChild variant="outline" className="n01-body rounded-sm text-xs"><a href={calendar} download="NEMPO-03-kalender-contoh.ics"><CalendarPlus/> Simpan tanggal</a></Button></div>
      </section>
      <section id="cerita" className="scroll-mt-10 px-6 py-20"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="n01-label n03-rose">Our love story</p><h2 className="mt-3 text-4xl">Cerita kita</h2><p className="n01-body mt-3 text-[11px] opacity-70">Contoh cerita pasangan</p></div><img src={storyPhoto} alt="Contoh potret pasangan di taman bunga" width={1536} height={1024} loading="lazy" className="n03-photo n03-story-photo mt-10"/><ol className="mt-10 grid gap-8 sm:grid-cols-3">{moments.map((moment) => <li key={moment.year} className="n01-line border-t pt-5"><p className="n01-label n03-rose">{moment.year}</p><h3 className="mt-3 text-2xl">{moment.title}</h3><p className="n01-body mt-3 text-xs leading-7">{moment.text}</p></li>)}</ol></div></section>
      <section id="galeri" className="n03-peach scroll-mt-10 px-6 py-16"><div className="mx-auto max-w-4xl"><div className="text-center"><p className="n01-label n03-rose">Little moments, lasting memories</p><h2 className="mt-3 text-4xl">Dalam bingkai</h2></div><div className="n03-gallery mt-10">{[{ src: coverPhoto, width: 1024, height: 1536 }, { src: storyPhoto, width: 1536, height: 1024 }].map((photo, i) => <Button key={photo.src} variant="ghost" aria-label={`Perbesar foto ${i + 1}`} onClick={() => setSelectedPhoto(photo.src)}><img src={photo.src} alt={`Foto contoh pasangan ${i + 1}`} width={photo.width} height={photo.height} loading="lazy"/></Button>)}</div></div></section>
      <Nempo01Guestbook guest={guest}/><Nempo01Gifts/>
      <section className="px-6 py-16 text-center"><Leaf className="n03-leaf mx-auto size-7" strokeWidth={1}/><p className="mx-auto mt-6 max-w-md text-xl italic leading-8">Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.</p><h2 className="n01-blue mt-6 text-4xl">Habib &amp; Adiba</h2><p className="n01-body mt-5 text-xs leading-7">Keluarga Bapak Ahmad &amp; Ibu Siti<br/>Keluarga Bapak Hasan &amp; Ibu Aisyah</p></section>
      <footer className="n01-soft px-6 pb-28 pt-10 text-center"><p className="n01-label n01-blue">NEMPO 03 · Peach Klasik</p><Button asChild className="n01-body mt-5 rounded-sm text-xs"><a href={consult} target="_blank" rel="noopener noreferrer"><Send/> Pesan tema ini</a></Button><p className="n01-body mt-5 text-[10px] leading-5 opacity-70">Nama, tanggal, cerita, lokasi, dan hadiah merupakan contoh.<br/>Foto pasangan dibuat dengan AI untuk pratinjau.<br/>Nempo Garut Organizer</p></footer>
    </main><nav className="n03-nav" aria-label="Bagian undangan">{[{ id: "mempelai", label: "Mempelai", Icon: Heart }, { id: "acara", label: "Acara", Icon: CalendarHeart }, { id: "cerita", label: "Cerita", Icon: BookHeart }, { id: "galeri", label: "Galeri", Icon: Images }, { id: "rsvp", label: "RSVP", Icon: MessageCircle }].map(({ id, label, Icon }) => <a key={id} href={`#${id}`}><Icon className="size-4"/>{label}</a>)}<Button variant="ghost" title={musicUnavailable ? "Musik contoh belum tersedia" : "Musik"} aria-label={playing ? "Matikan musik" : "Putar musik"} onClick={toggleMusic}>{playing ? <Volume2 className="size-4"/> : <VolumeX className="size-4"/>}Musik</Button></nav>
    {musicUnavailable && <p role="status" className="n01-body n01-soft fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-sm border px-4 py-3 text-xs">Musik contoh belum tersedia.</p>}
    <Dialog open={selectedPhoto !== null} onOpenChange={(value) => { if (!value) setSelectedPhoto(null); }}><DialogContent className="n03-lightbox border-0 rounded-none"><DialogTitle className="sr-only">Foto pasangan</DialogTitle>{selectedPhoto && <img src={selectedPhoto} alt="Foto contoh pasangan diperbesar"/>}</DialogContent></Dialog>
    </>}
  </div>;
}