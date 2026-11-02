import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Handshake,
  Instagram,
  MessageCircle,
  Radio,
  Target,
  Users,
} from "lucide-react";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./sponsorship.css";

const COLLABORATION_PATHS = [
  {
    number: "01",
    icon: BriefcaseBusiness,
    title: "Bantu acara brand Anda",
    description:
      "Punya launching, gathering, campaign, atau activation sendiri? Nempo membantu mengubah ide tersebut menjadi pengalaman yang lebih rapi, ramai, dan relevan.",
    bullets: [
      "Konsep dan alur pengalaman acara",
      "Publikasi ke audiens lokal Jawa Barat",
      "Talent, creator, dokumentasi, dan recap",
    ],
    cta: "Diskusikan acara saya",
  },
  {
    number: "02",
    icon: CalendarDays,
    title: "Ikut acara Nempo",
    description:
      "Brand Anda bisa hadir sebagai sponsor atau partner di acara yang kami selenggarakan—dengan format aktivasi yang disesuaikan dengan tujuan dan karakter brand.",
    bullets: [
      "Brand placement yang terasa natural",
      "Booth, sampling, dan product experience",
      "Hadiah, voucher, atau dukungan produk",
    ],
    cta: "Jadi partner acara Nempo",
  },
];

const SUPPORTS = [
  {
    icon: Target,
    title: "Strategi yang jelas",
    text: "Kami mulai dari tujuan brand, audiens yang ingin ditemui, dan pesan yang ingin dibawa.",
  },
  {
    icon: Users,
    title: "Akses ke komunitas",
    text: "Hubungkan brand dengan komunitas, kreator, pelaku lokal, dan audiens Jawa Barat yang relevan.",
  },
  {
    icon: Radio,
    title: "Aktivasi yang hidup",
    text: "Buat orang tidak hanya melihat logo, tetapi mengalami dan mengingat kehadiran brand Anda.",
  },
  {
    icon: BarChart3,
    title: "Dokumentasi dan laporan",
    text: "Rangkum eksekusi, konten, dan hasil kolaborasi agar mudah dievaluasi bersama.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Cerita kebutuhan Anda",
    text: "Bagikan brand, target, bentuk acara, atau ide aktivasi yang sedang Anda siapkan.",
  },
  {
    step: "02",
    title: "Susun format kolaborasi",
    text: "Kami bantu memilih peran, ruang aktivasi, timeline, dan kebutuhan yang paling masuk akal.",
  },
  {
    step: "03",
    title: "Jalankan bersama",
    text: "Tim Nempo ikut menyiapkan pengalaman, koordinasi, publikasi, dan eksekusi di lapangan.",
  },
  {
    step: "04",
    title: "Ukur dan kembangkan",
    text: "Setelah acara, kita lihat apa yang bekerja dan peluang kolaborasi berikutnya.",
  },
];

export default function SponsorshipPage() {
  return (
    <Layout>
      <SEO
        title="Kolaborasi Sponsorship Brand — Nempo Organizer"
        description="Ajak brand Anda berkolaborasi bersama Nempo Organizer untuk membantu acara brand Anda atau menjadi partner di acara Nempo."
        keywords="sponsorship brand Garut, kolaborasi brand Jawa Barat, partner acara Nempo, sponsorship event"
        path="/sponsorship"
      />

      <div className="sponsorship-page">
        <section className="sponsor-collab-hero" aria-labelledby="sponsor-page-title">
          <div className="sponsor-collab-hero-copy">
            <p className="sponsor-eyebrow">NEMPO ORGANIZER × BRAND</p>
            <h1 id="sponsor-page-title">
              Bawa cerita brand Anda lebih dekat.
            </h1>
            <p className="sponsor-collab-hero-lead">
              Nempo membantu brand membangun kolaborasi sponsorship yang terasa
              relevan—baik untuk acara yang Anda buat sendiri maupun acara yang
              kami selenggarakan.
            </p>
            <div className="sponsor-collab-hero-actions">
              <a
                href={NEMPO_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-button sponsor-button-primary"
              >
                Mulai ngobrol <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#pilihan-kolaborasi" className="sponsor-button sponsor-button-secondary">
                Lihat pilihan kolaborasi <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="sponsor-collab-hero-note">
              <Instagram className="h-4 w-4" aria-hidden="true" />
              <span>@nempo.id</span>
              <p>Diskusi awal melalui WhatsApp</p>
            </div>
          </div>

          <div className="sponsor-collab-hero-visual" aria-label="Ruang kolaborasi Nempo dan brand">
            <div className="sponsor-hero-graphic" aria-hidden="true">
              <span className="sponsor-hero-graphic-ring sponsor-hero-graphic-ring-one" />
              <span className="sponsor-hero-graphic-ring sponsor-hero-graphic-ring-two" />
              <span className="sponsor-hero-graphic-dot sponsor-hero-graphic-dot-one" />
              <span className="sponsor-hero-graphic-dot sponsor-hero-graphic-dot-two" />
              <Handshake className="sponsor-hero-graphic-icon" strokeWidth={1.3} />
            </div>
            <div className="sponsor-collab-hero-graphic-copy">
              <span className="sponsor-graphic-kicker">RUANG KOLABORASI</span>
              <strong>Tempat yang baik mempertemukan cerita.</strong>
              <p>Wisata, rasa, cafe, event, dan budaya lokal—semuanya punya ruang untuk brand Anda hadir dengan cara yang relevan.</p>
            </div>
            <div className="sponsor-collab-hero-graphic-meta">
              <span>01</span>
              <span>brand</span>
              <b>×</b>
              <span>komunitas</span>
              <b>×</b>
              <span>pengalaman</span>
            </div>
          </div>
        </section>

        <section className="sponsor-collab-ecosystem" aria-labelledby="sponsor-ecosystem-title">
          <div className="sponsor-collab-ecosystem-intro">
            <p className="sponsor-eyebrow">Ekosistem Nempo</p>
            <h2 id="sponsor-ecosystem-title">Bukan audiens yang lewat. Mereka sedang menjelajah.</h2>
            <p>
              Nempo hadir di ruang-ruang yang memang ingin dikunjungi orang:
              menemukan tempat, mencicipi rasa, menikmati waktu, dan mendengar cerita.
            </p>
          </div>
          <div className="sponsor-collab-ecosystem-list">
            {[
              ["01", "Wisata", "destinasi dan pengalaman lokal", "/wisata"],
              ["02", "Kuliner", "rasa yang dicari dan dibagikan", "/kuliner"],
              ["03", "Cafe", "ruang bertemu dan menghabiskan waktu", "/cafe"],
            ].map(([number, title, text, href]) => (
              <a key={title} href={href} className="sponsor-collab-ecosystem-item">
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <div className="sponsor-collab-ribbon" aria-label="Pilihan kolaborasi Nempo">
          <span>YOUR BRAND</span>
          <b>×</b>
          <span>YOUR EVENT</span>
          <b>×</b>
          <span>NEMPO EVENT</span>
          <em>Jawa Barat</em>
        </div>

        <section id="pilihan-kolaborasi" className="sponsor-collab-section">
          <div className="sponsor-section-heading">
            <div>
              <p className="sponsor-eyebrow">Dua arah kolaborasi</p>
              <h2>Satu tujuan: membuat brand lebih dekat dengan audiens.</h2>
            </div>
            <p>
              Tidak harus menunggu format yang sudah jadi. Ceritakan kebutuhan
              Anda, lalu kita susun bentuk partnership yang paling sesuai.
            </p>
          </div>

          <div className="sponsor-collab-path-grid">
            {COLLABORATION_PATHS.map((path) => {
              const PathIcon = path.icon;
              return (
                <article key={path.number} className="sponsor-collab-path">
                  <div className="sponsor-collab-path-top">
                    <span className="sponsor-collab-path-number">{path.number}</span>
                    <span className="sponsor-feature-icon" aria-hidden="true">
                      <PathIcon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  </div>
                  <h3>{path.title}</h3>
                  <p>{path.description}</p>
                  <ul>
                    {path.bullets.map((bullet) => (
                      <li key={bullet}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={NEMPO_CONSULT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sponsor-collab-path-link"
                  >
                    {path.cta} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sponsor-collab-support">
          <div className="sponsor-collab-support-intro">
            <p className="sponsor-eyebrow">Yang Nempo bantu</p>
            <h2>Bukan sekadar menaruh logo.</h2>
            <p>
              Kami membantu merancang titik temu yang masuk akal antara brand,
              acara, dan orang-orang yang ingin Anda ajak bicara.
            </p>
          </div>
          <div className="sponsor-collab-support-grid">
            {SUPPORTS.map((support) => {
              const SupportIcon = support.icon;
              return (
                <div key={support.title} className="sponsor-collab-support-card">
                  <span className="sponsor-feature-icon" aria-hidden="true">
                    <SupportIcon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <h3>{support.title}</h3>
                  <p>{support.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="sponsor-collab-workflow">
          <div className="sponsor-section-heading">
            <div>
              <p className="sponsor-eyebrow">Cara kerja</p>
              <h2>Mulai dari obrolan, tumbuh menjadi kolaborasi.</h2>
            </div>
            <p>
              Anda tidak perlu datang dengan proposal yang sudah sempurna.
              Kami bisa mulai dari brief singkat dan tujuan yang ingin dicapai.
            </p>
          </div>
          <div className="sponsor-collab-workflow-grid">
            {WORKFLOW.map((item) => (
              <div key={item.step} className="sponsor-collab-workflow-item">
                <span>{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sponsor-final-cta">
          <div className="sponsor-final-cta-mark" aria-hidden="true" />
          <div className="relative z-10">
            <p className="sponsor-eyebrow sponsor-eyebrow-light">Let&apos;s collaborate</p>
            <h2>
              Punya brand, acara, atau ide yang ingin diwujudkan bersama?
            </h2>
            <p>
              Ceritakan kebutuhan Anda. Tim Nempo akan membantu mencari bentuk
              sponsorship dan kolaborasi yang paling relevan.
            </p>
            <a
              href={NEMPO_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-button sponsor-button-light"
            >
              <MessageCircle className="h-4 w-4" /> Hubungi Tim Partnership
            </a>
            <small>
              Instagram DM · <span>@nempo.id</span>
            </small>
          </div>
        </section>

        <div className="sponsor-collab-footer-note">
          <Handshake className="h-4 w-4" /> Partnership Nempo Organizer · Jawa Barat
        </div>
      </div>
    </Layout>
  );
}