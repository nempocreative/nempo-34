import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import {
  Mic2, Guitar, Footprints, Music2, Sparkles, Drum, Clapperboard, Camera,
  Plus, Check, ArrowRight, Star, MessageCircle, ClipboardList, Search, CalendarCheck, PartyPopper,
} from "lucide-react";
import { EVENT_TYPES, TALENT_CATEGORIES, buildTalentRequestUrl, canSendTalentRequest } from "@/data/talent-management";
import { Reveal, SectionHead, ServiceHero, ServiceMarquee, StickerIcon, hand, heroOutlineBtn, heroPrimaryBtn, serviceKitCss } from "@/components/service-page-kit";
import { FaqList } from "@/pages/design-creative";

const icons: Record<string, React.ElementType> = {
  mc: Mic2, band: Guitar, penari: Footprints, vokalis: Music2, model: Sparkles, budaya: Drum, creator: Clapperboard, "foto-video": Camera,
};

const steps = [
  { title: "Ceritakan acaranya", desc: "Jenis acara, tanggal, lokasi, dan talent yang dibutuhkan.", icon: ClipboardList, color: "#6366F1" },
  { title: "Kami carikan talent", desc: "Tim Nempo mencocokkan talent yang pas dengan konsep dan budget.", icon: Search, color: "#0EA5E9" },
  { title: "Deal & jadwal", desc: "Rundown, durasi tampil, dan kebutuhan teknis disepakati bersama.", icon: CalendarCheck, color: "#DB2777" },
  { title: "Tampil di hari-H", desc: "Talent hadir sesuai jadwal, tim kami ikut memantau.", icon: PartyPopper, color: "#14B8A6" },
];

const faqs = [
  { q: "Berapa harga sewa talent?", a: "Tarif talent berbeda-beda tergantung jenis talent, durasi tampil, lokasi, dan tanggal acara. Kirim kebutuhanmu, nanti tim Nempo kirim penawarannya." },
  { q: "Bisa pesan beberapa talent sekaligus?", a: "Bisa. Misalnya MC + band + penari untuk satu acara — tinggal pilih di bagian racik line-up." },
  { q: "Ada talent untuk acara adat Sunda?", a: "Ada. Lengser, Ambu, kecapi suling, dan sinden disediakan melalui vendor rekanan Nempo." },
  { q: "Saya talent, bisa gabung?", a: "Bisa banget. Kirim portofolio lewat WhatsApp Nempo, tim kami akan menghubungi untuk proses seleksi." },
];

const marquee = ["MC & Host", "Band", "Penari Jaipong", "Penyanyi", "Model", "Lengser & Ambu", "Content Creator", "Fotografer", "Garut • Jawa Barat"];
const inputCls = "mt-1.5 w-full rounded-xl border-2 border-dashed border-border bg-background px-3 py-2 text-sm font-medium normal-case tracking-normal text-brand-navy outline-none focus:border-brand";
const labelCls = "text-xs font-bold uppercase tracking-wider text-brand";

export default function TalentManagementPage() {
  const [eventType, setEventType] = useState<string>("");
  const [picked, setPicked] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const request = { eventType, talentIds: picked, date, location, note };
  const ready = canSendTalentRequest(request);
  const waHref = ready ? buildTalentRequestUrl(request) : NEMPO_CONSULT_URL;
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const chip = (on: boolean) => `rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-colors ${on ? "border-brand bg-brand text-primary-foreground" : "border-dashed border-brand/30 bg-card text-brand-navy hover:border-brand/60"}`;

  return (
    <Layout>
      <div className="bg-background pb-14 text-foreground">
        <style>{serviceKitCss}</style>
        <ServiceHero
          kicker="acaramu butuh siapa?"
          title="Nempo"
          accent="Talent Management"
          desc="MC, band, penari, penyanyi, model, sampai seniman Sunda untuk acara di Garut dan Jawa Barat."
          chips={["MC", "Band", "Penari", "Model"]}
          actions={<>
            <Button asChild size="lg" className={heroPrimaryBtn}><a href="#lineup">Racik Line-up <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline" className={heroOutlineBtn}><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"><MessageCircle /> Chat WhatsApp</a></Button>
          </>}
        />
        <ServiceMarquee items={marquee} />

        <section id="talent" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Reveal><SectionHead eyebrow="Talent" title="Siapa yang bisa kami carikan?" note="tulis kebutuhanmu, kami yang cari" /></Reveal>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Nempo bekerja sama dengan pengisi acara di Garut dan Jawa Barat, termasuk vendor rekanan untuk kebutuhan adat Sunda.
            Tarif tergantung jenis talent, durasi tampil, lokasi, dan tanggal — cukup kirim kebutuhanmu, tim kami kirim penawarannya.
          </p>
          <dl className="mt-6 grid gap-x-10 rounded-3xl border-2 border-dashed border-border bg-card px-5 sm:grid-cols-2 sm:px-6">
            {TALENT_CATEGORIES.map((c) => {
              const Icon = icons[c.id] ?? Star;
              return (
                <div key={c.id} className="flex gap-3 border-b border-dashed border-border py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sky text-brand"><Icon className="h-4 w-4" strokeWidth={2.3} /></span>
                  <div className="min-w-0">
                    <dt className="text-sm font-bold text-brand-navy">{c.name}</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.desc}</dd>
                    <p className="mt-1.5 text-[11px] font-semibold text-brand">{c.examples.join(" · ")}</p>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>

        <section id="lineup" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-12">
          <Reveal><SectionHead eyebrow="Racik Line-up" title="Tulis kebutuhan acaramu" note="pesannya otomatis terisi di WhatsApp" /></Reveal>
          <div className="wed-card-pop rounded-3xl border-2 border-dashed border-brand/30 bg-card p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className={labelCls}>Jenis acara</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {EVENT_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => setEventType(t)} aria-pressed={eventType === t} className={chip(eventType === t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className={labelCls}>Talent yang dibutuhkan</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TALENT_CATEGORIES.map((c) => {
                    const on = picked.includes(c.id);
                    return (
                      <button key={c.id} type="button" onClick={() => toggle(c.id)} aria-pressed={on} className={`inline-flex items-center gap-1 ${chip(on)}`}>
                        {on ? <Check className="h-3 w-3" strokeWidth={3} /> : <Plus className="h-3 w-3" strokeWidth={3} />} {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className={labelCls}>Tanggal<input value={date} onChange={(e) => setDate(e.target.value)} placeholder="cth. 14 Februari" maxLength={60} className={inputCls} /></label>
              <label className={labelCls}>Lokasi<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="cth. Garut Kota" maxLength={80} className={inputCls} /></label>
            </div>
            <label className={`mt-3 block ${labelCls}`}>Catatan (opsional)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth. band akustik 2 jam, MC bilingual" maxLength={300} className={inputCls} /></label>
            <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-border pt-6 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="wed-sticker eo-btn-shine rounded-full bg-brand-navy px-7 text-primary-foreground hover:bg-brand-navy/90">
                <a href={waHref} target="_blank" rel="noopener noreferrer"><MessageCircle /> Kirim ke WhatsApp</a>
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {ready ? "Jenis acara dan talent sudah terisi — tinggal tekan kirim di chat." : "Pilih jenis acara dan minimal satu talent supaya pesannya lengkap."}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal><SectionHead eyebrow="Cara Booking" title="4 langkah sampai tampil" note="santai, kami yang koordinasi" /></Reveal>
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
          <SectionHead eyebrow="Tanya Jawab" title="Pertanyaan umum" note="biar gak ragu" />
          <FaqList faqs={faqs} open={open} setOpen={setOpen} prefix="talent" />
        </section>

        <section className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-10 text-center text-primary-foreground">
            <p className={`${hand} text-2xl text-brand-sky`}>kamu yang di atas panggung?</p>
            <h2 className="mt-1 text-3xl font-extrabold leading-tight">Gabung jadi talent Nempo</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">MC, musisi, penari, model, atau creator — kirim portofolio dan dapatkan kesempatan tampil di acara Nempo.</p>
            <Button asChild size="lg" className={`mt-6 ${heroPrimaryBtn}`}><a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">Kirim Portofolio <ArrowRight /></a></Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
