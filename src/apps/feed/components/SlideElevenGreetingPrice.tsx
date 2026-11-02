import generatedCouplePortrait from "@/assets/generated_images/nempo-slide10-couple-likeness.webp";

export function SlideElevenGreetingPrice() {
  return (
    <>
      <p className="text-[8px] font-black tracking-[0.28em] text-[#f2d1a2] sm:text-[10px]">
        KARTU UCAPAN DIGITAL
      </p>
      <h1 className="mt-2 max-w-[90%] text-[29px] font-black leading-[0.98] tracking-[-0.04em] text-[#fff7e5] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] sm:text-[38px]">
        Greeting
        <br />
        <span className="text-[#f2d1a2]">Card</span>
      </h1>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#f2d1a2]/40 bg-[#54242a]/95 px-4 py-2 text-[#fff7e5] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white sm:text-[9px]">
          Cuma
        </span>
        <span className="text-[20px] font-black leading-none tracking-[-0.04em] text-[#f2d1a2] sm:text-[25px]">
          Rp5.000
        </span>
      </div>
      <p className="mt-2 max-w-[76%] text-[9px] font-medium leading-[1.35] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[11px]">
        Kartu ucapan personal untuk momen spesial.
      </p>

      <article
        aria-label="Contoh kartu ucapan anniversary"
        className="relative mt-3 w-[82%] max-w-[390px] overflow-hidden rounded-[12px] border border-[#b98572]/65 bg-[#fff7e5] text-left text-[#54242a] shadow-[0_12px_30px_rgba(0,0,0,0.34)]"
      >
        <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-[#f2d1a2] via-[#b98572] to-[#741b24]" />
        <div className="relative grid grid-cols-[0.8fr_1.2fr] items-center gap-3 p-3 pl-4 sm:gap-4 sm:p-4 sm:pl-5">
          <div className="relative aspect-[0.82] overflow-hidden rounded-[8px] bg-[#eadcc7]">
            <img
              src={generatedCouplePortrait}
              alt="Ilustrasi pasangan untuk kartu ucapan anniversary"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 42%" }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[6px] font-black tracking-[0.16em] text-[#b98572] sm:text-[7px]">
              GREETING CARD
            </p>
            <h2 className="mt-1 text-[12px] font-extrabold leading-tight tracking-[-0.03em] text-[#54242a] sm:text-[16px]">
              Happy anniversary, sayang
            </h2>
            <p className="mt-2 line-clamp-2 text-[6px] font-medium leading-[1.35] text-[#916e60] sm:text-[8px]">
              Nothing&apos;s Going to Change My Love For You
            </p>
            <p className="mt-0.5 text-[6px] font-bold text-[#741b24] sm:text-[7px]">
              Westlife
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
