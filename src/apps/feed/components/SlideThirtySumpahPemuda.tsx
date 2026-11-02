const posterImage = new URL(
  "../../../assets/Sumpah_Pemuda__Youth_United_1793173357753.png",
  import.meta.url,
).href;

export function SlideThirtySumpahPemuda() {
  return (
    <section
      role="group"
      aria-label="Peringatan Sumpah Pemuda, 28 Oktober 1928"
      className="absolute inset-0 z-[3] overflow-hidden"
    >
      <img
        src={posterImage}
        alt="Poster Sumpah Pemuda dengan bendera Merah Putih dan para pemuda Indonesia"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
    </section>
  );
}
