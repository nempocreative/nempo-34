import { useState } from "react";
import { Layout } from "@/components/layout";
import { Link } from "@/lib/wouter";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { ArrowRight, Check, Globe2, Plus, Minus, Monitor, Smartphone, LayoutTemplate, ShoppingBag, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_PACKAGES, WEBSITE_ADDITIONAL_FEES, WEBSITE_EXCLUSIONS, websiteConsultUrl, webRupiah } from "@/data/web-development";

const mono = "font-mono";
const hand = "font-[family-name:var(--font-wed-hand)]";

const steps = [
  { code: "brief()", title: "Ngobrol kebutuhan", desc: "Ceritakan usaha, target pengunjung, dan fitur yang dibutuhkan." },
  { code: "design()", title: "Rancang tampilan", desc: "Kami susun struktur halaman dan tampilan sesuai karakter brand." },
  { code: "build()", title: "Bangun website", desc: "Tim Nempo mengembangkan website dan menyambungkan fiturnya." },
  { code: "review()", title: "Cek bareng", desc: "Kamu coba dulu, kami rapikan bagian yang perlu disesuaikan." },
  { code: "launch()", title: "Online!", desc: "Website tayang dan siap dibagikan ke pelanggan." },
];

const faqs = [
  { q: "Paket mana yang cocok untuk usaha saya?", a: "Landing Page untuk informasi ringkas dalam satu halaman. Website UMKM untuk hingga 5 halaman. Company Profile untuk profil perusahaan hingga 10 halaman. Professional untuk desain custom, dan E-Commerce untuk katalog serta pengelolaan pesanan." },
  { q: "Apakah domain dan hosting sudah termasuk?", a: "Domain dan hosting dihitung sebagai biaya tambahan: domain mulai Rp200.000/tahun dan hosting mulai Rp500.000/tahun." },
  { q: "Apakah payment gateway sudah termasuk E-Commerce?", a: "Payment gateway dihitung terpisah, begitu juga sistem kompleks dan integrasi khusus. Kebutuhan tersebut dibahas saat konsultasi." },
  { q: "Bisa dibantu setelah website tayang?", a: "Bisa. Maintenance Rp300.000–1.000.000/bulan, update konten mulai Rp250.000/bulan, dan SEO bulanan mulai Rp750.000/bulan." },
];

const packageIcons = [LayoutTemplate, Smartphone, Building2, Monitor, ShoppingBag];

function WebsitePreview() {
  const [view, setView] = useState("profil");
  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-lg border-2 border-dev-ink bg-card text-dev-ink">
      <div className="flex items-center gap-2 border-b border-dev-ink/15 bg-dev-paper px-4 py-3">
        <Globe2 className="size-4 shrink-0 text-dev-sky" />
        <span className="min-w-0 flex-1 truncate font-mono text-xs">usahakamu.id</span>
        <Monitor className="size-4 text-dev-ink/50" />
      </div>
      <div className="flex items-center justify-between gap-3 border-b border-dev-ink/10 px-4 py-3 sm:px-6">
        <span className="text-sm font-extrabold">USAHA KAMU<span className="text-dev-sky">.</span></span>
        <div role="tablist" aria-label="Contoh halaman website" className="flex gap-1">
          {["profil", "produk", "kontak"].map((id) => (
            <Button key={id} variant="ghost" size="sm" role="tab" id={`preview-tab-${id}`} aria-controls="website-preview-panel" aria-selected={view === id} onClick={() => setView(id)} className={`px-2 capitalize text-[11px] ${view === id ? "bg-dev-ink text-primary-foreground" : "text-dev-ink/60"}`}>{id}</Button>
          ))}
        </div>
      </div>
      <div id="website-preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${view}`} className="flex min-h-[200px] flex-col justify-center px-5 py-6 text-left sm:px-8">
        {view === "profil" && <><p className="font-mono text-[10px] text-dev-sky">BISNIS LOKAL, JANGKAUAN LUAS</p><h3 className="mt-2 text-2xl font-extrabold">Kenali usaha kami.</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-dev-ink/65">Produk, layanan, dan cerita bisnis dalam satu tempat.</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-dev-sky">Lihat produk <ArrowRight className="size-4" /></div></>}
        {view === "produk" && <><h3 className="mb-4 text-lg font-extrabold">Pilihan produk</h3><div className="grid grid-cols-3 gap-3">{["Produk 01", "Produk 02", "Produk 03"].map((name) => <div key={name}><div className="flex aspect-[4/3] items-center justify-center rounded-md bg-dev-sky/10"><ShoppingBag className="size-7 text-dev-sky" /></div><p className="mt-2 text-xs font-semibold">{name}</p></div>)}</div></>}
        {view === "kontak" && <><p className="text-xs font-semibold text-dev-sky">KONTAK</p><h3 className="mt-2 text-2xl font-extrabold">Mari terhubung.</h3><p className="mt-2 text-sm text-dev-ink/65">Informasi usaha dan lokasi mudah dijangkau pelanggan.</p><Button asChild variant="ghost" className="mt-4 w-fit bg-dev-lime text-dev-ink"><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Hubungi Nempo <ArrowRight /></a></Button></>}
      </div>
    </div>
  );
}

export default function WebDevelopmentPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string>("umkm");
  const selected = WEBSITE_PACKAGES.find((p) => p.id === selectedId) ?? WEBSITE_PACKAGES[0];
  const SelectedIcon = packageIcons[WEBSITE_PACKAGES.findIndex((p) => p.id === selected.id)] ?? Globe2;

  return (
    <Layout>
      <div className="bg-dev-paper text-dev-ink">
        <section className="relative overflow-hidden px-6 pb-10 pt-14 sm:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className={`${mono} text-xs font-bold text-dev-sky`}>WEBSITE UNTUK USAHA & PERUSAHAAN</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">Nempo <span className="text-dev-sky">Web Development</span></h1>
            <p className={`${hand} mt-3 text-2xl sm:text-3xl`}>Usahamu online, peluang makin luas.</p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-dev-ink/65 sm:text-base">Dari satu halaman hingga toko online. Pilih website dengan fitur yang sesuai kebutuhan dan anggaran usahamu.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="ghost" className="min-h-12 bg-dev-ink px-6 font-bold text-primary-foreground"><a href="#paket-website">Lihat Paket Website <ArrowRight /></a></Button>
              <Button asChild variant="ghost" className="min-h-12 border-dev-ink/25 bg-card px-6 font-bold"><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Konsultasi Dulu</a></Button>
            </div>
            <p className="mt-4 text-xs text-dev-ink/65">Mulai <b className="text-dev-ink">{webRupiah(WEBSITE_PACKAGES[0].price)}</b> · domain & hosting terpisah</p>
            <div className="mt-10"><WebsitePreview /></div>
          </div>
        </section>

        <section id="paket-website" className="scroll-mt-24 px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <SectionHead tag="01" eyebrow="Paket Website" title="Website yang pas untuk usahamu" note="Bandingkan kebutuhan, fitur, dan anggaran." />
            <div role="tablist" aria-label="Paket website" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {WEBSITE_PACKAGES.map((p, i) => {
                const Icon = packageIcons[i] ?? Globe2;
                const active = selected.id === p.id;
                return <Button key={p.id} role="tab" id={`package-tab-${p.id}`} aria-controls="website-package-panel" aria-selected={active} variant="ghost" onClick={() => setSelectedId(p.id)} className={`h-full min-h-24 flex-col items-start gap-2 whitespace-normal rounded-lg border p-3 text-left ${active ? "border-dev-ink bg-dev-ink text-primary-foreground" : "border-dev-ink/15 bg-card text-dev-ink hover:border-dev-sky"}`}><Icon className={active ? "text-dev-lime" : "text-dev-sky"} /><span className="text-xs font-bold">{p.name}</span><span className={`text-xs ${active ? "text-dev-lime" : "text-dev-ink/60"}`}>{webRupiah(p.price)}</span></Button>;
              })}
            </div>
            <div id="website-package-panel" role="tabpanel" aria-labelledby={`package-tab-${selected.id}`} className="mt-5 grid gap-6 rounded-lg border border-dev-ink/15 bg-card p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
              <div className="flex flex-col items-start">
                <span className="flex size-12 items-center justify-center rounded-lg bg-dev-lime"><SelectedIcon className="size-6" /></span>
                <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">{selected.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dev-ink/65">{selected.detail}</p>
                <p className="mt-5 text-3xl font-extrabold">{webRupiah(selected.price)}</p>
                <p className="mt-1 text-xs text-dev-ink/60">Biaya pembuatan website</p>
                <Button asChild variant="ghost" className="mt-6 min-h-12 w-full bg-dev-ink font-bold text-primary-foreground sm:w-auto"><a href={websiteConsultUrl(NEMPO_CONSULT_URL, selected.id)} target="_blank" rel="noopener noreferrer">Konsultasi Paket <ArrowRight /></a></Button>
              </div>
              <div className="border-t border-dev-ink/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="mb-4 text-xs font-bold uppercase text-dev-sky">Termasuk dalam paket</p>
                <ul className="grid gap-3">{selected.items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed"><Check className="mt-0.5 size-4 shrink-0 text-dev-sky" strokeWidth={3} /><span>{item}</span></li>)}</ul>
              </div>
            </div>
            {(WEBSITE_EXCLUSIONS.paymentGateway || WEBSITE_EXCLUSIONS.complexSystems || WEBSITE_EXCLUSIONS.customIntegrations) && <p className="mt-4 border-l-2 border-dev-sky pl-3 text-xs leading-relaxed text-dev-ink/65">Payment gateway, sistem kompleks, dan integrasi khusus dihitung terpisah.</p>}
          </div>
        </section>

        <section className="border-y border-dev-ink/10 bg-card px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <SectionHead tag="02" eyebrow="Biaya Tambahan" title="Rencanakan biaya setelahnya" note="Domain, hosting, dan dukungan sesuai kebutuhan." />
            <dl className="mx-auto max-w-3xl divide-y divide-dev-ink/10">{WEBSITE_ADDITIONAL_FEES.map((fee) => <div key={fee.id} className="flex flex-wrap items-center justify-between gap-2 py-4"><dt className="text-sm font-bold">{fee.name}</dt><dd className="text-right text-sm"><span className="text-xs text-dev-ink/60">{fee.startingFrom ? "Mulai " : ""}</span><span className="font-bold">{webRupiah(fee.price)}{fee.maxPrice ? `–${webRupiah(fee.maxPrice)}` : ""}</span><span className="text-xs text-dev-ink/60">{fee.unit}</span></dd></div>)}</dl>
          </div>
        </section>

        <section className="px-6 py-12"><div className="mx-auto max-w-5xl">
          <SectionHead tag="03" eyebrow="Cara Kerja" title="Dari obrolan sampai online" note="Dikerjakan bersama, tahap demi tahap." />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{steps.map((s, i) => <li key={s.code} className="flex items-start gap-4 rounded-lg border border-dev-ink/15 bg-card p-5 lg:flex-col lg:items-center lg:text-center"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-dev-lime font-mono text-sm font-bold">{String(i + 1).padStart(2, "0")}</span><div><h3 className="text-sm font-extrabold">{s.title}</h3><p className="mt-2 text-xs leading-relaxed text-dev-ink/65">{s.desc}</p></div></li>)}</ol>
        </div></section>

        <section className="px-6 py-12"><div className="mx-auto max-w-3xl">
          <SectionHead tag="04" eyebrow="Tanya Jawab" title="Sebelum mulai, kenali dulu" />
          <div className="space-y-3">{faqs.map((f, i) => <div key={f.q} className={`overflow-hidden rounded-lg border bg-card ${open === i ? "border-dev-sky" : "border-dev-ink/15"}`}><Button variant="ghost" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`web-faq-${i}`} className="min-h-16 w-full justify-between gap-4 whitespace-normal rounded-none p-5 text-left text-sm font-bold"><span>{f.q}</span>{open === i ? <Minus className="shrink-0 text-dev-sky" /> : <Plus className="shrink-0 text-dev-sky" />}</Button>{open === i && <p id={`web-faq-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-dev-ink/65">{f.a}</p>}</div>)}</div>
        </div></section>

        <section className="bg-dev-ink px-6 py-14 text-center text-primary-foreground">
          <div className="mx-auto max-w-3xl"><p className={`${mono} text-xs font-bold text-dev-lime`}>MULAI PROYEKMU</p><h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Siap bikin usahamu online?</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/75">Ceritakan kebutuhanmu. Tim Nempo bantu memilih paket website yang sesuai untuk usahamu.</p><Button asChild variant="ghost" className="mt-6 min-h-12 bg-dev-lime px-6 font-bold text-dev-ink"><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Chat via WhatsApp <ArrowRight /></a></Button><Link href="/business-system" className="mx-auto mt-5 flex w-fit items-center gap-2 text-xs text-primary-foreground/70">Butuh sistem operasional bisnis? <ArrowRight className="size-3.5" /></Link></div>
        </section>
      </div>
    </Layout>
  );
}

function SectionHead({ tag, eyebrow, title, note }: { tag: string; eyebrow: string; title: string; note?: string }) {
  return <div className="mb-7 text-center"><p className={`${mono} text-[11px] font-bold uppercase text-dev-sky`}>{tag} / {eyebrow}</p><h2 className="mt-2 text-[26px] font-extrabold leading-tight sm:text-4xl">{title}</h2>{note && <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-dev-ink/65">{note}</p>}</div>;
}
