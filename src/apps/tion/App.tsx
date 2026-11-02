import { useRef, useState } from 'react';
import { toCanvas } from 'html-to-image';
import { Download } from 'lucide-react';
import StoryPage from './story/StoryPage';
import BumperPage from './bumper/BumperPage';

const backgroundImage = `${"/tion-feed/"}assets/nasution-retro-product-background-ai.png`;
const slideTwoPortraitImage = `${"/tion-feed/"}assets/nasution-boy-slide-2-kitchen-ai.png`;
const slideThreePortraitImage = `${"/tion-feed/"}assets/tion-slide-3-cafe-enhanced.png`;
const slideFourPortraitImage = `${"/tion-feed/"}assets/tion-slide-4-cafe-no-person.png`;
const slideFivePortraitImage = `${"/tion-feed/"}assets/tion-slide-5-cafe-enhanced.png`;
const slideSixPortraitImage = `${"/tion-feed/"}assets/tion-slide-6-cafe-no-people.png`;
const slideEightCafeImage = `${"/tion-feed/"}assets/tion-slide-8-vintage-cafe-ai.png`;
const slideNineCafeImage = `${"/tion-feed/"}assets/tion-slide-9-vintage-cafe-ai.png`;
const slideTenCafeImage = `${"/tion-feed/"}assets/tion-slide-10-vintage-cafe-ai.png`;
const slideElevenCafeImage = `${"/tion-feed/"}assets/tion-slide-11-vintage-cafe-ai.png`;
const slideEightBrandWordmark = `${"/tion-feed/"}assets/nasution-boy-rounded-wordmark-white.png`;
const brandWordmark = `${"/tion-feed/"}assets/nasution-boy-retro-logo-headline-yellow-v2.png`;
const invitationCafePhotos = [
  {
    src: slideThreePortraitImage,
    alt: 'Sudut kafe dengan tanaman dan dinding kayu',
    className: 'left-[7%] top-[17%] w-[39%] h-[25%] rotate-[-5deg]',
  },
  {
    src: slideFourPortraitImage,
    alt: 'Area duduk kafe dengan dinding bertekstur dan tanaman',
    className: 'right-[7%] top-[16%] w-[39%] h-[25%] rotate-[4deg]',
  },
  {
    src: slideFivePortraitImage,
    alt: 'Sudut kafe vintage dengan sepeda dan furnitur kayu',
    className: 'left-[13%] top-[36%] w-[36%] h-[23%] rotate-[3deg]',
  },
  {
    src: slideSixPortraitImage,
    alt: 'Interior kafe dengan meja kayu dan lampu hijau',
    className: 'right-[10%] top-[35%] w-[37%] h-[23%] rotate-[-3deg]',
  },
];

const fontExamples = [
  {
    slide: 9,
    name: 'Lazy Arie',
    category: 'HAND-DRAWN DISPLAY',
    sample: 'Jajan enak\nbuat konten!',
    useCase: 'Hook · cover Reels · carousel',
    description:
      'Huruf tebal, membulat, dan organik memberi kesan playful serta akrab. Cocok untuk headline singkat di cover Reels atau carousel; gunakan sans-serif untuk lokasi, harga, dan CTA.',
    style: 'lazy-arie',
    backgroundImage: slideNineCafeImage,
  },
  {
    slide: 10,
    name: 'Gossamer Noon Sans',
    category: 'SANS SERIF · PERSONAL',
    sample: 'Tempat nyaman\nbuat rehat',
    useCase: 'Cerita lifestyle · rekomendasi',
    description: 'Sans-serif tipis dengan bentuk tinggi dan sedikit organik.',
    style: 'gossamer-noon-sans',
    backgroundImage: slideTenCafeImage,
  },
  {
    slide: 11,
    name: 'Super Chips',
    category: 'PLAYFUL & SANTAI',
    sample: 'Ngopi yuk!\nbuat konten!',
    useCase: 'Hook utama Reels · carousel',
    description: 'Terasa akrab, fun, dan ekspresif.',
    style: 'super-chips',
    backgroundImage: slideElevenCafeImage,
  },
  {
    slide: 12,
    name: 'Heyam',
    category: 'TULISAN TANGAN · ORGANIK',
    sample: 'Tempat nyaman\nbuat kerja santai',
    useCase: 'Headline personal · konten santai',
    description: 'Tulisan tangan yang terasa akrab, organik, dan santai.',
    style: 'heyam',
    backgroundImage: slideElevenCafeImage,
  },
];

const drinkDetails = [
  {
    name: 'Avocado Milk',
    nameFamily: 'Avocado',
    nameVariant: 'Milk',
    price: 'Rp21.000',
    priceLabel: '21K',
    image: `${"/tion-feed/"}assets/avocado-milk-user-trim.png`,
    center: '22%',
    cupTop: '58.5%',
    cupWidth: '18%',
    cupHeight: '21%',
    captionTop: '83%',
    captionWidth: '22%',
    ticketTop: '52%',
    ticketWidth: '18.5%',
    strawTop: '49%',
    strawHeight: '14%',
    strawWidth: '2%',
    strawStyle: 'avocado',
    zIndex: 12,
  },
  {
    name: 'Kopi Kenangan Mantan',
    nameFamily: 'Kopi Kenangan',
    nameVariant: 'Mantan',
    price: 'Rp18.000',
    priceLabel: '18K',
    image: `${"/tion-feed/"}assets/kopi-kenangan-mantan-user-trim.png`,
    center: '50%',
    cupTop: '63%',
    cupWidth: '21%',
    cupHeight: '25%',
    captionTop: '91.5%',
    captionWidth: '24%',
    ticketTop: '58%',
    ticketWidth: '20.5%',
    strawTop: '55%',
    strawHeight: '15%',
    strawWidth: '2.3%',
    strawStyle: 'coffee',
    zIndex: 15,
  },
  {
    name: 'Pistachio Aren Latte',
    nameFamily: 'Pistachio Aren',
    nameVariant: 'Latte',
    price: 'Rp15.000',
    priceLabel: '15K',
    image: `${"/tion-feed/"}assets/pistachio-user-trim.png`,
    center: '78%',
    cupTop: '58.5%',
    cupWidth: '18%',
    cupHeight: '21%',
    captionTop: '83%',
    captionWidth: '22%',
    ticketTop: '52%',
    ticketWidth: '18.5%',
    strawTop: '49%',
    strawHeight: '14%',
    strawWidth: '2%',
    strawStyle: 'pistachio',
    zIndex: 12,
  },
];

const glyphSizePattern = [0.9, 1.08, 0.96, 1.14, 0.92, 1.04, 1.12, 0.94];
const glyphTiltPattern = [-2, 1, -1, 2, -2, 0, 1, -1];
const glyphLiftPattern = [-0.12, 0.08, -0.04, 0.14, -0.08, 0.04, 0.12, -0.1];

function PlayfulTypeLine({
  text,
  baseSize,
  color,
  overlap = false,
}: {
  text: string;
  baseSize: number;
  color: string;
  overlap?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 flex items-center justify-center whitespace-nowrap${overlap ? ' -mt-[1.35cqi]' : ''}`}
      style={{ color }}
    >
      {Array.from(text).map((character, index) => {
        if (character === ' ') {
          return (
            <span
              key={`${index}-space`}
              aria-hidden="true"
              style={{
                display: 'inline-block',
                flex: '0 0 auto',
                fontSize: `${baseSize}cqi`,
                width: '0.28em',
              }}
            >
              &nbsp;
            </span>
          );
        }

        const patternIndex = index % glyphSizePattern.length;

        return (
          <span
            key={`${character}-${index}`}
            style={{
              display: 'inline-block',
              flex: '0 0 auto',
              fontSize: `${baseSize * glyphSizePattern[patternIndex]}cqi`,
              marginInline: '-0.06em',
              position: 'relative',
              transform: `translateY(${glyphLiftPattern[patternIndex]}cqi) rotate(${glyphTiltPattern[patternIndex]}deg)`,
              zIndex: index % 3 === 0 ? 2 : 1,
            }}
          >
            {character}
          </span>
        );
      })}
    </span>
  );
}

function FeedPage() {
  const artworkRef = useRef<HTMLElement | null>(null);
  const [activeSlide, setActiveSlide] = useState<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  >(10);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const isSecondSlide = activeSlide === 2;
  const isThirdSlide = activeSlide === 3;
  const isFourthSlide = activeSlide === 4;
  const isFifthSlide = activeSlide === 5;
  const isSixthSlide = activeSlide === 6;
  const isInvitationSlide = activeSlide === 7;
  const isFontGuideSlide = activeSlide === 8;
  const isFontGuideCover = isFontGuideSlide;
  const isSlideNine = activeSlide === 9;
  const isSlideTen = activeSlide === 10;
  const isSlideEleven = activeSlide === 11;
  const isSlideTwelve = activeSlide === 12;
  const usesSlideEightWordmark =
    isFontGuideCover || isSlideNine || isSlideTen || isSlideEleven || isSlideTwelve;
  const activeFontExample = isFontGuideCover
    ? undefined
    : fontExamples.find((example) => example.slide === activeSlide);
  const isFontExampleSlide = Boolean(activeFontExample);
  const isCustomFontExample =
    activeFontExample?.style === 'lazy-arie' ||
    activeFontExample?.style === 'gossamer-noon-sans' ||
    activeFontExample?.style === 'super-chips' ||
    activeFontExample?.style === 'heyam';
  const isGossamerNoonSans = activeFontExample?.style === 'gossamer-noon-sans';
  const isHeyam = activeFontExample?.style === 'heyam';
  const isFontGuideSeries = isFontGuideCover || isFontExampleSlide;
  const isCafeSlide = isThirdSlide || isFourthSlide || isFifthSlide || isSixthSlide;
  const isEditorialSlide = isCafeSlide || isInvitationSlide || isFontGuideSeries;

  const handleDownload = async () => {
    const artwork = artworkRef.current;
    if (!artwork || isDownloading) return;

    setIsDownloading(true);
    setDownloadError('');

    try {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      await Promise.all(
        Array.from(artwork.querySelectorAll('img')).map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve, reject) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener(
                'error',
                () => reject(new Error(`Gagal memuat gambar: ${image.currentSrc || image.src}`)),
                { once: true },
              );
            });
          }

          if (image.naturalWidth === 0) {
            throw new Error(`Gagal memuat gambar: ${image.currentSrc || image.src}`);
          }

          await image.decode();
        }),
      );

      const renderedCanvas = await toCanvas(artwork, {
        cacheBust: true,
        pixelRatio: 3,
        canvasWidth: 1080,
        canvasHeight: 1350,
        style: { boxShadow: 'none' },
      });
      const downloadLink = document.createElement('a');
      downloadLink.download = isSecondSlide
        ? 'nasution-boy-slide-2.png'
        : isThirdSlide
          ? 'nasution-boy-slide-3.png'
          : isFourthSlide
            ? 'nasution-boy-slide-4.png'
            : isFifthSlide
              ? 'nasution-boy-slide-5.png'
              : isSixthSlide
                ? 'nasution-boy-slide-6.png'
                : isInvitationSlide
                  ? 'nasution-boy-slide-7.png'
                  : isFontGuideSeries
                    ? `nasution-boy-slide-${activeSlide}.png`
                    : 'nasution-boy-dapur-nenek-promo.png';
      downloadLink.href = renderedCanvas.toDataURL('image/png');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
    } catch (error) {
      console.error('Gagal membuat PNG Nasution Boy Explore Jawa Barat:', error);
      setDownloadError('PNG belum bisa dibuat. Coba unduh lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#e9dfca] px-6 py-4 max-[640px]:px-0 max-[640px]:py-0">
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center max-[640px]:min-h-screen">
        <header className="mb-3 flex w-full max-w-[720px] items-center justify-between gap-2 px-2 max-[640px]:flex-col max-[640px]:items-center sm:px-0">
          <div aria-label="Pilih slide atau format Story" className="inline-flex shrink-0 rounded-full border border-[#d5c5a6] bg-[#f5eddd] p-1 shadow-[0_4px_12px_rgba(56,42,24,0.12)] max-[640px]:w-full max-[640px]:flex-wrap max-[640px]:justify-center">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((slide) => (
              <button
                key={slide}
                type="button"
                onClick={() => setActiveSlide(slide)}
                aria-pressed={activeSlide === slide}
                aria-label={`Pilih slide ${slide}`}
                className={`rounded-full px-3 py-2 text-[11px] font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c58152] focus-visible:ring-offset-2 ${
                  activeSlide === slide
                    ? 'bg-[#28483a] text-white shadow-sm'
                    : 'text-[#624b34] hover:bg-[#ebe0c9]'
                }`}
              >
                {slide}
              </button>
            ))}
            <a
              href={`${"/tion-feed/"}story/`}
              aria-label="Buka desain Instagram Story 9:16"
              className="rounded-full px-3 py-2 text-[11px] font-extrabold text-[#28483a] transition-colors hover:bg-[#ebe0c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c58152] focus-visible:ring-offset-2"
            >
              Story 9:16
            </a>
            <a
              href={`${"/tion-feed/"}bumper/`}
              aria-label="Buka video bumper podcast Ngopi Santai episode 1"
              className="rounded-full px-3 py-2 text-[11px] font-extrabold text-[#28483a] transition-colors hover:bg-[#ebe0c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c58152] focus-visible:ring-offset-2"
            >
              Video Bumper
            </a>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-busy={isDownloading}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#28483a] px-3.5 py-2 text-[11px] font-black text-white shadow-[0_6px_16px_rgba(56,42,24,0.18)] hover:bg-[#365b49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c58152] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 max-[640px]:w-full max-[640px]:max-w-[220px] max-[640px]:justify-center"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {isDownloading ? 'Menyiapkan PNG…' : 'Download PNG'}
          </button>
        </header>

        {downloadError && (
          <p
            role="alert"
            className="mb-2 w-full max-w-[420px] px-4 text-[11px] font-semibold text-red-700 sm:px-0"
          >
            {downloadError}
          </p>
        )}

        <article
          ref={artworkRef}
          aria-label={
            isSecondSlide
              ? 'Slide 2 Nasution Boy, potret AI memegang produk.'
              : isInvitationSlide
                ? 'Slide 7 ajakan memberi rekomendasi kafe estetik.'
                : isFontGuideCover
                  ? `Slide ${activeSlide} cover seri rekomendasi font untuk membuat konten.`
                  : activeFontExample
                    ? `Slide ${activeSlide}, contoh font ${activeFontExample.name} dan penerapannya.`
              : isCafeSlide
                ? `Slide ${activeSlide} foto kafe di Garut tanpa karakter.`
                : 'Poster promo Nasution Boy: tiga minuman dengan harga pada sedotan.'
          }
          className="relative isolate aspect-[4/5] h-auto w-full max-w-[420px] overflow-hidden text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] min-[641px]:h-[min(125vw,calc(100vh-5rem))] min-[641px]:w-auto min-[641px]:max-w-full"
          style={{
            fontFamily: "'DM Sans', 'Inter', sans-serif",
            containerType: 'inline-size',
            background: isSecondSlide
              ? '#302217'
              : isInvitationSlide
                ? 'linear-gradient(180deg, #173d32 0%, #173d32 58%, #f3e8d2 58%, #f3e8d2 100%)'
                : isFontGuideCover
                  ? `linear-gradient(180deg, rgba(16, 20, 16, 0.3) 0%, rgba(14, 20, 16, 0.12) 34%, rgba(10, 16, 13, 0.68) 100%), url("${slideEightCafeImage}") center / cover no-repeat`
                  : activeFontExample
                    ? `linear-gradient(180deg, rgba(16, 20, 16, 0.44) 0%, rgba(14, 20, 16, 0.18) 38%, rgba(10, 16, 13, 0.74) 100%), url("${activeFontExample.backgroundImage}") center / cover no-repeat`
              : isCafeSlide
                  ? `url("${isSixthSlide ? slideSixPortraitImage : isFifthSlide ? slideFivePortraitImage : isFourthSlide ? slideFourPortraitImage : slideThreePortraitImage}") center / cover no-repeat`
                : `linear-gradient(180deg, rgba(28,18,10,0.56) 0%, rgba(28,18,10,0.38) 24%, rgba(28,18,10,0.08) 43%, rgba(77,49,29,0.02) 56%, rgba(77,49,29,0.1) 100%), url("${backgroundImage}") center / cover no-repeat`,
          }}
        >
          {isInvitationSlide && (
            <div
              aria-hidden="true"
              className="absolute inset-0"
            >
              {invitationCafePhotos.map((photo) => (
                <div
                  key={photo.src}
                  className={`absolute z-10 overflow-hidden border-[1.1cqi] border-[#fff7e7] bg-[#fff7e7] p-[0.65cqi] shadow-[0_1.2cqi_2.5cqi_rgba(21,26,18,0.38)] ${photo.className}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          )}
          {isSecondSlide && (
            <img
              src={slideTwoPortraitImage}
              alt="Potret retro di dapur jadul, memegang minuman dengan produk tersaji di meja"
              className="absolute inset-0 z-0 h-full w-full object-cover"
              draggable={false}
            />
          )}
          <header
            className={`absolute inset-x-0 z-30 flex flex-col items-center text-center ${
              isInvitationSlide ? 'inset-y-0' : 'top-[5.5%]'
            }`}
          >
            <img
              src={usesSlideEightWordmark ? slideEightBrandWordmark : brandWordmark}
              alt="Nasution Boy"
              className={`h-auto w-[18cqi] object-contain ${
                usesSlideEightWordmark
                  ? 'drop-shadow-[0_2px_5px_rgba(12,12,8,0.65)]'
                  : 'drop-shadow-[0_0_3px_rgba(255,196,0,0.9)] drop-shadow-[0_2px_5px_rgba(12,12,8,0.65)]'
              } ${
                isInvitationSlide ? 'absolute top-[5.5%]' : ''
              }`}
              draggable={false}
            />
            {!isSecondSlide && !isFontGuideSeries && (
              <>
                {isInvitationSlide ? (
                  <div className="absolute inset-x-0 top-[72%] z-20 flex -translate-y-1/2 flex-col items-center">
                    <h1
                      aria-label="Menurut kalian, cafe mana yang oke?"
                      className="flex flex-col items-center leading-none"
                      style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
                    >
                      <PlayfulTypeLine text="Menurut kalian," baseSize={5.1} color="#173d32" />
                      <PlayfulTypeLine text="cafe mana yang oke?" baseSize={6.1} color="#a75434" overlap />
                    </h1>
                    <p className="mt-[3.2cqi] max-w-[84%] text-center text-[3.3cqi] font-bold leading-snug text-[#31483a]">
                      Ada rekomendasi cafe estetik lainnya?
                    </p>
                    <p className="mt-[2.4cqi] rounded-full border-[0.35cqi] border-[#d4a74c] bg-[#173d32] px-[3.5cqi] py-[1.35cqi] text-[2.65cqi] font-extrabold tracking-[0.04em] text-[#fff4dc] shadow-[0_0.7cqi_1.8cqi_rgba(36,34,22,0.2)]">
                      Tulis rekomendasinya di komentar!
                    </p>
                  </div>
                ) : (
                  <>
                    <h1
                      aria-label={
                        isCafeSlide
                          ? 'Cafe Vintage di Garut'
                          : 'Beli Kopi Kenangan Lebih Murah'
                      }
                      className="mt-[4cqi] flex flex-col items-center leading-none [text-shadow:0_3px_7px_rgba(18,10,5,0.98)]"
                      style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
                    >
                      {isCafeSlide ? (
                    <>
                      <PlayfulTypeLine text="Cafe Vintage" baseSize={5.5} color="#fff3d6" />
                      <PlayfulTypeLine text="di Garut" baseSize={6.2} color="#ffd447" overlap />
                    </>
                  ) : (
                    <>
                      <PlayfulTypeLine text="Beli Kopi Kenangan" baseSize={6.1} color="#fff3d6" />
                      <PlayfulTypeLine text="Lebih Murah" baseSize={7.2} color="#ffd447" overlap />
                    </>
                  )}
                    </h1>
                    {isCafeSlide && (
                      <p className="mt-[1.6cqi] rounded-full border-[0.3cqi] border-[#ffd447] bg-[#073c37]/95 px-[3cqi] py-[0.9cqi] text-[2.7cqi] font-extrabold tracking-[0.04em] text-[#fff1cc] shadow-[0_4px_12px_rgba(18,10,5,0.48)]">
                        {isFourthSlide
                          ? 'Seraloka'
                          : isFifthSlide
                            ? 'Cawene'
                            : isSixthSlide
                              ? 'Gudang Rasa'
                              : 'Two Days'}
                      </p>
                    )}
                    {!isCafeSlide && (
                      <>
                        <p className="mt-[1.6cqi] rounded-full border-[0.35cqi] border-[#ffd447] bg-[#073c37] px-[3cqi] py-[1.25cqi] text-[2.3cqi] font-extrabold uppercase tracking-[0.08em] text-[#fff1cc] shadow-[0_4px_12px_rgba(18,10,5,0.48)]">
                          Pakai Voucher TikTok
                        </p>
                        <p className="mt-[0.8cqi] text-[2cqi] font-extrabold uppercase tracking-[0.13em] text-[#fff1cc] [text-shadow:0_2px_5px_rgba(18,10,5,0.98)]">
                          ↓ Klik lokasi di bawah
                        </p>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </header>

          {isFontGuideCover && (
            <div
              className="slide-eight-font-intro"
            >
              <div className="slide-eight-font-intro__content">
                <h1>
                  <span className="slide-eight-font-intro__first-line">
                    <span className="slide-eight-font-intro__display">Font</span>
                    <span className="slide-eight-font-intro__seru">seru</span>
                  </span>
                  <span className="slide-eight-font-intro__accent">
                    <span>buat</span>
                    <span>ngonten</span>
                  </span>
                </h1>
              </div>
            </div>
          )}
          {activeFontExample && (
            <section
              className={`slide-font-example slide-font-example--${activeFontExample.style}`}
              aria-label={`${activeFontExample.name}: ${activeFontExample.description}`}
            >
              <header className="slide-font-example__intro">
                {!isCustomFontExample && (
                  <p className="slide-font-example__eyebrow">
                    {`FONT ${String(
                        fontExamples.findIndex(
                          (example) => example.slide === activeFontExample.slide,
                        ) + 1,
                      ).padStart(2, '0')} / ${String(fontExamples.length).padStart(2, '0')} · ${
                        activeFontExample.category
                      }`}
                  </p>
                )}
                <h1 className="slide-font-example__name">{activeFontExample.name}</h1>
              </header>
              {isCustomFontExample ? (
                <>
                  <div className="slide-font-example__specimen">
                    <p className="slide-font-example__specimen-label">
                      CONTOH HEADLINE
                    </p>
                    <p className="slide-font-example__sample">{activeFontExample.sample}</p>
                  </div>
                  <div className="slide-font-example__tip slide-font-example__tip--details">
                    <div className="slide-font-example__quick-grid">
                      <section className="slide-font-example__detail">
                        <p className="slide-font-example__tip-label">KARAKTER FONT</p>
                        <p className="slide-font-example__description">
                          {isGossamerNoonSans
                            ? 'Tipis · tinggi · organik'
                            : isHeyam
                              ? 'Organik · akrab · personal'
                              : 'Tebal · bulat · ekspresif'}
                        </p>
                      </section>
                      <section className="slide-font-example__detail">
                        <p className="slide-font-example__tip-label">INFLUENCER</p>
                        <p className="slide-font-example__description">
                          {isGossamerNoonSans
                            ? 'Cerita lifestyle · rekomendasi'
                            : isHeyam
                              ? 'Headline personal · konten santai'
                              : 'Hook utama Reels · carousel'}
                        </p>
                      </section>
                    </div>
                    <p className="slide-font-example__micro-note">
                      {isGossamerNoonSans
                        ? 'Foto personal · teks info sans-serif'
                        : isHeyam
                          ? 'Foto personal · teks info sans-serif'
                          : 'Foto kreator · teks info sans-serif'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="slide-font-example__sample">{activeFontExample.sample}</p>
                  <div className="slide-font-example__tip">
                    <p className="slide-font-example__tip-label">COCOK UNTUK</p>
                    <p className="slide-font-example__use-case">{activeFontExample.useCase}</p>
                    <p className="slide-font-example__description">
                      {activeFontExample.description}
                    </p>
                  </div>
                </>
              )}
            </section>
          )}

          {!isSecondSlide && (
            <div className="absolute inset-0">
              {!isEditorialSlide && (
                <>
                  <div aria-hidden="true" className="absolute inset-0 z-20">
                    {drinkDetails.map((drink) => (
                      <span
                        key={`${drink.name}-straw`}
                        className={`drink-straw drink-straw--${drink.strawStyle}`}
                        style={{
                          left: drink.center,
                          top: drink.strawTop,
                          height: drink.strawHeight,
                          width: drink.strawWidth,
                        }}
                      />
                    ))}
                  </div>

                  {drinkDetails.map((drink) => (
                    <img
                      key={`${drink.name}-image`}
                      src={drink.image}
                      alt={drink.name}
                      className="absolute -translate-x-1/2 object-contain drop-shadow-[0_12px_10px_rgba(20,18,11,0.3)]"
                      style={{
                        left: drink.center,
                        top: drink.cupTop,
                        width: drink.cupWidth,
                        height: drink.cupHeight,
                        zIndex: drink.zIndex,
                      }}
                      draggable={false}
                    />
                  ))}

                  <aside aria-label="Harga minuman" className="absolute inset-0 z-30">
                    {drinkDetails.map((drink) => (
                      <div
                        key={`${drink.name}-price`}
                        className="drink-ticket"
                        style={{
                          left: drink.center,
                          top: drink.ticketTop,
                          width: drink.ticketWidth,
                        }}
                        role="img"
                        aria-label={`${drink.name}, ${drink.price}`}
                      >
                        <span className="drink-ticket__currency" aria-hidden="true">
                          RP
                        </span>
                        <span className="drink-ticket__price" aria-hidden="true">
                          {drink.priceLabel}
                        </span>
                      </div>
                    ))}
                  </aside>

                  <section aria-label="Nama minuman" className="absolute inset-0 z-30">
                    {drinkDetails.map((drink) => (
                      <div
                        key={`${drink.name}-description`}
                        className="drink-caption"
                        style={{
                          left: drink.center,
                          top: drink.captionTop,
                          width: drink.captionWidth,
                        }}
                        aria-label={drink.name}
                      >
                        <span className="drink-caption__family">{drink.nameFamily}</span>
                        <strong className="drink-caption__name">{drink.nameVariant}</strong>
                      </div>
                    ))}
                  </section>
                </>
              )}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}

function App() {
  const storyPath = `${"/tion-feed/"}story`.replace(/\/+$/, '');
  const bumperPath = `${"/tion-feed/"}bumper`.replace(/\/+$/, '');
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  if (currentPath === storyPath) return <StoryPage />;
  if (currentPath === bumperPath) return <BumperPage />;
  return <FeedPage />;
}

export default App;
