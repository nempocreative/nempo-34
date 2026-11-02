import { Printer, Scissors } from 'lucide-react';
import { useEffect, useState } from 'react';
import coverArtwork from '@/assets/generated_images/ggs-qcard-grand-opening-cover-center-dark.png';
import coverArtworkPrint300Dpi from '@/assets/generated_images/ggs-qcard-grand-opening-cover-print-300dpi.webp';

const assetBase = "/nempo-feed/";

function QCardArtwork({
  index,
  printing,
}: {
  index: number;
  printing: boolean;
}) {
  return (
    <article
      className="qcard-cover"
      aria-label={`GGS Beauty Grand Opening cover ${index}`}
    >
      <img
        src={printing ? coverArtworkPrint300Dpi : coverArtwork}
        alt="Tiga ilustrasi perempuan dengan gaya rambut pink khas GGS Beauty"
      />
      <div className="qcard-cover__title">
        <p className="qcard-cover__eyebrow">Grand Opening</p>
        <h2>GGS Beauty</h2>
        <span className="qcard-cover__rule" />
      </div>
      <img
        className="qcard-cover__brand-logo"
        src={`${assetBase}assets/ggs-beauty-logo.png`}
        alt="Logo GGS Beauty"
      />
      <div className="qcard-cover__seal" aria-hidden="true">
        <Scissors />
      </div>
    </article>
  );
}

export function GgsQCardCover() {
  const [printing, setPrinting] = useState(false);
  const [printPreparationError, setPrintPreparationError] = useState('');

  useEffect(() => {
    if (!printing) return;

    let cancelled = false;

    const prepareAndPrint = async () => {
      try {
        await document.fonts.ready;

        const printImages = Array.from(
          document.querySelectorAll<HTMLImageElement>('.qcard-page--printing img'),
        );

        await Promise.all(
          printImages.map(async (image) => {
            if (!image.complete) {
              await new Promise<void>((resolve, reject) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener(
                  'error',
                  () => reject(new Error(`Gagal memuat gambar Q Card: ${image.currentSrc || image.src}`)),
                  { once: true },
                );
              });
            }

            if (image.naturalWidth === 0) {
              throw new Error(`Gagal memuat gambar Q Card: ${image.currentSrc || image.src}`);
            }

            await image.decode();
          }),
        );

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (!cancelled) window.print();
      } catch (error) {
        console.error('Gagal menyiapkan Q Card GGS untuk PDF:', error);
        if (!cancelled) {
          setPrintPreparationError(
            'PDF belum bisa disiapkan karena ada gambar Q Card yang gagal dimuat.',
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
    const reset = () => setPrinting(false);
    window.addEventListener('afterprint', reset);
    return () => window.removeEventListener('afterprint', reset);
  }, []);

  return (
    <main className={`qcard-page${printing ? ' qcard-page--printing' : ''}`}>
      <header className="qcard-heading">
        <div className="qcard-heading__copy">
          <p className="qcard-kicker"><span /> GGS BEAUTY <span /> GARUT</p>
          <h1>Sampul Q Card MC</h1>
          <p className="qcard-description">
            Grand Opening · GGS Beauty · A4 dibagi 2
          </p>
        </div>
        <button
          type="button"
          className="qcard-print-button"
          onClick={() => {
            setPrintPreparationError('');
            setPrinting(true);
          }}
          aria-label="Cetak dua sampul Q Card pada satu kertas A4"
        >
          <Printer aria-hidden="true" />
          <span>Cetak A4 · 2 Q Card · 3×</span>
        </button>
      </header>

      {printPreparationError && (
        <p className="qcard-print-error" role="alert">
          {printPreparationError}
        </p>
      )}

      <section className="qcard-stage" aria-label="Pratinjau dua Q Card pada kertas A4">
        <div className="qcard-stage__caption">
          <span>2 SAMPUL Q CARD MC</span>
          <span>A4 · DIBAGI 2</span>
        </div>
        <div className="qcard-sheet" aria-label="Dua kartu, masing-masing setengah lembar A4">
          <QCardArtwork index={1} printing={printing} />
          <QCardArtwork index={2} printing={printing} />
        </div>
        <p className="qcard-stage__note">
          <span className="qcard-stage__dot" />
          Dua sampul penuh · Siap dipotong menjadi dua
        </p>
        <p className="qcard-stage__quality-note">
          Latar 300 DPI (3× ukuran layar), teks tetap vektor. Untuk PDF, pilih “Simpan sebagai PDF” pada dialog cetak.
        </p>
      </section>
    </main>
  );
}
