export function SlideSangkuriangCover() {
  return (
    <section
      role="group"
      aria-label="Sampul legenda Sangkuriang"
      className="absolute left-[4%] top-[20%] z-[3] w-[62%] text-left [container-type:inline-size]"
    >
      <p className="inline-flex items-center rounded-full border border-[#f4d5a8]/75 bg-[#251811]/60 px-3 py-1.5 text-[clamp(8px,1.8vw,10px)] font-black uppercase tracking-[0.18em] text-[#fff1d2] shadow-[0_3px_10px_rgba(23,14,10,0.3)] backdrop-blur-[2px]">
        Kisah dari Tanah Sunda
      </p>

      <h2
        className="mt-4 font-black leading-[0.98] tracking-[-0.045em] text-[#fff1d2] [text-shadow:0_2px_4px_rgba(28,16,10,0.9),0_8px_24px_rgba(28,16,10,0.55)]"
        style={{
          fontFamily: "'Bowlby One SC', 'DM Sans', sans-serif",
          fontSize: 'clamp(16px, 11cqi, 48px)',
        }}
      >
        SANGKURIANG
      </h2>

      <span
        aria-hidden="true"
        className="mt-4 block h-[2px] w-[28%] bg-[#e3b66f] shadow-[0_1px_5px_rgba(32,18,10,0.6)]"
      />

      <p className="mt-3 max-w-[96%] text-[clamp(10px,2.25vw,13px)] font-semibold leading-[1.45] text-white [text-shadow:0_1px_5px_rgba(24,14,10,0.9)]">
        Sebuah janji. Sebuah amarah.
        <span className="block text-[#f2d1a2]">
          Lahirnya Gunung Tangkuban Parahu.
        </span>
      </p>
    </section>
  );
}
