import { ArrowLeft, ArrowUpRight, Camera, Download, Drama, Gift, Megaphone, MessageCircle, Music, Radio, Search, Shirt, Users } from "lucide-react";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { NEMPO_CONSULT_URL, NEMPO_INSTAGRAM_HANDLE } from "@/lib/contact";
import "./sponsorship-proposal.css";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function HalloweenProposalPage() {
  const minimalChrome = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("pdf") === "1";

  return (
    <Layout minimalChrome={minimalChrome}>
      <SEO title="Proposal Sponsorship Halloween — Kala Muda × Nempo Organizer" noIndex />
      <main className="sponsor-proposal-page">
        <div className="sponsor-proposal-toolbar">
          <a href="/sponsorship/halloween" className="sponsor-proposal-back">
            <ArrowLeft className="h-4 w-4" /> Kembali ke event
          </a>
          <div className="sponsor-proposal-actions">
            <a href="#slide-22" className="sponsor-proposal-tool-button sponsor-proposal-tool-primary">
              Ajukan kolaborasi <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={assetUrl("downloads/midnight-mystery-proposal-acara.pdf")}
              download="KALA-MUDA-NEMPO-ID-Proposal-Acara-Midnight-Mystery.pdf"
              className="sponsor-proposal-tool-button sponsor-proposal-tool-secondary"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </div>
        </div>

        <div className="sponsor-proposal-deck">
          <section className="sponsor-proposal-slide sponsor-proposal-cover" id="slide-1">
            <img
              src={assetUrl("images/sponsor/midnight-mystery-cover-optimized.jpg")}
              alt="Ilustrasi asli Midnight Mystery: pertunjukan musik Halloween di depan kastil"
              className="sponsor-proposal-cover-image"
            />
            <div className="sponsor-proposal-cover-overlay" />
            <div className="sponsor-proposal-cover-content">
              <p className="sponsor-proposal-kicker">KALA MUDA × NEMPO ORGANIZER / PROPOSAL ACARA</p>
              <h1 className="sponsor-proposal-visually-hidden">MIDNIGHT MYSTERY — The Musical Theatre of Halloween</h1>
              <img
                src={assetUrl("images/sponsor/midnight-mystery-logo.webp")}
                alt="Midnight Mystery — The Musical Theatre of Halloween"
                width={1536}
                height={1024}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                aria-label="Midnight Mystery — The Musical Theatre of Halloween"
                className="sponsor-proposal-event-logo"
              />
            </div>
            <footer className="sponsor-proposal-cover-footer">
              <p className="sponsor-proposal-cover-lead">
                Immersive Halloween experience yang menggabungkan misteri, musik, kostum, dan
                komunitas dalam satu malam di Garut.
              </p>
              <div className="sponsor-proposal-cover-meta">
                <span>Kala Muda × Nempo Organizer</span>
                <span>31 Oktober 2026</span>
                <span>18.00–23.00 WIB</span>
                <span>Garut, Jawa Barat</span>
              </div>
            </footer>
            <span className="sponsor-proposal-slide-number">01 / 22</span>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-idea" id="slide-2">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Tentang acara</p>
              <span>02 / 22</span>
            </div>
            <div className="sponsor-proposal-idea-grid">
              <h2>Halloween bukan hanya dekorasi.<br /><span>Ini adalah pengalaman.</span></h2>
              <div>
                <p className="sponsor-proposal-body">
                  Midnight Mystery 2026 adalah event Halloween yang dikemas sebagai immersive experience
                  di cafe. Pengunjung tidak hanya menikmati hiburan, tetapi ikut masuk ke dalam cerita
                  melalui musical theater, live entertainment, costume experience, interactive games,
                  dan social gathering.
                </p>
                <div className="sponsor-proposal-facts">
                  <div><strong>EVENT</strong><span>Midnight Mystery 2026</span></div>
                  <div><strong>TEMA</strong><span>Halloween Night &amp; Musical Mystery</span></div>
                  <div><strong>VENUE</strong><span>Cafe Partner — Garut</span></div>
                  <div><strong>TARGET</strong><span>150–250 pengunjung</span></div>
                </div>
              </div>
            </div>
            <div className="sponsor-proposal-quote">“The Musical Theatre of Halloween.”</div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-experience" id="slide-3">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Main experience</p>
              <span>03 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Satu malam.<br /><span>Masuk ke misteri.</span></h2>
              <p>Mulai dari pintu masuk hingga closing, setiap titik dirancang untuk membuat pengunjung menjadi bagian dari cerita.</p>
            </div>
            <div className="sponsor-proposal-experience-grid">
              <article>
                <div className="sponsor-proposal-experience-icon"><Drama aria-hidden="true" /></div>
                <span>01</span>
                <h3>Musical theater</h3>
                <p>Acting, singing, dance, dan lighting dalam pertunjukan utama.</p>
              </article>
              <article>
                <div className="sponsor-proposal-experience-icon"><Shirt aria-hidden="true" /></div>
                <span>02</span>
                <h3>Costume experience</h3>
                <p>Pengunjung datang berkostum dan ikut meramaikan malam Halloween.</p>
              </article>
              <article>
                <div className="sponsor-proposal-experience-icon"><Search aria-hidden="true" /></div>
                <span>03</span>
                <h3>Mystery game</h3>
                <p>Find The Clue dan tebak identitas Mystery Guest bersama audience.</p>
              </article>
              <article className="sponsor-proposal-experience-card-parasol">
                <div className="sponsor-proposal-experience-icon"><Music aria-hidden="true" /></div>
                <span>04</span>
                <h3>Live music</h3>
                <p>Live music, DJ, dan penampilan talent yang menjaga energi sepanjang acara.</p>
              </article>
              <article>
                <div className="sponsor-proposal-experience-icon"><Camera aria-hidden="true" /></div>
                <span>05</span>
                <h3>Photo spot</h3>
                <p>Area visual untuk membuat momen dan konten yang dibagikan pengunjung.</p>
              </article>
            </div>
            <div className="sponsor-proposal-experience-rail">
              <div>
                <span className="sponsor-proposal-experience-rail-label">THE NIGHT IN FIVE ACTS</span>
                <strong>18.00 <i>→</i> 23.00 WIB</strong>
              </div>
              <div className="sponsor-proposal-experience-rail-steps" aria-label="Alur pengalaman pengunjung">
                <span>Enter the story</span>
                <span>Find the clue</span>
                <span>Meet the mystery</span>
                <span>Celebrate together</span>
              </div>
              <p>Setiap momen memberi ruang bagi partner untuk hadir secara natural: dari first impression, interaksi, hingga konten yang dibagikan setelah acara.</p>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-story" id="slide-4">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Musical theater</p>
              <span>04 / 22</span>
            </div>
            <div className="sponsor-proposal-story-grid">
              <div>
                <p className="sponsor-proposal-kicker">THE MYSTERY AT MIDNIGHT</p>
                <h2>Sebuah tamu misterius.<br /><span>Satu rahasia besar.</span></h2>
                <p className="sponsor-proposal-body">
                  Pada malam Halloween, seorang Mystery Guest muncul tanpa dikenal siapa pun.
                  Rahasia para karakter terbuka melalui lagu, dialog, dan koreografi hingga venue
                  kembali menjadi Halloween celebration.
                </p>
              </div>
              <div className="sponsor-proposal-story-points">
                <div><strong>20–30 MIN</strong><span>Durasi pertunjukan utama</span></div>
                <div><strong>ACTING + SONG</strong><span>Dialog, musik, dan koreografi</span></div>
                <div><strong>FULL VENUE</strong><span>Penonton menjadi bagian dari cerita</span></div>
              </div>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-schedule" id="slide-5">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Rangkaian acara</p>
              <span>05 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Enam jam yang<br /><span>penuh cerita.</span></h2>
              <p>Rundown dapat disesuaikan bersama venue dan partner produksi tanpa mengubah inti pengalaman.</p>
            </div>
            <div className="sponsor-proposal-schedule-list">
              <div><strong>17.00–18.00</strong><span><b>OPEN GATE</b> Check-in, costume arrival, photo spot, cafe experience</span></div>
              <div><strong>19.00–19.30</strong><span><b>WELCOME &amp; INTERACTIVE SESSION</b> Opening, host, mystery game, audience interaction</span></div>
              <div><strong>19.30–20.00</strong><span><b>LIVE MUSIC</b> Penampilan musik pembuka</span></div>
              <div className="is-highlight"><strong>20.00–20.30</strong><span><b>MUSICAL THEATER</b> The Mystery at Midnight performance</span></div>
              <div><strong>20.30–21.00</strong><span><b>MYSTERY CHALLENGE</b> Games dan interactive session</span></div>
              <div><strong>21.00–21.30</strong><span><b>COSTUME CONTEST</b> Penilaian dan pengumuman pemenang</span></div>
              <div><strong>21.30–22.00</strong><span><b>TALENT PERFORMANCE</b> Penampilan bakat pilihan dan special guest</span></div>
              <div><strong>22.00–22.30</strong><span><b>DJ SESSION</b> Musik penutup dan dance floor experience</span></div>
              <div><strong>22.30–23.00</strong><span><b>DOORPRIZE &amp; CLOSING</b> Doorprize, sponsor mention, foto bersama</span></div>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-audience" id="slide-6">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Target pengunjung &amp; promosi</p>
              <span>06 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Audience yang datang<br /><span>untuk mengalami.</span></h2>
              <p>Komunitas muda Garut yang aktif berinteraksi secara offline sekaligus membagikan momen mereka di media sosial.</p>
            </div>
            <div className="sponsor-proposal-audience-grid">
              <article>
                <span className="sponsor-proposal-audience-label">150–250 TARGET ESTIMASI</span>
                <h3>Siapa yang hadir?</h3>
                <ul><li>Usia 16–30 tahun</li><li>Pelajar, mahasiswa &amp; young professionals</li><li>Komunitas kreatif dan komunitas musik</li><li>Pecinta theater &amp; Halloween</li></ul>
              </article>
              <article>
                <span className="sponsor-proposal-audience-label">AUDIENCE BEHAVIOR</span>
                <h3>Datang untuk mengalami</h3>
                <p>Audience aktif menggunakan Instagram, TikTok, WhatsApp, dan community network—lalu membagikan momen event secara organik.</p>
                <p className="sponsor-proposal-audience-note">Potensi: offline engagement + social media exposure.</p>
              </article>
              <article className="sponsor-proposal-promo-card">
                <span className="sponsor-proposal-audience-label">TARGET MEDIA PLAN</span>
                <h3>Jangkauan promosi</h3>
                <div><b>CHANNELS</b><span>Instagram, TikTok, WhatsApp Blast, creator, KOL lokal, dan community network.</span></div>
                <div><b>WAVES</b><span>Announce, activation, reminder, lalu recap setelah event.</span></div>
                <div><b>REACH</b><span>Baseline reach ditetapkan bersama partner dan dilaporkan setelah campaign.</span></div>
              </article>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-why" id="slide-7">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Why partner with us</p>
              <span>07 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Brand masuk<br /><span>ke dalam cerita.</span></h2>
              <p>Midnight Mystery memberi ruang bagi brand untuk hadir di momen yang nyata, relevan, dan bisa diingat audience.</p>
            </div>
            <div className="sponsor-proposal-why-grid">
              <article><strong>01</strong><h3>Target audience</h3><p>150–250 target estimasi, usia 16–30 tahun, dengan komunitas muda Garut sebagai core audience.</p></article>
              <article><strong>02</strong><h3>Potensi exposure</h3><p>Brand tampil di venue, materi promosi, sponsor mention, dan momen yang dibagikan audience.</p></article>
              <article><strong>03</strong><h3>Brand activation</h3><p>Booth, sampling, mystery gift, dan game membuat brand hadir sebagai pengalaman.</p></article>
              <article><strong>04</strong><h3>Content &amp; report</h3><p>Output konten, dokumentasi brand, attendance recap, dan evaluasi activation setelah event.</p></article>
            </div>
            <div className="sponsor-proposal-why-proof"><span>BRAND VALUE</span><strong>Onsite moment · digital output · post-event report</strong></div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-activation" id="slide-8">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Benefit untuk sponsor</p>
              <span>08 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Brand tidak hanya terlihat.<br /><span>Brand ikut bercerita.</span></h2>
              <p>Sponsor mendapatkan exposure sekaligus ruang aktivasi langsung yang relevan dengan pengalaman pengunjung.</p>
            </div>
            <div className="sponsor-proposal-activation-grid">
              <article><span>01</span><h3>Brand exposure</h3><p>Logo di poster, backdrop, venue, media sosial, dan sponsor mention.</p></article>
              <article><span>02</span><h3>Brand activation</h3><p>Sampling, voucher, giveaway, product placement, booth, dan doorprize.</p></article>
              <article><span>03</span><h3>Content exposure</h3><p>Integrasi brand di Story, Feed, Reels, TikTok, dan dokumentasi event.</p></article>
              <article><span>04</span><h3>Audience connection</h3><p>Brand hadir sebagai bagian dari pengalaman, bukan sekadar logo.</p></article>
            </div>
            <div className="sponsor-proposal-activation-note">NEMPO / BRAND × EVENT × COMMUNITY</div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-model" id="slide-9">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Paket sponsor</p>
              <span>09 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Paket yang jelas.<br /><span>Benefit yang terukur.</span></h2>
              <p>Bandingkan harga, tiket, exposure, aktivasi, dan output konten dalam satu tampilan ringkas.</p>
            </div>
            <div className="sponsor-proposal-package-summary">
              <table>
                <thead>
                  <tr><th>Benefit</th><th>Supporting</th><th>Official</th><th>Main</th></tr>
                </thead>
                <tbody>
                  <tr><th>Harga</th><td>Rp1 jt</td><td>Rp2,5 jt</td><td>Rp5 jt</td></tr>
                  <tr><th>Tiket</th><td>—</td><td>2</td><td>5</td></tr>
                  <tr><th>Logo &amp; sponsor mention</th><td>Poster &amp; media partner</td><td>+ backdrop &amp; venue</td><td>Seluruh media + dedicated Story</td></tr>
                  <tr><th>Backdrop &amp; venue branding</th><td>—</td><td>✓</td><td>✓</td></tr>
                  <tr><th>Aktivasi</th><td>Voucher / doorprize</td><td>Placement + sampling + booth</td><td>Integrasi brand dalam event</td></tr>
                  <tr><th>Integrasi brand</th><td>—</td><td>—</td><td>✓</td></tr>
                  <tr><th>Output konten</th><td>Story mention</td><td>Story + dokumentasi</td><td>Dedicated Story + dokumentasi</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-investment" id="slide-10">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Investment &amp; next steps</p>
              <span>10 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Dukungan yang jelas.<br /><span>Dampaknya terlihat.</span></h2>
              <p>Target kerja sama dibuat sederhana agar partner dapat melihat nilai investasi, potensi traction, dan langkah konfirmasi sebelum event.</p>
            </div>
            <div className="sponsor-proposal-investment-grid">
              <article className="is-highlight">
                <span>INVESTMENT TARGET</span>
                <strong>Rp15 juta</strong>
                <p>Target dukungan sponsor untuk produksi, talent, venue, promosi, dan pengalaman pengunjung.</p>
              </article>
              <article>
                <span>TRACTION RANGE</span>
                <strong>250–500</strong>
                <p>Potensi traction dan jangkauan audience yang dapat dikembangkan melalui event serta campaign partner.</p>
              </article>
              <article>
                <span>SPONSOR RESULTS</span>
                <strong>ALL CHANNELS</strong>
                <p>Onsite exposure, digital content, activation, sponsor mention, dan post-event report.</p>
              </article>
              <article>
                <span>CONFIRMATION</span>
                <strong>BEFORE EVENT</strong>
                <p>Konfirmasi sebelum acara, lalu finalisasi logo, placement, activation, dan kebutuhan produksi.</p>
              </article>
            </div>
            <div className="sponsor-proposal-investment-next">
              <span>NEXT STEPS</span>
              <strong>Pilih paket → meeting partnership → finalisasi benefit → produksi &amp; activation</strong>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-activation sponsor-proposal-activation-examples" id="slide-11">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Peluang brand activation</p>
              <span>11 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Brand terlihat.<br /><span>Brand ikut bergerak.</span></h2>
              <p>Contoh aktivasi yang membuat sponsor hadir secara natural di dalam alur event.</p>
            </div>
            <div className="sponsor-proposal-activation-examples-grid">
              <article><div className="sponsor-proposal-activation-icon"><Gift aria-hidden="true" /></div><span>01</span><h3>Booth sponsor</h3><p>Ruang brand yang terlihat dan bisa dikunjungi audience.</p></article>
              <article><div className="sponsor-proposal-activation-icon"><Gift aria-hidden="true" /></div><span>02</span><h3>Mystery gift</h3><p>Hadiah misterius yang menjadi bagian dari cerita malam.</p></article>
              <article><div className="sponsor-proposal-activation-icon"><Shirt aria-hidden="true" /></div><span>03</span><h3>Product sampling</h3><p>Produk dicoba langsung dalam momen yang relevan.</p></article>
              <article><div className="sponsor-proposal-activation-icon"><Search aria-hidden="true" /></div><span>04</span><h3>Find the brand</h3><p>Logo atau produk masuk ke dalam mystery game.</p></article>
              <article><div className="sponsor-proposal-activation-icon"><Camera aria-hidden="true" /></div><span>05</span><h3>Photo spot</h3><p>Logo hadir di titik foto yang dibagikan pengunjung.</p></article>
            </div>
            <div className="sponsor-proposal-activation-note">MAKE THE BRAND PART OF THE STORY</div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-partnership" id="slide-12">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Bentuk &amp; kebutuhan kerja sama</p>
              <span>12 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Bisa berupa dana,<br /><span>produk, atau keahlian.</span></h2>
              <p>Midnight Mystery membuka kesempatan bagi brand dan perusahaan untuk mendukung event mulai dari Rp1.000.000 atau melalui kontribusi non-dana.</p>
            </div>
            <div className="sponsor-proposal-partnership-grid">
              <article><span>FINANCIAL SUPPORT</span><h3>Dukungan mulai Rp1 juta.</h3><p>Dana untuk produksi, talent, venue, dekorasi, dan operasional.</p></article>
              <article><span>PRODUCT SUPPORT</span><h3>Produk untuk peserta.</h3><p>Produk untuk peserta, giveaway, dan doorprize.</p></article>
              <article><span>SERVICE SUPPORT</span><h3>Keahlian produksi.</h3><p>Printing, foto/video, photobooth, dekorasi, lighting, dan sound system.</p></article>
              <article><span>MEDIA SUPPORT</span><h3>Perluas jangkauan.</h3><p>Publikasi melalui media partner, creator, KOL, dan community network.</p></article>
            </div>
            <p className="sponsor-proposal-model-footnote">Nilai kerja sama akan disesuaikan dengan bentuk kontribusi partner.</p>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-venue" id="slide-13">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Kolaborasi &amp; value untuk venue</p>
              <span>13 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Cafe bukan hanya lokasi.<br /><span>Cafe menjadi cerita.</span></h2>
              <p>Midnight Mystery mengubah cafe partner menjadi theatrical world selama satu malam—sebuah destination experience yang membuka peluang traffic, exposure, dan revenue baru.</p>
            </div>
            <div className="sponsor-proposal-venue-grid">
              <article>
                <span>VENUE INTEGRATION</span>
                <h3>Ruang yang hidup sepanjang malam.</h3>
                <ul><li>Seluruh area cafe menjadi bagian dari cerita</li><li>Halloween decoration dan photo spot</li><li>Musical theater, live entertainment, dan mystery game</li><li>Brand activation yang menyatu dengan pengalaman</li><li>Cafe menu collaboration dan special offer</li></ul>
              </article>
              <article>
                <span>VALUE FOR VENUE</span>
                <h3>Lebih banyak alasan untuk datang kembali.</h3>
                <div className="sponsor-proposal-venue-deal">
                  <span>SKEMA KERJA SAMA CAFE</span>
                  <strong>Tiket bundling produk/menu + porsi omzet untuk manajemen</strong>
                  <small>Menyesuaikan kebijakan bersama venue terpilih.</small>
                </div>
                <ul><li>Tambahan traffic dan potensi customer baru</li><li>Exposure media sosial dan konten event</li><li>Promosi cafe dan kolaborasi komunitas</li><li>Dapat dikembangkan menjadi annual Halloween event</li></ul>
              </article>
            </div>
            <div className="sponsor-proposal-venue-proof">
              <div>
                <span>FROM A CAFE INTO A THEATRICAL WORLD</span>
                <strong>Pengunjung tidak hanya datang sebagai penonton.</strong>
              </div>
              <p>Mereka makan, melihat, menemukan clue, berinteraksi, bermain, membuat konten, lalu membawa pulang pengalaman yang hanya bisa terjadi di cafe partner.</p>
              <div className="sponsor-proposal-venue-proof-tags" aria-label="Dampak pengalaman untuk venue">
                <b>SEE</b><b>DISCOVER</b><b>INTERACT</b><b>PLAY</b><b>CREATE</b><b>REMEMBER</b>
              </div>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-cafe-model" id="slide-14">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Kerja sama dengan cafe</p>
              <span>14 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Skema yang fleksibel.<br /><span>Nilai yang sama-sama terasa.</span></h2>
              <p>Kerja sama dengan cafe dapat disusun melalui beberapa model yang disesuaikan dengan kebijakan dan kesepakatan bersama venue.</p>
            </div>
            <div className="sponsor-proposal-cafe-model-grid">
              <article>
                <span>TIKET BUNDLING</span>
                <h3>Event masuk ke dalam pengalaman cafe.</h3>
                <p>Tiket dapat dipaketkan dengan produk, menu, voucher, atau special offer dari cafe partner.</p>
                <strong>Tiket + produk/menu cafe</strong>
              </article>
              <article>
                <span>PORSI OMZET SELAMA EVENT</span>
                <h3>Kontribusi untuk pengadaan acara.</h3>
                <p>Omzet event dibagi sesuai model kerja sama dan tanggung jawab produksi yang disepakati bersama.</p>
                <strong>Porsi omzet manajemen acara</strong>
              </article>
              <article>
                <span>PRODUCTION / TALENT SUPPORT</span>
                <h3>Support kebutuhan event.</h3>
                <p>Cafe dapat membantu menyediakan kebutuhan produksi atau talent tambahan bila diperlukan.</p>
                <strong>Diturunkan melalui skema sharing</strong>
              </article>
            </div>
            <div className="sponsor-proposal-cafe-model-note">
              <span>KEBIJAKAN BERSAMA</span>
              <strong>Detail bundling, produk, tiket, porsi omzet, biaya produksi, dan support talent difinalisasi bersama cafe partner terpilih.</strong>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-cafe-simulation" id="slide-15">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Simulasi untuk cafe partner</p>
              <span>15 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Dua model kerja sama.<br /><span>Satu tujuan: venue hidup.</span></h2>
              <p>Simulasi awal untuk membuka pembicaraan dengan cafe. Angka menggunakan contoh 150–250 pengunjung dan perlu disesuaikan dengan kapasitas venue, menu, serta biaya aktual.</p>
            </div>
            <div className="sponsor-proposal-simulation-overview">
              <article>
                <span>SKALA SIMULASI</span>
                <strong>150–250 pax</strong>
                <p>Skenario tengah yang dipakai untuk membaca potensi omzet adalah 200 pengunjung.</p>
              </article>
              <article>
                <span>PILIHAN 1</span>
                <strong>Porsi omzet manajemen 30%</strong>
                <p>Tiket bundling dan produksi event dari tim manajemen; budget produksi dibahas terpisah dari porsi omzet.</p>
              </article>
              <article>
                <span>PILIHAN 2</span>
                <strong>Management fee 20% dari omzet event</strong>
                <p>Masuk gratis, produksi dan penjualan oleh cafe; fee dihitung dari transaksi cafe yang teridentifikasi selama event.</p>
              </article>
            </div>
            <div className="sponsor-proposal-simulation-note">
              <span>CATATAN PERHITUNGAN</span>
              <strong>Semua nominal adalah omzet bruto, bukan keuntungan bersih. Belum dikurangi HPP, pajak, payment gateway, diskon, dan biaya produksi. Rekonsiliasi diselesaikan setelah event berdasarkan data kasir/POS/QRIS.</strong>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-cafe-simulation" id="slide-16">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Pilihan kerja sama cafe</p>
              <span>16 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Dua pilihan kerja sama.<br /><span>Benefit utama tetap sama.</span></h2>
              <p>Pilihan 1 dan 2 memiliki support dasar yang sama dari tim kami. Perbedaannya ada pada skema omzet dan pihak yang memegang produksi event.</p>
            </div>
            <div className="sponsor-proposal-simulation-comparison">
              <article>
                <span>PILIHAN 1 · EVENT DARI MANAJEMEN</span>
                <h3>Porsi omzet manajemen 30%</h3>
                <ul><li>Event diproduksi penuh oleh tim manajemen acara</li><li>Pengunjung membayar tiket dan paket menu</li><li>Porsi omzet manajemen: 30% dari omzet bruto event</li><li>Budget produksi event dibahas terpisah dari porsi omzet</li></ul>
              </article>
              <article>
                <span>PILIHAN 2 · EVENT DARI CAFE</span>
                <h3>Management fee 20% dari omzet event</h3>
                <ul><li>Cafe memproduksi dan mengelola event</li><li>Pengunjung masuk tanpa tiket</li><li>Fee 20% dari omzet bruto event</li><li>Yang dihitung hanya transaksi cafe teridentifikasi selama event</li></ul>
              </article>
            </div>
            <div className="sponsor-proposal-shared-benefits">
              <article><div className="sponsor-proposal-shared-benefit-icon"><Megaphone aria-hidden="true" /></div><div><span>01 · IKLAN</span><strong>Awareness sebelum event.</strong><p>Promosi event dan cafe melalui materi campaign yang disiapkan bersama.</p></div></article>
              <article><div className="sponsor-proposal-shared-benefit-icon"><Camera aria-hidden="true" /></div><div><span>02 · KONTEN</span><strong>Story yang bisa dibagikan.</strong><p>Konten teaser, event moment, dan recap untuk memperpanjang exposure.</p></div></article>
              <article><div className="sponsor-proposal-shared-benefit-icon"><Users aria-hidden="true" /></div><div><span>03 · SDM ACARA</span><strong>Tim yang menjaga experience.</strong><p>Konsep, koordinasi, talent, host, dan kebutuhan operasional sesuai scope.</p></div></article>
              <article><div className="sponsor-proposal-shared-benefit-icon"><Radio aria-hidden="true" /></div><div><span>04 · PUBLIKASI</span><strong>Selama &amp; after acara.</strong><p>Publikasi selama event serta follow-up content setelah acara selesai.</p></div></article>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-cafe-simulation sponsor-proposal-simulation-example" id="slide-17">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Contoh perhitungan simulasi</p>
              <span>17 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Begini cara<br /><span>omzetnya dihitung.</span></h2>
              <p>Contoh sederhana dengan 200 pengunjung agar cafe dapat melihat alur pembagian dari penjualan sampai hasil akhir masing-masing pihak.</p>
            </div>
            <div className="sponsor-proposal-simulation-example-grid">
              <article>
                <span>PILIHAN 1 · TIKET BUNDLING</span>
                <h3>140 Paket A + 60 Paket B</h3>
                <div className="sponsor-proposal-simulation-formula">
                  <p><b>140 × Rp54.000</b><small>Paket A: tiket Rp35.000 + minum Rp19.000</small><strong>Rp7.560.000</strong></p>
                  <p><b>60 × Rp90.000</b><small>Paket B: tiket Rp55.000 + minum &amp; cemilan Rp35.000</small><strong>Rp5.400.000</strong></p>
                </div>
                <div className="sponsor-proposal-simulation-example-total"><span>OMZET GABUNGAN</span><strong>Rp12.960.000</strong></div>
                <div className="sponsor-proposal-simulation-example-split"><b>Porsi manajemen 30% <strong>Rp3.888.000</strong></b><b>70% cafe <strong>Rp9.072.000</strong></b></div>
              </article>
              <article className="is-highlight">
                <span>PILIHAN 2 · FREE ENTRY</span>
                <h3>200 pengunjung × Rp45.000</h3>
                <div className="sponsor-proposal-simulation-formula">
                  <p><b>200 × Rp45.000</b><small>Rata-rata belanja cafe per pengunjung</small><strong>Rp9.000.000</strong></p>
                  <p><b>Masuk gratis</b><small>Tidak ada pendapatan tiket; omzet berasal dari pembelian cafe</small><strong>Omzet cafe</strong></p>
                </div>
                <div className="sponsor-proposal-simulation-example-total"><span>OMZET CAFE</span><strong>Rp9.000.000</strong></div>
                <div className="sponsor-proposal-simulation-example-split"><b>Management fee 20% <strong>Rp1.800.000</strong></b><b>80% cafe <strong>Rp7.200.000</strong></b></div>
              </article>
            </div>
            <div className="sponsor-proposal-simulation-note">
              <span>ASUMSI CONTOH</span>
              <strong>Pilihan 1 memakai harga minum Rp19.000 dan mix 70% Paket A + 30% Paket B. Semua angka adalah omzet bruto, bukan keuntungan bersih; belum dikurangi HPP, pajak, payment gateway, diskon, dan biaya produksi. Rekonsiliasi diselesaikan setelah event berdasarkan data kasir/POS/QRIS.</strong>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-budget" id="slide-18">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Alokasi dukungan</p>
              <span>18 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Dana sponsor<br /><span>menjadi pengalaman.</span></h2>
              <p>Rancangan awal penggunaan dana agar setiap kontribusi partner kembali menjadi kualitas cerita, pengalaman, dan exposure yang terlihat.</p>
            </div>
            <div className="sponsor-proposal-budget-grid">
              <article><strong>35%</strong><span>Production &amp; talent</span><small>Musical theater, performer, rehearsal, dan creative direction.</small></article>
              <article><strong>25%</strong><span>Venue, decor &amp; photo spot</span><small>Transformasi ruang, atmosphere, dan titik konten pengunjung.</small></article>
              <article><strong>20%</strong><span>Sound, lighting &amp; technical</span><small>Audio, lighting, stage needs, dan kebutuhan teknis pertunjukan.</small></article>
              <article><strong>10%</strong><span>Marketing &amp; documentation</span><small>Promosi, content production, foto, dan video event.</small></article>
              <article><strong>10%</strong><span>Doorprize &amp; experience</span><small>Hadiah, mystery game, costume award, dan guest experience.</small></article>
            </div>
            <p className="sponsor-proposal-model-footnote">Persentase adalah rancangan awal dan dapat disesuaikan berdasarkan skala event, venue, serta bentuk kontribusi partner.</p>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-timeline" id="slide-19">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Timeline kerja sama</p>
              <span>19 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Dari partner pertama<br /><span>ke malam puncak.</span></h2>
              <p>Alur kerja dibuat sederhana agar sponsor punya waktu yang cukup untuk menyusun integrasi, produk, dan materi komunikasi.</p>
            </div>
            <div className="sponsor-proposal-timeline-list">
              <article><strong>D–45 → D–30</strong><span>PARTNER OUTREACH</span><p>Pilih bentuk dukungan, paket, dan ruang aktivasi yang paling relevan.</p></article>
              <article><strong>D–30 → D–14</strong><span>BRAND INTEGRATION</span><p>Finalisasi logo, produk, booth, copy, dan kebutuhan produksi bersama tim.</p></article>
              <article><strong>D–14 → D–1</strong><span>CAMPAIGN &amp; PRODUCTION</span><p>Promosi utama, distribusi materi, technical check, dan konfirmasi logistik.</p></article>
              <article className="is-highlight"><strong>D–DAY</strong><span>31 OCTOBER 2026</span><p>Activation, sponsor mention, documentation, dan pengalaman utama Midnight Mystery.</p></article>
              <article><strong>D+3 → D+7</strong><span>PARTNER REPORT</span><p>Pengiriman dokumentasi, rekap output konten, dan evaluasi exposure event.</p></article>
            </div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-reporting" id="slide-20">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Setelah event</p>
              <span>20 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Exposure tidak berhenti<br /><span>di malam acara.</span></h2>
              <p>Partner menerima rangkuman hasil kerja sama agar kontribusi dan momen brand dapat dipakai kembali untuk komunikasi berikutnya.</p>
            </div>
            <div className="sponsor-proposal-reporting-grid">
              <article><strong>01</strong><h3>Attendance recap</h3><p>Jumlah pengunjung dan dokumentasi audience yang hadir di venue.</p></article>
              <article><strong>02</strong><h3>Content recap</h3><p>Daftar konten, link publikasi, dan rekap output digital yang tayang.</p></article>
              <article><strong>03</strong><h3>Brand documentation</h3><p>Foto logo, produk, booth, sampling, sponsor mention, dan integrasi event.</p></article>
              <article><strong>04</strong><h3>Activation review</h3><p>Catatan singkat tentang respons audience dan peluang pengembangan kolaborasi.</p></article>
            </div>
            <div className="sponsor-proposal-reporting-highlight"><strong>150–250</strong><span>Target audience onsite · digital reach dan engagement direkap setelah campaign berjalan.</span></div>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-organizers" id="slide-21">
            <div className="sponsor-proposal-slide-header">
              <p className="sponsor-proposal-kicker">Tentang partner event</p>
              <span>21 / 22</span>
            </div>
            <div className="sponsor-proposal-split-heading">
              <h2>Local context.<br /><span>Experiential format.</span></h2>
              <p>Midnight Mystery dibangun dari kolaborasi kreatif yang menggabungkan pemahaman audience lokal dengan format event yang bisa dirasakan langsung.</p>
            </div>
            <div className="sponsor-proposal-organizers-grid">
              <article><span>NEMPO ORGANIZER</span><h3>Local platform &amp; community network.</h3><p>Platform lokal yang menghubungkan discovery Garut, lifestyle, event, dan partner exposure dalam satu ekosistem.</p></article>
              <article><span>KALA MUDA</span><h3>Creative event direction.</h3><p>Partner kreatif di balik konsep Midnight Mystery, musical theater, dan arah pengalaman Halloween.</p></article>
              <article><span>SHARED ADVANTAGE</span><h3>Brand masuk ke dalam cerita.</h3><p>Partner mendapatkan konteks audience lokal, ruang aktivasi, dan pengalaman yang lebih natural daripada sekadar logo placement.</p></article>
            </div>
            <p className="sponsor-proposal-organizers-note">Portfolio, media kit, dan detail produksi dapat dibahas bersama dalam pertemuan partnership.</p>
          </section>

          <section className="sponsor-proposal-slide sponsor-proposal-contact" id="slide-22">
            <p className="sponsor-proposal-kicker">Partner yang kami cari</p>
            <h2>Jadilah bagian dari<br /><span>Midnight Mystery 2026.</span></h2>
            <p>Brand, perusahaan, komunitas, dan cafe partner yang ingin hadir sebagai bagian dari pengalaman Halloween di Garut.</p>
            <div className="sponsor-proposal-contact-grid">
              <div><b>BENTUK DUKUNGAN</b><span>Dana · produk · service · media</span></div>
              <div><b>BATAS KONFIRMASI</b><span>30 September 2026 · D–30</span></div>
            </div>
            <p className="sponsor-proposal-contact-invite">Kami mencari partner yang siap membangun momen, bukan hanya menempatkan logo.</p>
            <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer" className="sponsor-proposal-contact-button">
              <MessageCircle className="h-4 w-4" /> Hubungi Tim Partnership
            </a>
            <div className="sponsor-proposal-contact-details">
              <span><b>INSTAGRAM</b>@kalamudacom · {NEMPO_INSTAGRAM_HANDLE}</span>
              <span><b>CHANNEL</b>WhatsApp / partnership meeting</span>
              <span><b>PIC</b>Tim Partnership Nempo</span>
            </div>
            <div className="sponsor-proposal-contact-footer">
              <span>KALA MUDA × NEMPO ORGANIZER · 31 OCTOBER 2026 · GARUT</span>
                <span>22 / 22</span>
            </div>
          </section>
        </div>

        <nav className="sponsor-proposal-pagination" aria-label="Navigasi pitch deck">
          {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"].map((number, index) => (
            <a key={number} href={`#slide-${index + 1}`} aria-label={`Slide ${number}`}>{number}</a>
          ))}
        </nav>
      </main>
    </Layout>
  );
}