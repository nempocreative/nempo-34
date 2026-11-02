export function SlideFifteenProductPoster() {
  return (
    <>
      <p className="text-[8px] font-black tracking-[0.28em] text-[#f2d1a2] sm:text-[10px]">
        POSTER PRODUK UMKM
      </p>
      <h1 className="mt-2 max-w-[90%] text-[29px] font-black leading-[0.98] tracking-[-0.04em] text-[#fff7e5] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] sm:text-[38px]">
        Poster Produk
        <br />
        <span className="text-[#f2d1a2]">UMKM Naik Kelas</span>
      </h1>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#f2d1a2]/40 bg-[#54242a]/95 px-4 py-2 text-[#fff7e5] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white sm:text-[9px]">
          Cuma
        </span>
        <span className="text-[20px] font-black leading-none tracking-[-0.04em] text-[#f2d1a2] sm:text-[25px]">
          Rp5.000
        </span>
      </div>
      <p className="mt-2 max-w-none whitespace-nowrap text-[8px] font-medium leading-[1.35] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[11px]">
        Bikin produk UMKM makin dilirik.
      </p>

      <article
        aria-label="Contoh poster produk UMKM"
        className="relative mt-3 w-[82%] max-w-[390px] overflow-hidden rounded-[12px] border border-[#b98572]/65 bg-[#fff7e5] text-left text-[#54242a] shadow-[0_12px_30px_rgba(0,0,0,0.34)]"
      >
        <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-[#f2d1a2] via-[#b98572] to-[#741b24]" />
        <div className="relative grid grid-cols-[1fr_1.1fr] items-center gap-3 p-3 pl-4 sm:gap-4 sm:p-4 sm:pl-5">
          <div className="relative flex aspect-[0.82] items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-br from-[#eadcc7] to-[#d9ad8d]">
            <span className="absolute -right-[20%] -top-[12%] h-[62%] w-[82%] rounded-full border border-[#fff7e5]/45" />
            <span className="absolute -bottom-[24%] -left-[18%] h-[62%] w-[82%] rounded-full border border-[#54242a]/15" />
            <span className="absolute right-[13%] top-[15%] h-[28%] w-[2px] rotate-[18deg] bg-[#54242a]" />
            <div className="relative z-10 flex h-[62%] w-[47%] flex-col items-center overflow-hidden rounded-b-[11px] rounded-t-[7px] border-2 border-[#54242a] bg-[#fff7e5] shadow-[0_7px_14px_rgba(52,29,23,0.25)]">
              <div className="h-[21%] w-full bg-[#54242a]" />
              <span className="mt-[20%] text-[5px] font-black tracking-[0.2em] text-[#b98572] sm:text-[6px]">
                RASA
              </span>
              <span className="font-serif text-[8px] font-black leading-none tracking-[-0.04em] text-[#54242a] sm:text-[11px]">
                LOKAL
              </span>
              <span className="absolute bottom-[8%] text-[4px] font-bold tracking-[0.14em] text-[#741b24] sm:text-[5px]">
                KOPI AREN
              </span>
            </div>
            <span className="absolute bottom-[7%] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#54242a] px-2 py-0.5 text-[4px] font-black tracking-[0.1em] text-[#fff7e5] sm:text-[5px]">
              CONTOH PRODUK
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[6px] font-black tracking-[0.16em] text-[#b98572] sm:text-[7px]">
              CONTOH POSTER
            </p>
            <h2 className="mt-1 text-[12px] font-extrabold leading-tight tracking-[-0.03em] text-[#54242a] sm:text-[16px]">
              Kopi Susu Aren
            </h2>
            <p className="mt-1.5 text-[6px] font-medium leading-[1.35] text-[#916e60] sm:text-[8px]">
              Produk lokal, tampil lebih menarik.
            </p>
            <span className="mt-2 inline-flex rounded-full bg-[#54242a] px-2 py-1 text-[5px] font-black tracking-[0.1em] text-[#fff7e5] sm:text-[6px]">
              PRODUK UMKM
            </span>
          </div>
        </div>
      </article>
    </>
  );
}
