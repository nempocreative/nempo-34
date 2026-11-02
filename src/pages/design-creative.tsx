import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { ArrowRight, Check, Plus, Minus, PenTool, Layers, Image, FileCheck2 } from "lucide-react";
import { DESIGN_PRICES, DESIGN_MONTHLY_PACKAGES, DESIGN_TERMS, designRupiah, designConsultUrl } from "@/data/design-creative";
import { Reveal, SectionHead, ServiceHero, ServiceMarquee, StickerIcon, hand, heroOutlineBtn, heroPrimaryBtn, serviceKitCss } from "@/components/service-page-kit";

const steps = [
  { title: "Ceritakan kebutuhan", desc: "Kirim brief, jenis desain, dan referensi yang kamu sukai.", icon: PenTool, color: "#6366F1" },
  { title: "Tentukan arah visual", desc: "Sepakati gaya, warna, dan kebutuhan materi sebelum mulai.", icon: Layers, color: "#0EA5E9" },
  { title: "Desain & revisi", desc: "Desain dikerjakan dan disesuaikan berdasarkan masukanmu.", icon: Image, color: "#DB2777" },
  { title: "File siap pakai", desc: "Hasil desain diserahkan dalam format sesuai kesepakatan.", icon: FileCheck2, color: "#14B8A6" },
];
const faqs = [
  { q: "Apa yang termasuk paket desain bulanan?", a: "Basic: 10 desain Feed / Story. Business: 20 desain Feed / Story dan 2 Carousel. Professional: 30 desain Feed / Story, 4 Carousel, dan prioritas pengerjaan. Semua paket termasuk 2x revisi per desain dan file JPG / PNG." },
  { q: "Apakah sudah termasuk posting ke Instagram?", a: "Paket ini untuk pembuatan desain. Pengelolaan akun dan penjadwalan posting tersedia melalui layanan Sosmed Management." },
  { q: "Bagaimana jika membutuhkan revisi tambahan?", a: "Paket bulanan mencakup 2x revisi per desain. Revisi tambahan dikenakan biaya, dibahas sesuai kebutuhan." },
  { q: "Apakah file editable dan biaya cetak termasuk?", a: "Harga belum termasuk cetak. File editable/source file dikenakan biaya tambahan. Desain kompleks menyesuaikan brief." },
];
const marquee = ["Feed & Story", "Carousel", "Poster & Banner", "Menu Cafe", "Logo", "Branding", "Packaging", "Garut • Jawa Barat"];

export default function DesignCreativePage() {
  const [open, setOpen] = useState<number | null>(null);
  const [pkg, setPkg] = useState(1);
  const sel = DESIGN_MONTHLY_PACKAGES[pkg] ?? DESIGN_MONTHLY_PACKAGES[0];
  const items = [`${sel.designs} desain Feed / Story`, ...(sel.carousels ? [`${sel.carousels} desain Carousel`] : []), ...(sel.priority ? ["Prioritas pengerjaan"] : []), `${sel.revisions}x revisi per desain`, `File ${sel.formats.join(" / ")}`];

  return (
    <Layout>
      <div className="bg-background pb-14 text-foreground">
        <style>{serviceKitCss}</style>
        <ServiceHero
          kicker="butuh visual yang rapi?"
          title="Nempo"
          accent="Design Creative"
          desc="Dari konten harian hingga identitas brand — desain untuk usaha, produk, dan acara dengan harga yang jelas."
          chips={DESIGN_MONTHLY_PACKAGES.map((p) => p.name)}
          actions={<>
            <Button asChild size="lg" className={heroPrimaryBtn}><a href="#paket-desain">Lihat Paket <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline" className={heroOutlineBtn}><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi Dulu</a></Button>
          </>}
        />
        <ServiceMarquee items={marquee} />

        <section id="paket-desain" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Reveal><SectionHead eyebrow="Paket Bulanan" title="Konten konsisten tiap bulan" note="pilih sesuai ritme usahamu" /></Reveal>
          <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="Pilihan paket desain">
            {DESIGN_MONTHLY_PACKAGES.map((p, i) => (
              <Button key={p.id} variant="outline" aria-pressed={pkg === i} onClick={() => setPkg(i)}
                className={`wed-sticker h-auto rounded-2xl px-1 py-3 text-xs sm:text-sm ${pkg === i ? "border-brand bg-brand text-primary-foreground hover:bg-brand hover:text-primary-foreground" : "border-dashed border-brand/30 bg-card text-brand-navy hover:border-brand/60"}`}>
                {p.name}
              </Button>
            ))}
          </div>
          <article className="wed-card-pop relative mt-6 rounded-3xl border-2 border-dashed border-brand/30 bg-card p-6 sm:p-8" aria-label={`Paket ${sel.name}`}>
            {sel.id === "business" && <span className="wed-sticker wed-wiggle absolute -top-4 right-6 rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-primary-foreground">Paling Diminati</span>}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={`${hand} text-xl text-brand`}>paket</p>
                <h3 className="-mt-1 text-3xl font-extrabold text-brand-navy">{sel.name}</h3>
              </div>
              <div className="rounded-2xl bg-brand-sky px-5 py-4 text-center">
                <p className="text-2xl font-extrabold text-brand sm:text-3xl">{designRupiah(sel.price)}</p>
                <p className="mt-1 text-xs text-muted-foreground">per bulan</p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 border-t border-dashed border-border pt-6 sm:grid-cols-2">
              {items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky"><Check className="h-3 w-3 text-brand" strokeWidth={3} /></span>{it}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="wed-sticker eo-btn-shine mt-6 rounded-full bg-brand-navy px-7 text-primary-foreground hover:bg-brand-navy/90">
              <a href={designConsultUrl(NEMPO_CONSULT_URL, sel.id)} target="_blank" rel="noopener noreferrer">Pilih {sel.name} <ArrowRight /></a>
            </Button>
          </article>
        </section>

        <section id="harga-desain" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Reveal><SectionHead eyebrow="Pricelist Desain" title="Satu kebutuhan, satu desain" note="harga per desain / project" /></Reveal>
          <div className="rounded-3xl border-2 border-dashed border-border bg-card p-5 sm:p-6">
            <div className="grid gap-x-10 lg:grid-cols-2">
              {[DESIGN_PRICES.slice(0, 8), DESIGN_PRICES.slice(8)].map((group, i) => (
                <dl key={i} className="divide-y divide-dashed divide-border">
                  {group.map((p) => (
                    <div key={p.id} data-design-price={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <dt className="min-w-0 text-brand-navy">{p.name}</dt>
                      <dd className="flex shrink-0 items-center gap-1 font-bold text-brand">
                        {p.startingFrom && <span className="text-xs font-normal text-muted-foreground">Mulai</span>}{designRupiah(p.price)}
                        <a href={designConsultUrl(NEMPO_CONSULT_URL, p.id)} target="_blank" rel="noopener noreferrer" aria-label={`Konsultasi ${p.name}`} className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-sky text-brand"><ArrowRight className="h-3.5 w-3.5" /></a>
                      </dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
            <div className="mt-5 border-t border-dashed border-border pt-5">
              <p className="text-sm font-bold text-brand-navy">Ketentuan</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {DESIGN_TERMS.map((t) => <li key={t.id} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />{t.text}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Cara Kerja" title="Dari ide jadi visual" note="arah jelas, proses teratur" /></Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="h-full">
                <div className="wed-card-pop flex h-full gap-4 rounded-3xl border-2 border-dashed border-border bg-card p-4 hover:border-brand/40 lg:flex-col lg:items-center lg:text-center">
                  <StickerIcon icon={s.icon} color={s.color} size="sm" className="self-start lg:self-center" />
                  <div>
                    <p className="text-[11px] font-extrabold text-brand">LANGKAH {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-0.5 text-sm font-bold text-brand-navy">{s.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <SectionHead eyebrow="Tanya Jawab" title="Sebelum desain dimulai" note="biar gak penasaran" />
          <FaqList faqs={faqs} open={open} setOpen={setOpen} prefix="design" />
        </section>

        <section className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-10 text-center text-primary-foreground">
            <p className={`${hand} text-2xl text-brand-sky`}>ceritakan idemu</p>
            <h2 className="mt-1 text-3xl font-extrabold leading-tight">Yuk, bikin visual untuk brand-mu.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">Kirim kebutuhan dan referensimu, tim Nempo bantu susun arah desainnya.</p>
            <Button asChild size="lg" className={`mt-6 ${heroPrimaryBtn}`}><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Chat via WhatsApp <ArrowRight /></a></Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export function FaqList({ faqs, open, setOpen, prefix }: { faqs: { q: string; a: string }[]; open: number | null; setOpen: (i: number | null) => void; prefix: string }) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={f.q} className={`rounded-2xl border-2 transition-colors ${open === i ? "border-brand/40 bg-card" : "border-dashed border-border bg-card/60"}`}>
          <Button variant="ghost" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`${prefix}-faq-${i}`}
            className="h-auto w-full justify-between gap-3 whitespace-normal rounded-2xl px-5 py-4 text-left text-sm font-semibold text-brand-navy hover:bg-transparent">
            {f.q}
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open === i ? "bg-brand text-primary-foreground" : "bg-brand-sky text-brand"}`}>
              {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </span>
          </Button>
          {open === i && <p id={`${prefix}-faq-${i}`} className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
