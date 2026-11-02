import { useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, MouseEvent } from 'react';
import { Download, Pause, Play, RotateCcw, VolumeX } from 'lucide-react';
import './bumper.css';

const bumperPoster = `${"/tion-feed/"}assets/ngopi-santai-episode-01-bumper-poster.jpg?v=phrases-no-label`;
const bumperVideo = `${"/tion-feed/"}assets/ngopi-santai-episode-01-bumper.mp4?v=phrases-no-label`;
const initialDuration = 18.9;

const bumperBeats = [
  { at: 0, label: 'Suasana pembuka', detail: 'Latar kafe dan judul episode', motion: 'Latar tampil lebih dulu' },
  { at: 1.05, label: 'Duduk dulu.', detail: 'Frasa 01 / 05', motion: 'Fade 0,5 dtk · tanpa geser' },
  { at: 2.89, label: 'Ngobrol yuk.', detail: 'Frasa 02 / 05', motion: 'Potong bersih · tanpa bayangan' },
  { at: 5.08, label: 'Santai saja.', detail: 'Frasa 03 / 05', motion: 'Potong bersih · tanpa bayangan' },
  { at: 7.26, label: 'Biar akrab.', detail: 'Frasa 04 / 05', motion: 'Potong bersih · tanpa bayangan' },
  { at: 9.45, label: 'Lanjut ngopi.', detail: 'Frasa 05 / 05', motion: 'Potong bersih · tanpa bayangan' },
  { at: 11.64, label: 'Logo Nasution Boy', detail: 'Wordmark putih yang sama seperti slide 11', motion: 'Fade 0,6 dtk · tanpa geser' },
  { at: 14.53, label: 'IG narasumber', detail: 'Tiga akun + tagline penutup', motion: 'Fade 0,7 dtk · tanpa geser' },
];

function formatTime(secondsValue: number) {
  const seconds = Math.floor(secondsValue);
  return `0:${String(seconds).padStart(2, '0')}`;
}

function formatCueTime(secondsValue: number) {
  const deciseconds = Math.round(secondsValue * 10);
  const wholeSeconds = Math.floor(deciseconds / 10);
  const tenths = deciseconds % 10;
  return `00:${String(wholeSeconds).padStart(2, '0')}.${tenths}`;
}

export default function BumperPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [playError, setPlayError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;
  const activeBeatIndex = bumperBeats.reduce(
    (activeIndex, beat, index) => (elapsed >= beat.at ? index : activeIndex),
    0,
  );

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    setPlayError('');
    try {
      await video.play();
    } catch {
      setPlayError('Video belum bisa diputar. Coba tekan putar sekali lagi.');
    }
  };

  const pause = () => videoRef.current?.pause();

  const replay = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setElapsed(0);
    await play();
  };

  const downloadBumper = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (downloading) return;
    setDownloading(true);
    setDownloadError('');

    try {
      const response = await fetch(bumperVideo, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Download returned ${response.status}`);
      const videoBlob = await response.blob();
      if (videoBlob.size === 0) throw new Error('The video file is empty');

      const objectUrl = URL.createObjectURL(videoBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = 'ngopi-santai-episode-01-bumper.mp4';
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch {
      setDownloadError('Unduhan tidak dapat dimulai. Coba buka video langsung:');
    } finally {
      setDownloading(false);
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const next = (Number(event.target.value) / 100) * duration;
    if (videoRef.current) videoRef.current.currentTime = next;
    setElapsed(next);
  };

  return (
    <main className="bumper-page">
      <div className="bumper-shell">
        <header className="bumper-topbar">
          <a className="bumper-wordmark" href={`${"/tion-feed/"}`} aria-label="Tion Feed home">
            <span className="bumper-wordmark__mark">t.</span>
            <span>tion feed</span>
          </a>
          <div className="bumper-location">
            <span className="bumper-location__dot" />
            <span>STUDIO / VIDEO BUMPER</span>
          </div>
          <p className="bumper-topbar__edition">NGOPI SANTAI · EPISODE 01</p>
        </header>

        <section className="bumper-workspace" aria-labelledby="bumper-heading">
          <div className="bumper-intro">
            <p className="bumper-kicker"><span>01</span> &nbsp; AWAL OBROLAN</p>
            <h1 id="bumper-heading">Duduk dulu.<br /><em>Ngobrol yuk.</em></h1>
            <p className="bumper-intro__copy">
              Lima frasa berganti halus, disusul logo Nasution Boy di tengah, lalu IG narasumber.
            </p>
            <section className="bumper-flow" aria-label="Urutan video bumper">
              <p className="bumper-flow__title">URUTAN TRANSISI BUMPER</p>
              <p className="bumper-flow__note">Pilih titik untuk lompat ke bagian itu. Waktu menunjukkan elemen mulai masuk.</p>
              <ol>
                {bumperBeats.map((beat, index) => (
                  <li
                    key={beat.label}
                    className={activeBeatIndex === index ? 'is-active' : ''}
                    aria-current={activeBeatIndex === index ? 'step' : undefined}
                  >
                    <button
                      className="bumper-flow__jump"
                      type="button"
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime = beat.at;
                        setElapsed(beat.at);
                      }}
                      aria-label={`Lompat ke ${beat.label}, ${formatCueTime(beat.at)}`}
                    >
                      <span className="bumper-flow__index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="bumper-flow__body">
                        <span className="bumper-flow__time">{formatCueTime(beat.at)}</span>
                        <strong>{beat.label}</strong>
                        <small>{beat.detail} · {beat.motion}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
            <div className="bumper-speakers" aria-label="Instagram narasumber">
              <p className="bumper-speakers__label">IG NARASUMBER</p>
              <p>@_obyputradiningrat</p>
              <p>@mzy_riyadh</p>
              <p>@nasutionboy</p>
            </div>
            <div className="bumper-episode-note">
              <span className="bumper-episode-note__rule" />
              <span>PODCAST NGOPI SANTAI · EPISODE 01</span>
            </div>
          </div>

          <div className="bumper-preview-column">
            <div className="bumper-preview-frame">
              <video
                ref={videoRef}
                className="bumper-artwork"
                src={bumperVideo}
                poster={bumperPoster}
                playsInline
                preload="metadata"
                aria-label="Video bumper Ngopi Santai episode 1, format lanskap 16:9"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => {
                  const videoDuration = event.currentTarget.duration;
                  if (Number.isFinite(videoDuration)) setDuration(videoDuration);
                }}
              >
                Browser tidak mendukung pemutaran video ini.
              </video>
              <div className="bumper-frame-caption">
                <span><i /> PRATINJAU VIDEO</span>
                 <span>FULL HD 1080P · 16:9 · LANSKAP · 18,9 DETIK</span>
              </div>
            </div>

            <section className="bumper-player" aria-label="Kontrol pemutaran video">
              <div className="bumper-player__controls">
                <button
                  className="bumper-control bumper-control--primary"
                  type="button"
                  onClick={playing ? pause : play}
                  aria-label={playing ? 'Jeda video' : 'Putar video'}
                >
                  {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
                </button>
                <button
                  className="bumper-control bumper-control--replay"
                  type="button"
                  onClick={replay}
                  aria-label="Putar ulang dari awal"
                >
                  <RotateCcw size={18} />
                </button>
                <div className="bumper-timeline">
                  <div className="bumper-timeline__time">
                    <span>{formatTime(elapsed)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="bumper-timeline__track">
                    <div className="bumper-timeline__fill" style={{ transform: `scaleX(${progress})` }} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress * 100}
                      onChange={seek}
                      aria-label="Geser posisi video"
                      style={{ '--seek-progress': `${progress * 100}%` } as CSSProperties}
                    />
                  </div>
                </div>
                <span className="bumper-volume" aria-label="Video ini belum memiliki audio">
                  <VolumeX size={17} />
                  <span>TANPA AUDIO</span>
                </span>
                <a
                  className="bumper-download"
                  href={bumperVideo}
                  download="ngopi-santai-episode-01-bumper.mp4"
                  onClick={downloadBumper}
                  aria-busy={downloading}
                  aria-label={downloading ? 'Menyiapkan unduhan bumper' : 'Unduh video bumper Ngopi Santai episode 1 dalam format MP4 Full HD 1080p'}
                >
                  <Download size={16} aria-hidden="true" />
                  <span>{downloading ? 'Menyiapkan…' : 'Unduh MP4'}</span>
                </a>
              </div>
              {playError && <p className="bumper-player__error" role="alert">{playError}</p>}
              {downloadError && (
                <p className="bumper-player__error" role="alert">
                  {downloadError}{' '}
                  <a href={bumperVideo} target="_blank" rel="noreferrer">Buka video MP4</a>
                </p>
              )}
              <p className="bumper-player__hint">
                {playing ? 'Obrolannya mulai…' : elapsed >= duration ? 'Pembuka selesai. Putar lagi?' : 'Tekan putar kalau sudah siap.'}
              </p>
            </section>
          </div>
        </section>

        <footer className="bumper-footer">
          <span>PEMBUKA MENJELANG SENJA</span>
          <span>SANTAI SAJA <i>↗</i></span>
        </footer>
      </div>
    </main>
  );
}
