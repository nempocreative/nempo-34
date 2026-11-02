import { useEffect, useRef, useState } from 'react';
import { toCanvas } from 'html-to-image';
import { ArrowLeft, Download } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';
import './story.css';

const base = "/tion-feed/";
const backdrop = `${base}assets/tion-story-wedding-group-background-9x16-enhanced.jpg`;
const storyLogo = `${base}assets/tion-story-saduli-ragap-logo-text-solid-brown.png`;
const storyCanvasWidth = 1080;
const storyCanvasHeight = 1920;
const storyPixelRatio = 3;

function getStoryScale() {
  if (typeof window === 'undefined') return 1;
  return Math.max(
    0.56,
    Math.min(1, (window.innerWidth - 38) / 360, (window.innerHeight - 184) / 640),
  );
}

export default function StoryPage() {
  const posterRef = useRef<HTMLElement | null>(null);
  const [scale, setScale] = useState(getStoryScale);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  useEffect(() => {
    const resize = () => setScale(getStoryScale());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleDownload = async () => {
    const poster = posterRef.current;
    if (!poster || isDownloading) return;

    setIsDownloading(true);
    setDownloadError('');
    const originalTransform = poster.style.transform;
    try {
      await document.fonts.ready;
      await Promise.all(
        Array.from(poster.querySelectorAll('img')).map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve, reject) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => reject(new Error('An artwork image could not be loaded.')), {
                once: true,
              });
            });
          }
          if (!image.naturalWidth) throw new Error('An artwork image could not be loaded.');
          await image.decode();
        }),
      );
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      poster.style.transform = 'none';
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const canvas = await toCanvas(poster, {
        cacheBust: true,
        pixelRatio: storyPixelRatio,
        canvasWidth: storyCanvasWidth,
        canvasHeight: storyCanvasHeight,
        style: { boxShadow: 'none' },
      });
      poster.style.transform = originalTransform;
      if (
        canvas.width !== storyCanvasWidth * storyPixelRatio ||
        canvas.height !== storyCanvasHeight * storyPixelRatio
      ) {
        throw new Error('The exported image has an unexpected size.');
      }
      const link = document.createElement('a');
      link.download = 'tion-feed-story.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      poster.style.transform = originalTransform;
      console.error('Unable to export the Tion Feed story background.', error);
      setDownloadError('PNG belum berhasil dibuat. Periksa koneksi gambar, lalu coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="story-page">
      <div className="story-workspace">
        <header className="story-toolbar">
          <a className="story-back" href={base}>
            <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.8} />
            <span>Kembali ke Feed</span>
          </a>
          <div className="story-toolbar-note">
            <span className="story-live-dot" />
            SATU CERITA · JAWA BARAT
          </div>
        </header>

        <section className="story-stage-wrap" aria-label="Pratinjau Instagram Story">
          <div
            className="story-stage"
            style={{ width: 360 * scale, height: 640 * scale }}
          >
            <article
              className="story-poster"
              ref={posterRef}
              aria-label="Foto wedding dengan logo dan informasi kontak Saduli Ragap di bagian bawah untuk Instagram Story"
              style={{ transform: `scale(${scale})` }}
            >
              <img
                className="story-backdrop"
                src={backdrop}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <img
                className="story-logo"
                src={storyLogo}
                alt="Logo Saduli Ragap Entertainment"
                draggable={false}
              />
              <section className="story-event-details" aria-label="Informasi penampilan">
                <p className="story-event-title">Saduli Ragap · Live Performance</p>
                <p className="story-event-venue">Colaboraci Resto</p>
                <p className="story-event-date">Sabtu, 10 Oktober 2026</p>
              </section>
              <ul className="story-contact-list" aria-label="Kontak Saduli Ragap">
                <li
                  className="story-contact-item story-contact-item--instagram"
                  aria-label="Instagram @saduli.ragap"
                >
                  <FaInstagram aria-hidden="true" focusable="false" />
                  <span>@saduli.ragap</span>
                </li>
                <li
                  className="story-contact-item story-contact-item--tiktok"
                  aria-label="TikTok @saduli_ragap"
                >
                  <FaTiktok aria-hidden="true" focusable="false" />
                  <span>@saduli_ragap</span>
                </li>
                <li
                  className="story-contact-item story-contact-item--whatsapp"
                  aria-label="WhatsApp 082128028676"
                >
                  <FaWhatsapp aria-hidden="true" focusable="false" />
                  <span>082128028676</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <div className="story-controls">
          {downloadError && <p className="story-error" role="alert">{downloadError}</p>}
          <button
            className="story-download"
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-busy={isDownloading}
          >
            <Download aria-hidden="true" size={16} strokeWidth={2} />
            {isDownloading ? 'Menyiapkan PNG…' : 'Unduh Story PNG'}
          </button>
          <p className="story-export-note">
            {storyCanvasWidth * storyPixelRatio} × {storyCanvasHeight * storyPixelRatio} px · PNG {storyPixelRatio}×
          </p>
        </div>
      </div>
    </main>
  );
}
