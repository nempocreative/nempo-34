import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Coffee, Heart, MessageCircle } from "lucide-react";
import cafePartnershipBannerImage from "@/assets/generated_images/cafe-partnership-banner.jpg";
import collaborationHeroImage from "@/assets/076ae51bf23030e0b8cfb7975b94609a_1789408708055.jpg";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./nempo-partnership-carousel.css";

const slides = [
  {
    id: "cafe",
    eyebrow: "Kolaborasi Kafe Garut",
    title: "Bikin suasana kafe lebih hidup.",
    description: "Gelar event seru bersama tim muda kreatif Nempo.",
    action: "Ajak Nempo Kolaborasi",
    image: cafePartnershipBannerImage,
    imagePosition: "72% 38%",
    Icon: Coffee,
  },
  {
    id: "wedding",
    eyebrow: "Wedding Organizer",
    title: "Wedding impian, Nempo yang urus.",
    description: "Tim organizer kami siap bantu dari persiapan hingga hari bahagia.",
    action: "Konsultasi Wedding",
    image: `${import.meta.env.BASE_URL}images/invitation-story.jpg`,
    Icon: Heart,
  },
  {
    id: "event",
    eyebrow: "Event Organizer",
    title: "Event apa pun, kami siap bantu.",
    description: "Dari gathering dan launching sampai acara komunitas, kami bantu dari konsep hingga pelaksanaan.",
    action: "Rencanakan Event",
    image: collaborationHeroImage,
    Icon: CalendarDays,
  },
];

export function NempoPartnershipCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[activeSlide];
  const Icon = slide.Icon;

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-label="Kolaborasi dan layanan event Nempo"
      aria-roledescription="carousel"
      className="nempo-partnership-carousel relative isolate overflow-hidden rounded-3xl border border-white/50 shadow-[0_12px_28px_rgba(11,50,83,0.17)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setIsPaused(false);
        }
      }}
    >
      <img
        key={slide.id}
        src={slide.image}
        alt=""
        aria-hidden="true"
        className="nempo-partnership-carousel__image absolute inset-0 h-full w-full object-cover sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[42%]"
        style={{ objectPosition: slide.imagePosition ?? "center" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,35,61,0.94)_0%,rgba(5,35,61,0.84)_48%,rgba(5,35,61,0.3)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-cyan-200/20 blur-3xl"
      />

      <div
        key={`${slide.id}-content`}
        className="nempo-partnership-carousel__content relative z-10 flex min-h-[196px] flex-col justify-between gap-3 p-4 sm:min-h-[184px] sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-4"
        role="group"
        aria-roledescription="slide"
        aria-label={`${activeSlide + 1} dari ${slides.length}: ${slide.eyebrow}`}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/30 bg-white/15 text-cyan-100 shadow-inner shadow-white/10 backdrop-blur-sm sm:h-11 sm:w-11"
          >
            <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          </span>

          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100 sm:text-[10px]">
                {slide.eyebrow}
              </p>
              <span className="shrink-0 text-[9px] font-bold tabular-nums tracking-wider text-white/65 sm:hidden" aria-hidden="true">
                0{activeSlide + 1} / 03
              </span>
            </div>
            <h2 className="mt-1 text-lg font-black leading-tight tracking-tight text-white sm:text-xl lg:text-2xl">
              {slide.title}
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/85 sm:text-[13px]">
              {slide.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pl-[52px] sm:shrink-0 sm:flex-col sm:items-end sm:gap-3 sm:pl-0">
          <a
            href={NEMPO_CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-white/70 bg-white px-3 py-2 text-[10px] font-extrabold text-[#075ba7] shadow-md shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-2 sm:px-4 sm:text-xs"
          >
            <MessageCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            {slide.action}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          </a>

          <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Pilih pesan">
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Tampilkan ${item.eyebrow}`}
                aria-pressed={activeSlide === index}
                onClick={() => setActiveSlide(index)}
                className="grid h-5 w-5 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === index ? "w-5 bg-cyan-200" : "w-1.5 bg-white/60 hover:bg-white"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
