import type { RefObject } from 'react';
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import photoboothIntegratedArt from '@/assets/generated_images/ggs-beauty-photobooth-qcard-style-print-4k.webp';

const assetBase = "/nempo-feed/";

type GgsBeautyPhotoboothProps = {
  exportRef: RefObject<HTMLElement | null>;
};

export function GgsBeautyPhotobooth({ exportRef }: GgsBeautyPhotoboothProps) {
  const [printing, setPrinting] = useState(false);
  const [printPreparationError, setPrintPreparationError] = useState('');

  useEffect(() => {
    if (!printing) return;

    let cancelled = false;

    const prepareAndPrint = async () => {
      try {
        await document.fonts.ready;

        const printImages = Array.from(
          document.querySelectorAll<HTMLImageElement>('.photobooth-page--printing img'),
        );

        await Promise.all(
          printImages.map(async (image) => {
            if (!image.complete) {
              await new Promise<void>((resolve, reject) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener(
                  'error',
                  () => reject(new Error(`Gagal memuat gambar photobooth: ${image.currentSrc || image.src}`)),
                  { once: true },
                );
              });
            }

            if (image.naturalWidth === 0) {
              throw new Error(`Gagal memuat gambar photobooth: ${image.currentSrc || image.src}`);
            }

            await image.decode();
          }),
        );

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (!cancelled) window.print();
      } catch (error) {
        console.error('Gagal menyiapkan photobooth GGS untuk PDF:', error);
        if (!cancelled) {
          setPrintPreparationError(
            'PDF belum bisa disiapkan karena ada gambar photobooth yang gagal dimuat.',
          );
          setPrinting(false);
        }
      }
    };

    void prepareAndPrint();
    return () => {
      cancelled = true;
    };
  }, [printing]);

  useEffect(() => {
    const resetPrinting = () => setPrinting(false);
    window.addEventListener('afterprint', resetPrinting);
    return () => window.removeEventListener('afterprint', resetPrinting);
  }, []);

  return (
    <section
      className={`photobooth-page mx-auto w-full max-w-[1200px] px-3 py-5 sm:px-6 sm:py-7${printing ? ' photobooth-page--printing' : ''}`}
    >
      <div className="photobooth-export-row">
        <div className="photobooth-export-copy">
          <p className="photobooth-export-kicker">
            PRINT PREVIEW <span>·</span> 3 × 2 M
          </p>
          <p className="photobooth-export-note">
            PDF satu halaman 3 × 2 m dengan teks vektor. PNG mengikuti tampilan PDF pada 3×
            (12.288 × 8.193 px); detail foto mengikuti sumber 4K. Pilih “Simpan sebagai PDF”
            saat dialog cetak.
          </p>
        </div>
        <button
          type="button"
          className="photobooth-print-button"
          disabled={printing}
          aria-busy={printing}
          onClick={() => {
            setPrintPreparationError('');
            setPrinting(true);
          }}
        >
          <Printer aria-hidden="true" />
          <span>{printing ? 'Menyiapkan PDF…' : 'Cetak PDF · 3 × 2 m'}</span>
        </button>
      </div>

      {printPreparationError && (
        <p className="photobooth-print-error" role="alert">
          {printPreparationError}
        </p>
      )}

      <main
        ref={exportRef}
        aria-label="GGS Beauty photobooth backdrop, 3 by 2 metres"
        className={`photobooth-artwork relative isolate mx-auto aspect-[3/2] w-full overflow-hidden bg-[#FC46AA] text-[#541431]${printing ? ' photobooth-artwork--printing' : ''}`}
        style={{
          containerType: 'inline-size',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <img
          src={photoboothIntegratedArt}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[center_68%]"
          draggable={false}
        />

        <div className="absolute inset-x-0 top-[4.5%] z-10 flex flex-col items-center text-center">
          <img
            src={`${assetBase}assets/ggs-beauty-logo.png`}
            alt=""
            aria-hidden="true"
            className="h-auto w-[13.5%] object-contain"
            draggable={false}
          />

          <p
            className="m-0 mt-[1.2%] font-sans font-semibold leading-none tracking-[0.025em] text-[#541431]"
            style={{ fontSize: '4.2cqw' }}
          >
            Grand Opening
          </p>

          <h1
            className="m-0 mt-[0.5%] font-sans font-semibold leading-[0.9] tracking-[0.025em] text-[#541431]"
            style={{ fontSize: '6.2cqw' }}
          >
            GGS Beauty
          </h1>
          <p
            className="m-0 mt-[0.8%] font-sans font-semibold leading-none tracking-[0.025em] text-[#64153d]"
            style={{ fontSize: '2.5cqw' }}
          >
            Grooming is better
          </p>
          <p
            className="m-0 mt-[0.65%] font-sans font-medium leading-none tracking-[0.12em] text-[#64153d]"
            style={{ fontSize: '1.6cqw' }}
          >
            Your style · your crown
          </p>
        </div>
      </main>
    </section>
  );
}

export default GgsBeautyPhotobooth;
