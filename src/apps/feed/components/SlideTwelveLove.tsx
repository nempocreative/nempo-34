import cafeCouplePhoto from "@/assets/instc_2026-03-16_003940600982F43F6A_1791390610237.jpeg";
import culturalPortraitPhoto from "@/assets/IMG_4120_1791390610237.jpeg";
import eveningCouplePhoto from "@/assets/IMG_0599_1791390610238.jpeg";
import outdoorCouplePhoto from "@/assets/IMG_1817_1791390610234.jpeg";
import hikingCouplePhoto from "@/assets/IMG_0274_1791390610235.jpeg";

const memoryMoments = [
  {
    src: outdoorCouplePhoto,
    alt: "Pasangan berfoto di luar ruangan",
    left: 22,
    top: 26,
    rotation: -38,
    position: "center 48%",
  },
  {
    src: cafeCouplePhoto,
    alt: "Pasangan berfoto bersama di kafe",
    left: 34,
    top: 15,
    rotation: -23,
    position: "center 48%",
  },
  {
    src: eveningCouplePhoto,
    alt: "Pasangan berfoto bersama pada malam hari",
    left: 50,
    top: 10,
    rotation: 0,
    position: "center 58%",
  },
  {
    src: hikingCouplePhoto,
    alt: "Pasangan mendaki di alam",
    left: 69,
    top: 15,
    rotation: 23,
    position: "center 42%",
  },
  {
    src: culturalPortraitPhoto,
    alt: "Dua orang berfoto dengan busana tradisional",
    left: 82,
    top: 26,
    rotation: 38,
    position: "center 42%",
  },
];

const photoFrameWidth = 13;
const photoFrameHeight = photoFrameWidth / 0.78;

function getPhotoFrameStyle(left: number, top: number, rotation: number) {
  return {
    left: `${left - photoFrameWidth / 2}%`,
    top: `${top - photoFrameHeight / 2}%`,
    transform: `rotate(${rotation}deg)`,
  };
}

const dialMarks = [
  { label: "12", left: "49%", top: "32%" },
  { label: "2", left: "74%", top: "49%" },
  { label: "4", left: "76%", top: "70%" },
  { label: "6", left: "49%", top: "84%" },
  { label: "8", left: "22%", top: "70%" },
  { label: "10", left: "20%", top: "49%" },
];

export function SlideTwelveLove() {
  return (
    <section
      role="group"
      aria-label="Jam kenangan anniversary Nempo"
      className="absolute inset-0"
      style={{ fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}
    >
      <header className="absolute inset-x-[7%] top-[8%] z-20 text-center text-[#fff7e5]">
        <div
          aria-hidden="true"
          className="mx-auto mb-[2%] flex w-[30%] items-center justify-center gap-[8%] text-[#f2d1a2]/85"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
          <svg viewBox="0 0 24 24" className="h-[clamp(8px,1.4vw,11px)] w-[clamp(8px,1.4vw,11px)] fill-current">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21l7.78-7.55 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
        </div>
        <h1
          className="whitespace-nowrap font-serif text-[clamp(28px,7.4vw,54px)] font-bold leading-[0.92] tracking-[-0.06em]"
          style={{ textShadow: "0 2px 12px rgba(20, 5, 9, .18)" }}
        >
          Kenangan
          <span className="ml-[0.18em] font-normal italic text-[#f2d1a2]">Kita</span>
        </h1>
        <span
          aria-hidden="true"
          className="mx-auto mt-[2.4%] block h-px w-[16%] bg-gradient-to-r from-transparent via-[#f2d1a2]/80 to-transparent"
        />
        <p className="mt-[1.6%] font-sans text-[clamp(8px,1.5vw,11px)] font-medium leading-[1.3] tracking-[0.04em] text-[#fff7e5]/80">
          Setiap detik bersama berarti.
        </p>
      </header>

      <div className="absolute left-1/2 top-[35%] z-10 aspect-square w-[132%] -translate-x-1/2 rounded-full border border-[#eadcc7]/80 shadow-[0_16px_42px_rgba(19,6,9,.28)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "#fff7e5",
            backgroundImage:
              "radial-gradient(ellipse at 50% 32%, rgba(255,255,255,.64), transparent 55%), repeating-linear-gradient(0deg, rgba(116,80,63,.035) 0px, rgba(116,80,63,.035) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(116,80,63,.025) 0px, rgba(116,80,63,.025) 1px, transparent 1px, transparent 5px)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7%] rounded-full border border-[#b98572]/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[20%] rounded-full border border-[#b98572]/20"
        />

        <div
          aria-hidden="true"
          className="absolute left-[28%] top-[10%] h-[6%] w-[3%] rotate-[-32deg] bg-[#741b24]/85"
        />
        <div
          aria-hidden="true"
          className="absolute right-[28%] top-[10%] h-[6%] w-[3%] rotate-[32deg] bg-[#741b24]/85"
        />

        {dialMarks.map((mark) => (
          <span
            key={mark.label}
            aria-hidden="true"
            className="absolute z-[1] font-serif text-[clamp(8px,2.1vw,13px)] font-bold text-[#54242a]/90"
            style={{ left: mark.left, top: mark.top }}
          >
            {mark.label}
          </span>
        ))}

        {memoryMoments.map((moment, index) => (
          <figure
            key={`${moment.alt}-${index}`}
            className="absolute z-10 aspect-[0.78] w-[13%] overflow-hidden rounded-[14%] border-[1.5px] border-[#b98572]/75 bg-[#f8eddd] p-[3.5%] pb-[13%] shadow-[0_6px_14px_rgba(42,17,18,.24)]"
            style={getPhotoFrameStyle(moment.left, moment.top, moment.rotation)}
          >
            <img
              src={moment.src}
              alt={moment.alt}
              className="absolute left-[4%] top-[4%] h-[82%] w-[92%] rounded-[7%] object-cover"
              style={{ objectPosition: moment.position }}
              loading="eager"
            />
          </figure>
        ))}

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
        >
          <path
            d="M50 50 L31 30"
            fill="none"
            stroke="#fff7e5"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M50 50 L31 30"
            fill="none"
            stroke="#741b24"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <path
            d="M50 50 L70 24"
            fill="none"
            stroke="#fff7e5"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M50 50 L70 24"
            fill="none"
            stroke="#741b24"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <circle cx="31" cy="30" r="1.15" fill="#b98572" />
          <circle cx="70" cy="24" r="1.15" fill="#b98572" />
        </svg>

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 z-20 grid h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-[#b98572] bg-[#741b24] shadow-[0_3px_10px_rgba(40,12,17,.24)]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[62%] w-[62%] fill-[#fff7e5] drop-shadow-[0_1px_1px_rgba(0,0,0,.18)]"
          >
            <path d="M12 21s-7.2-4.35-9.5-8.32C.1 8.8 2.1 4.5 6 4.5c2.4 0 3.8 1.3 6 3.5 2.2-2.2 3.6-3.5 6-3.5 3.9 0 5.9 4.3 3.5 8.18C19.2 16.65 12 21 12 21Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
