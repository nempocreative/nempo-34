import { useEffect, useState } from "react";
import { ArrowLeft, BookHeart, CalendarHeart, CalendarPlus, Flower2, Gift, Heart, Images, MailOpen, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@/lib/wouter";
import { NEMPO_WA_URL } from "@/lib/contact";
import { Nempo01Guestbook } from "./nempo-01-guestbook";
import { Nempo01Gifts } from "./nempo-01-gifts";
import cover from "@/assets/nempo-15-wedding-cover.jpg";
import storyPhoto from "@/assets/nempo-15-wedding-story.jpg";
import "./nempo-01-invitation.css";
import "./nempo-15-invitation.css";

const moments = [
  { year: "2021", title: "Sebuah pertemuan", text: "Berawal dari percakapan sederhana, kami menemukan banyak alasan untuk kembali bertemu." },
  { year: "2023", title: "Saling memilih", text: "Di setiap langkah, kami belajar menjadi tempat pulang dan saling menguatkan." },
  { year: "2026", title: "Janji selamanya", text: "Dengan restu keluarga, kami memilih melangkah bersama dalam satu ikatan pernikahan." },
];
const sections = [
  { id: "mempelai", label: "Mempelai", Icon: Heart }, { id: "acara", label: "Acara", Icon: CalendarHeart },
  { id: "cerita", label: "Cerita", Icon: BookHeart }, { id: "galeri", label: "Galeri", Icon: Images },
  { id: "rsvp", label: "RSVP", Icon: MessageCircle }, { id: "hadiah", label: "Kado", Icon: Gift },
];

export function Nempo15Invitation() {
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState("Bapak/Ibu/Saudara/i");
  const [now, setNow] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to")?.trim();
    if (name) setGuest(name);
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!open) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("n01-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll(".nempo-fifteen main section").forEach(element => { element.classList.add("n01-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, [open]);
  const remaining = now ? Math.max(0, new Date("2026-12-20T08:00:00+07:00").getTime() - now) : 0;
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  const consult = `${NEMPO_WA_URL}?text=${encodeURIComponent("Halo Nempo, saya tertarik undangan NEMPO 15 — Merah Marun (Adat Foto).")}`;
  const calendar = "data:text/calendar;charset=utf-8," + encodeURIComponent("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Nempo//Invitation Preview//ID\r\nBEGIN:VEVENT\r\nUID:nempo15-demo@nempo\r\nDTSTAMP:20261031T000000Z\r\nDTSTART:20261220T010000Z\r\nDTEND:20261220T070000Z\r\nSUMMARY:Pernikahan Habib dan Adiba (Contoh)\r\nLOCATION:Garut - lokasi contoh\r\nEND:VEVENT\r\nEND:VCALENDAR");

  return <div className="nempo-one nempo-fifteen min-h-screen overflow-x-hidden">
    <section className="n15-cover" id="sampul">
      <img src={cover} alt="Foto contoh pengantin berbusana adat marun di halaman berarsitektur klasik" width={1024} height={1536}/>
      <Link href="/wedding-invitation#tema" className="n15-back"><ArrowLeft className="size-4"/> Pilihan tema</Link>
      <div className="n15-cover-top"><p className="n01-label">NEMPO 15 · Merah Marun</p><div className="n15-monogram" aria-hidden="true">H <span>❦</span> A</div><p className="n01-label">The wedding of</p><h1>Habib <span>&amp;</span> Adiba</h1><p className="n15-date">20 Desember 2026</p></div>
      <div className="n15-cover-bottom">{!open && <><p className="n01-body mt-5 text-xs">Kepada Yth.</p><p className="mt-2 break-words text-lg">{guest}</p><Button className="n01-body px-6 text-xs" onClick={() => { setOpen(true); window.scrollTo({ top: 0, behavior: "instant" }); }}><MailOpen/> Buka Undangan</Button></>}</div>
    </section>
    <div className="n15-strip"><p className="n01-label">HABIB & ADIBA · 20 / 12 / 2026</p></div>
    {open && <><main>
      <section id="mempelai" className="n15-section"><div className="n15-inner"><div className="n15-heading"><Flower2 className="size-7" strokeWidth={1}/><p className="n01-label">Bismillahirrahmanirrahim</p><h2>Satu janji, seumur hidup</h2></div><div className="n15-couple"><img src={cover} alt="Foto contoh Habib dan Adiba" width={1024} height={1536} loading="lazy"/><article><p className="n01-body text-xs leading-7">Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Anda untuk merayakan pernikahan kami.</p><h3>Habib Ramadhan</h3><p className="n01-body mt-3 text-xs">Putra Bapak Ahmad &amp; Ibu Siti</p><p className="n15-amp">&amp;</p><h3>Adiba Nurul</h3><p className="n01-body mt-3 text-xs">Putri Bapak Hasan &amp; Ibu Aisyah</p></article></div><blockquote className="n15-quote">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</blockquote><p className="n01-label mt-4 text-center">QS. Ar-Rum: 21</p></div></section>
      <section id="acara" className="n15-section n15-event-band text-center"><div className="n15-heading"><CalendarHeart className="size-7" strokeWidth={1}/><p className="n01-label">Save the date</p><h2>Hari bahagia kami</h2></div><p className="text-2xl">20 . 12 . 2026</p><div className="n15-countdown">{countdown.map((value, i) => <div key={i}><strong>{String(value).padStart(2, "0")}</strong><p className="n01-label mt-2">{["Hari", "Jam", "Menit", "Detik"][i]}</p></div>)}</div><div className="n15-events">{[{ title: "Akad Nikah", time: "08.00 – 10.00 WIB", location: "Masjid Agung Garut (contoh)" }, { title: "Resepsi", time: "11.00 – 14.00 WIB", location: "Gedung Serbaguna, Garut (contoh)" }].map(event => <article key={event.title}><Flower2 className="size-5" strokeWidth={1}/><h3>{event.title}</h3><p className="n01-body text-xs leading-7">Minggu, 20 Desember 2026<br/>{event.time}<br/>{event.location}</p><Button asChild variant="outline" className="n01-body mt-5 rounded-sm text-xs"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title === "Akad Nikah" ? "Masjid Agung Garut" : "Garut Jawa Barat")}`} target="_blank" rel="noopener noreferrer"><MapPin/> Lihat area lokasi</a></Button></article>)}</div><Button asChild variant="outline" className="n01-body rounded-sm text-xs"><a href={calendar} download="NEMPO-15-kalender-contoh.ics"><CalendarPlus/> Simpan tanggal</a></Button></section>
      <section id="cerita" className="n15-section"><div className="n15-inner"><div className="n15-heading"><BookHeart className="size-7" strokeWidth={1}/><p className="n01-label">Our love story · Contoh cerita</p><h2>Kisah yang kami jaga</h2></div><img src={storyPhoto} alt="Foto contoh pasangan berjalan bersama di taman mawar" width={1024} height={1536} loading="lazy" className="n15-story-photo"/><ol className="n15-story">{moments.map(moment => <li key={moment.year}><p className="n01-label">{moment.year}</p><h3>{moment.title}</h3><p className="n01-body text-xs leading-7">{moment.text}</p></li>)}</ol></div></section>
      <section id="galeri" className="n15-section n01-soft"><div className="n15-inner"><div className="n15-heading"><Images className="size-7" strokeWidth={1}/><p className="n01-label">Our moments</p><h2>Kenangan berdua</h2></div><div className="n15-gallery">{[{ src: cover, width: 1024, height: 1536 }, { src: storyPhoto, width: 1024, height: 1536 }].map((image, i) => <Button key={image.src} variant="ghost" aria-label={`Perbesar foto ${i + 1}`} onClick={() => setPhoto(image.src)}><img src={image.src} alt={`Foto contoh pasangan ${i + 1}`} width={image.width} height={image.height} loading="lazy"/></Button>)}</div></div></section>
      <Nempo01Guestbook guest={guest}/><Nempo01Gifts/>
      <footer className="n15-footer"><Flower2 className="mx-auto size-7" strokeWidth={1}/><p className="mx-auto mt-6 max-w-md text-xl italic leading-8">Kehadiran dan doa restu Anda melengkapi kebahagiaan kami.</p><h2>Habib &amp; Adiba</h2><p className="n01-body text-xs leading-7">Keluarga Bapak Ahmad &amp; Ibu Siti<br/>Keluarga Bapak Hasan &amp; Ibu Aisyah</p><p className="n01-label mt-10">NEMPO 15 · Merah Marun</p><Button asChild className="n01-body mt-5 rounded-sm text-xs"><a href={consult} target="_blank" rel="noopener noreferrer"><Send/> Pesan tema ini</a></Button><p className="n01-body mt-6 text-[11px] leading-6 opacity-80">Nama, tanggal, cerita, lokasi, dan hadiah merupakan contoh.<br/>Foto pasangan dibuat dengan AI untuk pratinjau.<br/>Nempo Garut Organizer</p></footer>
    </main><nav className="n15-nav" aria-label="Bagian undangan">{sections.map(({ id, label, Icon }) => <a key={id} href={`#${id}`}><Icon className="size-4"/>{label}</a>)}</nav><Dialog open={photo !== null} onOpenChange={value => { if (!value) setPhoto(null); }}><DialogContent className="n15-lightbox"><DialogTitle className="sr-only">Foto pasangan</DialogTitle>{photo && <img src={photo} alt="Foto contoh pasangan diperbesar"/>}</DialogContent></Dialog></>}
  </div>;
}