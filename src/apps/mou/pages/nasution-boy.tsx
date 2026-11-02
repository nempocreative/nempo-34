type ScriptLine = {
  speaker?: string;
  text: string;
};

type ShootDetail = {
  framing: string;
  action: string;
};

export type VideoScene = {
  number: string;
  stage: string;
  title: string;
  visual: string;
  shootDetails: ShootDetail[];
  scriptType: 'Dialog' | 'Voice-over';
  lines: ScriptLine[];
  registrationFlow?: string[];
  entryRequirement?: string;
  tournamentInfo?: string;
  productReference?: {
    name: string;
    priceAndQuantity: string;
    message: string;
  };
  screenText?: string;
  cta?: string;
  hashtags?: string[];
};

export const videoScenes: VideoScene[] = [
  {
    number: '01',
    stage: 'HOOK',
    title: 'Cuma scroll video ini, langsung pengen ikutan?',
    visual:
      'Buka dengan Nasution Boy menemukan konten Jazy tentang aktivasi Mobile Legends saat sedang scroll. Ia langsung tertarik, menunjukkan konten itu ke tim, lalu mengajak mereka mencoba. Tutup dengan mereka berangkat ke Beri Kopi.',
    shootDetails: [
      {
        framing: 'Insert · konten Jazy di ponsel',
        action:
          'Tampilkan konten Jazy dari tautan referensi di layar ponsel. Gunakan cuplikan asli yang sudah diizinkan; bila tidak, rekam momen menemukan kontennya tanpa menyalin videonya.',
      },
      {
        framing: 'Close-up · reaksi Nasution Boy',
        action:
          'Ambil ekspresi penasaran lalu antusias saat Nasution Boy melihat konten. Sisipkan layar ponsel sebentar agar alasan ia tertarik langsung terbaca.',
      },
      {
        framing: 'Medium · ajak tim',
        action:
          'Nasution Boy menunjukkan konten itu ke teman-temannya dan mengajak mereka ikut mencoba. Rekam respons tim yang spontan dan kompak.',
      },
      {
        framing: 'Over-the-shoulder · lihat konten bersama',
        action:
          'Perlihatkan beberapa anggota tim melihat ponsel bersama. Jaga layar tetap singkat dan fokus pada reaksi mereka.',
      },
      {
        framing: 'Follow shot · berangkat',
        action:
          'Tutup dengan tim berdiri dan bersiap berangkat. Gunakan gerak kamera atau match cut menuju tampak luar Beri Kopi di scene berikutnya.',
      },
    ],
    scriptType: 'Dialog',
    lines: [
      {
        speaker: 'Nasution Boy',
        text: '“Gue cuma niat scroll bentar—eh, ada aktivasi Mobile Legends dari Jazy! Tim, kita cobain, yuk?”',
      },
      {
        speaker: 'Teman',
        text: '“Gas! Berangkat sekarang!”',
      },
    ],
    screenText: 'Scroll bentar, malah pengen ikut?',
  },
  {
    number: '02',
    stage: 'BERI KOPI',
    title: 'Sampai di Beri Kopi, langsung daftar',
    visual:
      'Lanjutkan keputusan dari scene sebelumnya: Nasution Boy dan tim tiba di Beri Kopi untuk mencoba aktivasi Jazy. Ambil papan nama atau tampak luar, momen masuk, lalu arahkan kamera ke booth dan proses pendaftaran.',
    shootDetails: [
      {
        framing: 'Wide · tampak luar Beri Kopi',
        action:
          'Buka scene dengan papan nama atau tampak luar. Tahan frame sebentar agar nama tempat terbaca sebelum tim masuk.',
      },
      {
        framing: 'Follow shot · perjalanan masuk',
        action:
          'Ikuti Nasution Boy dan tim dari belakang saat berjalan masuk. Jaga langkah kamera stabil dan biarkan mereka bergerak alami.',
      },
      {
        framing: 'Medium · dialog kedatangan',
        action:
          'Ambil dialog di depan area acara dengan booth atau suasana venue sebagai latar. Sisakan ruang di atas kepala dan jangan memotong gestur tangan.',
      },
      {
        framing: 'Insert · booth turnamen',
        action:
          'Ambil detail booth, materi turnamen, dan interaksi singkat dengan panitia. Pastikan tulisan yang memang tersedia di lokasi terbaca.',
      },
      {
        framing: 'Close-up · produk di booth',
        action:
          'Ambil produk sebagai cutaway di area booth, dengan nama produk terlihat jelas. Tidak perlu adegan penggunaan; cukup tampilkan konteks booth.',
      },
      {
        framing: 'Top-down · proses daftar',
        action:
          'Rekam urutan tangan saat menyelesaikan pendaftaran, lalu ambil detail pilihan kategori 1v1 atau 5v5. Hindari menampilkan data pribadi yang terbaca.',
      },
      {
        framing: 'Match cut · daftar ke match',
        action:
          'Tutup dengan jari memilih kategori atau menyentuh layar, lalu sambungkan gerakan yang sama ke jari mulai bermain di scene berikutnya.',
      },
    ],
    scriptType: 'Dialog',
    lines: [
      {
        speaker: 'Nasution Boy',
        text: '“Kita lihat konten Jazy-nya dan langsung penasaran. Sekarang udah sampai di Beri Kopi—langsung daftar, yuk!”',
      },
    ],
    registrationFlow: [
      'Datang ke booth',
      'Beli produk',
      'Isi data diri',
      'Pilih 1v1 atau 5v5',
      'Main',
    ],
    entryRequirement:
      'Syarat kategori sesuai brief: 1v1 — 1 bungkus rokok apa saja; 5v5 — 5 bungkus rokok apa saja.',
    productReference: {
      name: 'Jazy Max Filter',
      priceAndQuantity: 'Rp18.000 · 12 batang',
      message: '“Rasa penuh, aromanya kuat, tarikannya tetap smooth.”',
    },
  },
  {
    number: '03',
    stage: 'MULAI MAIN',
    title: 'Nasution Boy dan tim turun ke match',
    visual:
      'Lanjutkan dari pendaftaran: tampilkan Nasution Boy dan tim bermain Mobile Legends, reaksi saat match, serta crowd yang menonton. Setelah momen tim bermain, sorot hype final 5v5, pemenang, dan produk Jazy di booth.',
    shootDetails: [
      {
        framing: 'Wide · area pertandingan',
        action:
          'Bangun suasana match dengan gambar lebar pemain dan penonton. Ambil satu gerakan kamera pelan untuk memperlihatkan keramaian.',
      },
      {
        framing: 'Over-the-shoulder · gameplay',
        action:
          'Rekam layar permainan dari belakang pemain, lalu ambil insert tangan mengontrol game. Jaga fokus agar aksi di layar tetap terbaca.',
      },
      {
        framing: 'Close-up · fokus pemain',
        action:
          'Ambil wajah Nasution Boy dan anggota tim saat berkonsentrasi. Gunakan potongan pendek sebagai jeda di antara gambar gameplay.',
      },
      {
        framing: 'Reaction shot · tim dan penonton',
        action:
          'Arahkan kamera ke reaksi tim, lalu ke penonton yang ikut menyaksikan. Rekam suara sorakan venue beberapa detik untuk lapisan audio.',
      },
      {
        framing: 'Montage · final 5v5',
        action:
          'Selang-selingkan gameplay, jari di kontrol, dan reaksi penonton untuk membangun hype final. Jangan menambahkan skor atau hasil yang belum dikonfirmasi.',
      },
      {
        framing: 'Medium · pemenang',
        action:
          'Ambil momen pengumuman dan reaksi pemenang setelah nama dikonfirmasi panitia. Sisakan jeda untuk tepuk tangan atau ucapan selamat.',
      },
      {
        framing: 'Closing · tim dan CTA',
        action:
          'Ambil Nasution Boy bersama tim setelah match, lalu sisipkan cutaway booth. Tahan frame penutup cukup lama agar CTA dan hashtag terbaca.',
      },
    ],
    scriptType: 'Voice-over',
    lines: [
      {
        text: '“Akhirnya kita main juga! Match hari ini rame banget, apalagi final 5v5-nya. Selamat buat [nama pemenang—konfirmasi ke panitia]. Turnamennya lanjut lagi bulan depan!”',
      },
    ],
    tournamentInfo:
      '1v1: Top 3 best time masuk leaderboard. 5v5: berlanjut ke Grand Final. Total hadiah voucher diamond Rp10.000.000 setiap bulan.',
    screenText: 'Ada aja jalannya.',
    cta: 'Cek Instagram @jaztify_id untuk info venue di lokasimu. Sampai ketemu di Land of Dawn bulan depan, tunggu gue di sana!',
    hashtags: ['#AdaAjaJalannya', '#Jaztify', '#MobileLegendTournament'],
  },
];

export default function NasutionBoyPage() {
  return (
    <main className="workspace nasution-boy-workspace">
      <div className="nasution-boy-page">
        <header className="nasution-boy-hero">
          <div>
            <p className="nasution-boy-kicker">Video Feed IG + TikTok</p>
            <h1>Nasution Boy</h1>
            <p className="nasution-boy-event">JAZTIFY MOBILE LEGEND TOURNAMENT 2026</p>
            <p className="nasution-boy-intro">
              Konsep video vertikal: berawal dari konten Jazy yang membuat Nasution Boy dan tim
              penasaran, lalu datang ke Beri Kopi untuk mendaftar dan mencoba aktivasi.
            </p>
          </div>
          <div className="nasution-boy-format">
            <span>PLATFORM</span>
            <strong>IG Reels (Feed) + TikTok</strong>
            <span>URUTAN VIDEO</span>
            <strong>3 scene</strong>
          </div>
        </header>

        <ol className="nasution-boy-flow" aria-label="Urutan video">
          {videoScenes.map((beat) => (
            <li key={beat.number}>
              <span>{beat.number}</span>
              {beat.stage}
            </li>
          ))}
        </ol>

        <section className="nasution-boy-story-list" aria-label="Rincian video">
          {videoScenes.map((beat) => (
            <article className="nasution-boy-story-card" key={beat.number}>
              <div className="nasution-boy-story-index">
                <span className="nasution-boy-story-number">{beat.number}</span>
                <span className="nasution-boy-story-stage">{beat.stage}</span>
              </div>

              <div className="nasution-boy-story-content">
                <header className="nasution-boy-story-heading">
                  <span>SCENE {beat.number}</span>
                  <h2>{beat.title}</h2>
                </header>

                <div className="nasution-boy-story-details">
                  <section className="nasution-boy-story-block">
                    <h3>Arah visual</h3>
                    <p>{beat.visual}</p>
                    <div className="nasution-boy-shoot-list">
                      <div className="nasution-boy-shoot-heading">
                        <span>Rincian shoot</span>
                        <span>{beat.shootDetails.length} shot</span>
                      </div>
                      <ol>
                        {beat.shootDetails.map((shot, index) => (
                          <li key={`${beat.number}-shot-${index}`}>
                            <span className="nasution-boy-shoot-number">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <strong>{shot.framing}</strong>
                              <p>{shot.action}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </section>

                  <section className="nasution-boy-story-block nasution-boy-script">
                    <h3>{beat.scriptType}</h3>
                    <div className="nasution-boy-lines">
                      {beat.lines.map((line, index) => (
                        <blockquote key={`${beat.number}-${index}`}>
                          {line.speaker && <span>{line.speaker}</span>}
                          <p>{line.text}</p>
                        </blockquote>
                      ))}
                    </div>
                    {beat.registrationFlow && (
                      <div className="nasution-boy-registration">
                        <span>Alur pendaftaran</span>
                        <ol>
                          {beat.registrationFlow.map((step, index) => (
                            <li key={step}>
                              <b>{index + 1}</b>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {beat.entryRequirement && (
                      <p className="nasution-boy-brief-detail">
                        <strong>Syarat kategori</strong>
                        {beat.entryRequirement}
                      </p>
                    )}
                    {beat.productReference && (
                      <aside className="nasution-boy-product-reference">
                        <span>Referensi produk dari brief</span>
                        <strong>{beat.productReference.name}</strong>
                        <p>{beat.productReference.priceAndQuantity}</p>
                        <p>{beat.productReference.message}</p>
                      </aside>
                    )}
                    {beat.tournamentInfo && (
                      <p className="nasution-boy-brief-detail">
                        <strong>Format &amp; hadiah</strong>
                        {beat.tournamentInfo}
                      </p>
                    )}
                    {beat.screenText && (
                      <p className="nasution-boy-screen-text">
                        <span>Teks layar</span>
                        <strong>“{beat.screenText}”</strong>
                      </p>
                    )}
                    {beat.cta && (
                      <p className="nasution-boy-cta">
                        <span>CTA di layar</span>
                        <strong>“{beat.cta}”</strong>
                      </p>
                    )}
                    {beat.hashtags && (
                      <div className="nasution-boy-hashtags">
                        <span>Hashtag</span>
                        <div>
                          {beat.hashtags.map((hashtag) => (
                            <b key={hashtag}>{hashtag}</b>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </article>
          ))}
        </section>

      </div>
    </main>
  );
}
