import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SLIDE_COUNT = 16;

export default function NempoKenalanPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [slide, setSlide] = useState(1);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;

      if (event.data?.type === 'advanceSlide') {
        setSlide((current) => Math.min(SLIDE_COUNT, current + 1));
      } else if (event.data?.type === 'retreatSlide') {
        setSlide((current) => Math.max(1, current - 1));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'navigateToSlide', position: slide },
      '*',
    );
  }, [slide]);

  const navigate = (position: number) => {
    setSlide(Math.max(1, Math.min(SLIDE_COUNT, position)));
  };

  const base = "/nempo-mou/";

  return (
    <main className="kenalan-workspace">
      <div className="kenalan-toolbar">
        <div>
          <p className="eyebrow">Presentasi Nempo</p>
          <h1>Kenalan dengan Nempo</h1>
        </div>
        <p className="kenalan-counter" aria-live="polite">
          Slide {slide} dari {SLIDE_COUNT}
        </p>
      </div>

      <div className="kenalan-frame-wrap">
        <iframe
          ref={frameRef}
          className="kenalan-frame"
          src={`${base}kenalan/slide1`}
          title="Presentasi layanan Nempo"
          allowFullScreen
          onLoad={() => {
            frameRef.current?.contentWindow?.postMessage(
              { type: 'navigateToSlide', position: slide },
              '*',
            );
          }}
        />
      </div>

      <div className="kenalan-controls" aria-label="Navigasi slide">
        <button
          type="button"
          className="button"
          onClick={() => navigate(slide - 1)}
          disabled={slide === 1}
        >
          <ArrowLeft size={15} />
          <span>Sebelumnya</span>
        </button>
        <span className="kenalan-hint">Klik slide atau gunakan tombol panah</span>
        <button
          type="button"
          className="button primary"
          onClick={() => navigate(slide + 1)}
          disabled={slide === SLIDE_COUNT}
        >
          <span>Berikutnya</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </main>
  );
}
