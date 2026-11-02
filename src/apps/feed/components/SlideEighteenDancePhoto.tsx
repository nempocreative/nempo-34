const gateBackground = `${"/nempo-feed/"}dance-temple-gate-background-final.webp`;
const dancerCutout = `${"/nempo-feed/"}dance-performers-cutout-high-trim.webp`;
const titleWords = [
  {
    word: 'SADULI',
    color: '#984c58',
    turns: [-5, 3, -2, 4, -3, 2],
  },
  {
    word: 'RAGAP',
    color: '#285653',
    turns: [3, -4, 2, -3, 4],
  },
];

export function SlideEighteenDancePhoto() {
  return (
    <section
      role="group"
      aria-label="Empat penari berdiri di depan gerbang Bali"
      className="absolute inset-x-[1%] top-[5%] bottom-[9%] overflow-hidden bg-[#e9d9b8] shadow-[0_12px_32px_rgba(0,0,0,.28)]"
    >
      <img
        src={gateBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
        draggable={false}
      />
      <h2
        aria-label="Saduli Ragap"
        className="absolute left-1/2 top-[39%] z-[2] flex w-[84%] -translate-x-1/2 flex-col items-center text-center leading-[0.82]"
        style={{ fontFamily: "'Bowlby One SC', 'Arial Black', sans-serif" }}
      >
        {titleWords.map(({ word, color, turns }) => (
          <span key={word} aria-hidden="true" className="flex items-center justify-center">
            {Array.from(word).map((letter, index) => (
              <span
                key={`${word}-${index}`}
                className="-mx-[0.045em] inline-block text-[clamp(18px,4.8vw,28px)]"
                style={{
                  color,
                  transform: `translateY(${index % 2 === 0 ? '-1px' : '1px'}) rotate(${turns[index] * 1.2}deg) scale(${index % 2 === 0 ? 1.04 : 0.96}, ${index % 3 === 0 ? 1.06 : 0.98})`,
                  transformOrigin: '50% 82%',
                  WebkitTextStroke: '1.35px rgba(255, 241, 216, .98)',
                  paintOrder: 'stroke fill',
                  filter: 'drop-shadow(0 2px 0 rgba(49, 47, 39, .23))',
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <div
        aria-hidden="true"
        className="absolute bottom-[0.5%] left-1/2 z-[2] h-[3%] w-[48%] -translate-x-1/2 rounded-[50%] blur-[5px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(45, 38, 29, .38) 0%, rgba(45, 38, 29, .18) 46%, transparent 76%)',
        }}
      />
      <a
        href="https://www.instagram.com/saduli.ragap/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Saduli Ragap, @saduli.ragap"
        className="absolute left-[3%] top-[3%] z-[4] text-[clamp(10px,2.8vw,14px)] font-extrabold leading-none tracking-[0.02em] text-[#285653]"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          textShadow: '0 1px 1px rgba(255, 245, 223, .7)',
        }}
      >
        @saduli.ragap
      </a>
      <img
        src={dancerCutout}
        alt="Empat penari sanggar mengenakan busana tari tradisional berwarna merah muda"
        className="absolute bottom-0 left-1/2 z-[3] h-auto w-[58%] -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(25,31,28,.26)]"
        draggable={false}
      />
    </section>
  );
}
