import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "@/lib/wouter";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./nempo-home-cta-banner.css";

const headlines = [
  "Your Ideas, Our Execution.",
  "Dari ide jadi karya nyata.",
  "Ide besar, eksekusi terbaik.",
];

export function NempoHomeCtaBanner() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setHeadlineIndex((index) => (index + 1) % headlines.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      aria-labelledby="nempo-home-cta-title"
      className="relative isolate overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-[#0789d8] via-[#0870c6] to-[#064b9b] px-3.5 py-3.5 shadow-[0_10px_24px_rgba(0,85,150,0.16)] sm:px-5 sm:py-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-20 h-44 w-44 rounded-full bg-cyan-200/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[24%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
      />
      <span aria-hidden="true" className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-cyan-200/80" />

      <div className="relative flex flex-col gap-3 sm:gap-3.5 md:flex-row md:items-center md:gap-5">
        <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center sm:gap-3">
          <div
            aria-hidden="true"
            className="relative mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/35 bg-gradient-to-br from-white/25 to-cyan-200/10 text-white shadow-inner shadow-white/10 sm:mt-0 sm:h-11 sm:w-11"
          >
            <span className="text-2xl font-black italic leading-none sm:text-[27px]">N</span>
            <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.9)]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100 sm:text-[10px]">
                Nempo Organizer
              </p>
              <span className="shrink-0 text-[9px] font-bold tabular-nums tracking-wider text-white/55" aria-hidden="true">
                0{headlineIndex + 1} <span className="text-white/35">/ 03</span>
              </span>
            </div>
            <h2
              id="nempo-home-cta-title"
              className="mt-0.5 text-lg font-black leading-tight tracking-tight text-white sm:text-xl lg:text-2xl"
            >
              <span key={headlineIndex} className="nempo-home-cta-headline">
                {headlines[headlineIndex]}
              </span>
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-snug text-white/80 sm:text-[13px]">
              Nempo bantu merancang dan mewujudkan acara, konten kreatif, serta kebutuhan digitalmu.
            </p>
          </div>
        </div>

        <div className="relative flex shrink-0 flex-wrap gap-1.5 sm:gap-2 md:flex-nowrap md:justify-end">
          <Link
            href="/digital-services"
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-2.5 py-2 text-[10px] font-extrabold text-[#075ba7] shadow-md shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:gap-2 sm:px-3 sm:text-xs"
          >
            Jelajahi Layanan
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          </Link>
          <a
            href={NEMPO_CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-white/40 bg-white/10 px-2.5 py-2 text-[10px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:gap-2 sm:px-3 sm:text-xs"
          >
            <MessageCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            Konsultasi Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
