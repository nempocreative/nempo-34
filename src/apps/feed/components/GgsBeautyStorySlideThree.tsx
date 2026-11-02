import { FaWhatsapp } from 'react-icons/fa6';
import ggsHairFrame from '@/assets/Glossy_Pink_Hair_Frame_1791984223772.png';
import type { RefObject } from 'react';

const assetBase = "/nempo-feed/";

export function GgsBeautyStorySlideThree({
  exportRef,
}: {
  exportRef: RefObject<HTMLElement | null>;
}) {
  return (
    <main
      ref={exportRef}
      aria-label="GGS Beauty — Story slide 03, bingkai rambut pink full-width"
      className="relative isolate aspect-[9/16] h-auto w-[min(100%,45vh)] max-w-full overflow-hidden bg-transparent text-[#561535] shadow-[0_24px_70px_rgba(63,35,47,0.22)]"
      style={{
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <div className="absolute left-1/2 top-[4.5%] z-30 flex aspect-square w-[23.5%] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-[#fff8f6] p-[0.5%] shadow-[0_5px_18px_rgba(63,35,47,0.16)]">
        <img
          src={`${assetBase}assets/ggs-beauty-logo.png`}
          alt="Logo bulat GGS Beauty"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="absolute left-0 right-0 top-[81%] z-30 flex flex-col items-center text-center">
        <p
          className="text-[clamp(14px,1.7vw,20px)] font-bold leading-tight tracking-[-0.035em] text-white"
          style={{ textShadow: '0 1px 3px rgba(86, 21, 53, 0.8)' }}
        >
          Grooming is better
        </p>
        <p
          className="mt-[0.35em] text-[clamp(7px,0.8vw,9px)] font-semibold uppercase tracking-[0.16em] text-white"
          style={{ textShadow: '0 1px 3px rgba(86, 21, 53, 0.8)' }}
        >
          Your style · your crown
        </p>
      </div>

      <a
        href="https://wa.me/6282342777723"
        target="_blank"
        rel="noreferrer"
        aria-label="Booking GGS Beauty via WhatsApp"
        className="absolute bottom-[7.5%] left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-[0.45em] whitespace-nowrap rounded-full bg-[#561535] px-[3.2%] py-[1.35%] text-[clamp(10px,1.05vw,13px)] font-bold leading-none text-[#fff8f6] shadow-[0_5px_18px_rgba(63,35,47,0.18)]"
      >
        <FaWhatsapp aria-hidden="true" className="h-[1.2em] w-[1.2em] shrink-0" />
          <span>Booking · 0823 4277 7723</span>
      </a>

      <img
        src={ggsHairFrame}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
        style={{ transform: 'translateY(-2%) scale(1.34, 1.2)' }}
        draggable={false}
      />
    </main>
  );
}
