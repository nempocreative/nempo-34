import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { Link } from "@/lib/wouter";
import { SosmedPortfolioGallery } from "@/components/sosmed-portfolio-gallery";
import { InvitationCoverPreview } from "@/components/invitation-cover-preview";
import { eventPortfolioItems } from "@/data/event-portfolio";
import { invitationThemes } from "@/data/invitation-themes";
import { MapPin, CalendarDays, ArrowUpRight, Sparkles } from "lucide-react";

const serviceLinks = [
  { href: "/event-organizer", label: "Event Organizer" },
  { href: "/wedding-organizer", label: "Wedding Organizer" },
  { href: "/sosmed-management", label: "Sosmed Management" },
  { href: "/wedding-invitation", label: "Wedding Invitation" },
  { href: "/web-development", label: "Web Development" },
  { href: "/design-creative", label: "Design Creative" },
  { href: "/talent", label: "Talent Management" },
  { href: "/business-system", label: "Business System" },
];

export default function PortofolioPage() {
  return (
    <Layout>
      <SEO
        title="Portofolio Nempo Organizer"
        description="Kumpulan portofolio Nempo Organizer: event yang pernah digelar, konten sosmed, undangan digital, dan layanan kreatif lainnya."
        keywords="portofolio Nempo, portofolio event organizer, portofolio sosmed, undangan digital Nempo"
        path="/portofolio"
      />

      <main className="min-h-screen overflow-x-clip bg-white text-[#17233a]">
        {/* ===== HEADER ===== */}
        <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(145deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%)" }}>
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/55">
              Nempo Organizer
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Semua portofolio, satu halaman.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Dari panggung event, konten sosmed, sampai undangan digital —
              lihat hasil kerja kami sebelum mulai bareng Nempo.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {[
                { n: eventPortfolioItems.length, l: "Event" },
                { n: invitationThemes.length, l: "Tema undangan" },
                { n: serviceLinks.length, l: "Layanan" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-2xl font-black sm:text-3xl">{s.n}+</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== JUMP NAV ===== */}
        <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
            {[
              { id: "event", l: "Event" },
              { id: "sosmed", l: "Sosmed" },
              { id: "undangan", l: "Undangan Digital" },
            ].map((t) => (
              <a key={t.id} href={`#${t.id}`} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#0194f3] hover:text-[#0194f3]">
                {t.l}
              </a>
            ))}
          </div>
        </nav>

        {/* ===== EVENT ===== */}
        <section id="event" className="scroll-mt-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0194f3]">
                Event Kami
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Acara yang pernah digelar
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Poster asli dari setiap acara Nempo, lengkap dengan tanggal dan
                lokasinya.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {eventPortfolioItems.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.name}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[9/16] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                      {event.badge}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <h3 className="text-[13px] font-extrabold leading-snug text-slate-800">
                      {event.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0 text-[#0194f3]" />
                      {event.location}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <CalendarDays className="h-3 w-3 shrink-0 text-[#0194f3]" />
                      {event.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SOSMED ===== */}
        <section id="sosmed" className="scroll-mt-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0194f3]">
                Sosmed Management
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Konten sosmed tiap brand
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Sentuh karya untuk melihat sembilan unggahan dalam satu tone.
              </p>
            </div>
            <div className="mt-8">
              <SosmedPortfolioGallery />
            </div>
          </div>
        </section>

        {/* ===== WEDDING INVITATION ===== */}
        <section id="undangan" className="scroll-mt-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0194f3]">
                Wedding Invitation
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Undangan digital siap buka
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Semua tema undangan NEMPO, dari yang pertama sampai terbaru.
                Klik untuk melihat demonya.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {invitationThemes.map((theme) => (
                <Link
                  key={theme.code}
                  href={`/wedding-invitation/tema/${theme.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <InvitationCoverPreview theme={theme} />
                  <div className="flex items-center justify-between gap-2 p-3.5">
                    <div className="min-w-0">
                      <h3 className="truncate text-[13px] font-extrabold text-slate-800">
                        {theme.name}
                      </h3>
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
                        {theme.code} · {theme.mood}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0194f3] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(145deg, #0172B1 0%, #0194f3 55%, #1BA0E2 100%)" }}>
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/55">
              <Sparkles className="h-4 w-4" />
              Bikin bareng Nempo
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl">
              Suka karyanya? Ayo wujudkan punyamu.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {serviceLinks.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/85 transition hover:border-white/40 hover:bg-white/15"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
