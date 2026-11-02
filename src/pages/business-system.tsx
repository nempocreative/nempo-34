import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Activity, ArrowRight, BedDouble, Boxes, Building2, CalendarCheck, Check, ClipboardList, Code2,
  Coffee, FileText, MessageCircle, Minus, NotebookPen, PackageX, Plus, Search, ShieldCheck, Store,
  UserMinus, Wrench,
} from "lucide-react";
import {
  BIZ_BUNDLES, BIZ_CUSTOM, BIZ_INDUSTRY, BIZ_INDUSTRY_NOTE, BIZ_MAINTENANCE, BIZ_MAINTENANCE_EXCLUSION,
  BIZ_MAINTENANCE_SCOPE, BIZ_MANAGEMENT, BIZ_OPERATIONAL, BIZ_TAGLINE, BIZ_TERMS, bizConsultUrl, bizRupiah,
  type BizSystem,
} from "@/data/business-system";
import {
  Reveal, SectionHead, ServiceHero, ServiceMarquee, StickerIcon, hand, heroOutlineBtn, heroPrimaryBtn, serviceKitCss,
} from "@/components/service-page-kit";

type Tab = "operational" | "management" | "industry" | "custom";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "operational", label: "Operasional", icon: Activity },
  { id: "management", label: "Manajemen", icon: Boxes },
  { id: "industry", label: "Industri", icon: Building2 },
  { id: "custom", label: "Custom", icon: Code2 },
];

const pains = [
  { icon: NotebookPen, color: "#0194F3", pain: "Catatan penjualan masih di buku", fix: "POS dan Finance mencatat otomatis" },
  { icon: PackageX, color: "#4F46E5", pain: "Stok sering selisih atau tiba-tiba habis", fix: "Inventory dengan notifikasi stok menipis" },
  { icon: UserMinus, color: "#0891B2", pain: "Pelanggan datang sekali lalu hilang", fix: "CRM dan Membership supaya mereka kembali" },
];

const fits = [
  { icon: Coffee, color: "#0194F3", title: "Cafe & Resto", mods: "QR Menu · POS · Inventory · Finance" },
  { icon: Store, color: "#2563EB", title: "Toko & Retail", mods: "POS · Inventory · Purchasing · CRM" },
  { icon: BedDouble, color: "#0891B2", title: "Hotel & Villa", mods: "Reservasi & Booking · CRM · Voucher" },
  { icon: CalendarCheck, color: "#4F46E5", title: "Kantor & Jasa", mods: "HR & Payroll · Attendance · CMS · Finance" },
];

const steps = [
  { icon: Search, color: "#0194F3", title: "Analisis kebutuhan", desc: "Ceritakan alur kerja, jumlah pengguna, dan masalah yang paling mengganggu." },
  { icon: FileText, color: "#2563EB", title: "Penawaran & DP", desc: "Rincian fitur dan biaya disusun, lalu DP 50% untuk memulai pengerjaan." },
  { icon: Wrench, color: "#0891B2", title: "Pengerjaan & testing", desc: "Sistem dibangun, kamu ikut mencoba sampai sesuai kesepakatan." },
  { icon: ShieldCheck, color: "#4F46E5", title: "Serah terima", desc: "Pelatihan 1 sesi, garansi bug 30 hari, lalu maintenance kalau mau lanjut." },
];

const faqs = [
  { q: "Harga di halaman ini sudah final?", a: "Harga yang tertera adalah harga mulai untuk lingkup fitur dasar. Sebelum penawaran final dibuat, tim Nempo menganalisis kebutuhan, jumlah pengguna, dan alur kerja usahamu dulu." },
  { q: "Bagaimana sistem pembayarannya?", a: "DP 50% di awal, lalu 50% setelah testing dan sebelum serah terima." },
  { q: "Apakah ada garansi?", a: "Ada, garansi bug 30 hari setelah serah terima. Perbaikan bug pada fitur yang sudah disepakati juga masuk cakupan maintenance." },
  { q: "Bisa tambah fitur setelah sistem jadi?", a: "Bisa. Fitur tambahan dihitung berdasarkan estimasi, begitu juga modul khusus dan kebutuhan regulasi industri." },
  { q: "Harga sudah termasuk domain dan hosting?", a: "Belum. Domain dan hosting terpisah jika belum termasuk paket, dan biaya hosting menyesuaikan spesifikasi yang dipakai." },
  { q: "Apa saja cakupan maintenance?", a: "Monitoring website dan sistem, perbaikan bug pada fitur yang disepakati, backup database berkala, pemeriksaan keamanan dasar, dan bantuan teknis penggunaan." },
];

const marquee = ["QR Menu", "POS / Kasir", "Inventory", "Finance", "CRM", "HR & Payroll", "Reservasi", "Ticketing", "Garut • Jawa Barat"];

/* Dashboard contoh di bagian "sekilas isinya" */
function DashboardMockup() {
  const side = ["Dashboard", "Kasir", "Stok", "Pelanggan", "Laporan"];
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-brand-navy/25 bg-card" style={{ boxShadow: "0 24px 50px -30px rgba(23,49,74,.55)" }}>
      <div className="flex">
        <aside className="hidden w-28 shrink-0 space-y-1 bg-brand-navy p-3 text-[10px] text-primary-foreground sm:block">
          <p className="mb-3 font-extrabold">Nempo System</p>
          {side.map((s, i) => (
            <p key={s} className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-brand font-bold" : "opacity-70"}`}>{s}</p>
          ))}
        </aside>
        <div className="flex-1 space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-brand-navy">Hari ini</p>
            <span className="rounded-full bg-brand-sky px-2 py-0.5 text-[9px] font-bold text-brand">contoh data</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["Penjualan", "Rp2,4jt"], ["Transaksi", "86"], ["Pelanggan kembali", "31%"]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-brand-sky/70 p-2.5">
                <p className="text-[9px] text-muted-foreground">{l}</p>
                <p className="text-sm font-extrabold text-brand-navy">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex h-20 items-end gap-1.5 rounded-xl bg-brand-sky/70 p-2.5">
            {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t ${i === 5 ? "bg-brand" : "bg-brand/45"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-brand/45 bg-brand-sky/50 p-2 text-[10px] text-brand-navy">
            <PackageX className="h-3.5 w-3.5 shrink-0 text-brand" /> Stok susu tinggal 3 liter — waktunya belanja
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessSystemPage() {
  const [tab, setTab] = useState<Tab>("operational");
  const [open, setOpen] = useState<number | null>(0);

  const shown: BizSystem[] = tab === "management" ? BIZ_MANAGEMENT : BIZ_OPERATIONAL;
  const cheapest = Math.min(...BIZ_OPERATIONAL.map((s) => s.price));
  const total = BIZ_OPERATIONAL.length + BIZ_MANAGEMENT.length + BIZ_INDUSTRY.length;

  return (
    <Layout>
      <div className="bg-brand-paper pb-14 text-foreground">
        <style>{serviceKitCss}</style>

        <ServiceHero
          kicker="usaha makin besar, makin ribet?"
          title="Business System"
          accent="& Digital Solutions"
          desc="Solusi teknologi untuk membantu bisnis bekerja lebih mudah, cepat, terorganisir, dan efisien — dari kasir, stok, dan keuangan sampai sistem khusus per industri."
          chips={["POS & Kasir", "Inventory & Stok", "CRM & Membership", "HR & Payroll", "Sistem per Industri"]}
          actions={<>
            <Button asChild size="lg" className={heroPrimaryBtn}><a href="#katalog">Lihat Katalog Sistem <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline" className={heroOutlineBtn}><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi Dulu</a></Button>
          </>}
        />
        <ServiceMarquee items={marquee} />

        {/* Sekilas isinya */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Sekilas isinya" title="Satu sistem, semua nyambung" note="kasir, stok, dan uang tercatat rapi" /></Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
            <Reveal delay={60} className="py-4">
              <DashboardMockup />
            </Reveal>
            <Reveal delay={140}>
              <p className={`${hand} text-xl text-brand`}>contoh dashboard</p>
              <h3 className="mt-1 text-2xl font-extrabold leading-tight text-brand-navy sm:text-3xl">
                Penjualan, stok, dan pelanggan terlihat di satu tempat
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {BIZ_TAGLINE} Setiap sistem di bawah ini bisa jalan sendiri, tapi paling enak dipakai berbarengan karena datanya saling nyambung.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {pains.map((p) => (
                  <div key={p.pain} className="rounded-2xl border-2 border-dashed border-brand/25 bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground line-through decoration-brand/60">{p.pain}</p>
                    <p className="mt-1.5 flex items-start gap-2 text-sm font-bold text-brand-navy">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={3} /> {p.fix}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs font-semibold text-brand-navy/70">
                {total} sistem tersedia · mulai {bizRupiah(cheapest)} · {BIZ_TAGLINE}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Katalog sistem */}
        <section id="katalog" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Reveal><SectionHead eyebrow="Katalog Sistem" title="Pilih sesuai kebutuhan usaha" note="harga mulai, fitur tercantum" /></Reveal>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" role="group" aria-label="Kategori sistem">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant="outline"
                aria-pressed={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`wed-sticker h-auto rounded-2xl px-1 py-3 text-xs sm:text-sm ${
                  tab === t.id
                    ? "border-brand bg-brand text-primary-foreground hover:bg-brand hover:text-primary-foreground"
                    : "border-dashed border-brand/30 bg-card text-brand-navy hover:border-brand/60"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {(tab === "operational" || tab === "management") && shown.map((s) => <SystemRow key={s.id} s={s} />)}

            {tab === "industry" && (
              <>
                <div className="rounded-2xl border-2 border-dashed border-brand/35 bg-brand-sky p-5">
                  <p className="text-xs leading-relaxed text-brand-navy/80">{BIZ_INDUSTRY_NOTE}</p>
                </div>
                <div className="divide-y divide-dashed divide-brand/15 overflow-hidden rounded-2xl border-2 border-dashed border-brand/25 bg-card">
                  {BIZ_INDUSTRY.map((s) => (
                    <div key={s.id} data-industry={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-brand-navy">{s.name}</h3>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.fungsi}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-extrabold text-brand"><span className="text-[11px] font-medium text-muted-foreground">Mulai </span>{bizRupiah(s.price)}</p>
                        <Button asChild size="sm" className="rounded-full bg-brand-navy px-4 text-[11px] text-primary-foreground hover:bg-brand-navy/90">
                          <a href={bizConsultUrl(s.name, s.price, true)} target="_blank" rel="noopener noreferrer">Tanya <ArrowRight className="h-3 w-3" /></a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "custom" && (
              <article className="relative overflow-hidden rounded-3xl border-2 border-dashed border-brand/30 bg-card p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <StickerIcon icon={Code2} color="#4F46E5" />
                  <div>
                    <p className={`${hand} text-xl text-brand`}>butuh yang beda?</p>
                    <h3 className="-mt-1 text-2xl font-extrabold text-brand-navy">{BIZ_CUSTOM.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{BIZ_CUSTOM.desc}</p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3 border-t border-dashed border-brand/20 pt-6 sm:grid-cols-2">
                  {BIZ_CUSTOM.items.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-brand-navy">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-sky"><Check className="h-3 w-3 text-brand" strokeWidth={3} /></span>{f}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="wed-sticker eo-btn-shine mt-6 rounded-full bg-brand-navy px-7 text-primary-foreground hover:bg-brand-navy/90">
                  <a href={bizConsultUrl(BIZ_CUSTOM.name)} target="_blank" rel="noopener noreferrer">Diskusikan Sistem Custom <ArrowRight /></a>
                </Button>
              </article>
            )}
          </div>
        </section>

        {/* Bundles */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Paket Bundling" title="Sistem dalam satu paket" note="lebih hemat, langsung nyambung" /></Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {BIZ_BUNDLES.map((b, i) => (
              <Reveal key={b.id} delay={i * 70} className="h-full">
                <article
                  data-bundle={b.id}
                  className={`relative flex h-full flex-col rounded-3xl border-2 p-6 ${
                    b.recommended ? "border-brand-navy bg-brand-navy text-primary-foreground" : "border-dashed border-brand/25 bg-card"
                  }`}
                >
                  {b.recommended && (
                    <span className="wed-sticker wed-wiggle absolute -top-3.5 right-5 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-primary-foreground">Rekomendasi</span>
                  )}
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${b.recommended ? "text-brand-sky" : "text-brand"}`}>{b.forWho}</p>
                  <h3 className={`mt-1.5 text-lg font-extrabold ${b.recommended ? "text-primary-foreground" : "text-brand-navy"}`}>{b.name}</h3>
                  <p className="mt-3 text-2xl font-extrabold">
                    {b.startingFrom && <span className="text-xs font-medium opacity-70">Mulai </span>}{bizRupiah(b.price)}
                  </p>
                  <ul className={`mt-5 flex-1 space-y-2 border-t border-dashed pt-5 ${b.recommended ? "border-primary-foreground/20" : "border-brand/15"}`}>
                    {b.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-xs">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3} /> {it}
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className={`mt-6 w-full rounded-full text-sm ${b.recommended ? "wed-sticker eo-btn-shine bg-brand text-primary-foreground hover:bg-brand/90" : "bg-brand-navy text-primary-foreground hover:bg-brand-navy/90"}`}>
                    <a href={bizConsultUrl(b.name, b.price, b.startingFrom)} target="_blank" rel="noopener noreferrer">Ambil Paket Ini <ArrowRight /></a>
                  </Button>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Cocok untuk */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Cocok Untuk" title="Sistem per jenis usaha" note="tinggal bilang usahamu apa" /></Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fits.map((f, i) => (
              <Reveal key={f.title} delay={i * 60} className="h-full">
                <div className="wed-card-pop flex h-full items-start gap-3 rounded-2xl border-2 border-dashed border-brand/25 bg-card p-5 hover:border-brand/45">
                  <StickerIcon icon={f.icon} color={f.color} size="sm" />
                  <div>
                    <h3 className="text-sm font-extrabold text-brand-navy">{f.title}</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{f.mods}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Maintenance */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Maintenance & Subscription" title="Setelah sistem jadi" note="biar tetap sehat" /></Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <Reveal delay={60}>
              <dl className="divide-y divide-dashed divide-brand/15 rounded-3xl border-2 border-dashed border-brand/25 bg-card p-5 sm:p-6">
                {BIZ_MAINTENANCE.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <dt className="font-semibold text-brand-navy">{m.name}</dt>
                    <dd className="shrink-0 font-extrabold text-brand">
                      {m.price == null
                        ? <span className="text-xs font-semibold text-muted-foreground">{m.quoteNote}</span>
                        : <>{m.startingFrom && <span className="text-[11px] font-medium text-muted-foreground">Mulai </span>}{bizRupiah(m.price)}<span className="text-[11px] font-medium text-muted-foreground">{m.unit}</span></>}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={140}>
              <div className="h-full rounded-3xl bg-brand-sky p-5 sm:p-6">
                <p className="flex items-center gap-2 text-sm font-extrabold text-brand-navy">
                  <Wrench className="h-4 w-4 text-brand" /> Cakupan maintenance
                </p>
                <ul className="mt-3 space-y-2">
                  {BIZ_MAINTENANCE_SCOPE.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-brand-navy/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={3} /> {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-dashed border-brand/25 pt-3 text-[11px] leading-relaxed text-brand-navy/65">
                  {BIZ_MAINTENANCE_EXCLUSION}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Ketentuan */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Ketentuan" title="Aturan mainnya" note="biar sama-sama jelas" /></Reveal>
          <dl className="divide-y divide-dashed divide-brand/15 rounded-3xl border-2 border-dashed border-brand/25 bg-card px-5 sm:px-6">
            {BIZ_TERMS.map((t) => (
              <div key={t.label} className="flex flex-wrap items-center justify-between gap-2 py-3.5 text-sm">
                <dt className="font-semibold text-muted-foreground">{t.label}</dt>
                <dd className="text-right font-bold text-brand-navy">{t.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Cara kerja */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Cara Kerja" title="4 langkah sampai sistem dipakai" note="jelas dari awal" /></Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} className="h-full">
                <div className="wed-card-pop flex h-full gap-4 rounded-3xl border-2 border-dashed border-brand/25 bg-card p-4 hover:border-brand/40 lg:flex-col lg:items-center lg:text-center">
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

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <SectionHead eyebrow="Tanya Jawab" title="Sebelum sistem dibuat" note="biar gak ragu" />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className={`rounded-2xl border-2 transition-colors ${open === i ? "border-brand/40 bg-card" : "border-dashed border-brand/25 bg-card/60"}`}>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`biz-faq-${i}`}
                  className="h-auto w-full justify-between gap-3 whitespace-normal rounded-2xl px-5 py-4 text-left text-sm font-semibold text-brand-navy hover:bg-transparent"
                >
                  {f.q}
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${open === i ? "bg-brand text-primary-foreground" : "bg-brand-sky text-brand"}`}>
                    {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </Button>
                {open === i && <p id={`biz-faq-${i}`} className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-10 text-center text-primary-foreground">
            <p className={`${hand} text-2xl text-brand-sky`}>bukan cuma aplikasi,</p>
            <h2 className="mt-1 text-3xl font-extrabold leading-tight">tapi solusi atas masalah usahamu</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">
              Ceritakan alur kerja dan jumlah pengguna yang butuh akses. Tim Nempo bantu susun sistem mana yang paling tepat, lengkap dengan estimasi biayanya.
            </p>
            <Button asChild size="lg" className={`mt-6 ${heroPrimaryBtn}`}>
              <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Konsultasi via WhatsApp <ArrowRight /></a>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function SystemRow({ s }: { s: BizSystem }) {
  return (
    <article data-system={s.id} className="wed-card-pop rounded-2xl border-2 border-dashed border-brand/25 bg-card p-5 sm:p-6 hover:border-brand/45">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-brand-navy">{s.name}</h3>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold text-brand">
            {s.startingFrom && <span className="text-[11px] font-medium text-muted-foreground">Mulai </span>}{bizRupiah(s.price)}
          </p>
          <p className="text-[10px] text-muted-foreground">sekali bayar</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-x-5 gap-y-1.5 border-t border-dashed border-brand/15 pt-4 sm:grid-cols-2">
        {s.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs leading-relaxed text-brand-navy/85">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={3} /> {f}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-brand/15 pt-4">
        <p className="text-[11px] text-muted-foreground">Cocok untuk: {s.target}</p>
        <Button asChild size="sm" className="rounded-full bg-brand-navy px-4 text-[11px] text-primary-foreground hover:bg-brand-navy/90">
          <a href={bizConsultUrl(s.name, s.price, s.startingFrom)} target="_blank" rel="noopener noreferrer">Tanya sistem ini <ArrowRight className="h-3 w-3" /></a>
        </Button>
      </div>
    </article>
  );
}
