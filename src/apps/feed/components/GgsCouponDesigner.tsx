import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import ggsHairHeader from '@/assets/generated_images/ggs-beauty-double-braid-edge-connected-4x5-20261012.png';
import ggsCouponA3Full from '@/assets/generated_images/ggs-coupon-a3-full-300dpi.jpg';
import ggsCouponA3Last from '@/assets/generated_images/ggs-coupon-a3-last-300dpi.jpg';
import ggsCouponA4Full from '@/assets/generated_images/ggs-coupon-a4-full-300dpi.jpg';
import ggsCouponA4Last from '@/assets/generated_images/ggs-coupon-a4-last-300dpi.jpg';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const assetBase = "/nempo-feed/";
type PrintFormat = 'a4' | 'a3';

function CouponCard({
  number,
  backgroundFromSheet = false,
}: {
  number: string;
  backgroundFromSheet?: boolean;
}) {
  return (
    <article
      className={`ggs-coupon${backgroundFromSheet ? ' ggs-coupon--background-from-sheet' : ''}`}
      aria-label={`Voucher undian GGS Beauty nomor ${number}`}
    >
      <div className="ggs-coupon__frame">
        {!backgroundFromSheet && (
          <img
            className="ggs-coupon__hair-background"
            src={ggsHairHeader}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="ggs-coupon__veil" aria-hidden="true" />
        <header className="ggs-coupon__brand">
          <img
            src={`${assetBase}assets/ggs-beauty-logo.png`}
            alt="Logo GGS Beauty"
          />
          <span>GGS BEAUTY</span>
        </header>
        <span className="ggs-coupon__number">NO. {number}</span>
        <div className="ggs-coupon__content">
          <p className="ggs-coupon__eyebrow">UNDIAN SPESIAL · GGS BEAUTY</p>
          <h2>Voucher Undian</h2>
          <p className="ggs-coupon__benefit">Nomor undian khusus untukmu</p>
          <div className="ggs-coupon__name">
            <span>Nama:</span>
            <span
              className="ggs-coupon__name-space"
              aria-label="Ruang kosong untuk menulis nama dengan pulpen"
            />
          </div>
        </div>
        <footer className="ggs-coupon__contacts" aria-label="Kontak GGS Beauty">
          <a
            href="https://www.instagram.com/ggsbeauty.hair.co/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram GGS Beauty: @ggsbeauty.hair.co"
          >
            <FaInstagram aria-hidden="true" />
            <span>@ggsbeauty.hair.co</span>
          </a>
          <a
            href="https://wa.me/6282342777723"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp GGS Beauty: 0823 4277 7723"
          >
            <FaWhatsapp aria-hidden="true" />
            <span>0823 4277 7723</span>
          </a>
        </footer>
      </div>
    </article>
  );
}

function CouponPrintSheetBackground({
  format,
  couponsOnPage,
}: {
  format: PrintFormat;
  couponsOnPage: number;
}) {
  const background =
    format === 'a4'
      ? couponsOnPage === 8
        ? ggsCouponA4Full
        : ggsCouponA4Last
      : couponsOnPage === 21
        ? ggsCouponA3Full
        : ggsCouponA3Last;

  return (
    <img
      className="ggs-coupon-print-sheet-background"
      src={background}
      alt=""
      aria-hidden="true"
    />
  );
}

export function GgsCouponDesigner() {
  const [printFormat, setPrintFormat] = useState<PrintFormat | null>(null);
  const [printPreparationError, setPrintPreparationError] = useState('');
  const couponsPerPage = printFormat === 'a4' ? 8 : 21;
  const totalCoupons = 150;
  const pageCount = Math.ceil(totalCoupons / couponsPerPage);

  useEffect(() => {
    if (!printFormat) return;

    let cancelled = false;

    const prepareAndPrint = async () => {
      try {
        await document.fonts.ready;

        const printImages = Array.from(
          document.querySelectorAll<HTMLImageElement>('.ggs-coupon-print-sheet img'),
        );

        await Promise.all(
          printImages.map(async (image) => {
            if (!image.complete) {
              await new Promise<void>((resolve, reject) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener(
                  'error',
                  () => reject(new Error(`Gagal memuat gambar kupon: ${image.currentSrc || image.src}`)),
                  { once: true },
                );
              });
            }

            if (image.naturalWidth === 0) {
              throw new Error(`Gagal memuat gambar kupon: ${image.currentSrc || image.src}`);
            }

            await image.decode();
          }),
        );

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (!cancelled) window.print();
      } catch (error) {
        console.error('Gagal menyiapkan kupon GGS untuk PDF:', error);
        if (!cancelled) {
          setPrintPreparationError(
            'PDF belum bisa disiapkan karena ada gambar kupon yang gagal dimuat.',
          );
          setPrintFormat(null);
        }
      }
    };

    void prepareAndPrint();
    return () => {
      cancelled = true;
    };
  }, [printFormat]);

  useEffect(() => {
    const resetPrintFormat = () => setPrintFormat(null);
    window.addEventListener('afterprint', resetPrintFormat);
    return () => window.removeEventListener('afterprint', resetPrintFormat);
  }, []);

  return (
    <main className={`ggs-coupon-page${printFormat ? ` ggs-coupon-page--print-${printFormat}` : ''}`}>
      <div className="ggs-coupon-content">
        <header className="ggs-coupon-heading">
          <div>
            <p className="ggs-coupon-kicker">GGS BEAUTY · GARUT</p>
            <h1>Voucher Undian</h1>
          </div>
          <div className="ggs-print-actions" aria-label="Pilihan ukuran cetak">
            <button
              type="button"
              className="ggs-print-button ggs-print-button--secondary"
              onClick={() => {
                setPrintPreparationError('');
                setPrintFormat('a4');
              }}
            >
              <Printer aria-hidden="true" /> Cetak A4 · 8 kupon · 3×
            </button>
            <button
              type="button"
              className="ggs-print-button"
              onClick={() => {
                setPrintPreparationError('');
                setPrintFormat('a3');
              }}
            >
              <Printer aria-hidden="true" /> Cetak A3 · 21 kupon · 3×
            </button>
          </div>
        </header>
        {printPreparationError && (
          <p className="ggs-print-error" role="alert">
            {printPreparationError}
          </p>
        )}
        <p className="ggs-print-quality-note">
          Latar foto disiapkan pada 300 DPI (3× ukuran layar) dan teks tetap vektor. Untuk PDF, pilih “Simpan sebagai PDF” pada dialog cetak.
        </p>

        <section className="ggs-coupon-preview" aria-label="Pratinjau kupon">
          <div className="ggs-preview-topline">
            <span>PRATINJAU</span>
            <span>85 × 55 MM</span>
          </div>
          <CouponCard number="001" />
        </section>
      </div>

      {Array.from({ length: pageCount }, (_, pageIndex) => {
        const firstVoucherNumber = pageIndex * couponsPerPage + 1;
        const vouchersOnPage = Math.min(
          couponsPerPage,
          totalCoupons - pageIndex * couponsPerPage,
        );
        const lastVoucherNumber = firstVoucherNumber + vouchersOnPage - 1;

        return (
          <section
            key={`${printFormat ?? 'default'}-${pageIndex}`}
            className="ggs-coupon-print-sheet"
            aria-label={`Lembar ${pageIndex + 1} dari ${pageCount}, voucher ${String(firstVoucherNumber).padStart(3, '0')} sampai ${String(lastVoucherNumber).padStart(3, '0')}`}
          >
            <CouponPrintSheetBackground
              format={printFormat ?? 'a3'}
              couponsOnPage={vouchersOnPage}
            />
            {Array.from({ length: vouchersOnPage }, (_, index) => (
              <CouponCard
                key={firstVoucherNumber + index}
                number={String(firstVoucherNumber + index).padStart(3, '0')}
                backgroundFromSheet
              />
            ))}
          </section>
        );
      })}
    </main>
  );
}
