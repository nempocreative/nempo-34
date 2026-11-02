import type React from "react";
import { useEffect, useRef } from "react";

export const hand = "font-[family-name:var(--font-wed-hand)]";

export const serviceKitCss = `
@keyframes eo-ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes eo-ring-glow { 0%,100% { opacity: .3; } 50% { opacity: .75; } }
@keyframes eo-tile-shine { 0%, 72% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
.eo-ring { position: absolute; inset: -3px -3px -5px; border-radius: 20px; overflow: hidden; padding: 2px; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; filter: drop-shadow(0 0 5px var(--ring-color)) saturate(1.2); }
.eo-ring::before { content: ""; position: absolute; left: 50%; top: 50%; width: 180%; height: 180%; transform: translate(-50%, -50%);
  background: conic-gradient(from 0deg, transparent 0deg 190deg, var(--ring-tail) 250deg, var(--ring-color) 320deg, #fff 352deg, transparent 360deg);
  animation: eo-ring-spin 2.6s linear infinite; animation-delay: var(--ring-delay); }
.eo-glow { position: absolute; inset: -2px; border-radius: 20px; z-index: -1; pointer-events: none; background: radial-gradient(circle, var(--ring-color) 0%, transparent 70%); filter: blur(4px); animation: eo-ring-glow 3.2s ease-in-out infinite; animation-delay: var(--ring-delay); }
.eo-shine { position: absolute; inset: 0; width: 45%; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: eo-tile-shine 4.8s ease-in-out infinite; animation-delay: var(--ring-delay); }
.wed-card-pop:hover .eo-ring::before { animation-duration: 1.4s; }

@keyframes eo-hero-in { from { opacity: 0; transform: translateY(26px) scale(.98); } to { opacity: 1; transform: none; } }
.eo-hero { animation: eo-hero-in .7s cubic-bezier(.22,1,.36,1) both; }

.eo-reveal { opacity: 0; transform: translateY(24px) scale(.985); will-change: opacity, transform; }
.eo-reveal.eo-in { opacity: 1; transform: none; transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }

@keyframes eo-glow-pulse { 0%,100% { box-shadow: 0 18px 42px -20px rgba(6,95,125,.5); } 50% { box-shadow: 0 26px 60px -16px rgba(6,95,125,.75); } }
.eo-glow-pulse { animation: eo-glow-pulse 2.8s ease-in-out infinite; }

@keyframes eo-shine-sweep { 0% { transform: translateX(-170%) skewX(-18deg); } 100% { transform: translateX(330%) skewX(-18deg); } }
.eo-btn-shine { position: relative; overflow: hidden; }
.eo-btn-shine::after { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 40%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent); transform: translateX(-170%) skewX(-18deg); pointer-events: none; }
.eo-btn-shine:hover::after { animation: eo-shine-sweep .8s ease; }

.wed-marquee:hover { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .eo-ring::before, .eo-glow, .eo-shine, .eo-glow-pulse { animation: none; }
  .eo-shine { display: none; }
  .eo-hero, .eo-reveal { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
}
`;

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("eo-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("eo-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`eo-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function StickerIcon({ icon: Icon, color, size = "md", className = "", delay = 0 }: { icon: React.ElementType; color: string; size?: "sm" | "md"; className?: string; delay?: number }) {
  const box = size === "sm" ? "h-11 w-11 rounded-[14px]" : "h-[54px] w-[54px] rounded-[17px]";
  return (
    <span
      className={`relative isolate m-1.5 inline-flex w-fit shrink-0 ${className}`}
      style={{ "--ring-color": color, "--ring-tail": `color-mix(in srgb, ${color} 35%, transparent)`, "--ring-delay": `${-delay * 0.4}s` } as React.CSSProperties}
    >
      <span aria-hidden className="eo-glow" />
      <span aria-hidden className="eo-ring" />
      <span
        className={`relative flex items-center justify-center overflow-hidden ${box}`}
        style={{
          background: `linear-gradient(148deg, color-mix(in srgb, ${color} 55%, white) 0%, ${color} 58%, color-mix(in srgb, ${color} 72%, black) 100%)`,
          boxShadow: `0 4px 0 color-mix(in srgb, ${color} 82%, black), 0 8px 13px -9px ${color}88, inset 0 1px 0 rgba(255,255,255,.54)`,
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_27%_17%,rgba(255,255,255,.42),transparent_56%)]" />
        <span aria-hidden className="pointer-events-none absolute inset-[1px] rounded-[inherit] border border-white/20" />
        <span aria-hidden className="eo-shine" />
        <Icon className={`relative z-10 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,.25)] ${size === "sm" ? "h-5 w-5" : "h-6 w-6"}`} strokeWidth={2.2} />
      </span>
    </span>
  );
}

/* Coretan tangan — pengganti ikon dekorasi biar tidak kaku */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" fill="none" className={className} aria-hidden>
      <path d="M3 13 C 11 3, 19 19, 27 10 S 43 3, 51 12 S 57 15, 57 8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function Burst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path d="M20 4v8M20 28v8M4 20h8M28 20h8M9 9l5.5 5.5M25.5 25.5L31 31M31 9l-5.5 5.5M14.5 25.5L9 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

export function Ring({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <path d="M20 5 C 30 4, 36 12, 35 21 C 34 31, 24 37, 15 34 C 7 31, 3 22, 7 14 C 10 8, 15 6, 19 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}


export type ServiceTone = "brand" | "cake";

export function SectionHead({ eyebrow, title, note, tone = "brand" }: { eyebrow: string; title: string; note?: string; tone?: ServiceTone }) {
  const accent = tone === "cake" ? "text-cake" : "text-brand";
  const ink = tone === "cake" ? "text-cake-deep" : "text-brand-navy";
  return (
    <div className="mb-7 text-center">
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${accent}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-[26px] font-extrabold leading-tight sm:text-4xl ${ink}`}>{title}</h2>
      {note && <p className={`${hand} mt-1 text-xl ${accent}`}>{note}</p>}
    </div>
  );
}

export function ServiceHero({ kicker, title, accent, desc, chips, actions, tone = "brand" }: { kicker: string; title: string; accent: string; desc: string; chips: string[]; actions: React.ReactNode; tone?: ServiceTone }) {
  const heroBg = tone === "cake" ? "bg-cake" : "bg-brand";
  const heroSoft = tone === "cake" ? "text-cake-soft" : "text-brand-sky";
  const heroSoft70 = tone === "cake" ? "text-cake-soft/70" : "text-brand-sky/70";
  return (
    <section className={`relative isolate overflow-hidden px-6 pb-20 pt-14 text-primary-foreground sm:pt-20 ${heroBg}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-foreground/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary-foreground/20 blur-3xl" />
      <Burst className="wed-float pointer-events-none absolute left-[7%] top-16 h-8 w-8 text-primary-foreground/50" />
      <Burst className="wed-float-slow pointer-events-none absolute right-[9%] top-24 h-10 w-10 text-primary-foreground/30" />
      <Ring className={`wed-wiggle pointer-events-none absolute bottom-24 left-[15%] h-6 w-6 ${heroSoft70}`} />
      <Ring className="wed-float pointer-events-none absolute bottom-28 right-[16%] h-8 w-8 text-primary-foreground/40" />
      <div className="mx-auto max-w-5xl text-center">
        <p className={`${hand} eo-hero text-2xl sm:text-3xl ${heroSoft}`}>{kicker}</p>
        <h1 className="eo-hero mt-3 text-[38px] font-extrabold leading-[1.08] tracking-tight sm:text-6xl" style={{ animationDelay: "80ms" }}>
          {title}
          <span className={`mt-1 block ${heroSoft}`}>{accent}</span>
        </h1>
        <p className="eo-hero mx-auto mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base" style={{ animationDelay: "160ms" }}>{desc}</p>
        <div className="eo-hero mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>{actions}</div>
        <div className="eo-hero mt-8 flex flex-wrap items-center justify-center gap-2" style={{ animationDelay: "320ms" }}>
          {chips.map((c, i) => (
            <span key={c} className="wed-sticker inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              <Burst className={`h-3 w-3 ${i === 1 ? heroSoft : "text-primary-foreground/60"}`} />{c}
            </span>
          ))}
        </div>
      </div>
      <svg className={`absolute bottom-0 left-0 w-full ${heroSoft}`} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden>
        <path d="M0,32 C240,60 480,4 720,28 C960,52 1200,8 1440,32 L1440,60 L0,60 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

export function ServiceMarquee({ items, tone = "brand" }: { items: string[]; tone?: ServiceTone }) {
  return (
    <div className={`overflow-hidden py-3 ${tone === "cake" ? "bg-cake-soft text-cake" : "bg-brand-sky text-brand"}`} aria-hidden>
      <div className="wed-marquee flex w-max items-center gap-8">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-semibold tracking-wide">{item}<Burst className="h-3.5 w-3.5" /></span>
        ))}
      </div>
    </div>
  );
}

export const heroPrimaryBtn = "wed-sticker eo-btn-shine rounded-full bg-card px-7 text-brand hover:bg-card/90";
export const cakeHeroPrimaryBtn = "wed-sticker eo-btn-shine rounded-full bg-card px-7 text-cake hover:bg-card/90";
export const heroOutlineBtn = "rounded-full border-primary-foreground/40 bg-primary-foreground/10 px-7 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground";
