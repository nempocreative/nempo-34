import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { WeddingConceptStudio } from "@/components/wedding-concept-studio";
import { Heart, Check, ArrowRight, Users, Music, Plus, Minus, Flower2, Gem, PartyPopper, HeartHandshake } from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { WCC_PACKAGES, WCC_ADDONS, WCC_TRANSPORT_NOTE } from "@/data/wedding-content-creator";
import { weddingPackages, weddingAdatOptions, weddingTotal, weddingRupiah, weddingVendorNote, weddingAdatNote } from "@/data/wedding-packages";

const serif = "font-[family-name:var(--font-wed-serif)]";
const hand = "font-[family-name:var(--font-wed-hand)]";

const faqs = [
  { q: "Apakah dekorasi, catering, dan MUA sudah termasuk?", a: weddingVendorNote },
  { q: "Paket mana yang termasuk undangan digital dan alat sawer?", a: "Signature dan Premium termasuk undangan digital dan alat sawer gratis. Pada Essential, keduanya tidak termasuk." },
  { q: "Siapa yang menyediakan layanan adat Sunda?", a: "Layanan adat disediakan vendor rekanan. Jadwal, durasi, dan kebutuhan teknis dikonfirmasi sebelum pemesanan." },
  { q: "Apakah simulasi biaya merupakan harga final?", a: weddingAdatNote },
];

const marqueeItems = ["Wedding Organizer", "Adat Sunda", "Undangan Digital", "Alat Sawer", "Tim Intimate", "Tim Lengkap", "Garut • Jawa Barat"];

export default function WeddingOrganizerPage() {
  const [pkg, setPkg] = useState(1);
  const [open, setOpen] = useState<number | null>(null);
  const selected = weddingPackages[pkg] ?? weddingPackages[0];

  return (
    <Layout>
      <div className="bg-wed-blush pb-14 text-wed-ink">

        {/* ── HERO ── */}
        <section className="wed-hero-bg relative isolate overflow-hidden px-6 pb-20 pt-14 sm:pt-20">
          {/* floating decor */}
          <Heart className="wed-float absolute left-[6%] top-16 h-8 w-8 fill-wed-rose/30 text-wed-rose/30" aria-hidden />
          <Heart className="wed-float-slow absolute right-[10%] top-24 h-12 w-12 fill-wed-rose/20 text-wed-rose/20" aria-hidden />
          <Flower2 className="wed-wiggle absolute left-[16%] bottom-24 h-6 w-6 text-wed-gold/60" aria-hidden />
          <Flower2 className="wed-float absolute right-[18%] bottom-28 h-9 w-9 text-wed-rose/40" aria-hidden />
          <Gem className="wed-wiggle absolute left-[42%] top-10 h-6 w-6 text-wed-gold/50" aria-hidden />
          <Heart className="wed-float-slow absolute left-[70%] top-40 h-5 w-5 fill-wed-gold/30 text-wed-gold/30" aria-hidden />

          <div className="mx-auto max-w-5xl text-center">
            <p className={`${hand} text-2xl text-wed-rose sm:text-3xl`}>hai calon pengantin!</p>
            <h1 className={`${serif} mt-3 text-5xl font-bold leading-[1.05] sm:text-7xl`}>
              Nempo
              <span className="mt-1 block text-wed-rose">Wedding Organizer</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-wed-ink/75 sm:text-base">
              Semua paket berfokus pada manajemen dan koordinasi acara oleh tim WO Nempo. Pilih dukungan yang sesuai kebutuhan, dengan pilihan adat Sunda dari vendor rekanan.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="wed-sticker rounded-full bg-wed-rose px-7 text-primary-foreground hover:bg-wed-rose/90">
                <a href="#paket">Lihat Paket WO <ArrowRight /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-wed-rose/40 bg-card/70 px-7 text-wed-rose hover:bg-card">
                <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi Dulu</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {weddingPackages.map((p, i) => (
                <span key={p.name} className="wed-sticker inline-flex items-center gap-1.5 rounded-full border border-wed-gold/40 bg-card px-4 py-1.5 text-xs font-semibold">
                  <Heart className={`h-3 w-3 ${i === 1 ? "fill-wed-rose text-wed-rose" : "text-wed-rose/60"}`} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* wavy divider */}
          <svg className="absolute bottom-0 left-0 w-full text-wed-rose" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
            <path d="M0,32 C240,60 480,4 720,28 C960,52 1200,8 1440,32 L1440,60 L0,60 Z" fill="currentColor" />
          </svg>
        </section>

        {/* ── MARQUEE RIBBON ── */}
        <div className="overflow-hidden bg-wed-rose py-3 text-primary-foreground" aria-hidden>
          <div className="wed-marquee flex w-max items-center gap-8">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-8 text-sm font-semibold tracking-wide">
                {item}
                <Heart className="h-3.5 w-3.5 fill-current" />
              </span>
            ))}
          </div>
        </div>

        <WeddingConceptStudio />

        {/* ── PACKAGES ── */}
        <section id="paket" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Head eyebrow="Pilihan Paket" title="Dukungan sesuai kebutuhan" note="pilih yang paling pas buat kalian" />
          <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Pilihan paket WO">
            {weddingPackages.map((p, i) => (
              <Button
                key={p.name}
                variant="outline"
                aria-pressed={pkg === i}
                onClick={() => setPkg(i)}
                className={`wed-sticker h-auto rounded-2xl px-1 py-3 text-xs sm:text-sm ${
                  pkg === i
                    ? "border-wed-rose bg-wed-rose text-primary-foreground"
                    : "border-dashed border-wed-ink/25 bg-card text-wed-ink hover:border-wed-rose/60"
                }`}
              >
                <span className="flex flex-col items-center gap-1">
                  {i === 0 && <Flower2 className="h-4 w-4" />}
                  {i === 1 && <Heart className="h-4 w-4 fill-current" />}
                  {i === 2 && <Gem className="h-4 w-4" />}
                  {p.name}
                </span>
              </Button>
            ))}
          </div>

          <article className="wed-card-pop relative mt-6 rounded-3xl border-2 border-dashed border-wed-gold/50 bg-card p-6 sm:p-8" aria-label={`Paket ${selected.name}`}>
            {pkg === 1 && (
              <span className="wed-sticker wed-wiggle absolute -top-4 right-6 inline-flex items-center gap-1.5 rounded-full bg-wed-dust px-4 py-1.5 text-xs font-bold text-primary-foreground">
                <PartyPopper className="h-3.5 w-3.5" /> Paling Laris
              </span>
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={`${hand} text-xl text-wed-rose`}>paket</p>
                <h3 className={`${serif} -mt-1 text-3xl font-bold`}>{selected.name}</h3>
                <p className="mt-2 max-w-md text-sm text-wed-ink/70">{selected.intro}</p>
              </div>
              <div className="rounded-2xl bg-wed-blush px-5 py-4 text-center">
                <p className={`${serif} text-3xl font-bold text-wed-rose`}>{weddingRupiah(selected.price)}</p>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-wed-rose" />{selected.team} anggota tim</p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 border-t border-dashed border-wed-ink/15 pt-6 sm:grid-cols-2">
              {selected.items.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wed-rose/15">
                    <Check className="h-3 w-3 text-wed-rose" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 rounded-2xl bg-wed-blush px-4 py-3 text-sm font-semibold text-wed-rose">
              <HeartHandshake className="h-4 w-4 shrink-0" />
              {selected.digitalInvitationAndSawer ? "Termasuk undangan digital dan alat sawer gratis." : "Undangan digital dan alat sawer tidak termasuk."}
            </p>
            <Button asChild size="lg" className="wed-sticker mt-6 rounded-full bg-wed-ink px-7 text-primary-foreground hover:bg-wed-ink/90">
              <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi {selected.name} <ArrowRight /></a>
            </Button>
          </article>
          <p className="mt-5 text-xs leading-relaxed text-wed-ink/70">{weddingVendorNote}</p>
        </section>

        {/* ── ADAT SUNDA ── */}
        <section className="relative bg-card px-6 py-12">
          <Flower2 className="wed-float-slow absolute right-[8%] top-8 h-10 w-10 text-wed-rose/20" aria-hidden />
          <div className="mx-auto max-w-5xl">
            <Head eyebrow="Vendor Rekanan · Adat Sunda" title="Pilihan untuk hari istimewa" note="ada tarif spesial lho" />
            <p className="mb-7 text-sm leading-relaxed text-wed-ink/70">Dua format pertunjukan adat dengan tarif spesial untuk klien Wedding Organizer Nempo.</p>
            <div className="grid gap-6 md:grid-cols-2">
              {weddingAdatOptions.map(option => (
                <article key={option.name} className="wed-card-pop relative rounded-3xl border-2 border-dashed border-wed-gold/50 bg-wed-blush/50 p-6">
                  <span className="wed-sticker absolute -top-3.5 right-5 -rotate-3 rounded-full bg-wed-rose px-3.5 py-1 text-xs font-bold text-primary-foreground">
                    Hemat {weddingRupiah(option.normal - option.special)}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wed-rose/15">
                    <Music className="h-6 w-6 text-wed-rose" />
                  </span>
                  <h3 className={`${serif} mt-4 text-2xl font-bold`}>{option.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-wed-ink/70">{option.description}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-dashed border-wed-ink/15 py-4">
                    <div>
                      <dt className="text-xs text-wed-ink/60">Harga normal</dt>
                      <dd className="mt-1 text-sm line-through opacity-70">{weddingRupiah(option.normal)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-wed-rose">Tarif spesial WO</dt>
                      <dd className={`${serif} mt-1 text-2xl font-bold text-wed-rose`}>{weddingRupiah(option.special)}</dd>
                    </div>
                  </dl>
                  {option.music && <p className="mt-4 text-sm leading-relaxed"><span className="font-bold">Musik: </span>{option.music}</p>}
                  <p className="mt-3 text-sm leading-relaxed"><span className="font-bold">Penampilan: </span>{option.performers}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-wed-ink/70">{weddingAdatNote}</p>
          </div>
        </section>

        {/* ── WEDDING CONTENT CREATOR ── */}
        <section id="wcc" className="relative scroll-mt-24 bg-card px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <Head eyebrow="Wedding Content Creator" title="Momen pernikahan jadi konten" note="cepat, candid, siap dibagikan" />
            <div className="grid gap-5 md:grid-cols-3">
              {WCC_PACKAGES.map(p => (
                <article key={p.id} data-wcc={p.id} className={`wed-card-pop relative flex h-full flex-col rounded-3xl border-2 p-6 ${p.id === "intimate" ? "border-wed-rose bg-wed-blush" : "border-dashed border-wed-gold/50 bg-card"}`}>
                  {p.id === "intimate" && <span className="wed-sticker absolute -top-3.5 right-5 rounded-full bg-wed-rose px-3.5 py-1 text-xs font-bold text-primary-foreground">Mulai di sini</span>}
                  <p className="text-xs font-bold uppercase tracking-wider text-wed-rose">{p.name}</p>
                  <p className={`${serif} mt-2 text-3xl font-bold`}>{weddingRupiah(p.price)}</p>
                  <p className="mt-1 text-sm text-wed-ink/70">{p.scope}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-dashed border-wed-ink/15 pt-5">
                    {p.items.map(it => <li key={it} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-wed-rose" />{it}</li>)}
                  </ul>
                  <Button asChild className="mt-6 rounded-full bg-wed-ink text-primary-foreground hover:bg-wed-ink/90">
                    <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Pilih {p.name} <ArrowRight /></a>
                  </Button>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border-2 border-dashed border-wed-ink/15 p-5 sm:p-6">
              <p className="text-sm font-bold">Add-on</p>
              <dl className="mt-3 divide-y divide-dashed divide-wed-ink/15">
                {WCC_ADDONS.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt>{a.name}</dt>
                    <dd className="font-bold text-wed-rose">{a.startingFrom ? <span className="mr-1 text-xs font-normal text-wed-ink/60">Mulai</span> : null}{weddingRupiah(a.price)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-wed-ink/70">{WCC_TRANSPORT_NOTE}</p>
            </div>
          </div>
        </section>

        {/* ── COMBINATION TABLE ── */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Head eyebrow="WO + Adat Sunda" title="Contoh total kombinasi" note="tinggal pilih kombinasinya" />
          <p className="mb-6 text-sm text-wed-ink/70">Paket WO digabungkan dengan tarif khusus vendor adat.</p>
          <div className="wed-sticker overflow-hidden rounded-3xl border-2 border-wed-rose/25 bg-card">
            <table className="w-full table-fixed text-left text-xs sm:text-sm">
              <caption className="sr-only">Simulasi biaya paket WO dan adat Sunda</caption>
              <thead className="bg-wed-rose text-primary-foreground">
                <tr>
                  <th className="p-2 font-semibold sm:p-4">Paket WO</th>
                  <th className="p-2 font-semibold sm:p-4">Harga WO</th>
                  <th className="p-2 font-semibold sm:p-4">Dengan live</th>
                  <th className="p-2 font-semibold sm:p-4">Tanpa live</th>
                </tr>
              </thead>
              <tbody>
                {weddingPackages.map(p => (
                  <tr key={p.name} className="border-t border-dashed border-wed-ink/15">
                    <th scope="row" className="p-2 font-semibold sm:p-4">{p.name}</th>
                    <td className="p-2 sm:p-4">{weddingRupiah(p.price)}</td>
                    {weddingAdatOptions.map(a => (
                      <td key={a.name} className={`${serif} p-2 text-sm font-bold text-wed-rose sm:p-4 sm:text-base`}>{weddingRupiah(weddingTotal(p.price, a.special))}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-wed-ink/70">Biaya WO mencakup manajemen; vendor independen tidak termasuk kecuali disepakati terpisah. Tarif adat dan total akhir perlu dikonfirmasi kembali sesuai ketersediaan, jadwal, durasi, transportasi, serta kebutuhan teknis.</p>
        </section>

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-5xl px-6 pb-12">
          <Head eyebrow="Tanya Jawab" title="Detail sebelum pemesanan" note="biar gak penasaran" />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className={`rounded-2xl border-2 transition-colors ${open === i ? "border-wed-rose/40 bg-card" : "border-dashed border-wed-ink/15 bg-card/60"}`}>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`wedding-answer-${i}`}
                  className="h-auto w-full justify-between gap-3 whitespace-normal rounded-2xl px-5 py-4 text-left text-sm font-semibold hover:bg-transparent"
                >
                  {f.q}
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open === i ? "bg-wed-rose text-primary-foreground" : "bg-wed-rose/15 text-wed-rose"}`}>
                    {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </Button>
                {open === i && <p id={`wedding-answer-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-wed-ink/70">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative isolate overflow-hidden bg-wed-rose px-6 py-14 text-center text-primary-foreground">
          <Heart className="wed-float absolute left-[10%] top-10 h-8 w-8 fill-primary-foreground/20 text-primary-foreground/20" aria-hidden />
          <Heart className="wed-float-slow absolute right-[12%] bottom-12 h-10 w-10 fill-primary-foreground/15 text-primary-foreground/15" aria-hidden />
          <Flower2 className="wed-wiggle absolute right-[22%] top-8 h-6 w-6 text-wed-gold" aria-hidden />
          <Heart className="wed-pulse-heart mx-auto h-8 w-8 fill-current" aria-hidden />
          <p className={`${hand} mt-4 text-2xl`}>yuk wujudkan</p>
          <h2 className={`${serif} mt-1 text-3xl font-bold sm:text-4xl`}>Hari Istimewa Kalian</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/90">Bahas kebutuhan acara dan pilihan paket bersama Nempo. Konsultasi santai, tanpa komitmen.</p>
          <Button asChild size="lg" variant="secondary" className="wed-sticker mt-7 rounded-full bg-card px-8 text-wed-rose hover:bg-card/90">
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Mulai Konsultasi <ArrowRight /></a>
          </Button>
        </section>
      </div>
    </Layout>
  );
}

function Head({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-7 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-wed-rose">{eyebrow}</p>
      <h2 className={`${serif} mt-2 text-3xl font-bold leading-tight sm:text-4xl`}>{title}</h2>
      {note && <p className={`${hand} mt-1 text-xl text-wed-gold`}>{note}</p>}
    </div>
  );
}
