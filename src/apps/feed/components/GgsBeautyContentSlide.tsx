import type { RefObject } from 'react';
import {
  Eye,
  Hand,
  Heart,
  MessageCircle,
  Paintbrush,
} from 'lucide-react';
import { FaInstagram, FaLocationDot, FaWhatsapp } from 'react-icons/fa6';
import hairOrnament from '@/assets/generated_images/ggs-beauty-hair-ornament-20261012.png';
import goldHairTemplate from '@/assets/generated_images/ggs-beauty-curly-pink-slide2-short-portrait-4x5-20261012.png';
import ggsHairHeader from '@/assets/generated_images/ggs-beauty-double-braid-edge-connected-4x5-20261012.png';
import ggsGrandOpeningPoster from '@/assets/Glossy_Pink_Grand_Opening_Beauty_Poster_1791924828998.png';
import slideFourManicurePoster from '@/assets/Pink_Manicure_Treatment_Discount_Poster_1791978106822.png';
import slideFiveRecruitmentPoster from '@/assets/Polished_Pink_Beauty_Recruitment_Flyer_1791982292367.png';
import slideTwoPhoto from '@/assets/Glamorous_Powder_Trail_Portrait_1791880787206_powder-cleaned.png';
import { GgsPosterVectorText } from './GgsPosterVectorText';

const assetBase = "/nempo-feed/";

function CartoonHairIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-[68%] w-[68%]" aria-hidden="true">
      <path
        d="M11 29c-2-13 7-23 21-23s23 10 21 24l-2 18H13z"
        fill="#d91070"
        stroke="#561535"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M18 30c0-10 6-17 14-17s14 7 14 17v10c0 9-6 15-14 15s-14-6-14-15z"
        fill="#ffd4c4"
        stroke="#561535"
        strokeWidth="2.4"
      />
      <path
        d="M18 29c2-8 8-12 15-13 4 0 8 2 12 6-3-10-9-15-17-14-9 1-14 9-14 18 1 4 2 6 4 8z"
        fill="#f52d91"
        stroke="#561535"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M25 35h2m10 0h2" stroke="#561535" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M27 43c3 3 7 3 10 0" fill="none" stroke="#d75a78" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="41" r="2.4" fill="#f58a9f" />
      <circle cx="42" cy="41" r="2.4" fill="#f58a9f" />
      <path
        d="M9 59c1-8 8-12 15-13l8 7 8-7c8 1 14 5 15 13z"
        fill="#f9a4c7"
        stroke="#561535"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M32 53v6" stroke="#fff5f7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CartoonLashIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-[68%] w-[68%]" aria-hidden="true">
      <path
        d="M8 34c6-13 15-19 24-19s18 6 24 19c-6 11-15 16-24 16S14 45 8 34z"
        fill="#fff8fb"
        stroke="#561535"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 32c5-12 14-18 23-18s18 6 23 18"
        fill="none"
        stroke="#d91070"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M13 23 8 17m12 1-2-8m13 6 1-9m10 11 5-7m4 14 8-5"
        fill="none"
        stroke="#561535"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="34" r="10" fill="#f06aa6" stroke="#561535" strokeWidth="2" />
      <circle cx="32" cy="34" r="5.2" fill="#561535" />
      <circle cx="35" cy="31" r="2" fill="white" />
      <path d="M17 45c4 4 9 6 15 6s11-2 15-6" fill="none" stroke="#d75a78" strokeWidth="2" strokeLinecap="round" />
      <path d="m53 8 1.7 3.5L58 13l-3.3 1.7L53 18l-1.7-3.3L48 13l3.3-1.5z" fill="#ffc94a" stroke="#561535" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function CartoonTherapistIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-[68%] w-[68%]" aria-hidden="true">
      <path
        d="M12 43c4-5 9-7 14-5l6 4 6-4c5-2 10 0 14 5l-5 5-12-4-3 1-3-1-12 4z"
        fill="#ffd4c4"
        stroke="#561535"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 38c-2-3-8-7-11-2-4 7 8 14 11 17 3-3 15-10 11-17-3-5-9-1-11 2z"
        fill="#f52d91"
        stroke="#561535"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M7 48c7-3 13-3 18 0l7 5 7-5c5-3 11-3 18 0l-3 6c-6-1-10 0-14 3l-8 3-8-3c-4-3-8-4-14-3z" fill="#f9a4c7" stroke="#561535" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 30c1-9 7-15 16-15s15 6 16 15" fill="none" stroke="#d91070" strokeWidth="4" strokeLinecap="round" />
      <circle cx="16" cy="31" r="3.3" fill="#ffc94a" stroke="#561535" strokeWidth="1.8" />
      <circle cx="48" cy="31" r="3.3" fill="#ffc94a" stroke="#561535" strokeWidth="1.8" />
      <path d="M32 11v4" stroke="#561535" strokeWidth="2" strokeLinecap="round" />
      <path d="m29 9 3-4 3 4" fill="none" stroke="#561535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const slideCopy = {
  2: {
    eyebrow: 'PERSONAL STYLE',
    headline: 'Gaya yang\nterasa seperti kamu.',
    description:
      'Bukan soal mengikuti tren. Pilih tampilan yang nyaman dan terasa milikmu.',
    footer: 'YOUR STYLE · YOUR CROWN',
  },
  4: {
    eyebrow: 'GGS BEAUTY',
    headline: 'Tampil percaya diri.',
    description: 'Your style. Your crown.',
    footer: 'GROOMING IS BETTER',
  },
} as const;

const ggsReasons = [
  {
    icon: Paintbrush,
    title: 'Layanan kecantikan beragam',
    description: 'Nail art, eyelash extension, refleksi & spa, dan makeup.',
  },
  {
    icon: MessageCircle,
    title: 'Pilih sesuai kebutuhan',
    description: 'Pilih perawatan untuk gaya dan momenmu.',
  },
  {
    icon: Heart,
    title: 'Waktu nyaman untuk dirimu',
    description: 'Luangkan waktu merawat diri dan percaya diri.',
  },
] as const;

function GgsBeautyWhyGgsSlide({
  exportRef,
}: {
  exportRef: RefObject<HTMLElement | null>;
}) {
  return (
    <main
      ref={exportRef}
      aria-label="GGS Beauty — Kenapa memilih GGS Beauty?"
      className="relative isolate aspect-[4/5] h-auto w-[min(100%,80vh)] max-w-full overflow-hidden text-[#472b38] shadow-[0_24px_70px_rgba(63,35,47,0.22)]"
      style={{
        backgroundColor: '#FC46AA',
        containerType: 'inline-size',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <img
        src={goldHairTemplate}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundColor: '#FC46AA',
          mixBlendMode: 'color',
          opacity: 0.86,
        }}
      />
      <img
        src={slideTwoPhoto}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[18%] z-[5] h-[70%] w-auto max-w-[90%]"
        style={{
          filter:
            'saturate(1.08) hue-rotate(-10deg) drop-shadow(0 0 20px rgba(252, 70, 170, 0.34))',
        }}
        draggable={false}
      />
      <div className="pointer-events-none absolute left-[68%] top-[2.5%] z-10 aspect-square w-[16%] -translate-x-1/2">
        <img
          src={`${assetBase}assets/ggs-beauty-logo.png`}
          alt="Logo GGS Beauty — Grooming is Better"
          className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(66,37,49,0.22)]"
          loading="eager"
        />
      </div>

      <section className="absolute left-[10%] right-[40%] top-[35%] z-10 flex flex-col">
          <h1
            className="whitespace-pre-line text-[clamp(20px,4.3cqw,36px)] font-semibold leading-[0.99] tracking-[-0.055em] text-[#42162f] [text-shadow:0_1px_8px_rgba(255,220,235,0.28)]"
          >
            {'Kenapa memilih\nGGS Beauty?'}
          </h1>
          <p className="mt-[1.5%] max-w-[98%] text-justify text-[clamp(12px,2cqw,16px)] leading-[1.2] text-[#501a38] [text-shadow:0_1px_7px_rgba(255,220,235,0.3)]">
            Pilihan layanan beragam untuk merawat diri sesuai kebutuhan dan
            gayamu.
          </p>
        <div
          aria-label="Alasan memilih GGS"
          className="mt-[8%] flex flex-col gap-[1.5cqw]"
        >
          {ggsReasons.map(({ icon: Icon, title, description }) => (
            <article key={title} className="flex min-w-0 items-start gap-[1.5cqw]">
              <Icon
                aria-hidden="true"
                className="mt-[0.02em] h-[clamp(12px,2cqw,16px)] w-[clamp(12px,2cqw,16px)] shrink-0 text-white"
                strokeWidth={1.8}
              />
              <div className="min-w-0">
                <h2 className="text-[clamp(14px,2.4cqw,18px)] font-semibold leading-[1] tracking-[-0.035em] text-[#42162f] [text-shadow:0_1px_7px_rgba(255,220,235,0.28)]">
                  {title}
                </h2>
                <p className="mt-[0.35em] max-w-[98%] text-justify text-[clamp(10px,1.65cqw,13px)] leading-[1.1] text-[#501a38] [text-shadow:0_1px_6px_rgba(255,220,235,0.32)]">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-[4.5%] flex flex-wrap gap-x-[1.3em] text-[clamp(10px,1.5cqw,12px)] font-semibold text-[#42162f] [text-shadow:0_1px_6px_rgba(255,220,235,0.3)]">
          <span>Lihat layanan →</span>
          <span>Atur jadwal →</span>
        </p>
      </section>

      <section
        aria-label="Layanan GGS"
        className="absolute left-[10%] right-[40%] bottom-[16%] z-10"
      >
        <ul className="grid grid-cols-4 gap-x-[2%] text-center">
          {[
            { label: 'Nail Art', icon: Paintbrush },
            { label: 'Eyelash Extension', icon: Eye },
            { label: 'Refleksi & Spa', icon: Hand },
            { label: 'Makeup & Wedding Project', icon: Heart },
          ].map(({ label, icon: Icon }) => (
            <li key={label} className="flex min-w-0 flex-col items-center gap-[0.8cqw]">
              <span className="flex aspect-square w-[clamp(38px,6cqw,76px)] shrink-0 items-center justify-center rounded-full border border-[#F1324D]/45 bg-[#fff8f6]/85 text-[#F1324D] shadow-[0_4px_12px_rgba(91,22,46,0.12)]">
                <Icon
                  aria-hidden="true"
                  className="h-[48%] w-[48%]"
                  strokeWidth={1.8}
                />
              </span>
              <span className="text-[clamp(8px,1.15cqw,11px)] font-semibold leading-tight text-[#42162f]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer
        aria-label="Kontak GGS Beauty"
        className="absolute inset-x-[4%] bottom-[4.2%] z-10 flex items-center gap-[2.5%] text-[#561535]"
      >
        <div className="min-w-0 flex-1">
          <p className="whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold leading-none tracking-[-0.035em]">
            Grooming is better
          </p>
          <p className="mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]">
            Your style · your crown
          </p>
        </div>
        <span
          aria-hidden="true"
          className="h-11 w-px shrink-0 bg-[#561535]/40"
        />
        <div className="flex min-w-0 flex-[1.2] flex-col items-start gap-[0.3em]">
          <a
            href="https://www.instagram.com/ggsbeauty.hair.co/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
          >
            <FaInstagram aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
            @ggsbeauty.hair.co
          </a>
          <a
            href="https://wa.me/6282342777723"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
          >
            <FaWhatsapp aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]" />
            0823 4277 7723
          </a>
          <span className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-medium leading-tight">
            <FaLocationDot aria-hidden="true" className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]" />
            <span>Jl. Cimanuk No. 309, Sukagalih, Garut</span>
          </span>
        </div>
        <a
          href="https://wa.me/6282342777723"
          target="_blank"
          rel="noreferrer"
          aria-label="Booking Now via WhatsApp"
          className="shrink-0 whitespace-nowrap rounded-full bg-[#561535] px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)] font-bold leading-none text-[#fff8f6] transition-colors hover:bg-[#71274c]"
        >
          Booking Now
        </a>
      </footer>

    </main>
  );
}

function GgsBeautyMomentSlide({
  exportRef,
}: {
  exportRef: RefObject<HTMLElement | null>;
}) {
  return (
    <main
      ref={exportRef}
      aria-label="GGS Beauty — Poster Grand Opening"
      className="ggs-grand-opening-slide relative isolate aspect-[4/5] h-auto w-[min(100%,80vh)] max-w-full overflow-hidden text-[#561535] shadow-[0_24px_70px_rgba(63,35,47,0.22)]"
      style={{
        backgroundColor: '#FC46AA',
        containerType: 'inline-size',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <img
        src={ggsGrandOpeningPoster}
        alt="Poster Grand Opening GGS Beauty"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        draggable={false}
      />
      <img
        src={ggsHairHeader}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
        style={{
          opacity: 1,
          mixBlendMode: 'overlay',
          clipPath: 'inset(0 0 68% 0)',
          maskImage:
            'linear-gradient(to bottom, #000 0%, #000 22%, transparent 30%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 0%, #000 22%, transparent 30%)',
        }}
        draggable={false}
      />
      <img
        src={ggsHairHeader}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
        style={{
          opacity: 1,
          mixBlendMode: 'overlay',
          clipPath: 'inset(19% 88% 37% 0)',
        }}
        draggable={false}
      />
      <img
        src={ggsHairHeader}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
        style={{
          opacity: 1,
          mixBlendMode: 'overlay',
          clipPath: 'inset(19% 0 37% 88%)',
        }}
        draggable={false}
      />
      <GgsPosterVectorText />
    </main>
  );
}

export function GgsBeautyContentSlide({
  slide,
  exportRef,
  isStoryCover = false,
}: {
  slide: 2 | 3 | 4 | 5 | 6;
  exportRef: RefObject<HTMLElement | null>;
  isStoryCover?: boolean;
}) {
  if (slide === 3) {
    return <GgsBeautyMomentSlide exportRef={exportRef} />;
  }

  if (slide === 4) {
    return (
      <main
        ref={exportRef}
        aria-label="GGS Beauty — slide 4, promo diskon manicure"
        className="relative aspect-[4/5] h-auto w-[min(100%,80vh)] max-w-full overflow-hidden bg-[#FC46AA] shadow-[0_24px_70px_rgba(63,35,47,0.22)]"
        style={{
          backgroundColor: '#FC46AA',
          fontFamily: "'Poppins', Arial, sans-serif",
        }}
      >
        <img
          src={slideFourManicurePoster}
          alt="Poster manicure salon GGS Beauty dengan diskon 30% all treatment hingga Oktober 2026"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute left-[52%] top-[2.5%] z-10 aspect-square w-[18%] -translate-x-1/2">
          <img
            src={`${assetBase}assets/ggs-beauty-logo.png`}
            alt="Logo GGS Beauty — Grooming is Better"
            className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(66,37,49,0.22)]"
            loading="eager"
          />
        </div>
        <footer
          aria-label="Kontak GGS Beauty"
          className="absolute inset-x-[4%] bottom-[4.2%] z-10 flex items-center gap-[2.5%] text-[#561535]"
        >
          <div
            className={`min-w-0 flex-1 ${
              isStoryCover ? 'pl-[2%]' : ''
            }`}
          >
            <p className="whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold leading-none tracking-[-0.035em]">
              Grooming is better
            </p>
            <p className="mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]">
              Your style · your crown
            </p>
          </div>
          <span
            aria-hidden="true"
            className="h-11 w-px shrink-0 bg-[#561535]/40"
          />
          <div className="flex min-w-0 flex-[1.2] flex-col items-start gap-[0.3em]">
            <a
              href="https://www.instagram.com/ggsbeauty.hair.co/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <FaInstagram
                aria-hidden="true"
                className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]"
              />
              <span>@ggsbeauty.hair.co</span>
            </a>
            <a
              href="https://wa.me/6282342777723"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <FaWhatsapp
                aria-hidden="true"
                className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]"
              />
              <span>0823 4277 7723</span>
            </a>
            <span className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-medium leading-tight">
              <FaLocationDot
                aria-hidden="true"
                className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]"
              />
              <span>Jl. Cimanuk No. 309, Sukagalih, Garut</span>
            </span>
          </div>
          <a
            href="https://wa.me/6282342777723"
            target="_blank"
            rel="noreferrer"
            aria-label="Booking Now via WhatsApp"
            className="shrink-0 whitespace-nowrap rounded-full bg-[#561535] px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)] font-bold leading-none text-[#fff8f6] transition-colors hover:bg-[#71274c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561535]/40"
          >
            Booking Now
          </a>
        </footer>
      </main>
    );
  }

  if (slide === 5 || slide === 6) {
    return (
      <main
        ref={exportRef}
        aria-label={
          slide === 5
            ? 'GGS Beauty — slide 5, lowongan kerja'
            : 'GGS Beauty — slide 6'
        }
        className="relative isolate aspect-[4/5] h-auto w-[min(100%,80vh)] max-w-full overflow-hidden bg-[#FC46AA] shadow-[0_24px_70px_rgba(63,35,47,0.22)]"
        style={{ fontFamily: "'Poppins', Arial, sans-serif" }}
      >
        {slide === 6 && (
          <>
            <img
              src={`${assetBase}assets/ggs-feed-06-spa-background.webp`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="pointer-events-none absolute left-1/2 top-[6.5%] z-20 aspect-square w-[15.5%] -translate-x-1/2">
              <img
                src={`${assetBase}assets/ggs-beauty-logo.png`}
                alt="Logo GGS Beauty — Grooming is Better"
                className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(66,37,49,0.22)]"
                loading="eager"
              />
            </div>
            <p
              className="pointer-events-none absolute left-1/2 top-[55%] z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[clamp(22px,4.8vw,52px)] leading-none text-[#fff8f6] drop-shadow-[0_3px_9px_rgba(52,29,23,0.6)]"
              style={{ fontFamily: "'Melon Tea', cursive" }}
            >
              Reflection <span className="italic">time</span>
            </p>
          </>
        )}
        {slide === 5 && (
          <>
            <img
              src={slideFiveRecruitmentPoster}
              alt="Poster lowongan kerja GGS Beauty: hairstyle 1 orang, eyelash 2 orang, dan terapis 1 orang perempuan. Kirim CV ke 0823 4277 7723."
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1]"
            >
              <span className="absolute left-[9.1%] top-[40.5%] flex aspect-square w-[16.5%] items-center justify-center rounded-full border-2 border-white bg-[#fce5ef]">
                <CartoonHairIcon />
              </span>
              <span className="absolute left-[53.9%] top-[40.8%] flex aspect-square w-[15.5%] items-center justify-center rounded-full border-2 border-white bg-[#fce5ef]">
                <CartoonLashIcon />
              </span>
              <span className="absolute left-[26%] top-[55.3%] flex aspect-square w-[16.8%] items-center justify-center rounded-full border-2 border-white bg-[#fce5ef]">
                <CartoonTherapistIcon />
              </span>
            </div>
          </>
        )}
        <footer
          aria-label="Kontak GGS Beauty"
          className={`absolute ${
            isStoryCover ? 'inset-x-[8%]' : 'inset-x-[4%]'
          } bottom-[4.2%] z-10 flex items-center gap-[2.5%] text-[#561535]`}
        >
          <div className={`min-w-0 flex-1 ${isStoryCover ? 'pl-[2%]' : ''}`}>
            <p className="whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold leading-none tracking-[-0.035em]">
              Grooming is better
            </p>
            <p className="mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]">
              Your style · your crown
            </p>
          </div>
          <span
            aria-hidden="true"
            className="h-11 w-px shrink-0 bg-[#561535]/40"
          />
          <div className="flex min-w-0 flex-[1.2] flex-col items-start gap-[0.3em]">
            <a
              href="https://www.instagram.com/ggsbeauty.hair.co/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <FaInstagram
                aria-hidden="true"
                className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]"
              />
              <span>@ggsbeauty.hair.co</span>
            </a>
            <a
              href="https://wa.me/6282342777723"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(10px,0.96vw,12px)] font-semibold tracking-[-0.02em]"
            >
              <FaWhatsapp
                aria-hidden="true"
                className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]"
              />
              <span>0823 4277 7723</span>
            </a>
            <span className="inline-flex items-center gap-[0.45em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-medium leading-tight">
              <FaLocationDot
                aria-hidden="true"
                className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]"
              />
              <span>Jl. Cimanuk No. 309, Sukagalih, Garut</span>
            </span>
          </div>
          {!isStoryCover && (
            <a
              href="https://wa.me/6282342777723"
              target="_blank"
              rel="noreferrer"
              aria-label="Hubungi GGS Beauty via WhatsApp"
              className="shrink-0 whitespace-nowrap rounded-full bg-[#561535] px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)] font-bold leading-none text-[#fff8f6] transition-colors hover:bg-[#71274c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561535]/40 max-[480px]:hidden"
            >
              Hubungi Kami
            </a>
          )}
        </footer>
      </main>
    );
  }

  const copy = slideCopy[slide];
  const isGoldSlide = slide === 2;

  if (isGoldSlide) {
    return <GgsBeautyWhyGgsSlide exportRef={exportRef} />;
  }

  return (
    <main
      ref={exportRef}
      aria-label={`GGS Beauty — slide ${slide} dari 4`}
      className={`relative aspect-[4/5] h-auto w-[min(100%,80vh)] max-w-full overflow-hidden shadow-[0_24px_70px_rgba(63,35,47,0.22)] ${
        isGoldSlide ? 'text-[#493311]' : 'text-[#561535]'
      }`}
      style={{
        backgroundColor: isGoldSlide ? '#E8BD58' : '#FC46AA',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      <img
        src={isGoldSlide ? goldHairTemplate : hairOrnament}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        style={{
          mixBlendMode: isGoldSlide ? 'normal' : 'screen',
          opacity: isGoldSlide ? 0.88 : 0.82,
          objectPosition: 'right center',
        }}
      />

      <div className="relative z-10 flex h-full flex-col px-[8%] pb-[7%] pt-[7%]">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[clamp(8px,1vw,12px)] font-black uppercase tracking-[0.2em]">
              GGS Beauty
            </p>
            <p className={`mt-1 text-[clamp(6px,0.72vw,9px)] font-semibold uppercase tracking-[0.18em] ${isGoldSlide ? 'text-[#79570f]' : 'text-[#71274c]'}`}>
              Salon &amp; beauty
            </p>
          </div>
          <span className={`border-l pl-[4%] text-[clamp(7px,0.8vw,10px)] font-bold tracking-[0.16em] ${isGoldSlide ? 'border-[#79570f]/45' : 'border-[#71274c]/40'}`}>
            0{slide} / 04
          </span>
        </header>

        <section
          className={`relative z-10 flex flex-1 flex-col ${
            slide === 4
              ? 'items-center justify-center text-center'
              : slide === 3
                ? 'justify-center'
                : 'justify-center'
          }`}
        >
          <p className={`mb-[4%] text-[clamp(7px,0.9vw,11px)] font-black uppercase tracking-[0.24em] ${isGoldSlide ? 'text-[#805b12]' : 'text-[#d91070]'}`}>
            {copy.eyebrow}
          </p>
          {slide === 4 && (
            <img
              src={`${assetBase}assets/ggs-beauty-logo.png`}
              alt="Logo GGS Beauty — Grooming is Better"
              className="mb-[7%] w-[34%] object-contain drop-shadow-[0_10px_24px_rgba(66,37,49,0.2)]"
              loading="eager"
            />
          )}
          <h1
            className={`relative whitespace-pre-line font-semibold leading-[0.96] tracking-[-0.055em] ${
              slide === 4
                ? 'max-w-[82%] text-[clamp(30px,7vw,76px)]'
                : 'max-w-[84%] text-[clamp(38px,8.8vw,94px)]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {copy.headline}
          </h1>
          <p
            className={`relative mt-[5%] max-w-[74%] text-[clamp(9px,1.25vw,15px)] font-medium leading-relaxed ${
              isGoldSlide ? 'text-[#493311]/85' : 'text-[#561535]/85'
            } ${
              slide === 4 ? 'max-w-[62%]' : ''
            }`}
          >
            {copy.description}
          </p>
          {slide !== 4 && (
          <span className={`mt-[9%] inline-flex w-fit items-center gap-3 border-y py-[2.5%] text-[clamp(7px,0.85vw,10px)] font-bold uppercase tracking-[0.2em] ${
            isGoldSlide ? 'border-[#805b12]/40 text-[#493311]' : 'border-[#d91070]/35 text-[#561535]'
          }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isGoldSlide ? 'bg-[#fff0c2]' : 'bg-[#fff5f9]'}`} />
              {copy.footer}
              <span className={`h-1.5 w-1.5 rounded-full ${isGoldSlide ? 'bg-[#fff0c2]' : 'bg-[#fff5f9]'}`} />
            </span>
          )}
        </section>

        <footer className={`flex items-center justify-between border-t pt-[3%] text-[clamp(6px,0.72vw,9px)] font-bold uppercase tracking-[0.18em] ${
          isGoldSlide ? 'border-[#79570f]/40 text-[#493311]/80' : 'border-[#71274c]/35 text-[#561535]/80'
        }`}>
          <span>{slide === 4 ? 'YOUR STYLE · YOUR CROWN' : 'GGS BEAUTY'}</span>
          <span>{copy.footer}</span>
        </footer>
      </div>
    </main>
  );
}
