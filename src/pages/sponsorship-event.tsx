import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "@/lib/wouter";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./sponsorship-event.css";

type EventDetail = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  lead: string;
  description: string;
  image: string;
  logo?: string;
  logoVideo?: string;
  previewVideo?: string;
  previewPoster?: string;
  format: string;
  audience: string;
  setting: string;
  activations: { title: string; text: string }[];
  brandSpaces: { label: string; title: string; text: string }[];
};

const EVENT_DETAILS: Record<string, EventDetail> = {
  halloween: {
    slug: "halloween",
    number: "01",
    eyebrow: "KALA MUDA × NEMPO ORGANIZER",
    title: "MIDNIGHT MYSTERY",
    lead: "The Musical Theatre of Halloween — malam immersive dengan musical theater, live entertainment, costume experience, interactive games, dan social gathering.",
    description: "Midnight Mystery 2026 membawa pengunjung masuk ke sebuah cerita misteri di cafe partner Garut. Brand tidak hanya tampil sebagai logo, tetapi ikut menjadi bagian dari pengalaman yang ingin dimainkan dan dibagikan.",
    image: "images/sponsor/midnight-mystery-background.webp",
    logo: "images/sponsor/midnight-mystery-logo.webp",
    logoVideo: "videos/sponsor/midnight-mystery-logo-h264.mp4",
    previewVideo: "videos/sponsor/midnight-mystery-pitch-deck.mp4",
    previewPoster: "images/sponsor/midnight-mystery-pitch-deck-poster.png",
    format: "Musical mystery experience",
    audience: "Usia 16–30 · 150–250 orang",
    setting: "31 Okt 2026 · Garut",
    activations: [
      { title: "Musical theater", text: "The Mystery at Midnight menjadi main attraction melalui acting, singing, dance, music, lighting, dan sound effect." },
      { title: "Costume & mystery game", text: "Pengunjung datang dengan kostum, mencari clue, dan menebak identitas Mystery Guest." },
      { title: "Activation & doorprize", text: "Hadirkan sampling, giveaway, booth, product placement, atau hadiah yang menyatu dengan cerita malam." },
    ],
    brandSpaces: [
      { label: "01", title: "Supporting · Rp1 Juta", text: "Logo digital, media partner, Instagram Story mention, MC mention, dan peluang doorprize." },
      { label: "02", title: "Official · Rp2,5 Juta", text: "Benefit Supporting ditambah backdrop, venue branding, sampling, booth, dan 2 tiket." },
      { label: "03", title: "Main · Rp5 Juta", text: "Logo utama, dedicated Story, integrasi event, doorprize, dokumentasi, dan 5 tiket." },
    ],
  },
  "tour-cafe": {
    slug: "tour-cafe",
    number: "03",
    eyebrow: "NEMPO WEEKEND SERIES",
    title: "Tour Cafe Music Theme.",
    lead: "Perjalanan rasa, musik, dan suasana yang membuat brand terasa lebih dekat dari satu tempat ke tempat berikutnya.",
    description: "Sebuah rangkaian cafe hopping dengan tema musik, discovery lokal, dan momen intimate yang memberi ruang bagi brand untuk hadir secara natural.",
    image: "images/hero/kolaborasi.webp",
    format: "Lifestyle music tour",
    audience: "Lifestyle & music lovers",
    setting: "Cafe partners / Garut",
    activations: [
      { title: "Product placement natural", text: "Produk hadir di meja, menu, atau momen yang memang sedang dinikmati audience." },
      { title: "Acoustic set & content", text: "Buat sesi musik kecil yang menghasilkan suasana, foto, dan video organik." },
      { title: "Cafe hopping", text: "Bawa komunitas menjelajahi beberapa tempat sekaligus dalam satu cerita akhir pekan." },
    ],
    brandSpaces: [
      { label: "01", title: "Journey Partner", text: "Brand hadir sebagai teman perjalanan dari satu cafe ke cafe berikutnya." },
      { label: "02", title: "Music Partner", text: "Dukung acoustic set dan momen yang membuat suasana terasa lebih dekat." },
      { label: "03", title: "Taste Partner", text: "Hadir melalui produk, voucher, atau pengalaman rasa yang relevan." },
    ],
  },
};

function startVideoPlayback(video: HTMLVideoElement | null) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  void video.play().catch(() => undefined);
}

function assetUrl(path: string): string {
  return path.startsWith("/") ? path : `${import.meta.env.BASE_URL}${path}`;
}

export default function SponsorshipEventPage() {
  const [location] = useLocation();
  const key = location.includes("tour-cafe") ? "tour-cafe" : "halloween";
  const event = EVENT_DETAILS[key];

  return (
    <Layout>
      <SEO title={`${event.title} — Nempo Sponsorship`} noIndex />
      <main className="sponsor-event-page mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        <a href="/sponsorship" className="sponsor-event-back">
          <ArrowLeft className="h-4 w-4" /> Kembali ke sponsorship
        </a>

        {event.slug === "halloween" && (
          <section className="sponsor-event-video" aria-labelledby="halloween-video-title">
            <div className="sponsor-event-video-copy">
              <p className="sponsor-event-eyebrow sponsor-event-eyebrow-light">KALA MUDA × NEMPO ORGANIZER</p>
              <h2 id="halloween-video-title">Midnight<br /><span>Mystery</span></h2>
              <p>
                {event.lead}
              </p>
              <a href="/sponsorship/halloween/proposal" className="sponsor-event-button sponsor-event-button-primary">
                Lihat pitch deck <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="sponsor-event-video-frame">
              <video
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="auto"
                poster={assetUrl(event.previewPoster ?? event.image)}
                ref={startVideoPlayback}
                onLoadedMetadata={(event) => startVideoPlayback(event.currentTarget)}
                onLoadedData={(event) => startVideoPlayback(event.currentTarget)}
                onCanPlay={(event) => startVideoPlayback(event.currentTarget)}
                aria-label="Cuplikan pitch deck Midnight Mystery"
              >
                <source
                  src={assetUrl(event.previewVideo ?? event.logoVideo ?? "videos/sponsor/midnight-mystery-logo-preview.mp4")}
                  type="video/mp4"
                />
                Browser Anda tidak mendukung pemutaran video.
              </video>
            </div>
          </section>
        )}

        <div className="sponsor-event-facts">
          <div><span>Format</span><strong>{event.format}</strong></div>
          <div><span>Audience</span><strong>{event.audience}</strong></div>
          <div><span>Lokasi acara</span><strong>{event.setting}</strong></div>
        </div>

        <section className="sponsor-event-intro">
          <div>
            <p className="sponsor-event-eyebrow">The idea</p>
            <h2>Satu malam.<br /><span>Satu cerita.</span></h2>
          </div>
          <p>{event.description}</p>
        </section>

        <section id="peluang-brand" className="sponsor-event-section">
          <div className="sponsor-event-section-heading">
            <div>
              <p className="sponsor-event-eyebrow">Activation menu</p>
              <h2>Ruang yang bisa<br />brand Anda miliki.</h2>
            </div>
            <p>Kolaborasi dirancang berdasarkan karakter event, target audience, dan peran brand yang ingin dibangun.</p>
          </div>
          <div className="sponsor-event-activation-grid">
            {event.activations.map((activation, index) => (
              <article key={activation.title}>
                <span>0{index + 1}</span>
                <h3>{activation.title}</h3>
                <p>{activation.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sponsor-event-brand-section">
          <div className="sponsor-event-section-heading">
            <div>
              <p className="sponsor-event-eyebrow">Partnership roles</p>
              <h2>Pilih cara brand<br />Anda hadir.</h2>
            </div>
            <p>Tidak harus selalu menjadi logo terbesar. Yang penting, brand hadir di momen yang tepat.</p>
          </div>
          <div className="sponsor-event-brand-grid">
            {event.brandSpaces.map(space => (
              <article key={space.label}>
                <span>{space.label}</span>
                <h3>{space.title}</h3>
                <p>{space.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sponsor-event-cta">
          <p className="sponsor-event-eyebrow sponsor-event-eyebrow-light">Let&apos;s make it memorable</p>
          <h2>Punya brand yang cocok<br />untuk event ini?</h2>
          <p>Ceritakan target dan kebutuhan Anda. Tim Nempo akan bantu menyusun bentuk kolaborasi yang paling relevan.</p>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="sponsor-event-button sponsor-event-button-light">
            <MessageCircle className="h-4 w-4" /> Hubungi Tim Partnership
          </a>
        </section>
      </main>
    </Layout>
  );
}