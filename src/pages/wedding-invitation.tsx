import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/wouter";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Heart, Check, ArrowRight, MailOpen, CalendarHeart, MapPin, BookHeart, Images,
  MessageSquareHeart, Music, Gift, Share2, ChevronDown, Plus,
} from "lucide-react";
import {
  INVITATION_BILLING, INVITATION_CONSULT_EXTRAS, INVITATION_FEATURES, INVITATION_INCLUDED,
  INVITATION_PRICE, invitationRupiah, woPackagesWithFreeInvitation,
} from "@/data/wedding-invitation";
import { invitationCategories, filterInvitationThemes, type InvitationCategoryKey } from "@/data/invitation-themes";
import { InvitationCoverPreview } from "@/components/invitation-cover-preview";

const serif = "font-[family-name:var(--font-wed-serif)]";
const hand = "font-[family-name:var(--font-wed-hand)]";

const featureIcons: Record<string, React.ElementType> = {
  rsvp: CalendarHeart, acara: MapPin, cerita: BookHeart, galeri: Images,
  ucapan: MessageSquareHeart, musik: Music, kado: Gift, share: Share2,
};

const steps = [
  { title: "Kirim data", desc: "Nama mempelai, jadwal acara, lokasi, foto, dan lagu favorit kalian." },
  { title: "Kami susun", desc: "Tim Nempo merangkai undangan sesuai tema dan warna pilihan." },
  { title: "Cek bareng", desc: "Kalian lihat hasilnya dulu sebelum undangan disebar." },
  { title: "Sebar link", desc: "Bagikan lewat WhatsApp atau Instagram, RSVP dan ucapan langsung masuk." },
];

const freeWith = woPackagesWithFreeInvitation();

const faqs = [
  { q: "Berapa harga undangan digitalnya?", a: `${invitationRupiah(INVITATION_PRICE)} ${INVITATION_BILLING}. Sudah termasuk ${INVITATION_INCLUDED.join(", ").toLowerCase()}.` },
  { q: "Bisa pakai nama domain sendiri?", a: "Bisa. Custom domain, revisi tambahan, dan kebutuhan khusus lainnya dikonsultasikan terpisah dengan tim Nempo." },
  { q: "Ada cara dapat undangan digital gratis?", a: `Ada! Paket Wedding Organizer ${freeWith.join(" dan ")} sudah termasuk undangan digital dan alat sawer gratis.` },
  { q: "Tamu perlu install aplikasi?", a: "Tidak perlu. Undangan dibuka langsung dari link di browser HP atau laptop." },
];

const marqueeItems = ["RSVP Online", "Galeri Momen", "Ucapan Tamu", "Musik Latar", "Kado Digital", "Satu Link", "Garut • Jawa Barat"];

/* HP berisi undangan contoh — bisa "dibuka" */
function InvitationPhone() {
  const [opened, setOpened] = useState(false);
  return (
    <div className="relative mx-auto w-[230px] -rotate-2">
      <span className={`${hand} wed-wiggle absolute -right-12 -top-6 z-10 rotate-6 rounded-full bg-wed-gold px-3 py-1 text-lg text-primary-foreground`}>
        coba buka!
      </span>
      <div className="overflow-hidden rounded-[32px] border-[6px] border-wed-ink bg-card shadow-2xl shadow-wed-rose/30">
        <div className="relative h-[420px]">
          {!opened ? (
            <div className="absolute inset-0">
              <img src="/images/invitation-hero.jpg" alt="Contoh sampul undangan digital" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-wed-ink/85 via-wed-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-center text-primary-foreground">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">The Wedding of</p>
                <p className={`${serif} mt-1 text-3xl font-bold`}>Alya & Reza</p>
                <p className="mt-1 text-[11px] opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <button
                  type="button"
                  onClick={() => setOpened(true)}
                  className="wed-pulse-heart mx-auto mt-4 flex items-center gap-1.5 rounded-full bg-wed-rose px-4 py-2 text-xs font-bold"
                >
                  <MailOpen className="h-3.5 w-3.5" /> Buka Undangan
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 overflow-y-auto bg-wed-blush p-4 text-center text-wed-ink [scrollbar-width:none]">
              <p className={`${hand} text-xl text-wed-rose`}>bismillah,</p>
              <p className={`${serif} text-2xl font-bold`}>Alya & Reza</p>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {[["12", "hari"], ["08", "jam"], ["30", "menit"], ["15", "detik"]].map(([n, l]) => (
                  <div key={l} className="rounded-lg bg-card py-1.5">
                    <p className="text-sm font-extrabold text-wed-rose">{n}</p>
                    <p className="text-[8px] text-wed-ink/60">{l}</p>
                  </div>
                ))}
              </div>
              <img src="/images/invitation-story.jpg" alt="" className="mt-3 h-24 w-full rounded-xl object-cover" />
              <div className="mt-3 rounded-xl bg-card p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-wed-rose">Akad & Resepsi</p>
                <p className="mt-1 text-[11px] leading-relaxed">Minggu, pukul 08.00 WIB</p>
                <p className="flex items-center gap-1 text-[11px] text-wed-ink/70"><MapPin className="h-3 w-3" /> Garut, Jawa Barat</p>
              </div>
              <div className="mt-3 rounded-xl bg-card p-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-wed-rose">Ucapan tamu</p>
                <p className="mt-1 text-[11px] leading-relaxed">“Selamat menempuh hidup baru, semoga sakinah!” — Dina</p>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="flex-1 rounded-full bg-wed-rose py-2 text-[11px] font-bold text-primary-foreground">RSVP</span>
                <button type="button" onClick={() => setOpened(false)} className="flex-1 rounded-full border border-wed-rose/40 py-2 text-[11px] font-bold text-wed-rose">
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WeddingInvitationPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [category, setCategory] = useState<InvitationCategoryKey | "all">("all");
  const visibleThemes = filterInvitationThemes(category);

  return (
    <Layout>
      <div className="bg-wed-blush pb-14 text-wed-ink">
        {/* Hero */}
        <section className="wed-hero-bg relative isolate overflow-hidden px-6 pb-16 pt-12 sm:pt-16">
          <Heart className="wed-float absolute left-[6%] top-14 h-8 w-8 fill-wed-rose/25 text-wed-rose/25" aria-hidden />
          <Heart className="wed-float-slow absolute right-[6%] bottom-16 h-10 w-10 fill-wed-gold/25 text-wed-gold/25" aria-hidden />

          <div className="mx-auto grid max-w-5xl items-center gap-12 sm:grid-cols-[1.15fr_1fr]">
            <div className="text-center sm:text-left">
              <p className={`${hand} text-2xl text-wed-rose sm:text-3xl`}>sebar kabar bahagia, tanpa ribet</p>
              <h1 className={`${serif} mt-3 text-5xl font-bold leading-[1.05] sm:text-6xl`}>
                Undangan
                <span className="block text-wed-rose">Digital Nempo</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-wed-ink/75 sm:mx-0 sm:text-base">
                Undangan pernikahan online yang personal, elegan, dan cukup satu link untuk semua tamu — lengkap dengan RSVP, galeri, ucapan, dan musik.
              </p>
              <div className="mt-6 inline-flex items-end gap-2 rounded-2xl border-2 border-dashed border-wed-rose/40 bg-card px-5 py-3">
                <span className={`${serif} text-3xl font-bold text-wed-rose`}>{invitationRupiah(INVITATION_PRICE)}</span>
                <span className="pb-1 text-xs text-wed-ink/60">{INVITATION_BILLING}</span>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Button asChild size="lg" className="wed-sticker rounded-full bg-wed-rose px-7 text-primary-foreground hover:bg-wed-rose/90">
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Pesan Undangan <ArrowRight /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-wed-rose/40 bg-card/70 px-7 text-wed-rose hover:bg-card">
                  <a href="#fitur">Lihat Fitur</a>
                </Button>
              </div>
            </div>
            <div className="py-6">
              <InvitationPhone />
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden bg-wed-rose py-3 text-primary-foreground" aria-hidden>
          <div className="wed-marquee flex w-max items-center gap-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 text-sm font-semibold tracking-wide">
                {item}
                <Heart className="h-3 w-3 fill-primary-foreground" />
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5">
          {/* Features */}
          <section id="fitur" className="scroll-mt-20 pt-14">
            <SectionHead eyebrow="Isi Undangan" title="Semua yang tamu butuhkan" note="dari kabar sampai kado" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {INVITATION_FEATURES.map((f) => {
                const Icon = featureIcons[f.id] ?? Heart;
                return (
                  <div key={f.id} className="wed-card-pop rounded-3xl border-2 border-dashed border-wed-rose/25 bg-card p-4">
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-wed-blush text-wed-rose">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <h3 className="text-[13px] font-bold">{f.title}</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-wed-ink/65">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Gallery strip */}
          <section className="pt-12">
            <div className="grid grid-cols-3 gap-3">
              {[
                { src: "/images/invitation-hero.jpg", label: "sampul" },
                { src: "/images/invitation-story.jpg", label: "cerita" },
                { src: "/images/invitation-detail.jpg", label: "detail" },
              ].map((img, i) => (
                <figure key={img.src} className={`wed-card-pop relative overflow-hidden rounded-3xl border-4 border-card shadow-lg ${i === 1 ? "sm:-translate-y-4 rotate-1" : "-rotate-1"}`}>
                  <img src={img.src} alt={`Contoh halaman ${img.label} undangan`} className="aspect-[3/4] w-full object-cover" loading="lazy" />
                  <figcaption className={`${hand} absolute bottom-2 left-3 rounded-full bg-card/90 px-2.5 text-base text-wed-rose`}>{img.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Themes */}
          <section id="tema" className="scroll-mt-20 pt-14">
            <SectionHead eyebrow="Tema" title="Pilih tema, buka contohnya" note="klik untuk lihat undangan" />
            <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4" aria-label="Kategori tema undangan">
              {invitationCategories.map((item) => (
                <Button key={item.key} variant="outline" type="button" aria-pressed={category === item.key} onClick={() => setCategory(item.key)} className={`h-auto min-h-9 whitespace-normal rounded-md px-2 py-2 text-[11px] leading-snug sm:text-xs ${category === item.key ? "border-primary bg-primary text-primary-foreground" : "border-primary/40 bg-card text-primary"}`}>
                  {item.name}
                </Button>
              ))}
            </div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{visibleThemes.length} tema</span>
              <Button variant="ghost" size="sm" onClick={() => setCategory("all")} aria-pressed={category === "all"} className="text-primary">Semua Tema</Button>
            </div>
            <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {visibleThemes.map((t) => (
                <Link key={t.slug} href={`/wedding-invitation/tema/${t.slug}`} aria-label={`Lihat undangan ${t.code} ${t.name}`} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                  <InvitationCoverPreview theme={t} />
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <p className="text-sm font-bold leading-snug text-primary">{t.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.mood}</p>
                    <p className="mb-3 mt-2 text-[10px] font-semibold leading-relaxed text-muted-foreground">{invitationCategories.find((item) => item.key === t.category)?.name}</p>
                    <span className="mt-auto inline-flex items-center justify-between gap-2 border-t border-border pt-3 text-xs font-semibold text-primary">Lihat Contoh <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Price */}
          <section id="harga" className="scroll-mt-20 pt-14">
            <SectionHead eyebrow="Harga" title="Satu harga, sudah lengkap" note="gak ada biaya tersembunyi" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="wed-card-pop relative overflow-hidden rounded-3xl bg-wed-ink p-6 text-primary-foreground">
                <span className="wed-sticker wed-wiggle absolute -right-1 top-5 rotate-3 rounded-full bg-wed-gold px-3.5 py-1.5 text-[10px] font-bold tracking-wide">
                  SEKALI BAYAR
                </span>
                <p className={`${hand} text-xl text-wed-gold`}>paket</p>
                <h3 className={`${serif} -mt-1 text-2xl font-bold`}>Wedding Invitation</h3>
                <p className={`${serif} mt-4 text-4xl font-bold`}>{invitationRupiah(INVITATION_PRICE)}</p>
                <div className="my-4 border-t-2 border-dashed border-primary-foreground/20" />
                <ul className="space-y-2">
                  {INVITATION_INCLUDED.map((it) => (
                    <li key={it} className="flex items-center gap-2.5 text-[13px]">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-wed-rose">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
                <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="wed-sticker mt-6 block rounded-full bg-wed-rose py-3 text-center text-sm font-bold">
                  Pesan Sekarang
                </a>
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-3xl border-2 border-dashed border-wed-rose/30 bg-card p-6">
                  <p className={`${hand} text-xl text-wed-rose`}>mau lebih spesial?</p>
                  <h3 className="text-lg font-extrabold">Tambahan (konsultasi)</h3>
                  <ul className="mt-3 space-y-2">
                    {INVITATION_CONSULT_EXTRAS.map((x) => (
                      <li key={x} className="flex items-center gap-2.5 text-[13px]">
                        <Plus className="h-4 w-4 text-wed-gold" strokeWidth={3} /> {x}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-wed-ink/60">Harga tambahan dibahas langsung dengan tim Nempo.</p>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-wed-rose p-6 text-primary-foreground">
                  <Heart className="wed-float absolute -right-3 -top-3 h-16 w-16 fill-primary-foreground/15 text-primary-foreground/15" aria-hidden />
                  <p className={`${hand} text-xl`}>psst, bisa gratis!</p>
                  <h3 className="text-lg font-extrabold">Ambil paket WO {freeWith.join(" / ")}</h3>
                  <p className="mt-1 text-xs leading-relaxed opacity-90">Undangan digital dan alat sawer sudah termasuk tanpa biaya tambahan.</p>
                  <Link href="/wedding-organizer" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-wed-rose">
                    Lihat Paket WO <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="pt-14">
            <SectionHead eyebrow="Cara Pesan" title="4 langkah, undangan siap sebar" note="santai, kami bantu" />
            <ol className="grid gap-3 sm:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-3xl bg-card p-5">
                  <span className={`${serif} text-3xl font-bold text-wed-rose/40`}>0{i + 1}</span>
                  <h3 className="mt-1 text-sm font-bold">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-wed-ink/65">{s.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="pt-14">
            <SectionHead eyebrow="FAQ" title="Pertanyaan umum" note="biar makin yakin" />
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={f.q} className={`rounded-2xl border-2 bg-card ${open === i ? "border-wed-rose/40" : "border-dashed border-wed-rose/20"}`}>
                  <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left text-[13px] font-semibold">
                    {f.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-wed-rose transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  {open === i && <p className="px-4 pb-4 text-xs leading-relaxed text-wed-ink/70">{f.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="pt-14">
            <div className="relative overflow-hidden rounded-3xl bg-wed-ink p-8 text-center text-primary-foreground">
              <Heart className="wed-pulse-heart mx-auto h-10 w-10 fill-wed-rose text-wed-rose" />
              <p className={`${hand} mt-3 text-2xl text-wed-gold`}>tanggal sudah fix?</p>
              <h2 className={`${serif} mt-1 text-3xl font-bold`}>Yuk, bikin undangannya sekarang</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm opacity-80">Chat tim Nempo lewat Instagram, kirim datanya, undangan siap disebar.</p>
              <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="wed-sticker mt-6 inline-flex items-center gap-2 rounded-full bg-wed-rose px-7 py-3.5 text-sm font-bold">
                Chat via Instagram <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-wed-rose">{eyebrow}</p>
      <h2 className={`${serif} mt-1 text-3xl font-bold leading-tight`}>{title}</h2>
      {note && <p className={`${hand} mt-0.5 text-xl text-wed-gold`}>{note}</p>}
    </div>
  );
}
