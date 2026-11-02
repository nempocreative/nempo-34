import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { useEffect, useState, type FormEvent, type TouchEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Instagram,
  MapPin,
  Music2,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";
import "./nempo-cultural-tour.css";

type HeroBanner = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  btn_text?: string;
  link?: string;
  image?: string;
  accent?: string;
  sort_order?: number;
  active?: boolean;
};

type CulturalEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  example: true;
};

type GuestCategory = {
  id: string;
  title: string;
  detail: string;
};

type RundownItem = {
  time: string;
  title: string;
  detail: string;
};

type UmkmCategory = {
  id: string;
  title: string;
  detail: string;
};

const sampleEvents: CulturalEvent[] = [
  {
    id: "rasa-lokal",
    title: "Weekend Cultural & UMKM Experience — Rasa Lokal",
    date: "Sabtu, 28 November 2026",
    location: "Alun-Alun Garut",
    description:
      "Contoh gambaran akhir pekan yang mempertemukan pertunjukan seni budaya, bazar UMKM, kuliner lokal, musik, dan aktivitas komunitas dalam satu ruang publik.",
    example: true,
  },
];

const exampleGuests: GuestCategory[] = [
  {
    id: "budaya",
    title: "Penampil budaya lokal",
    detail: "Contoh kategori pengisi acara; nama dan keikutsertaan belum dikonfirmasi.",
  },
  {
    id: "akustik",
    title: "Musisi akustik",
    detail: "Contoh kategori pengisi acara; nama dan keikutsertaan belum dikonfirmasi.",
  },
];

const exampleRundown: RundownItem[] = [
  { time: "08.00–10.00", title: "Persiapan tenant dan area acara", detail: "Penataan area dan persiapan tenant." },
  { time: "10.00–12.00", title: "UMKM market dan aktivitas pengunjung", detail: "Waktu untuk menjelajahi bazar dan aktivitas pengunjung." },
  { time: "13.00–15.00", title: "Workshop, demo produk, dan komunitas", detail: "Sesi berbagi, demonstrasi produk, dan kegiatan komunitas." },
  { time: "15.00–17.00", title: "Pertunjukan budaya dan musik", detail: "Contoh rentang waktu pertunjukan seni dan musik." },
  { time: "17.00–20.00", title: "Kuliner, hiburan, dan penampilan utama", detail: "Contoh penutup hari dengan kuliner dan hiburan." },
];

const exampleUmkm: UmkmCategory[] = [
  { id: "makanan", title: "Makanan", detail: "Contoh kategori tenant." },
  { id: "minuman", title: "Minuman & kopi", detail: "Contoh kategori tenant." },
  { id: "karya", title: "Kerajinan & produk lokal", detail: "Contoh kategori tenant." },
];

export default function NempoCulturalTourPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [tenantDraft, setTenantDraft] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setBannerLoading(true);
    setBannerError(false);
    fetch("/api/banners", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Banner request failed");
        return response.json() as Promise<HeroBanner[]>;
      })
      .then((data) => {
        const active = (Array.isArray(data) ? data : [])
          .filter((banner) => banner.active !== false)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setBanners(active);
        setActiveSlide(0);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setBannerError(true);
      })
      .finally(() => setBannerLoading(false));
    return () => controller.abort();
  }, [retryKey]);

  useEffect(() => {
    if (banners.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % banners.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  function moveSlide(direction: -1 | 1) {
    setActiveSlide((current) => (current + direction + banners.length) % banners.length);
  }

  function prepareTenantApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usaha = String(formData.get("usaha") || "").trim();
    const penanggungJawab = String(formData.get("penanggung-jawab") || "").trim();
    const kategori = String(formData.get("kategori") || "").trim();
    const produk = String(formData.get("produk") || "").trim();
    const instagram = String(formData.get("instagram") || "").trim();

    setTenantDraft(
      [
        "Halo Nempo, saya ingin mendaftar sebagai tenant Nempo Cultural Tour.",
        "",
        `Nama usaha: ${usaha}`,
        `Nama penanggung jawab: ${penanggungJawab}`,
        `Kategori: ${kategori}`,
        `Produk yang ditawarkan: ${produk}`,
        `Instagram usaha: ${instagram || "Belum ada"}`,
      ].join("\n"),
    );
    setCopyStatus("idle");
    window.setTimeout(() => {
      document.getElementById("hasil-daftar-tenant")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  async function copyTenantApplication() {
    try {
      await navigator.clipboard.writeText(tenantDraft);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("manual");
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;
    const difference = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    if (Math.abs(difference) > 45 && banners.length > 1) moveSlide(difference < 0 ? 1 : -1);
    setTouchStartX(null);
  }

  const eventList: CulturalEvent[] = sampleEvents;
  const guestList: GuestCategory[] = exampleGuests;
  const rundown: RundownItem[] = exampleRundown;
  const umkmList: UmkmCategory[] = exampleUmkm;

  return (
    <Layout>
      <SEO
        title="Nempo Cultural Tour — Weekend Cultural & UMKM Experience"
        description="Ruang akhir pekan di Garut untuk seni budaya, bazar UMKM, kuliner lokal, musik, dan aktivitas komunitas."
        keywords="Nempo Cultural Tour, UMKM Garut, budaya Garut, kuliner lokal, kegiatan akhir pekan Garut"
        path="/cultural-tour"
      />

      <main className="nct-page">
        <section className="nct-promos" aria-label="Pilihan Nempo">
          <div className="nct-promo-wrap">
            {bannerLoading ? (
              <div className="nct-promo-skeleton" aria-label="Memuat banner pilihan Nempo" />
            ) : bannerError ? (
              <div className="nct-promo-message" role="status">
                <p>Banner pilihan Nempo belum dapat dimuat.</p>
                <button type="button" onClick={() => setRetryKey((key) => key + 1)}>Coba lagi</button>
              </div>
            ) : banners.length > 0 ? (
              <>
                <div
                  className="nct-promo-track"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  aria-roledescription="carousel"
                >
                  {banners.map((banner, index) => {
                    const isCurrent = index === activeSlide;
                    const href = banner.link || "#cerita";
                    return (
                      <article
                        className={`nct-promo-slide${isCurrent ? " is-active" : ""}`}
                        key={banner.id}
                        aria-hidden={!isCurrent}
                        aria-roledescription="slide"
                        aria-label={`${index + 1} dari ${banners.length}`}
                        style={{
                          backgroundImage: banner.image ? `linear-gradient(90deg, rgba(7,18,35,.86), rgba(7,18,35,.48) 52%, rgba(7,18,35,.08)), url("${banner.image}")` : undefined,
                        }}
                      >
                        <div className="nct-promo-topline">
                          <span className="nct-promo-brand">NEMPO <i>pilihan</i></span>
                          {banner.category && <span className="nct-promo-category">{banner.category}</span>}
                        </div>
                        <div className="nct-promo-copy">
                          {banner.subtitle && <p className="nct-promo-subtitle">{banner.subtitle}</p>}
                          <h1>{banner.title}</h1>
                          {banner.description && <p className="nct-promo-description">{banner.description}</p>}
                          <a href={href} className="nct-promo-cta">
                            {banner.btn_text || "Lihat selengkapnya"} <ArrowRight size={16} aria-hidden="true" />
                          </a>
                        </div>
                        {banner.accent && <span className="nct-promo-accent" style={{ backgroundColor: banner.accent }} aria-hidden="true" />}
                      </article>
                    );
                  })}
                  {banners.length > 1 && (
                    <div className="nct-promo-arrows">
                      <button type="button" onClick={() => moveSlide(-1)} aria-label="Banner sebelumnya"><ArrowLeft size={18} /></button>
                      <button type="button" onClick={() => moveSlide(1)} aria-label="Banner berikutnya"><ArrowRight size={18} /></button>
                    </div>
                  )}
                </div>
                {banners.length > 1 && (
                  <div className="nct-promo-dots" aria-label="Pilih banner">
                    {banners.map((banner, index) => (
                      <button
                        key={banner.id}
                        type="button"
                        aria-label={`Tampilkan banner ${index + 1}`}
                        aria-current={index === activeSlide}
                        onClick={() => setActiveSlide(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>

        <section id="cerita" className="nct-intro" aria-labelledby="nct-intro-title">
          <div className="nct-intro-side">
            <span className="nct-brand-mark">N</span>
            <span className="nct-side-label">Garut, Jawa Barat</span>
          </div>
          <div className="nct-intro-copy">
            <p className="nct-kicker">Nempo Cultural Tour</p>
            <h2 id="nct-intro-title">Akhir pekan yang mempertemukan <em>banyak cerita.</em></h2>
            <p className="nct-intro-body">
              Nempo Cultural Tour merupakan kegiatan akhir pekan yang menghadirkan ruang berkumpul bagi masyarakat melalui pertunjukan seni budaya, bazar UMKM, kuliner lokal, musik, dan aktivitas komunitas. Program ini dirancang untuk menghidupkan ruang publik, memperluas pasar UMKM, memberikan panggung bagi seniman lokal, serta menghadirkan alternatif kegiatan akhir pekan bagi masyarakat Garut.
            </p>
            <a href="#agenda" className="nct-text-link">Lihat contoh agenda <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="nct-intro-art" aria-hidden="true">
            <span className="nct-art-ring ring-a" />
            <span className="nct-art-ring ring-b" />
            <span className="nct-art-sun" />
            <span className="nct-art-type">RASA<br />LOKAL</span>
            <span className="nct-art-caption">BERTEMU · BERBAGI · MERAYAKAN</span>
          </div>
        </section>

        {eventList.length > 0 && (
          <section id="agenda" className="nct-event-section" aria-labelledby="nct-event-heading">
            <div className="nct-section-heading">
              <div>
                <p className="nct-kicker">Agenda akhir pekan</p>
                <h2 id="nct-event-heading">Contoh acara<br /><em>terdekat.</em></h2>
              </div>
              <p className="nct-section-note">Semua detail di bawah adalah contoh konsep, bukan pengumuman acara.</p>
            </div>
            <div className="nct-event-list">
              {eventList.map((event) => (
                <article className="nct-event-card" key={event.id}>
                  <div className="nct-event-art" aria-hidden="true">
                    <span>CONTOH</span>
                    <strong>RASA<br />LOKAL</strong>
                    <i />
                  </div>
                  <div className="nct-event-info">
                    <span className="nct-example-label">Contoh — belum dikonfirmasi</span>
                    <h3>{event.title}</h3>
                    <div className="nct-event-meta">
                      <span><CalendarDays size={17} aria-hidden="true" /> {event.date} <b>(contoh, belum dikonfirmasi)</b></span>
                      <span><MapPin size={17} aria-hidden="true" /> {event.location} <b>(contoh, belum dikonfirmasi)</b></span>
                    </div>
                    <p>{event.description}</p>
                    <span className="nct-event-disclaimer">Tanggal, lokasi, dan penyelenggaraan belum dikonfirmasi.</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {eventList.length > 0 && guestList.length > 0 && (
          <section className="nct-guests" aria-labelledby="nct-guests-heading">
            <div className="nct-guests-intro">
              <p className="nct-kicker">Panggung terbuka</p>
              <h2 id="nct-guests-heading">Cerita budaya,<br /><em>dibawa bersama.</em></h2>
              <p>Contoh kategori pengisi acara. Belum ada penampil atau partisipasi yang dikonfirmasi.</p>
            </div>
            <div className="nct-guest-list">
              {guestList.map((guest) => (
                <article className="nct-guest-item" key={guest.id}>
                  <span className="nct-guest-icon"><Music2 size={21} aria-hidden="true" /></span>
                  <div><h3>{guest.title}</h3><p>{guest.detail}</p></div>
                  <UsersRound size={19} aria-hidden="true" />
                </article>
              ))}
            </div>
          </section>
        )}

        {eventList.length > 0 && rundown.length > 0 && (
          <section className="nct-rundown" aria-labelledby="nct-rundown-heading">
            <div className="nct-rundown-head">
              <div>
                <p className="nct-kicker">Contoh rundown</p>
                <h2 id="nct-rundown-heading">Satu hari,<br /><em>beragam temu.</em></h2>
              </div>
              <span className="nct-example-seal"><b>CONTOH</b><i>BUKAN JADWAL PASTI</i></span>
            </div>
            <p className="nct-rundown-note">Gambaran program berikut hanya contoh dan dapat berubah mengikuti karakter ruang publik serta izin penggunaan lokasi.</p>
            <div className="nct-rundown-list">
              {rundown.map((item) => (
                <article className="nct-rundown-row" key={item.time}>
                  <time>{item.time}</time>
                  <span className="nct-rundown-dot" aria-hidden="true" />
                  <div><h3>{item.title}</h3><p>{item.detail}</p></div>
                </article>
              ))}
            </div>
          </section>
        )}

        {eventList.length > 0 && umkmList.length > 0 && (
          <section className="nct-market" aria-labelledby="nct-market-heading">
            <div className="nct-market-visual" aria-hidden="true">
              <div className="nct-market-sun" />
              <div className="nct-market-booth booth-back"><i /><i /><i /><i /><i /><span /></div>
              <div className="nct-market-booth booth-front"><i /><i /><i /><i /><i /><span /></div>
              <p>Pasar lokal<br />punya cerita.</p>
            </div>
            <div className="nct-market-copy">
              <p className="nct-kicker">Contoh kategori UMKM</p>
              <h2 id="nct-market-heading">Dibuat di sekitar.<br /><em>Ditemukan bersama.</em></h2>
              <p>Contoh ragam produk yang dapat hadir di area market. Tenant, produk, dan partisipasi belum dikonfirmasi.</p>
              <div className="nct-market-list">
                {umkmList.map((item) => (
                  <article key={item.id}>
                    <ShoppingBasket size={18} aria-hidden="true" />
                    <div><h3>{item.title}</h3><p>{item.detail}</p></div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="daftar-tenant" className="nct-tenant" aria-labelledby="nct-tenant-title">
          <div className="nct-tenant-intro">
            <p className="nct-kicker">Untuk pelaku usaha lokal</p>
            <h2 id="nct-tenant-title">Bawa produkmu<br /><em>ke titik temu.</em></h2>
            <p>Ceritakan usaha dan produk yang ingin kamu bawa. Kami siapkan pesan pendaftaran untuk ditinjau dan dikirim langsung ke tim Nempo.</p>
            <p className="nct-tenant-privacy">Data formulir tidak dikirim atau disimpan otomatis oleh website. Kamu akan meninjau pesannya sendiri sebelum mengirim lewat Instagram DM.</p>
          </div>
          <div className="nct-tenant-form-wrap">
            <form className="nct-tenant-form" onSubmit={prepareTenantApplication}>
              <label>
                Nama usaha
                <input name="usaha" required maxLength={90} autoComplete="organization" placeholder="Contoh: Dapur Nini" />
              </label>
              <label>
                Nama penanggung jawab
                <input name="penanggung-jawab" required maxLength={90} autoComplete="name" placeholder="Nama yang bisa dihubungi" />
              </label>
              <label>
                Kategori produk
                <select name="kategori" required defaultValue="">
                  <option value="" disabled>Pilih kategori</option>
                  <option>Makanan &amp; jajanan</option>
                  <option>Minuman &amp; kopi</option>
                  <option>Kerajinan</option>
                  <option>Fesyen &amp; produk kreatif</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label>
                Produk yang ditawarkan
                <textarea name="produk" required maxLength={500} rows={3} placeholder="Ceritakan singkat produk andalanmu" />
              </label>
              <label>
                Instagram usaha <span>(opsional)</span>
                <input name="instagram" maxLength={100} placeholder="@namausaha" />
              </label>
              <button className="nct-button nct-button-dark" type="submit">
                Siapkan pesan pendaftaran <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
            {tenantDraft && (
              <div id="hasil-daftar-tenant" className="nct-tenant-result" aria-live="polite">
                <span className="nct-result-title">Pesan siap ditinjau</span>
                <p>Periksa detailnya, lalu salin dan kirim melalui DM Instagram Nempo.</p>
                <textarea aria-label="Pesan pendaftaran tenant" readOnly value={tenantDraft} rows={8} />
                <div className="nct-tenant-result-actions">
                  <button className="nct-button nct-button-outline" type="button" onClick={copyTenantApplication}>
                    {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {copyStatus === "copied" ? "Pesan tersalin" : "Salin pesan"}
                  </button>
                  <a className="nct-button nct-button-dark" href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">
                    Buka Instagram DM <Instagram size={16} aria-hidden="true" />
                  </a>
                </div>
                {copyStatus === "manual" && <small className="nct-copy-help">Pesan belum tersalin otomatis. Tekan dan tahan teks untuk menyalinnya.</small>}
              </div>
            )}
          </div>
        </section>

        <section className="nct-talent" aria-labelledby="nct-talent-heading">
          <div>
            <p className="nct-kicker">Untuk seniman dan komunitas</p>
            <h2 id="nct-talent-heading">Punya cerita untuk<br /><em>dibawa ke panggung?</em></h2>
            <p>Kenalkan diri dan ceritakan bentuk penampilan atau aktivitas komunitas yang ingin kamu bagikan. Hubungi tim Nempo melalui Instagram DM.</p>
          </div>
          <a className="nct-talent-link" href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer">
            <span><Instagram size={19} aria-hidden="true" /> Ngobrol dengan tim Nempo</span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
        </section>

        <footer className="nct-footer">
          <a href="#cerita" className="nct-footer-logo" aria-label="Nempo Cultural Tour">NEMPO<span>®</span></a>
          <p>Ruang temu untuk cerita lokal.</p>
          <span>GARUT · JAWA BARAT</span>
          <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" aria-label="Hubungi Nempo melalui Instagram DM">
            <Instagram size={17} />
          </a>
        </footer>
      </main>
    </Layout>
  );
}
