import mainCouplePhoto from "@/assets/IMG_1817_1791390610234.jpeg";
import hikingCouplePhoto from "@/assets/IMG_0274_1791390610235.jpeg";
import mirrorWalkPhoto from "@/assets/IMG_8628_1791390610235.jpeg";

function HandDrawnHeart({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 44"
      fill="none"
      className={className}
    >
      <path
        d="M24 39C18 33 4 24 4 14 4 6 14 2 20 9l4 5 4-5c6-7 16-3 16 5 0 10-14 19-20 25Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13c1-3 4-4 7-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SnapshotStrip() {
  const crops = [
    {
      src: hikingCouplePhoto,
      position: "50% 52%",
      caption: "the first hello",
    },
    {
      src: mirrorWalkPhoto,
      position: "50% 44%",
      caption: "same old us",
    },
  ];

  return (
    <aside
      aria-label="Potongan foto kenangan"
      className="absolute left-[5%] top-[20%] z-20 w-[16%] rotate-[-7deg] bg-[#fff7e5] p-[1.6%] pb-[2.2%] shadow-[2px_7px_13px_rgba(53,43,33,.22)]"
    >
      <div className="space-y-[3px]">
        {crops.map((crop) => (
          <div
            key={crop.caption}
            className="relative aspect-[.78] overflow-hidden bg-[#d5c7b4]"
          >
            <img
              src={crop.src}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              style={{
                objectPosition: crop.position,
                transform: "scale(1.17)",
              }}
            />
          </div>
        ))}
      </div>
      <p className="pt-1 text-center font-serif text-[clamp(5px,1vw,8px)] italic leading-none text-[#5c5148]">
        our little days
      </p>
      <span
        aria-hidden="true"
        className="absolute -top-[2%] left-[28%] h-[5%] w-[48%] rotate-[-4deg] bg-[#ead9b9]/90"
      />
    </aside>
  );
}

export function SlideTenLove() {
  return (
    <section
      role="group"
      aria-label="Kartu ucapan anniversary Nempo"
      className="absolute inset-0 overflow-hidden text-[#54242a]"
      style={{ fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-[4%] top-[16%] bottom-[6%] rounded-[16px]"
        style={{
          backgroundColor: "#fff7e5",
          backgroundImage:
            "radial-gradient(ellipse at 88% 17%, rgba(185,143,125,.22), transparent 34%), radial-gradient(ellipse at 7% 91%, rgba(185,87,85,.16), transparent 34%), repeating-linear-gradient(0deg, rgba(101,82,62,.025) 0px, rgba(101,82,62,.025) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div className="absolute left-[51%] top-[35%] z-10 w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-[2.4deg]">
        <div className="relative bg-[#fff7e5] p-[2.5%] pb-[6%] shadow-[0_15px_28px_rgba(48,48,40,.26)]">
          <span
            aria-hidden="true"
            className="absolute -top-[2%] left-[41%] z-10 h-[5%] w-[21%] rotate-[-3deg] border border-[#b98572]/55 bg-[#ead9b9]/90"
          />
          <img
            src={mainCouplePhoto}
            alt="Foto pasangan dengan latar tirai merah"
            className="block aspect-[1.2] w-full object-cover"
            style={{ objectPosition: "center 44%" }}
            loading="eager"
          />
          <div className="absolute bottom-[1%] left-[6%] font-serif text-[clamp(6px,1.2vw,9px)] italic tracking-wide text-[#916e60]">
            Happy anniversary, sayang
          </div>
          <span className="absolute bottom-[1.4%] right-[7%] rotate-[-9deg] text-[clamp(8px,1.8vw,13px)] text-[#982a34]">
            ♥
          </span>
        </div>
      </div>

      <SnapshotStrip />

      <div className="absolute right-[6%] top-[27%] z-20 w-[26%] rotate-[6deg] border border-[#bb8f7d]/70 bg-[#fff7e5] px-[2.5%] py-[2%] text-center shadow-[2px_4px_9px_rgba(40,57,54,.13)]">
        <p className="font-serif text-[clamp(7px,1.45vw,10px)] italic leading-[1.25] text-[#59343a]">
          “you make
          <br />
          ordinary days
          <br />
          feel like home”
        </p>
        <span className="mt-1 block text-[clamp(5px,1vw,7px)] tracking-[.16em] text-[#916e60]">
          — us
        </span>
      </div>

      <div className="absolute right-[6%] top-[48%] z-20 w-[37%] rotate-[3deg] rounded-[13px] border border-[#b98572]/45 bg-[#54242a]/95 p-[2.4%] text-[#fff7e5] shadow-[2px_7px_16px_rgba(28,32,37,.3)]">
        <div className="flex items-center gap-[clamp(4px,1.2vw,8px)]">
          <div className="flex h-[clamp(19px,5.5vw,36px)] w-[clamp(19px,5.5vw,36px)] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-[#d8b9a6]">
            <span aria-hidden="true" className="font-serif text-[clamp(12px,3vw,20px)] text-[#fff7e5]">
              ♥
            </span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[clamp(5px,1.25vw,9px)] font-bold leading-tight">
              Nothing&apos;s Going to Change My Love For You
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[clamp(4px,1vw,7px)] text-[#f6d8c9]/75">
              Westlife
            </p>
          </div>
          <span className="ml-auto grid h-[clamp(14px,3.4vw,23px)] w-[clamp(14px,3.4vw,23px)] shrink-0 place-items-center rounded-full bg-[#f6d8c9] text-[#54242a]">
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="h-[45%] w-[45%] fill-current"
            >
              <path d="M3 1.5v9L10 6 3 1.5Z" />
            </svg>
          </span>
        </div>
        <div className="mt-[5%] flex items-center gap-1.5">
          <span className="text-[clamp(4px,1vw,7px)] text-[#f6d8c9]/75">1:42</span>
          <span className="relative h-[2px] flex-1 rounded-full bg-[#b98572]/40">
            <span className="absolute inset-y-0 left-0 w-[54%] rounded-full bg-[#b95755]" />
          </span>
          <span className="text-[clamp(4px,1vw,7px)] text-[#f6d8c9]/75">3:25</span>
        </div>
      </div>

      <div className="absolute left-[8%] top-[54%] z-20 -rotate-[7deg]">
        <HandDrawnHeart className="h-[clamp(22px,6vw,42px)] w-[clamp(22px,6vw,42px)] text-[#b95755]" />
      </div>

      <section className="absolute left-[8%] right-[8%] top-[63%] z-10">
        <h1
          className="max-w-[94%] font-serif text-[clamp(19px,4.4vw,30px)] font-bold leading-[1] tracking-[-.045em] text-[#7e2029]"
          style={{ textShadow: "1px 1px 0 rgba(255,255,255,.62)" }}
        >
          Nggak kerasa,
          <br />
          <span className="font-normal italic text-[#762d36]">
            udah sejauh ini.
          </span>
        </h1>
        <p className="mt-[1.2%] max-w-full text-[clamp(9px,1.35vw,11px)] font-medium leading-[1.3] text-[#59343a]">
          Makasih udah nemenin aku sampai sekarang. Mungkin aku nggak selalu
          pintar bilangnya, tapi aku senang banget bisa jalanin banyak hal sama
          kamu. Selamat anniversary, ya.
        </p>
        <div className="mt-[2%] flex w-full items-center justify-center gap-2 font-serif text-[clamp(10px,1.7vw,13px)] italic text-[#713640]">
          <span>Sayang kamu,</span>
          <span className="font-bold text-[#7f2833]">aku.</span>
          <HandDrawnHeart className="h-[clamp(11px,2vw,14px)] w-[clamp(11px,2vw,14px)] text-[#b95755]" />
        </div>
      </section>

    </section>
  );
}
