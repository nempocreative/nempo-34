import { BookOpen, Building2, CalendarDays, Instagram, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import "./nempo-facts-section.css";

const facts: {
  Icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  tint: string;
  gradient: string;
  glow: string;
}[] = [
  {
    Icon: CalendarDays,
    title: "Event & Wedding Organizer",
    desc: "Bantu rencanakan acara dari konsep sampai pelaksanaan dengan lebih rapi.",
    accent: "#0789ce",
    tint: "#e8f6ff",
    gradient: "linear-gradient(135deg, #ebf3ff, #cce0ff)",
    glow: "rgba(0, 108, 157, 0.2)",
  },
  {
    Icon: Instagram,
    title: "Kreatif untuk brand",
    desc: "Sosmed Management dan Design Creative untuk kebutuhan konten dan promosi.",
    accent: "#e27642",
    tint: "#fff1e8",
    gradient: "linear-gradient(135deg, #fff0ec, #fed7aa)",
    glow: "rgba(234, 88, 12, 0.2)",
  },
  {
    Icon: BookOpen,
    title: "Undangan & website digital",
    desc: "Wedding Invitation dan Web Development untuk kebutuhan digitalmu.",
    accent: "#7660d8",
    tint: "#f0edff",
    gradient: "linear-gradient(135deg, #f0edff, #ddd6fe)",
    glow: "rgba(118, 96, 216, 0.2)",
  },
  {
    Icon: Building2,
    title: "Talent & sistem bisnis",
    desc: "Talent Management dan Business System untuk kebutuhan talent dan operasional.",
    accent: "#138b70",
    tint: "#e7f8f1",
    gradient: "linear-gradient(135deg, #ecfdf5, #a7f3d0)",
    glow: "rgba(5, 150, 105, 0.2)",
  },
];

type NempoFactsSectionProps = {
  factIdx: number;
  onFactChange: (index: number) => void;
};

export function NempoFactsSection({ factIdx, onFactChange }: NempoFactsSectionProps) {
  const activeIndex = ((factIdx % facts.length) + facts.length) % facts.length;
  const activeFact = facts[activeIndex];
  const mascotSrc = `${import.meta.env.BASE_URL}images/nempo-facts-otter-nempo.webp`;

  return (
    <section id="nempo-fakta" className="home-section-facts overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3 border-b border-gray-50 px-4 pb-2 pt-4">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#0194f3]">
              Fakta Menarik
            </p>
            <h2 className="text-xl font-extrabold leading-tight text-gray-900">
              Nempo Garut{" "}
              <span className="nempo-org-word">
                Organizer
                <svg className="nempo-org-underline" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 7 C 22 2, 38 9, 58 5 S 88 3, 98 6" fill="none" pathLength={100} />
                </svg>
              </span>
            </h2>
            <p className="mt-1 text-[10px] font-semibold text-gray-500">
              Satu tim kreatif, banyak ide seru.
            </p>
          </div>
          <div className="relative grid h-[88px] w-[88px] shrink-0 place-items-center">
            <img
              src={mascotSrc}
              alt="Maskot berang-berang Nempo"
              decoding="async"
              className="nempo-mascot-float relative z-10 h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="px-4 py-3">
          <article key={activeIndex} className="nempo-fact-enter flex items-start gap-3 rounded-2xl bg-gray-50 p-3.5" aria-live="polite">
            <span
              className="fact-icon-wrap mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ background: activeFact.gradient, color: activeFact.accent, "--glow": activeFact.glow, animationDelay: `${activeIndex * 0.75}s` } as CSSProperties}
            >
              <activeFact.Icon
                className="fact-icon"
                style={{ width: 20, height: 20, animationDelay: `${activeIndex * 0.75}s` }}
                strokeWidth={2.1}
              />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="mb-0.5 flex items-center gap-1.5 text-sm font-extrabold text-gray-900">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: activeFact.accent }} />
                {activeFact.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">{activeFact.desc}</p>
            </div>
          </article>
        </div>

        <div className="flex justify-center gap-1.5 pb-4" role="group" aria-label="Pilih layanan Nempo">
          {facts.map((fact, index) => (
            <button
              key={fact.title}
              type="button"
              onClick={() => onFactChange(index)}
              aria-label={`Tampilkan ${fact.title}`}
              aria-pressed={index === activeIndex}
              className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0194f3]"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-5 bg-[#0194f3]" : "w-1.5 bg-gray-300 hover:bg-[#0194f3]/70"}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-6 p-6 sm:flex lg:gap-8 lg:p-8">
        <aside className="flex w-44 shrink-0 flex-col items-center justify-center gap-1.5 lg:w-52">
          <p className="self-start text-[10px] font-bold uppercase tracking-widest text-[#0194f3]">
            Fakta Menarik
          </p>
          <h2 className="self-start text-2xl font-extrabold leading-tight text-gray-900 lg:text-3xl">
            Nempo Garut{" "}
            <span className="nempo-org-word">
              Organizer
              <svg className="nempo-org-underline" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
                <path d="M2 7 C 22 2, 38 9, 58 5 S 88 3, 98 6" fill="none" pathLength={100} />
              </svg>
            </span>
          </h2>
          <p className="self-start text-xs leading-relaxed text-gray-500">
            Satu tim kreatif, banyak ide seru.
          </p>
          <div className="relative mt-1 grid h-36 w-full place-items-center lg:h-40">
            <img
              src={mascotSrc}
              alt="Maskot berang-berang Nempo"
              loading="lazy"
              decoding="async"
              className="nempo-mascot-float relative z-10 h-full w-full object-contain"
            />
          </div>
        </aside>

        <div className="grid flex-1 grid-cols-2 content-center gap-3">
          {facts.map((fact, index) => (
            <article key={fact.title} className="fact-card group relative flex min-h-[138px] flex-col overflow-hidden rounded-2xl bg-gray-50 p-4">
              {/* lingkaran dekor sepusat dengan badge nomor */}
              <span aria-hidden="true" className="pointer-events-none absolute right-[4px] top-[10px] h-14 w-14 rounded-full opacity-90 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: fact.tint }} />
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span
                  className="fact-icon-wrap grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: fact.gradient, color: fact.accent, "--glow": fact.glow, animationDelay: `${index * 0.75}s` } as CSSProperties}
                >
                  <fact.Icon
                    className="fact-icon"
                    style={{ width: 20, height: 20, animationDelay: `${index * 0.75}s` }}
                    strokeWidth={2.1}
                  />
                </span>
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[11px] font-extrabold leading-none tabular-nums shadow-sm ring-1 ring-black/5"
                  style={{ color: fact.accent }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative z-10 mt-3">
                <h3 className="text-sm font-extrabold leading-snug text-gray-900">
                  {fact.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{fact.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
