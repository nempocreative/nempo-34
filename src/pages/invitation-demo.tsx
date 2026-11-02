import { useEffect, useState } from "react";
import { Link, useParams } from "@/lib/wouter";
import { MailOpen, MapPin, CalendarHeart, ArrowLeft, Heart, Gift } from "lucide-react";
import { findInvitationTheme, invitationThemes } from "@/data/invitation-themes";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { Nempo01Invitation } from "@/components/nempo-01-invitation";
import { Nempo02Invitation } from "@/components/nempo-02-invitation";
import { Nempo03Invitation } from "@/components/nempo-03-invitation";
import { Nempo04Invitation } from "@/components/nempo-04-invitation";
import { Nempo05Invitation } from "@/components/nempo-05-invitation";
import { Nempo06Invitation } from "@/components/nempo-06-invitation";
import { Nempo07Invitation } from "@/components/nempo-07-invitation";
import { Nempo08Invitation } from "@/components/nempo-08-invitation";
import { Nempo09Invitation } from "@/components/nempo-09-invitation";
import { Nempo10Invitation } from "@/components/nempo-10-invitation";
import { Nempo11Invitation } from "@/components/nempo-11-invitation";
import { Nempo16Invitation } from "@/components/nempo-16-invitation";
import { Nempo15Invitation } from "@/components/nempo-15-invitation";
import { Nempo14Invitation } from "@/components/nempo-14-invitation";
import { Nempo13Invitation } from "@/components/nempo-13-invitation";
import { Nempo12Invitation } from "@/components/nempo-12-invitation";

const serif = "font-[family-name:var(--font-wed-serif)]";
const hand = "font-[family-name:var(--font-wed-hand)]";

const css = `
.inv-cover{transition:transform 1s cubic-bezier(.7,0,.3,1),opacity 1s}
.inv-cover.open{transform:translateY(-105%);opacity:.6}
@keyframes invRise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.inv-rise{animation:invRise .9s both}
@keyframes invFloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(4deg)}}
.inv-float{animation:invFloat 6s ease-in-out infinite}
@keyframes invPetal{0%{transform:translateY(-10vh) rotate(0);opacity:0}10%{opacity:.9}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
.inv-petal{position:absolute;top:0;width:12px;height:12px;border-radius:60% 0 60% 0;animation:invPetal linear infinite}
@media (prefers-reduced-motion:reduce){.inv-rise,.inv-float,.inv-petal{animation:none}.inv-cover{transition:none}}
`;

function Ornament({ kind, color }: { kind: string; color: string }) {
  const ch = kind === "star" ? "✦" : kind === "leaf" ? "❦" : kind === "minimal" ? "◆" : "✿";
  return <div className="inv-float text-3xl" style={{ color }}>{ch} {ch} {ch}</div>;
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, target - now);
  return [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
}

export default function InvitationDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const theme = findInvitationTheme(slug ?? "") ?? invitationThemes[0];
  const [open, setOpen] = useState(false);
  const cd = useCountdown(new Date("2026-12-20T09:00:00+07:00").getTime());

  useEffect(() => { document.body.style.overflow = open || ["NEMPO 01", "NEMPO 02", "NEMPO 03", "NEMPO 04", "NEMPO 05", "NEMPO 06", "NEMPO 07", "NEMPO 08", "NEMPO 09", "NEMPO 10", "NEMPO 11", "NEMPO 12", "NEMPO 13", "NEMPO 14", "NEMPO 15", "NEMPO 16"].includes(theme?.code ?? "") ? "" : "hidden"; return () => { document.body.style.overflow = ""; }; }, [open, theme?.code]);

  if (!theme) return null;
  if (theme.code === "NEMPO 01") return <Nempo01Invitation />;
  if (theme.code === "NEMPO 02") return <Nempo02Invitation />;
  if (theme.code === "NEMPO 03") return <Nempo03Invitation />;
  if (theme.code === "NEMPO 04") return <Nempo04Invitation />;
  if (theme.code === "NEMPO 05") return <Nempo05Invitation />;
  if (theme.code === "NEMPO 06") return <Nempo06Invitation />;
  if (theme.code === "NEMPO 07") return <Nempo07Invitation />;
  if (theme.code === "NEMPO 08") return <Nempo08Invitation />;
  if (theme.code === "NEMPO 09") return <Nempo09Invitation />;
  if (theme.code === "NEMPO 10") return <Nempo10Invitation />;
  if (theme.code === "NEMPO 11") return <Nempo11Invitation />;
  if (theme.code === "NEMPO 16") return <Nempo16Invitation />;
  if (theme.code === "NEMPO 15") return <Nempo15Invitation />;
  if (theme.code === "NEMPO 14") return <Nempo14Invitation />;
  if (theme.code === "NEMPO 13") return <Nempo13Invitation />;
  if (theme.code === "NEMPO 12") return <Nempo12Invitation />;
  const c = theme.colors;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: c.surface, color: c.ink }}>
      <style>{css}</style>

      {/* Cover */}
      <div className={`inv-cover fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 text-center ${open ? "open pointer-events-none" : ""}`} style={{ background: c.bg }}>
        {theme.withPhoto ? <img src="/images/invitation-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /> : <div className="absolute inset-x-0 top-12 text-center"><Ornament kind={theme.ornament} color={c.accent} /></div>}
        <div className="relative rounded-[2rem] px-8 py-10 shadow-2xl backdrop-blur" style={{ background: `${c.surface}e6` }}>
          <p className="text-xs uppercase tracking-[0.3em]">The Wedding of</p>
          <p className="mt-2 text-[10px] font-semibold">{theme.code}</p>
          <h1 className={`${hand} my-3 text-5xl`} style={{ color: c.accent }}>Habib &amp; Adiba</h1>
          <p className="text-sm opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className={`${serif} mt-1 text-xl font-semibold`}>Nama Tamu</p>
          <button
            onClick={() => { setOpen(true); window.scrollTo({ top: 0 }); }}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:scale-105"
            style={{ background: c.accent, color: c.surface }}
          >
            <MailOpen className="h-4 w-4" /> Buka Undangan
          </button>
        </div>
        <Link href="/wedding-invitation" className="relative mt-6 text-xs underline opacity-80" style={{ color: c.surface }}>← Kembali ke pilihan tema</Link>
      </div>

      {/* Petals */}
      {open && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="inv-petal" style={{ left: `${(i * 37) % 100}%`, background: c.accent, opacity: 0.5, animationDuration: `${8 + (i % 5) * 2}s`, animationDelay: `${i * 0.7}s` }} />
          ))}
        </div>
      )}

      {open && (
        <main className="relative z-20 mx-auto max-w-md px-5 pb-24">
          <Link href="/wedding-invitation" className="sticky top-3 z-30 mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow" style={{ background: c.accent, color: c.surface }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Tema lain
          </Link>

          <section className="inv-rise pt-10 text-center">
            <Ornament kind={theme.ornament} color={c.accent} />
            <p className="mt-4 text-xs uppercase tracking-[0.3em]">Bismillah, kami menikah</p>
            {theme.withPhoto && <img src="/images/invitation-hero.jpg" alt="Foto pasangan" className="mx-auto mt-5 aspect-[3/4] w-56 rounded-t-full object-cover shadow-xl" style={{ border: `4px solid ${c.accent}` }} />}
            <h2 className={`${hand} mt-5 text-5xl`} style={{ color: c.accent }}>Habib &amp; Adiba</h2>
            <p className="mt-2 text-sm">Minggu, 20 Desember 2026</p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {cd.map((n, i) => (
                <div key={i} className="rounded-xl py-2" style={{ background: c.accent, color: c.surface }}>
                  <p className="text-xl font-bold">{String(n).padStart(2, "0")}</p>
                  <p className="text-[10px]">{["hari", "jam", "menit", "detik"][i]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="inv-rise pt-14 text-center" style={{ animationDelay: ".2s" }}>
            <p className={`${serif} text-sm italic leading-relaxed opacity-85`}>
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya."
            </p>
            <p className="mt-2 text-xs font-semibold">QS. Ar-Rum: 21</p>
          </section>

          <section className="pt-14 text-center">
            {[["Habib Ramadhan", "Putra dari Bapak Ahmad & Ibu Siti"], ["Adiba Nurul", "Putri dari Bapak Hasan & Ibu Aisyah"]].map(([n, p], i) => (
              <div key={n}>
                {i === 1 && <Heart className="mx-auto my-4 h-6 w-6" style={{ color: c.accent }} />}
                <h3 className={`${hand} text-4xl`} style={{ color: c.accent }}>{n}</h3>
                <p className="text-xs opacity-80">{p}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 pt-14">
            {[["Akad Nikah", "08.00 – 10.00 WIB"], ["Resepsi", "11.00 – 14.00 WIB"]].map(([t, w]) => (
              <div key={t} className="rounded-3xl p-6 text-center shadow-lg" style={{ background: c.bg, color: c.surface }}>
                <CalendarHeart className="mx-auto h-6 w-6" />
                <h4 className={`${serif} mt-2 text-2xl font-semibold`}>{t}</h4>
                <p className="mt-1 text-sm">Minggu, 20 Desember 2026</p>
                <p className="text-sm">{w}</p>
                <p className="mt-2 flex items-center justify-center gap-1 text-xs"><MapPin className="h-3.5 w-3.5" /> Gedung Serbaguna, Garut</p>
              </div>
            ))}
          </section>

          {theme.withPhoto && <section className="pt-14">
            <h4 className={`${serif} text-center text-2xl font-semibold`}>Galeri</h4>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["/images/invitation-story.jpg", "/images/invitation-detail.jpg", "/images/invitation-hero.jpg", "/images/invitation-story.jpg"].map((s, i) => (
                <img key={i} src={s} alt="" loading="lazy" className={`w-full rounded-2xl object-cover shadow ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`} />
              ))}
            </div>
          </section>}

          <section className="pt-14 text-center">
            <Gift className="mx-auto h-6 w-6" style={{ color: c.accent }} />
            <h4 className={`${serif} mt-2 text-2xl font-semibold`}>Kado Digital</h4>
            <p className="mt-1 text-sm opacity-80">Doa restu Anda adalah hadiah terindah bagi kami.</p>
          </section>

          <section className="mt-14 rounded-3xl p-6 text-center shadow-lg" style={{ background: c.accent, color: c.surface }}>
            <p className="text-sm">Suka tema <b>{theme.code} · {theme.name}</b>?</p>
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: c.surface, color: c.accent }}>
              Pesan via WhatsApp
            </a>
          </section>
        </main>
      )}
    </div>
  );
}
