import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { FaInstagram, FaLocationDot, FaWhatsapp } from 'react-icons/fa6';
import ggsGrandOpeningTitle from '@/assets/Luxurious_Golden_Grand_Opening_Text_1791800724251.png';
import ggsHairHeader from '@/assets/generated_images/ggs-beauty-double-braid-edge-connected-4x5-20261012.png';
import ggsWoodDoorStorefront from '@/assets/generated_images/ggs-storefront-wood-door-reference-20261012-transparent.png';
import ggsTreatmentPortrait from '@/assets/generated_images/ggs-hair-treatment-client-portrait-20261012.png';
import ggsOpeningDecor from '@/assets/generated_images/ggs-storefront-theatre-curtains-20261012.png';
import { GgsBeautyContentSlide } from './GgsBeautyContentSlide';

const assetBase = "/nempo-feed/";

export function GgsOpeningRibbon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 260"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-[20%] top-[68%] z-40 h-[18%] w-[60%] overflow-visible"
    >
      <defs>
        <linearGradient id="ggs-ribbon-band" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#bd0753" />
          <stop offset="0.22" stopColor="#f42e82" />
          <stop offset="0.5" stopColor="#dc075f" />
          <stop offset="0.78" stopColor="#f42e82" />
          <stop offset="1" stopColor="#bd0753" />
        </linearGradient>
        <linearGradient id="ggs-ribbon-bow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff9ac1" />
          <stop offset="0.45" stopColor="#ec176d" />
          <stop offset="1" stopColor="#ae064d" />
        </linearGradient>
        <filter
          id="ggs-ribbon-shadow"
          x="-10%"
          y="-15%"
          width="120%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3b1023" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#ggs-ribbon-shadow)">
        <path
          d="M0 72 C174 78 335 93 435 105 C464 109 484 113 500 121 C516 113 536 109 565 105 C665 93 826 78 1000 72 L1000 135 C826 144 665 160 565 169 C536 172 516 177 500 185 C484 177 464 172 435 169 C335 160 174 144 0 135 Z"
          fill="url(#ggs-ribbon-band)"
        />
        <path
          d="M4 79 C180 85 337 100 432 112 C463 116 481 120 497 127"
          fill="none"
          stroke="#ffabd0"
          strokeOpacity="0.72"
          strokeWidth="5"
        />
        <path
          d="M0 128 C180 139 337 153 432 163 C463 166 481 170 497 176"
          fill="none"
          stroke="#8d0640"
          strokeOpacity="0.5"
          strokeWidth="5"
        />
        <path
          d="M480 137 C465 168 446 203 428 239 L470 224 L494 254 L514 148 Z"
          fill="url(#ggs-ribbon-bow)"
        />
        <path
          d="M520 137 C535 168 554 203 572 239 L530 224 L506 254 L486 148 Z"
          fill="url(#ggs-ribbon-bow)"
        />
        <path
          d="M490 139 C458 108 414 62 369 59 C341 57 331 83 350 105 C378 137 439 151 493 151 Z"
          fill="url(#ggs-ribbon-bow)"
        />
        <path
          d="M510 139 C542 108 586 62 631 59 C659 57 669 83 650 105 C622 137 561 151 507 151 Z"
          fill="url(#ggs-ribbon-bow)"
        />
        <path
          d="M356 68 C397 69 449 111 481 139"
          fill="none"
          stroke="#ffd0e2"
          strokeOpacity="0.75"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M644 68 C603 69 551 111 519 139"
          fill="none"
          stroke="#ffd0e2"
          strokeOpacity="0.75"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M480 119 C491 111 509 111 520 119 L524 158 C511 171 489 171 476 158 Z"
          fill="#d30a5d"
          stroke="#ff9ac1"
          strokeWidth="4"
        />
        <path
          d="M484 124 C493 119 507 119 516 124"
          fill="none"
          stroke="#ffd0e2"
          strokeOpacity="0.75"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function GgsBeautySlideOne({
  exportRef,
  isStory = false,
  showShadow = true,
  isEmbeddedCover = false,
}: {
  exportRef: RefObject<HTMLElement | null>;
  isStory?: boolean;
  showShadow?: boolean;
  isEmbeddedCover?: boolean;
}) {
  const footerLayoutClass = isStory
    ? 'absolute inset-x-[4%] bottom-[10.2%] z-10 flex flex-col items-center gap-[0.35em] text-center'
    : 'absolute inset-x-[4%] bottom-[4.2%] z-10 flex items-center gap-[2.5%]';
  const footerBrandClass = isStory ? 'min-w-0 text-center' : 'min-w-0 flex-1';
  const footerBrandTitleClass = isStory
    ? 'whitespace-nowrap text-[clamp(12px,1.5vw,16px)] font-semibold leading-none tracking-[-0.035em]'
    : isEmbeddedCover
      ? 'whitespace-nowrap text-[21px] font-semibold leading-none tracking-[-0.035em]'
    : 'whitespace-nowrap text-[clamp(14px,1.8vw,21px)] font-semibold leading-none tracking-[-0.035em]';
  const footerTaglineClass = isStory
    ? 'mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.75vw,9px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]'
    : isEmbeddedCover
      ? 'mt-[0.35em] whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-[#71274c]'
    : 'mt-[0.35em] whitespace-nowrap text-[clamp(8px,0.82vw,10px)] font-semibold uppercase tracking-[0.12em] text-[#71274c]';
  const footerContactsClass = isStory
    ? 'flex max-w-full flex-wrap justify-center gap-x-3 gap-y-1'
    : 'flex min-w-0 flex-[1.2] flex-col items-start gap-[0.3em]';
  const footerContactTextClass = isStory
    ? 'text-[clamp(8px,0.8vw,10px)]'
    : isEmbeddedCover
      ? 'text-[12px]'
    : 'text-[clamp(10px,0.96vw,12px)]';
  const footerAddressTextClass = isStory
    ? 'text-[clamp(8px,0.8vw,10px)]'
    : isEmbeddedCover
      ? 'text-[10px]'
    : 'text-[clamp(8px,0.82vw,10px)]';
  const footerBookingClass = isStory
    ? 'px-[0.75em] py-[0.55em] text-[clamp(10px,1vw,12px)]'
    : isEmbeddedCover
      ? 'px-[0.8em] py-[0.65em] text-[14px]'
    : 'px-[0.8em] py-[0.65em] text-[clamp(12px,1.15vw,14px)]';
  const bookingButtonClass = `whitespace-nowrap rounded-full bg-[#561535] ${footerBookingClass} font-bold leading-none text-[#fff8f6] transition-colors hover:bg-[#71274c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#561535]/40`;

  return (
    <main
      ref={exportRef}
      aria-label={
        isStory
          ? 'GGS Beauty — Story 9:16'
          : 'GGS Beauty — Grooming is better'
      }
      className={`relative ${
        isStory
          ? 'aspect-[9/16] w-[min(100%,45vh)]'
          : 'aspect-[4/5] w-[min(100%,80vh)]'
      } h-auto max-w-full overflow-hidden text-[#472b38] ${
        showShadow ? 'shadow-[0_24px_70px_rgba(63,35,47,0.22)]' : ''
      }`}
      style={{
        backgroundColor: '#e995b1',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <img
        src={ggsHairHeader}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div
        className={`pointer-events-none absolute ${
          isStory ? 'left-[74%]' : 'left-[66%]'
        } top-[2.5%] z-10 aspect-square w-[18%] -translate-x-1/2`}
      >
        <img
          src={`${assetBase}assets/ggs-beauty-logo.png`}
          alt="Logo GGS Beauty — Grooming is Better"
          className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(66,37,49,0.22)]"
          loading="eager"
        />
      </div>

      <section
        aria-label="Grand Opening pukul 10.00 dan acara puncak pukul 18.00 sampai selesai"
        className="absolute left-1/2 top-[15.5%] z-10 flex w-[90%] -translate-x-1/2 flex-col items-center text-center"
      >
        <h1 className="relative z-20 w-[54%]" aria-label="Grand Opening">
          <img
            src={ggsGrandOpeningTitle}
            alt=""
            aria-hidden="true"
            className="block h-auto w-full object-contain"
          />
        </h1>
        <div
          className="relative z-10 -mt-[7%] w-[55%]"
          style={{ aspectRatio: '1 / 1' }}
        >
          <img
            src={ggsWoodDoorStorefront}
            alt="Fasad GGS dengan kusen hitam dan pintu panel kayu"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute left-1/2 top-[7%] z-10 aspect-square w-[14%] -translate-x-1/2 rounded-full bg-white p-[0.6%] shadow-[0_2px_8px_rgba(40,24,18,0.35)]">
            <img
              src={`${assetBase}assets/ggs-beauty-logo.png`}
              alt="Logo GGS Beauty pada fasad"
              className="h-full w-full object-contain"
              loading="eager"
            />
          </div>
          <div
            role="img"
            aria-label="Foto pelanggan dewasa sedang menjalani hair treatment, memenuhi kedua panel pintu"
            className="pointer-events-none absolute left-[23%] top-[41.5%] z-10 h-[50%] w-[25%]"
            style={{
              backgroundImage: `url(${ggsTreatmentPortrait})`,
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '200% 100%',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[52%] top-[41.5%] z-10 h-[50%] w-[25%]"
            style={{
              backgroundImage: `url(${ggsTreatmentPortrait})`,
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '200% 100%',
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[46.4%] top-[59%] z-20 h-[18%] w-[0.8%] rounded-full bg-[#211c19] shadow-[0_0_2px_rgba(255,255,255,0.5)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-[52.8%] top-[59%] z-20 h-[18%] w-[0.8%] rounded-full bg-[#211c19] shadow-[0_0_2px_rgba(255,255,255,0.5)]"
          />
          <img
            src={ggsOpeningDecor}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain"
            loading="eager"
          />
          <GgsOpeningRibbon />
        </div>
        <p
          className={`mt-[0.4%] ${
            isEmbeddedCover
              ? 'text-[19px]'
              : 'text-[clamp(13px,2.7vw,19px)]'
          } font-bold tracking-[0.02em] text-[#d91070]`}
        >
          18 Oktober 2026
        </p>
        <p
          className={`mt-[0.4%] whitespace-nowrap ${
            isEmbeddedCover ? 'text-[10px]' : 'text-[clamp(8px,1.55vw,10px)]'
          } font-semibold text-[#561535]`}
        >
          <span className="font-extrabold uppercase tracking-[0.15em] text-[#71274c]">
            Lokasi
          </span>
          <span className="mx-[0.45em] text-[#d91070]">·</span>
          Jl. Cimanuk No. 309, Sukagalih, Garut
        </p>
        <div
          className={
            isStory
              ? 'mt-[4.5%] flex w-fit max-w-full flex-col items-stretch'
              : 'contents'
          }
        >
          <div
            className={`flex items-center justify-center ${
              isStory
                ? 'w-fit max-w-full gap-x-[0.5em]'
                : 'mt-[1.5%] w-full gap-[2%]'
            }`}
          >
            <div className="inline-flex items-center gap-[0.55em] whitespace-nowrap rounded-full bg-[#561535] px-[0.9em] py-[0.55em] text-[#fff8f6]">
              <span
                className={`${
                  isEmbeddedCover
                    ? 'text-[9px]'
                    : 'text-[clamp(7px,1.45vw,9px)]'
                } font-extrabold uppercase tracking-[0.08em]`}
              >
                Opening
              </span>
              <span
                className={`${
                  isEmbeddedCover ? 'text-[13px]' : 'text-[clamp(10px,2vw,13px)]'
                } font-black leading-none`}
              >
                10.00
              </span>
            </div>
            <div className="inline-flex items-center gap-[0.55em] whitespace-nowrap rounded-full bg-[#561535] px-[0.9em] py-[0.55em] text-[#fff8f6]">
              <span
                className={`${
                  isEmbeddedCover
                    ? 'text-[9px]'
                    : 'text-[clamp(7px,1.4vw,9px)]'
                } font-extrabold uppercase tracking-[0.04em]`}
              >
                Acara Puncak
              </span>
              <span
                className={`${
                  isEmbeddedCover
                    ? 'text-[11px]'
                    : 'text-[clamp(8px,1.65vw,11px)]'
                } font-black leading-none`}
              >
                18.00 – Selesai
              </span>
            </div>
          </div>
          <div
            className={`flex items-center ${
              isStory
                ? 'mt-[1.2%] w-full justify-end gap-x-[0.75em]'
                : 'mt-[0.3%] w-full justify-center gap-[2.5%]'
            }`}
          >
            <p
              className={`whitespace-nowrap ${
                isEmbeddedCover
                  ? 'text-[11px]'
                  : 'text-[clamp(8px,1.65vw,11px)]'
              } font-bold text-[#561535]`}
            >
              Akustik · DJ · Give Away · Keseruan Lain
            </p>
            <span
              className={`shrink-0 rounded-full bg-[#561535] px-[1em] py-[0.5em] ${
                isEmbeddedCover
                  ? 'text-[11px]'
                  : 'text-[clamp(9px,1.7vw,11px)]'
              } font-black uppercase tracking-[0.14em] text-[#fff8f6]`}
            >
              Gratis
            </span>
          </div>
        </div>
      </section>

      <footer
        aria-label="Kontak GGS Beauty"
        className={`${footerLayoutClass} text-[#561535]`}
      >
        <div className={footerBrandClass}>
          <p className={footerBrandTitleClass}>Grooming is better</p>
          <p className={footerTaglineClass}>
            Your style · your crown
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`h-11 w-px shrink-0 bg-[#561535]/40 ${
            isStory ? 'hidden' : ''
          }`}
        />
        <div className={footerContactsClass}>
          <a
            href="https://www.instagram.com/ggsbeauty.hair.co/"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-[0.45em] whitespace-nowrap ${footerContactTextClass} font-semibold tracking-[-0.02em]`}
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
            className={`inline-flex items-center gap-[0.45em] whitespace-nowrap ${footerContactTextClass} font-semibold tracking-[-0.02em]`}
          >
            <FaWhatsapp
              aria-hidden="true"
              className="h-[1.15em] w-[1.15em] shrink-0 text-[#561535]"
            />
            <span>0823 4277 7723</span>
          </a>
          <span
            className={`inline-flex items-center gap-[0.45em] whitespace-nowrap ${footerAddressTextClass} font-medium leading-tight`}
          >
            <FaLocationDot
              aria-hidden="true"
              className="h-[1.1em] w-[1.1em] shrink-0 text-[#561535]"
            />
            <span>Jl. Cimanuk No. 309, Sukagalih, Garut</span>
          </span>
        </div>
        {!isStory && (
          <a
            href="https://wa.me/6282342777723"
            target="_blank"
            rel="noreferrer"
            aria-label="Booking Now via WhatsApp"
            className={`shrink-0 ${bookingButtonClass}`}
          >
            Booking Now
          </a>
        )}
      </footer>
      {isStory && (
        <a
          href="https://wa.me/6282342777723"
          target="_blank"
          rel="noreferrer"
          aria-label="Booking Now via WhatsApp"
          className={`absolute bottom-[3%] left-1/2 z-10 -translate-x-1/2 ${bookingButtonClass}`}
        >
          Booking Now
        </a>
      )}
    </main>
  );
}

export function GgsBeautyStorySlideTwo({
  exportRef,
}: {
  exportRef: RefObject<HTMLElement | null>;
}) {
  const feedSlideRef = useRef<HTMLElement | null>(null);
  const [coverScale, setCoverScale] = useState(1);

  useLayoutEffect(() => {
    const updateCoverScale = () => {
      const coverWidth = exportRef.current?.getBoundingClientRect().width ?? 0;
      const coverHeight = coverWidth * (4 / 3);
      const feedHeight = feedSlideRef.current?.offsetHeight ?? 0;

      if (coverHeight > 0 && feedHeight > 0) {
        setCoverScale(coverHeight / feedHeight);
      }
    };

    updateCoverScale();

    const observer = new ResizeObserver(updateCoverScale);
    if (exportRef.current) observer.observe(exportRef.current);
    if (feedSlideRef.current) observer.observe(feedSlideRef.current);

    return () => observer.disconnect();
  }, [exportRef]);

  return (
    <section
      ref={exportRef}
      aria-label="GGS Beauty — Story slide 02 with GGS Feed slide 6 center artwork"
      className="relative aspect-[9/16] h-auto w-[min(100%,45vh)] max-w-full overflow-hidden bg-[#FC46AA]"
      style={{ backgroundColor: '#FC46AA' }}
    >
      <div className="absolute inset-x-0 top-1/2 flex aspect-[3/4] w-full -translate-y-1/2 justify-center overflow-hidden">
        <div
          className="w-[80vh] shrink-0"
          style={{
            transform: `scale(${coverScale})`,
            transformOrigin: 'top center',
          }}
        >
          <GgsBeautyContentSlide
            slide={6}
            exportRef={feedSlideRef}
            isStoryCover
          />
        </div>
      </div>
    </section>
  );
}
