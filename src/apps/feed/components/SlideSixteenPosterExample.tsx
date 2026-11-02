import { FaInstagram, FaWhatsapp } from 'react-icons/fa6';

const base = "/nempo-feed/";

function FoodDoodles() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 700 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[.2]"
    >
      <g
        fill="none"
        stroke="#9f4038"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 110c25-24 60-13 62 13s-30 45-55 28-13-41 9-40 21 23 4 29" />
        <path d="M185 40c14 12 13 29 0 39s-27 2-23-12 20-10 20 3m13 23c10-9 20-7 24 2" />
        <path d="M572 115c9-21 38-23 49-4 10 18-1 41-19 43-16 2-26-11-20-23 5-9 17-8 19 1" />
        <path d="M66 280c-7-31 9-55 29-53 21 2 26 29 9 42-11 8-25 1-21-10 3-8 13-6 14 0" />
        <path d="M574 340c-24 7-42 29-43 56 29 1 48-15 52-43m-48 42 42-37" />
        <path d="M110 488c-14-24-2-52 19-54 22-2 34 23 21 42-9 12-25 8-24-3 1-8 10-11 15-5" />
        <path d="M590 570c-26-16-29-47-7-58 23-12 47 7 37 30-6 13-24 14-27 2-2-8 7-14 14-10" />
        <path d="M66 705c-6-20 5-40 22-40 19 0 27 21 15 34-9 10-23 4-20-6 2-7 11-8 14-3" />
        <path d="M520 760c17-22 47-24 60-5 13 20-2 45-22 43-16-2-22-18-12-27 7-6 17-2 16 5" />
        <circle cx="314" cy="96" r="20" />
        <circle cx="624" cy="227" r="12" />
        <circle cx="256" cy="404" r="15" />
        <circle cx="130" cy="605" r="17" />
        <circle cx="390" cy="744" r="22" />
        <path d="m369 65 8 18 20 2-15 13 5 19-18-10-17 10 4-20-15-12 20-3 8-17Z" />
        <path d="m201 592 6 13 14 2-11 9 3 14-12-7-12 7 3-14-10-9 14-2 5-13Z" />
      </g>
    </svg>
  );
}

const seblakTitleLetters = [
  { char: 'S', rotate: -5, y: -1, scaleX: 1.02, scaleY: 1.04, color: '#7b2830' },
  { char: 'E', rotate: 3, y: 0, scaleX: 0.98, scaleY: 1.01, color: '#c94335', altFont: true },
  { char: 'B', rotate: -2, y: -1, scaleX: 1.03, scaleY: 1.04, color: '#8e3035' },
  { char: 'L', rotate: 4, y: 1, scaleX: 0.99, scaleY: 1.05, color: '#d4523c', altFont: true },
  { char: 'A', rotate: -3, y: -1, scaleX: 1.02, scaleY: 1.02, color: '#7b2830' },
  { char: 'K', rotate: 2, y: 1, scaleX: 1.01, scaleY: 1.04, color: '#c94335', altFont: true },
  { char: ' ', rotate: 0, y: 0, scaleX: 1, scaleY: 1, color: '#7b2830' },
  { char: 'P', rotate: -3, y: 0, scaleX: 1.02, scaleY: 1.04, color: '#8e3035' },
  { char: 'E', rotate: 3, y: -1, scaleX: 0.98, scaleY: 1.02, color: '#d4523c', altFont: true },
  { char: 'D', rotate: -2, y: 1, scaleX: 1.02, scaleY: 1.02, color: '#7b2830' },
  { char: 'A', rotate: 4, y: -1, scaleX: 0.98, scaleY: 1.05, color: '#c94335', altFont: true },
  { char: 'S', rotate: -2, y: 1, scaleX: 1.02, scaleY: 1.02, color: '#8e3035' },
];

function SeblakLettering({ layer }: { layer: 'fill' | 'outline' | 'shadow' }) {
  return (
    <>
      {seblakTitleLetters.map((letter, index) => {
        if (letter.char === ' ') {
          return <br key={`line-break-${index}`} aria-hidden="true" />;
        }

        return (
          <span
            key={`${letter.char}-${index}`}
            aria-hidden="true"
            className="inline-block align-baseline"
            style={{
              transform: `translateY(${letter.y}px) rotate(${letter.rotate}deg) scale(${letter.scaleX}, ${letter.scaleY})`,
              transformOrigin: '50% 82%',
              color: layer === 'fill' ? letter.color : 'transparent',
              fontFamily: letter.altFont
                ? "'Bricolage Grotesque', 'Arial Black', sans-serif"
                : "'Bowlby One SC', 'Arial Black', sans-serif",
              fontStyle: letter.altFont ? 'italic' : 'normal',
              fontWeight: letter.altFont ? 800 : 400,
            }}
          >
            {letter.char}
          </span>
        );
      })}
    </>
  );
}

export function SlideSixteenPosterExample() {
  return (
    <section
      role="group"
      aria-label="Contoh poster promosi seblak"
      className="absolute inset-x-[1%] top-[5%] bottom-[9%] overflow-hidden bg-[#f5e2d3] text-white shadow-[0_12px_32px_rgba(0,0,0,.28)]"
      style={{ fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 52% 39%, rgba(255,248,235,.9), transparent 48%), linear-gradient(135deg,#f8e9d9 0%,#eac6b8 100%)",
        }}
      />
      <FoodDoodles />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          filter: "drop-shadow(0 12px 10px rgba(15,38,0,.28))",
          transform: "translateY(3%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 66%, 100% 46%, 100% 68%, 0 88%)",
            background:
              "linear-gradient(165deg, #c94335 0%, #b73532 55%, #9f2d35 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(0 88%, 100% 68%, 100% 82%, 0 100%)",
            background:
              "linear-gradient(165deg, #6f202b 0%, #4b1723 100%)",
          }}
        />
      </div>

      <h1
        aria-label="Seblak Pedas"
        className="absolute left-[3%] right-[3%] top-[9%] z-[8] text-center text-[clamp(17px,5.5vw,40px)] font-normal leading-[.88] tracking-[.005em] text-white"
        style={{
          fontFamily: "'Bowlby One SC', 'Bricolage Grotesque', 'Arial Black', sans-serif",
          fontWeight: 400,
          transform: "perspective(850px) rotateX(-6deg) rotateZ(-1deg)",
          transformOrigin: "center center",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 text-transparent"
          style={{
            WebkitTextStroke: "2.6px rgba(255,248,228,.94)",
            transform: "translate(-1px,-1px) rotate(-.35deg)",
          }}
        >
          <SeblakLettering layer="outline" />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 text-transparent"
          style={{
            WebkitTextStroke: "1.4px #8e3334",
            transform: "translate(3px,4px) rotate(.3deg)",
          }}
        >
          <SeblakLettering layer="shadow" />
        </span>
        <span className="relative text-[#7b2830] [text-shadow:0_1px_0_#fff7ed,2px_3px_0_#e8b5a2,4px_5px_0_#b6463a,6px_8px_0_rgba(72,24,31,.24)]">
          <SeblakLettering layer="fill" />
        </span>
      </h1>

      <div
        className="absolute left-[19%] top-[34%] z-[6] flex aspect-[1.24] w-[20%] items-center justify-center rounded-[12px] rounded-br-[3px] bg-[#762631] px-[3%] py-[3%] text-center text-[clamp(8px,1.8vw,12px)] font-bold leading-[1.05] text-white"
        style={{
          transform:
            "perspective(680px) rotateX(14deg) rotateY(16deg) rotateZ(-6deg)",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 2px 0 rgba(78,22,31,.32), 0 7px 13px rgba(53,20,25,.23), inset 0 1px 2px rgba(255,255,255,.12)",
        }}
      >
        Lagi
        <br />
        pengen yang
        <br />
        pedas?
        <span
          className="absolute -bottom-[20%] right-[11%] h-[31%] w-[26%] bg-[#762631] [clip-path:polygon(0_0,100%_0,100%_100%)]"
          style={{ filter: "drop-shadow(1px 2px 2px rgba(53,20,25,.22))" }}
        />
      </div>
      <div
        className="absolute right-[18%] top-[31%] z-[6] flex aspect-[1.24] w-[20%] items-center justify-center rounded-[12px] rounded-bl-[3px] bg-[#fffaf1] px-[3%] py-[3%] text-center text-[clamp(8px,1.8vw,12px)] font-bold leading-[1.05] text-[#9d3033]"
        style={{
          transform:
            "perspective(680px) rotateX(13deg) rotateY(-16deg) rotateZ(4deg)",
          transformOrigin: "right center",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 2px 0 rgba(222,217,196,.45), 0 7px 13px rgba(22,37,0,.18), inset 0 1px 2px rgba(255,255,255,.9)",
        }}
      >
        Seporsi
        <br />
        hangat,
        <br />
        langsung happy!
        <span
          className="absolute -bottom-[20%] left-[11%] h-[31%] w-[26%] bg-[#fffaf1] [clip-path:polygon(0_0,100%_0,0_100%)]"
          style={{ filter: "drop-shadow(-1px 2px 2px rgba(53,20,25,.18))" }}
        />
      </div>

      <img
        src={`${base}assets/seblak-poster-perspective.png`}
        alt="Semangkuk seblak kuah pedas dengan kerupuk, mi, bakso, sosis, dan daun bawang"
        className="absolute left-1/2 top-[32%] z-[5] w-[55%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_16px_18px_rgba(48,30,5,.42)]"
        draggable={false}
      />

      <div
        className="absolute left-[3%] top-[74%] z-[6] text-[clamp(11px,3vw,22px)] font-black leading-[.82] tracking-[-.04em] text-[#fff0e4] drop-shadow-[0_3px_4px_rgba(69,20,28,.52)]"
        style={{
          transform: "perspective(420px) rotateX(24deg) rotateZ(-12deg)",
          transformOrigin: "left center",
        }}
      >
        PESAN
        <br />
        SEKARANG
      </div>
      <div
        className="absolute right-[3%] top-[60%] z-[6] text-[clamp(10px,2.8vw,20px)] font-black leading-[.82] tracking-[-.04em] text-[#fff0e4] drop-shadow-[0_3px_4px_rgba(69,20,28,.52)]"
        style={{
          transform: "perspective(420px) rotateX(24deg) rotateZ(-12deg)",
          transformOrigin: "left center",
        }}
      >
        DELIVERY
        <br />
        DINE IN
      </div>

      <div
        className="absolute left-[28%] top-[91%] z-[7] flex items-center gap-[.8em] whitespace-nowrap text-[clamp(8px,2vw,12px)] font-semibold leading-[1.05] tracking-[.01em] text-[#fff7ef] drop-shadow-[0_1px_2px_rgba(45,13,19,.62)]"
        style={{
          transform: "rotateZ(-12deg)",
          transformOrigin: "left center",
        }}
      >
        <span className="inline-flex items-center gap-[.35em]">
          <FaInstagram aria-hidden="true" className="shrink-0 text-[1.2em]" />
          <span>@seblakasik</span>
        </span>
        <span className="inline-flex items-center gap-[.35em]">
          <FaWhatsapp aria-hidden="true" className="shrink-0 text-[1.2em]" />
          <span>0857 2498 1356</span>
        </span>
      </div>

    </section>
  );
}
