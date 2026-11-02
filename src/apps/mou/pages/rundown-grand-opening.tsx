import { useState } from 'react';
import { Printer } from 'lucide-react';
import {
  rundownMcGuideCards,
  type RundownMcGuideCard,
} from '../data/rundown-mc-reference';

type RundownCategory = 'Seremoni' | 'Aktivitas' | 'Hiburan';

type RundownItem = {
  start: string;
  end?: string;
  title: string;
  description: string;
  category: RundownCategory;
};

const rundownItems: RundownItem[] = [
  {
    start: '10.00',
    end: '10.30',
    title: 'Iring-iringan barongsai, registrasi dan penyambutan tamu',
    description:
      'Iring-iringan barongsai berangkat dari Simpang Lima menuju GGS, bersamaan dengan registrasi dan penyambutan tamu undangan, keluarga, rekan bisnis, karyawan, dan pelanggan. Musik pembuka serta sesi foto berlangsung di area grand opening.',
    category: 'Seremoni',
  },
  {
    start: '10.30',
    end: '10.45',
    title: 'Pembukaan oleh MC',
    description:
      'Salam pembuka dan ucapan selamat datang di Grand Opening cabang ke-3 GGS. Perjalanan GGS berawal sebagai barber khusus pria, lalu berkembang dengan menghadirkan layanan grooming bagi wanita. Bagi GGS, perawatan diri bukan sekadar treatment; pelayanan terbaik bagi setiap pelanggan selalu menjadi prioritas.',
    category: 'Seremoni',
  },
  {
    start: '10.45',
    end: '11.00',
    title: 'Sambutan Teh Imel Arsawijaya · Owner GGS',
    description:
      'Sambutan dari Teh Imel Arsawijaya selaku Owner GGS, disertai ucapan terima kasih kepada keluarga, karyawan, mitra, dan seluruh tamu yang telah mendukung perkembangan GGS.',
    category: 'Seremoni',
  },
  {
    start: '11.00',
    end: '11.10',
    title: 'Sambutan Ibu Kikan Davanca · Ketua HCI',
    description:
      'Sambutan disampaikan oleh Ibu Kikan Davanca, Ketua Hairdresser Community Indonesia.',
    category: 'Seremoni',
  },
  {
    start: '11.10',
    end: '11.20',
    title: 'Sambutan orang tua Owner',
    description: 'Sambutan dari orang tua Owner GGS.',
    category: 'Seremoni',
  },
  {
    start: '11.20',
    end: '11.35',
    title: 'Doa bersama',
    description:
      'Doa dipimpin ustaz untuk memohon keberkahan, kelancaran usaha, kesehatan, kekompakan tim, serta kesuksesan GGS Beauty Salon & Spa.',
    category: 'Seremoni',
  },
  {
    start: '11.35',
    end: '11.40',
    title: 'Ice breaking MC & arahan melihat barongsai',
    description:
      'MC mengadakan ice breaking singkat dan mengarahkan tamu untuk menyaksikan atraksi barongsai.',
    category: 'Aktivitas',
  },
  {
    start: '11.40',
    end: '11.50',
    title: 'Atraksi barongsai',
    description:
      'Atraksi barongsai berlangsung setelah doa bersama dan ice breaking MC.',
    category: 'Hiburan',
  },
  {
    start: '11.50',
    end: '12.05',
    title: 'Prosesi gunting pita & potong tumpeng',
    description:
      'Prosesi peresmian cabang ke-3 dimulai dengan gunting pita. MC mengarahkan seluruh karyawan GGS berkumpul di panggung untuk mengikuti pemotongan tumpeng bersama. Setelah pemotongan, Owner memberi suapan tumpeng kepada orang tua dan anak. Lanjutkan dengan dokumentasi foto dan video.',
    category: 'Seremoni',
  },
  {
    start: '12.05',
    end: '12.15',
    title: 'Pembersihan oleh barongsai',
    description:
      'Prosesi pembersihan lokasi dilakukan oleh barongsai setelah gunting pita dan pemotongan tumpeng, sebelum acara berikutnya.',
    category: 'Aktivitas',
  },
  {
    start: '12.15',
    end: '12.25',
    title: 'Santunan anak yatim',
    description:
      'MC mengarahkan perwakilan anak yatim naik ke panggung. Santunan diserahkan secara simbolis, dilanjutkan dengan sesi foto bersama.',
    category: 'Aktivitas',
  },
  {
    start: '12.25',
    end: '12.55',
    title: 'Catwalk model makeup wedding',
    description:
      'Parade model dengan riasan pengantin, busana wedding, dan hairstyle karya tim GGS. Diiringi musik runway yang elegan.',
    category: 'Aktivitas',
  },
  {
    start: '12.55',
    end: '13.25',
    title: 'Apresiasi pelanggan',
    description:
      'MC menyampaikan apresiasi kepada pelanggan GGS dan menyebut nama: Pa Teguh, Pa Hj. Asep Bibit, Bu Hj. Zahra MBG, dan Fitria (Seleb TikTok).',
    category: 'Aktivitas',
  },
  {
    start: '13.25',
    end: '14.55',
    title: 'Makan bersama dan ramah tamah',
    description:
      'Perjamuan prasmanan bagi tamu undangan, keluarga besar GGS, karyawan, dan mitra. Dilanjutkan dengan silaturahmi serta foto bersama.',
    category: 'Aktivitas',
  },
  {
    start: '14.55',
    end: '16.55',
    title: 'Salon tour dan sesi dokumentasi',
    description:
      'Pengenalan fasilitas dan layanan salon. Selama tour, MC mengingatkan bahwa GGS memberikan diskon 30% untuk semua treatment. Lanjutkan sesi foto dengan model dan tamu undangan serta pembuatan konten promosi media sosial.',
    category: 'Aktivitas',
  },
  {
    start: '16.55',
    end: 'Habis Magrib',
    title: 'Persiapan hiburan malam',
    description:
      'Pengecekan sound system, lighting, panggung, serta persiapan penampilan band dan DJ. Tamu dapat menikmati suasana dan layanan salon sesuai operasional.',
    category: 'Aktivitas',
  },
  {
    start: 'Habis Magrib',
    end: '18.30',
    title: 'Transisi musik Spotify',
    description:
      'Musik dari Spotify diputar setelah Magrib sebagai transisi sebelum sesi hiburan malam dibuka pukul 18.30.',
    category: 'Hiburan',
  },
  {
    start: '18.30',
    end: '19.00',
    title: 'Pembukaan hiburan malam & apresiasi',
    description:
      'MC menyapa pengunjung dan membuka sesi hiburan malam. Dilanjutkan apresiasi loyalitas pelanggan dan penyerahan penghargaan karyawan terbaik oleh owner.',
    category: 'Hiburan',
  },
  {
    start: '19.00',
    end: '19.30',
    title: 'Live music — Band Si Matakaca · Set 1',
    description:
      'Pembuka penampilan band dan pemanasan suasana sebelum sesi games. MC dapat mengundi sebagian doorprize di sela set musik.',
    category: 'Hiburan',
  },
  {
    start: '19.30',
    end: '19.45',
    title: 'Penghargaan untuk Cindy Kitty',
    description:
      'Setelah Band Si Matakaca Set 1, MC membacakan penghargaan untuk Cindy Kitty, sahabat Owner yang menemani perjalanan GGS. Setelah itu, lanjutkan Games Joged Terheboh sebelum Set 2.',
    category: 'Hiburan',
  },
  {
    start: '19.45',
    end: '20.15',
    title: 'Live music — Band Si Matakaca · Set 2',
    description:
      'Lanjutan penampilan band. Undian doorprize dapat diselingkan oleh MC.',
    category: 'Hiburan',
  },
  {
    start: '20.15',
    end: '20.30',
    title: 'Games — Sambung kata',
    description:
      'Peserta bergiliran menyambung kata. MC mengumumkan pemenang yang bertahan sampai akhir.',
    category: 'Hiburan',
  },
  {
    start: '20.30',
    end: '20.45',
    title: 'Games — Sambung lagu',
    description:
      'Peserta melanjutkan cuplikan lagu dari MC. Jawaban ronde dan pemenang diumumkan langsung.',
    category: 'Hiburan',
  },
  {
    start: '20.45',
    end: '21.00',
    title: 'Kuis cepat MC & undian doorprize',
    description:
      'Kuis seputar GGS dilanjutkan undian doorprize. MC mengumumkan jawaban dan pemenang setiap ronde.',
    category: 'Hiburan',
  },
  {
    start: '21.00',
    end: '21.15',
    title: 'Pengumuman pemenang & penyerahan hadiah',
    description:
      'Umumkan pemenang kontes Instagram Story Terkece dan komentar Instagram, lalu serahkan hadiah yang siap dibagikan. Sampaikan bahwa undian motor listrik dari program poin treatment dilakukan akhir Desember 2026, bukan malam ini.',
    category: 'Hiburan',
  },
  {
    start: '21.15',
    end: '22.00',
    title: 'DJ performance',
    description:
      'Penampilan DJ sebagai penutup hiburan, dengan musik energik, lighting, dan suasana perayaan grand opening.',
    category: 'Hiburan',
  },
  {
    start: '22.00',
    title: 'Penutupan acara',
    description:
      'Ucapan terima kasih dari MC, penutupan resmi, dan dokumentasi terakhir.',
    category: 'Seremoni',
  },
];

function formatTimeForMachine(time: string) {
  return time.replace('.', ':');
}

function TimeLabel({ value }: { value: string }) {
  if (!/^\d{2}\.\d{2}$/.test(value)) {
    return <span>{value}</span>;
  }

  return <time dateTime={formatTimeForMachine(value)}>{value}</time>;
}

const qCardPartSections = [
  { section: 'Bagian 1', startIndex: 0, endIndex: 14 },
  { section: 'Bagian 2', startIndex: 14, endIndex: rundownItems.length },
];

const qCardParts = qCardPartSections.flatMap(({ section, startIndex, endIndex }) => {
  const items = rundownItems.slice(startIndex, endIndex);
  const itemsPerCard = 4;
  const cardCount = Math.ceil(items.length / itemsPerCard);
  const baseItemsPerCard = Math.floor(items.length / cardCount);
  const remainingItems = items.length % cardCount;

  return Array.from({ length: cardCount }, (_, cardIndex) => {
    const cardStartIndex = cardIndex * baseItemsPerCard + Math.min(cardIndex, remainingItems);
    const cardItemCount = baseItemsPerCard + Number(cardIndex < remainingItems);
    const cardItems = items.slice(cardStartIndex, cardStartIndex + cardItemCount);
    const firstItem = cardItems[0];
    const lastItem = cardItems[cardItems.length - 1];
    const cardEndTime = lastItem.end ?? lastItem.start;

    return {
      section,
      card: `Kartu ${cardIndex + 1}/${cardCount}`,
      startIndex: startIndex + cardStartIndex,
      range: `${firstItem.start}${firstItem.start === cardEndTime ? '' : `—${cardEndTime}`} WIB`,
      items: cardItems,
    };
  });
});

const qCardScheduleSheets = Array.from(
  { length: Math.ceil(qCardParts.length / 2) },
  (_, sheetIndex) =>
    qCardParts
      .slice(sheetIndex * 2, sheetIndex * 2 + 2)
      .map((part) => ({ type: 'schedule' as const, part })),
);

const qCardGuideSheets = Array.from(
  { length: Math.ceil(rundownMcGuideCards.length / 2) },
  (_, sheetIndex) =>
    rundownMcGuideCards
      .slice(sheetIndex * 2, sheetIndex * 2 + 2)
      .map((guide, cardIndex) => ({
        type: 'guide' as const,
        guide,
        cardNumber: sheetIndex * 2 + cardIndex + 1,
      })),
);

const qCardSheets = [...qCardScheduleSheets, ...qCardGuideSheets];

function ScheduleQCard({ part }: { part: (typeof qCardParts)[number] }) {
  return (
    <article
      className="rundown-qcard-card"
      aria-label={`Q Card rundown ${part.section}, ${part.card}`}
      key={`${part.section}-${part.card}`}
    >
      <header className="rundown-qcard-card-header">
        <div>
          <p>GGS BEAUTY · GRAND OPENING</p>
          <h2>Rundown MC <span>{part.section} · {part.card}</span></h2>
          <span className="rundown-qcard-card-range">
            Minggu, 18 Oktober 2026 · {part.range}
          </span>
        </div>
        <span className="rundown-qcard-crew">MC · CREW</span>
      </header>

      <aside className="rundown-qcard-tagline" aria-label="Tagline yang harus diucapkan terus oleh MC">
        <span>DI-SOUNDING TERUS OLEH MC</span>
        <strong>GGS · Grooming is Better</strong>
      </aside>

      <ol className="rundown-qcard-list">
        {part.items.map((item, index) => (
          <li className="rundown-qcard-event" key={`${part.section}-${item.start}-${item.title}`}>
            <span className="rundown-qcard-number">
              {String(index + part.startIndex + 1).padStart(2, '0')}
            </span>
            <span className="rundown-qcard-time">
              {item.start}{item.end ? <>–{item.end}</> : null}
            </span>
            <span className="rundown-qcard-copy">
              <span className="rundown-qcard-event-heading">
                <span className="rundown-qcard-title">{item.title}</span>
                <span className={`rundown-qcard-category rundown-category-${item.category.toLowerCase()}`}>
                  {item.category}
                </span>
              </span>
              <span className="rundown-qcard-description">{item.description}</span>
            </span>
          </li>
        ))}
      </ol>

    </article>
  );
}

function GuideQCard({
  guide,
  cardNumber,
}: {
  guide: RundownMcGuideCard;
  cardNumber: number;
}) {
  return (
    <article className="rundown-qcard-card rundown-qcard-guide-card">
      <header className="rundown-qcard-card-header">
        <div>
          <p>GGS BEAUTY · PANDUAN MC</p>
          <h2>{guide.title} <span>Kartu {cardNumber}/{rundownMcGuideCards.length}</span></h2>
          <span className="rundown-qcard-card-range">{guide.subtitle}</span>
        </div>
        <span className="rundown-qcard-crew">MC · CREW</span>
      </header>

      <aside className="rundown-qcard-tagline" aria-label="Tagline yang harus diucapkan terus oleh MC">
        <span>DI-SOUNDING TERUS OLEH MC</span>
        <strong>GGS · Grooming is Better</strong>
      </aside>

      <div className="rundown-qcard-guide-content">
        {guide.sections.map((section) => (
          <section className="rundown-qcard-guide-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.intro && <p className="rundown-qcard-guide-intro">{section.intro}</p>}
            {section.entries && (
              <ul className={`rundown-qcard-guide-entries${section.entryLayout === 'stack' ? ' is-stacked' : ''}`}>
                {section.entries.map((entry) => (
                  <li key={entry.label}>
                    <span>{entry.label}</span>
                    {entry.detail && <small>{entry.detail}</small>}
                  </li>
                ))}
              </ul>
            )}
            {section.steps && (
              <ol className="rundown-qcard-guide-steps">
                {section.steps.map((step, index) => (
                  <li key={step}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            )}
            {section.paragraphs?.map((paragraph) => (
              <p className="rundown-qcard-guide-paragraph" key={paragraph}>{paragraph}</p>
            ))}
            {section.tag && <span className="rundown-qcard-guide-tag">{section.tag}</span>}
          </section>
        ))}
      </div>

      <footer className="rundown-qcard-card-footer">
        <span>GGS BEAUTY SALON &amp; SPA</span>
        <span>PANDUAN MC · KARTU {cardNumber}/{rundownMcGuideCards.length} <i /> POTONG DI GARIS TENGAH</span>
      </footer>
    </article>
  );
}

function QCardRundownView() {
  const qCardCount = qCardParts.length + rundownMcGuideCards.length;

  return (
    <section className="rundown-qcard-view" aria-labelledby="rundown-qcard-title">
      <header className="rundown-qcard-toolbar">
        <div>
          <p className="rundown-eyebrow">Grand Opening · 18 Oktober 2026</p>
          <h1 id="rundown-qcard-title">Q Card Rundown</h1>
          <p>{qCardCount} kartu setengah-A4 dalam {qCardSheets.length} lembar A4. Cetak, lalu potong di garis tengah.</p>
        </div>
        <button className="button primary" type="button" onClick={() => window.print()}>
          <Printer size={14} />
          <span>Cetak / Simpan PDF</span>
        </button>
      </header>

      <section className="rundown-qcard-preview" aria-label={`Pratinjau ${qCardSheets.length} lembar A4`}>
        {qCardSheets.map((sheet, sheetIndex) => (
          <div className="rundown-qcard-sheet-block" key={`sheet-${sheetIndex + 1}`}>
            <div className="rundown-qcard-preview-caption">
              <span>PRATINJAU CETAK · LEMBAR {sheetIndex + 1} DARI {qCardSheets.length}</span>
              <span>A4 · 210 × 297 MM</span>
            </div>
            <div className="rundown-qcard-sheet">
              {sheet.map((card) =>
                card.type === 'schedule' ? (
                  <ScheduleQCard
                    part={card.part}
                    key={`${card.part.section}-${card.part.card}`}
                  />
                ) : (
                  <GuideQCard
                    guide={card.guide}
                    cardNumber={card.cardNumber}
                    key={`guide-${card.cardNumber}`}
                  />
                ),
              )}
            </div>
          </div>
        ))}
        <p className="rundown-qcard-preview-note">Potong setiap lembar mengikuti garis putus-putus di tengah.</p>
      </section>
    </section>
  );
}

export default function RundownGrandOpeningPage() {
  const [activeView, setActiveView] = useState<'rundown' | 'qcard'>('rundown');

  return (
    <main className={`workspace rundown-workspace${activeView === 'qcard' ? ' rundown-qcard-mode' : ''}`}>
      <div className="rundown-page">
        <div className="rundown-view-tabs no-print" role="tablist" aria-label="Tampilan rundown">
          <button
            className={`rundown-view-tab${activeView === 'rundown' ? ' is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeView === 'rundown'}
            onClick={() => setActiveView('rundown')}
          >
            Rundown
          </button>
          <button
            className={`rundown-view-tab${activeView === 'qcard' ? ' is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeView === 'qcard'}
            onClick={() => setActiveView('qcard')}
          >
            Q Card Rundown
          </button>
        </div>

        {activeView === 'qcard' ? <QCardRundownView /> : (
          <>
        <header className="rundown-hero">
          <p className="rundown-eyebrow">GGS Beauty Salon &amp; Spa · Cabang ke-3</p>
          <h1>Rundown Grand Opening</h1>
          <p className="rundown-date">Minggu, 18 Oktober 2026</p>

          <div className="rundown-summary" aria-label="Waktu acara">
            <div className="rundown-summary-item">
              <span>Opening</span>
              <strong>10.00 WIB</strong>
            </div>
            <div className="rundown-summary-item rundown-summary-peak">
              <span>Acara puncak</span>
              <strong>18.00 – selesai</strong>
            </div>
            <div className="rundown-summary-item">
              <span>Jam acara</span>
              <strong>10.00–22.00 WIB</strong>
            </div>
          </div>

          <div className="rundown-highlights" aria-label="Rangkaian acara utama">
            <span>Opening Ceremony</span>
            <span>Wedding Makeup Showcase</span>
            <span>Live Music</span>
            <span>DJ Performance</span>
          </div>

          <p className="rundown-timing-note">
            Acara puncak dimulai pukul 18.00 WIB. Pembukaan sesi hiburan terjadwal pukul 18.30 WIB.
          </p>
        </header>

        <section className="rundown-night-program" aria-labelledby="rundown-night-title">
          <div className="rundown-night-heading">
            <div>
              <p className="rundown-eyebrow">Rangkaian malam</p>
              <h2 id="rundown-night-title">Giveaway &amp; apresiasi</h2>
            </div>
            <p>
              Kuis dan doorprize berlangsung selama hiburan malam. Undian motor listrik memakai poin
              treatment dan dilakukan terpisah pada akhir Desember 2026.
            </p>
          </div>

          <div className="rundown-night-grid">
            <article className="rundown-night-card">
              <div className="rundown-prize-group">
                <h3>Grand prize akhir tahun</h3>
                <p className="rundown-grand-prize">
                  <strong>Motor listrik</strong>
                  <span>1 unit</span>
                </p>
                <div className="rundown-prize-draw-rule">
                  <p>Setiap transaksi treatment <strong>Rp1.000.000</strong> mendapat <strong>1.000 poin</strong>.</p>
                  <p>Setiap <strong>1.000 poin</strong> mendapat <strong>1 nomor undian</strong>.</p>
                  <span>Pengundian: akhir Desember 2026</span>
                </div>
              </div>

              <div className="rundown-prize-group">
                <h3>Doorprize</h3>
                <ul className="rundown-prize-list">
                  <li><span>Magicom</span><strong>2 unit</strong></li>
                  <li><span>Dispenser</span><strong>2 unit</strong></li>
                  <li><span>Setrika</span><strong>1 unit</strong></li>
                  <li><span>Kipas angin</span><strong>2 unit</strong></li>
                  <li><span>Hair dryer</span><strong>3 unit</strong></li>
                  <li><span>Karaoke mini</span><strong>3 unit</strong></li>
                  <li className="rundown-prize-wide">
                    <span>Voucher Rp100.000</span>
                    <strong>20 voucher · total Rp2.000.000</strong>
                  </li>
                </ul>
              </div>

              <div className="rundown-prize-group">
                <h3>Hadiah produk</h3>
                <ul className="rundown-prize-list">
                  <li><span>Body serum tone up</span><strong>50 pcs</strong></li>
                  <li><span>Hair powder</span><strong>20 pcs</strong></li>
                  <li><span>Matte clay</span><strong>15 pcs</strong></li>
                  <li><span>Curly clay</span><strong>15 pcs</strong></li>
                </ul>
              </div>
            </article>

            <article className="rundown-night-card">
              <div className="rundown-award-group">
                <h3>Apresiasi loyalitas pelanggan</h3>
                <ul className="rundown-award-list">
                  <li>Pa Teguh</li>
                  <li>Pa Hj. Asep Bibit</li>
                  <li>Bu Hj. Zahra MBG</li>
                  <li>Fitria <span>Seleb TikTok</span></li>
                </ul>
              </div>
              <div className="rundown-award-group">
                <h3>Penghargaan sahabat owner</h3>
                <ul className="rundown-award-list">
                  <li><strong>Cindy Kitty</strong><span>Sahabat Owner yang menemani perjalanan GGS</span></li>
                </ul>
              </div>
              <div className="rundown-award-group">
                <h3>Karyawan terbaik</h3>
                <ul className="rundown-award-list">
                  <li><strong>Asep Ahong</strong><span>Head Barberman</span></li>
                  <li><strong>Ilham Araf</strong><span>Supervisor Barberman</span></li>
                  <li><strong>Rizka Nabila</strong><span>Head Admin GGS</span></li>
                </ul>
              </div>
            </article>
          </div>

          <section className="rundown-giveaway" aria-labelledby="rundown-giveaway-title">
            <div className="rundown-giveaway-heading">
              <div>
                <p className="rundown-eyebrow">Pilihan mekanisme</p>
                <h3 id="rundown-giveaway-title">Cara ikut giveaway</h3>
              </div>
              <p>
                Kupon, Story, dan kuis dapat dipakai untuk doorprize acara. Undian motor listrik
                menggunakan poin treatment dan berakhir pada akhir Desember 2026.
              </p>
            </div>

            <div className="rundown-giveaway-options">
              <article className="rundown-giveaway-option rundown-giveaway-option-featured">
                <span className="rundown-giveaway-number">01</span>
                <h4>Undian kupon</h4>
                <p>
                  Tamu mendapat satu nomor saat registrasi. MC mengundi nomor secara terbuka untuk
                  doorprize grand opening.
                </p>
                <span className="rundown-giveaway-tag">Doorprize saat acara</span>
              </article>
              <article className="rundown-giveaway-option">
                <span className="rundown-giveaway-number">02</span>
                <h4>Instagram Story Terkece</h4>
                <p>
                  Unggah Instagram Story paling kreatif saat grand opening, lalu tag
                  {' '}<strong>@ggsbeauty.hair.co</strong> dan <strong>@hairstudio.ggs.grt</strong>.
                  Tunjukkan Story ke panitia; akun privat dapat menunjukkan tangkapan layar. Panitia
                  memilih Story terkece.
                </p>
                <span className="rundown-giveaway-tag">Kontes kreativitas saat acara</span>
              </article>
              <article className="rundown-giveaway-option rundown-giveaway-option-quiz">
                <span className="rundown-giveaway-number">03</span>
                <h4>Kuis cepat dari MC</h4>
                <p>
                  MC membacakan pertanyaan berikut. Berikan hadiah kepada peserta pertama yang
                  menjawab benar.
                </p>
                <dl className="rundown-quiz-answer-key">
                  <div><dt>Siapa nama Owner GGS?</dt><dd>Imel Arsawijaya</dd></div>
                  <div><dt>Kapan ulang tahun GGS?</dt><dd>25 Juni 2024</dd></div>
                  <div><dt>Sebutkan layanan yang ada di GGS.</dt><dd>Perlu dikonfirmasi</dd></div>
                  <div><dt>Apa tagline GGS?</dt><dd>“Grooming is Better”</dd></div>
                </dl>
                <span className="rundown-giveaway-tag">Selingan live music</span>
              </article>
              <article className="rundown-giveaway-option">
                <span className="rundown-giveaway-number">04</span>
                <h4>Komentar &amp; tag 5 teman</h4>
                <p>
                  Di postingan Instagram GGS, tulis alasan kenapa harus datang ke Grand Opening GGS
                  dan tag 5 teman. Pemenang dipilih lewat undian dari komentar yang memenuhi syarat.
                </p>
                <span className="rundown-giveaway-tag">Aktivasi pra-acara</span>
              </article>
            </div>

            <div className="rundown-giveaway-flow">
              <h4>Alur saat acara</h4>
              <ol>
                <li>MC menjelaskan cara ikut, hadiah, batas waktu, dan syarat klaim sebelum sesi dimulai.</li>
                <li>Panitia menutup pendaftaran atau verifikasi sesuai waktu yang diumumkan.</li>
                <li>MC mengundi kupon / memanggil pemenang kuis di sela penampilan band.</li>
                <li>Nomor pemenang dipanggil maksimal tiga kali; jika tidak hadir, lakukan undian ulang.</li>
                <li>Catat nama pemenang dan serah-terima hadiah untuk dokumentasi acara.</li>
              </ol>
            </div>

            <p className="rundown-giveaway-note">
              <strong>Perlu dipastikan sebelum publikasi:</strong> hashtag (bila digunakan), jumlah
              kupon/peserta, treatment yang memenuhi syarat poin, periode poin, tanggal pengundian,
              hadiah untuk tiap mekanisme, kriteria penilaian Story, serta batas waktu klaim. Tetapkan
              satu peserta satu kesempatan per mekanisme dan jangan meminta kata sandi atau kode OTP.
            </p>
          </section>

          <section className="rundown-games" aria-labelledby="rundown-games-title">
            <div className="rundown-games-heading">
              <div>
                <p className="rundown-eyebrow">Selingan hiburan malam</p>
                <h3 id="rundown-games-title">Games interaktif</h3>
              </div>
              <p>Dimainkan bersama MC di sela penampilan band; urutan dan durasi menyesuaikan suasana acara.</p>
            </div>
            <div className="rundown-games-grid">
              <article className="rundown-game-card">
                <span className="rundown-giveaway-number">01</span>
                <h4>Joged terheboh</h4>
                <p>
                  Ajak beberapa tamu untuk joget saat musik diputar. MC atau panitia memilih peserta
                  dengan jogetan paling seru; pastikan area tetap aman.
                </p>
              </article>
              <article className="rundown-game-card">
                <span className="rundown-giveaway-number">02</span>
                <h4>Sambung kata</h4>
                <p>
                  MC memberi kata awal. Peserta bergiliran menyebut kata yang berhubungan tanpa
                  mengulang; yang kehabisan ide atau terlalu lama menjawab gugur. Peserta terakhir
                  menjadi pemenang.
                </p>
              </article>
              <article className="rundown-game-card">
                <span className="rundown-giveaway-number">03</span>
                <h4>Sambung lagu</h4>
                <p>
                  MC memutar atau menyanyikan cuplikan lagu, lalu peserta melanjutkan bagian
                  berikutnya. MC menentukan jawaban yang tepat dan pemenang tiap ronde.
                </p>
              </article>
            </div>
            <p className="rundown-games-note">
              Hadiah pemenang games mengikuti alokasi doorprize yang disiapkan panitia.
            </p>
          </section>
        </section>

        <section className="rundown-schedule" aria-labelledby="rundown-schedule-title">
          <div className="rundown-section-heading">
            <div>
              <p className="rundown-eyebrow">Susunan acara</p>
              <h2 id="rundown-schedule-title">Jadwal kegiatan</h2>
            </div>
            <p>Waktu pelaksanaan dapat disesuaikan dengan kondisi acara di lapangan.</p>
          </div>

          <ol className="rundown-timeline">
            {rundownItems.map((item, index) => (
              <li className="rundown-event" key={`${item.start}-${item.title}`}>
                <div className="rundown-event-time">
                  <TimeLabel value={item.start} />
                  {item.end && (
                    <span>
                      – <TimeLabel value={item.end} />
                    </span>
                  )}
                </div>
                <article className="rundown-event-card">
                  <div className="rundown-event-topline">
                    <span className="rundown-event-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className={`rundown-category rundown-category-${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </li>
            ))}
          </ol>

          <p className="rundown-closing-note">
            <strong>Catatan:</strong> Jam pada jadwal adalah susunan awal dan dapat menyesuaikan
            kondisi di lapangan.
          </p>
        </section>
          </>
        )}
      </div>
    </main>
  );
}
