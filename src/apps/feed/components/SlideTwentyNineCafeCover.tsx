type Cafe = {
  number: string;
  name: string;
  image: string;
  imageAlt: string;
  story: string;
  fit: string;
};

type SlideTwentyNineCafeCoverProps = {
  cafes: Cafe[];
};

export function SlideTwentyNineCafeCover({
  cafes,
}: SlideTwentyNineCafeCoverProps) {
  return (
    <section
      role="group"
      aria-label="Sampul tiga cafe vintage spot foto"
      className="absolute inset-0 z-[3] overflow-hidden text-left text-white [container-type:inline-size]"
    >
      <div className="absolute inset-x-[7.5%] top-[15%] bottom-[7%] flex flex-col">
        <header className="shrink-0 text-center">
          <h1
            className="mx-auto -translate-y-[clamp(10px,4.5cqi,42px)] max-w-[96%] font-black leading-[0.98] tracking-[-0.045em] text-[#fff1d2] [text-shadow:0_2px_5px_rgba(28,16,10,0.9),0_8px_24px_rgba(28,16,10,0.6)]"
            style={{
              fontFamily: "'Bowlby One SC', 'DM Sans', sans-serif",
              fontSize: "clamp(24px, 7.7cqi, 70px)",
            }}
          >
            <span className="block">3 Cafe Vintage</span>
            <span className="block text-[#e3b66f]">Spot Foto</span>
          </h1>
          <span
            aria-hidden="true"
            className="mx-auto mt-[2.2%] block h-[2px] w-[14%] bg-[#e3b66f] shadow-[0_1px_5px_rgba(32,18,10,0.7)]"
          />
          <p className="mx-auto mt-[2%] max-w-[90%] text-[clamp(11px,2.5cqi,20px)] font-semibold leading-[1.35] text-white [text-shadow:0_1px_5px_rgba(24,14,10,0.9)]">
            Sudut klasik, suasana nyaman—pilih yang paling kamu suka.
          </p>
        </header>

        <div
          className="mt-[3.5%] grid grid-cols-3 items-stretch gap-[1.5%]"
          aria-label="Tiga cafe untuk dipilih"
        >
          {cafes.map((cafe) => (
            <article
              key={cafe.number}
              aria-label={`${cafe.name}: ${cafe.story}`}
              className="group flex min-w-0 flex-col overflow-hidden rounded-[clamp(9px,1.35cqi,16px)] border border-[#fff1d2]/80 bg-[#fffaf0] text-left shadow-[0_8px_24px_rgba(16,10,8,0.3)]"
            >
              <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#c9d8d0]">
                <img
                  src={cafe.image}
                  alt={cafe.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
                <span className="absolute left-[5%] top-[5%] flex h-[11%] min-h-[16px] w-[11%] min-w-[16px] items-center justify-center rounded-full bg-[#211711]/85 text-[clamp(8px,1.15cqi,12px)] font-black text-[#fff1d2]">
                  {cafe.number}
                </span>
                <span className="absolute bottom-[5%] left-[5%] rounded bg-[#211711]/80 px-[4%] py-[2%] text-[clamp(6px,0.75cqi,9px)] font-extrabold tracking-[0.08em] text-white">
                  ILUSTRASI
                </span>
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col px-[7%] py-[7%]">
                <h2 className="text-[clamp(10px,1.45cqi,16px)] font-black leading-[1.12] tracking-[-0.02em] text-[#183c4c]">
                  {cafe.name}
                </h2>
                <p className="mt-[5%] text-[clamp(7px,0.92cqi,11px)] leading-[1.3] text-[#435762]">
                  {cafe.story}
                </p>
                <span className="mt-auto pt-[7%]">
                  <span className="inline-block w-fit rounded-full bg-[#e4f1f1] px-[7%] py-[3%] text-[clamp(6px,0.7cqi,9px)] font-extrabold leading-[1.2] tracking-[0.04em] text-[#1b6b83]">
                    {cafe.fit}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-auto shrink-0 rounded-[clamp(9px,1.2cqi,14px)] border border-white/25 bg-[#062f4d]/35 px-[2%] py-[1.5%] text-center backdrop-blur-[2px]">
          <p className="text-[clamp(9px,1.25cqi,14px)] font-black tracking-[0.08em] text-[#ffdd00] [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
            MANA YANG PALING KAMU BANGET?
          </p>
          <p className="mt-[0.5%] text-[clamp(7px,0.9cqi,10px)] font-medium leading-[1.3] text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
            Tulis 01, 02, atau 03 di komentar · foto ilustrasi, bukan foto lokasi
            asli.
          </p>
        </footer>
      </div>
    </section>
  );
}
