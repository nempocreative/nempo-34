import { useEffect, useState } from "react";
import { ArrowLeft, BookHeart, CalendarHeart, CalendarPlus, Flower2, Gift, Heart, Leaf, MailOpen, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { NEMPO_WA_URL } from "@/lib/contact";
import { Nempo01Guestbook } from "./nempo-01-guestbook";
import { Nempo01Gifts } from "./nempo-01-gifts";
import coupleIllu from "@/assets/nempo-16-couple.png";
import coupleScene from "@/assets/nempo-16-couple-scene.jpg";
import storyScene from "@/assets/nempo-16-story-scene.jpg";
import "./nempo-01-invitation.css";
import "./nempo-16-invitation.css";

const story = [
  { year: "2021", title: "Awal yang sederhana", text: "Satu pertemuan mempertemukan dua cerita. Dari percakapan kecil, tumbuh rasa yang ingin kami jaga." },
  { year: "2023", title: "Tumbuh bersama", text: "Kami belajar mendengarkan, saling menguatkan, dan menemukan ketenangan dalam kebersamaan." },
  { year: "2026", title: "Menuju selamanya", text: "Dengan restu kedua keluarga, kami memilih satu perjalanan dan satu janji untuk seumur hidup." },
];

export function Nempo16Invitation() {
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState("Bapak/Ibu/Saudara/i");
  const [now, setNow] = useState(0);
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
    }), { threshold: .1 });
    document.querySelectorAll(".nempo-sixteen main section").forEach(element => { element.classList.add("n01-reveal"); observer.observe(element); });
    return () => observer.disconnect();
  }, [open]);
  const remaining = now ? Math.max(0, new Date("2026-12-20T08:00:00+07:00").getTime() - now) : 0;
  const countdown = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];

  const consult = `${NEMPO_WA_URL}?text=${encodeURIComponent("Halo Nempo, saya tertarik undangan NEMPO 16 — Merah Marun (Adat Tanpa Foto).")}`;
  const calendar = "data:text/calendar;charset=utf-8," + encodeURIComponent("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Nempo//Invitation Preview//ID\r\nBEGIN:VEVENT\r\nUID:nempo16-demo@nempo\r\nDTSTAMP:20261031T000000Z\r\nDTSTART:20261220T010000Z\r\nDTEND:20261220T070000Z\r\nSUMMARY:Pernikahan Habib dan Adiba (Contoh)\r\nLOCATION:Garut - lokasi contoh\r\nEND:VEVENT\r\nEND:VCALENDAR");

  return <div className="nempo-one nempo-sixteen min-h-screen overflow-x-hidden">
    <section className="n16-cover" id="sampul">
      <div className="n16-cover-text">
        <div className="n16-cover-title"><p className="n01-label">NEMPO 16 · Merah Marun</p><p className="n01-label mt-5">The wedding of</p><h1>Habib &amp; Adiba</h1><p>Minggu, 20 Desember 2026</p></div>
        {!open && <div className="n16-recipient"><p className="n01-body text-xs">Kepada Yth.</p><p className="mt-2 break-words text-lg">{guest}</p><Button className="n01-body mt-4 rounded-sm px-6 text-xs" onClick={() => { setOpen(true); window.scrollTo({ top: 0, behavior: "instant" }); }}><MailOpen/> Buka Undangan</Button></div>}
      </div>
      <img src={coupleScene} alt="Cartoon pengantin berbusana adat marun di halaman taman mawar" width={1536} height={1024} className="n16-scene"/>
      <Link href="/wedding-invitation#tema" className="n16-back"><ArrowLeft className="size-4"/> Pilihan tema</Link>
    </section>
    {!open ? <div className="n16-opening-note"><p className="n01-label">Adat Tanpa Foto · Contoh undangan</p></div> : <><main>
      <section className="n16-intro scroll-mt-8" id="mempelai">
        <Leaf className="n16-sprig mx-auto size-8" strokeWidth={1}/><p className="n01-label n01-blue mt-5">Bismillahirrahmanirrahim</p><h2 className="mt-5 text-4xl">Terikat dalam restu</h2>
        <p className="n01-body mx-auto mt-5 max-w-lg text-xs leading-7">Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan kami.</p>
        <div className="n16-couple-stage"><img src={coupleIllu} alt="Cartoon mempelai Habib dan Adiba" width={768} height={1024} loading="lazy" className="n16-couple-illu"/></div>
        <div className="n16-couple"><article><Flower2 className="n16-rose mx-auto size-6" strokeWidth={1}/><h3 className="mt-5 text-3xl">Habib Ramadhan</h3><p className="n01-body mt-4 text-xs leading-7">Putra Bapak Ahmad &amp; Ibu Siti</p></article><span className="n16-rose text-4xl italic">&amp;</span><article><Flower2 className="n16-rose mx-auto size-6" strokeWidth={1}/><h3 className="mt-5 text-3xl">Adiba Nurul</h3><p className="n01-body mt-4 text-xs leading-7">Putri Bapak Hasan &amp; Ibu Aisyah</p></article></div>
        <blockquote className="mx-auto max-w-2xl text-lg italic leading-8">“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.”</blockquote><p className="n01-label n16-rose mt-4">QS. Ar-Rum: 21</p>
      </section>
      <section id="acara" className="n16-event-band scroll-mt-8 px-6 py-16 text-center"><CalendarHeart className="n01-blue mx-auto size-7" strokeWidth={1}/><p className="n01-label n16-rose mt-4">Save the date</p><h2 className="mt-4 text-4xl">Hari yang kita nantikan</h2><p className="mt-5 text-xl">20 . 12 . 2026</p>
        <div className="n16-countdown">{countdown.map((value, i) => <div key={i}><p className="text-3xl tabular-nums">{String(value).padStart(2, "0")}</p><p className="n01-label mt-2">{["Hari", "Jam", "Menit", "Detik"][i]}</p></div>)}</div>
        <div className="n16-events">{[{ title: "Akad Nikah", time: "08.00 – 10.00 WIB", location: "Masjid Agung Garut (contoh)" }, { title: "Resepsi", time: "11.00 – 14.00 WIB", location: "Gedung Serbaguna, Garut (contoh)" }].map(event => <article key={event.title}><Flower2 className="n16-rose mx-auto size-6" strokeWidth={1}/><h3 className="mt-4 text-3xl">{event.title}</h3><p className="n01-body mt-4 text-xs leading-7">Minggu, 20 Desember 2026<br/>{event.time}<br/>{event.location}</p><Button asChild variant="outline" className="n01-body mt-5 rounded-sm text-xs"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.title === "Akad Nikah" ? "Masjid Agung Garut" : "Garut Jawa Barat")}`} target="_blank" rel="noopener noreferrer"><MapPin/> Lihat area lokasi</a></Button></article>)}</div>
        <Button asChild variant="outline" className="n01-body mt-7 rounded-sm text-xs"><a href={calendar} download="NEMPO-16-kalender-contoh.ics"><CalendarPlus/> Simpan tanggal</a></Button>
      </section>
      <section id="cerita" className="scroll-mt-8 px-6 py-20"><div className="n16-story"><img src={storyScene} alt="Cartoon mempelai berjalan bersama di taman mawar" loading="lazy" width={1024} height={1536}/><div><p className="n01-label n16-rose">Our love story</p><h2 className="mt-4 text-4xl">Satu janji dalam restu</h2><p className="n01-body mt-3 text-[11px] opacity-70">Contoh cerita pasangan</p><ol className="mt-8">{story.map(moment => <li key={moment.year}><p className="n01-label n16-rose">{moment.year}</p><h3 className="mt-3 text-2xl">{moment.title}</h3><p className="n01-body mt-3 text-xs leading-7">{moment.text}</p></li>)}</ol></div></div></section>
      <Nempo01Guestbook guest={guest}/><Nempo01Gifts/>
      <section className="n16-closing"><Flower2 className="n16-sprig mx-auto size-8" strokeWidth={1}/><p className="mx-auto mt-7 max-w-md text-xl italic leading-8">Menjadi kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.</p><h2 className="mt-7 text-4xl">Habib &amp; Adiba</h2><p className="n01-body mt-5 text-xs leading-7">Keluarga Bapak Ahmad &amp; Ibu Siti<br/>Keluarga Bapak Hasan &amp; Ibu Aisyah</p></section>
      <footer className="px-6 pb-28 pt-10 text-center"><p className="n01-label n16-rose">NEMPO 16 · Merah Marun Tanpa Foto</p><Button asChild className="n01-body mt-5 rounded-sm text-xs"><a href={consult} target="_blank" rel="noopener noreferrer"><Send/> Pesan tema ini</a></Button><p className="n01-body mt-5 text-[10px] leading-6 opacity-70">Nama, tanggal, cerita, lokasi, dan hadiah merupakan contoh.<br/>Nempo Garut Organizer</p></footer>
    </main><nav className="n16-nav" aria-label="Bagian undangan">{[{ id: "mempelai", label: "Mempelai", Icon: Heart }, { id: "acara", label: "Acara", Icon: CalendarHeart }, { id: "cerita", label: "Cerita", Icon: BookHeart }, { id: "rsvp", label: "RSVP", Icon: MessageCircle }, { id: "hadiah", label: "Kado", Icon: Gift }].map(({ id, label, Icon }) => <a key={id} href={`#${id}`}><Icon className="size-4"/>{label}</a>)}</nav></>}
  </div>;
}
