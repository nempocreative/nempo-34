export type RundownMcGuideEntry = {
  label: string;
  detail?: string;
};

export type RundownMcGuideSection = {
  title: string;
  intro?: string;
  entries?: RundownMcGuideEntry[];
  entryLayout?: 'grid' | 'stack';
  paragraphs?: string[];
  steps?: string[];
  tag?: string;
};

export type RundownMcGuideCard = {
  title: string;
  subtitle: string;
  sections: RundownMcGuideSection[];
};

export const rundownMcGuideCards: RundownMcGuideCard[] = [
  {
    title: 'Informasi acara & waktu',
    subtitle: 'Rundown Grand Opening · Minggu, 18 Oktober 2026',
    sections: [
      {
        title: 'Ringkasan acara',
        entries: [
          { label: 'Opening', detail: '10.00 WIB' },
          { label: 'Acara puncak', detail: '18.00 – selesai' },
          { label: 'Jam acara', detail: '10.00–22.00 WIB' },
        ],
      },
      {
        title: 'Rangkaian acara utama',
        entries: [
          { label: 'Opening Ceremony' },
          { label: 'Wedding Makeup Showcase' },
          { label: 'Live Music' },
          { label: 'DJ Performance' },
        ],
      },
      {
        title: 'Catatan waktu',
        paragraphs: [
          'Acara puncak dimulai pukul 18.00 WIB. Pembukaan sesi hiburan terjadwal pukul 18.30 WIB.',
        ],
      },
      {
        title: 'Rangkaian malam · Giveaway & apresiasi',
        paragraphs: [
          'Kuis dan doorprize berlangsung selama hiburan malam. Undian motor listrik memakai poin treatment dan dilakukan terpisah pada akhir Desember 2026.',
        ],
      },
    ],
  },
  {
    title: 'Tamu undangan yang disapa MC',
    subtitle: 'Sapaan kehormatan · Nama dan jabatan',
    sections: [
      {
        title: 'Pembuka: “Kepada yang terhormat”',
        intro: 'Sebutkan nama dan jabatan berikut satu per satu:',
        entryLayout: 'stack',
        entries: [
          { label: 'Hj. Diah Kurniasari', detail: 'Dewan DPR RI Komisi IV' },
          { label: 'Hj. Erni Herdiani', detail: 'Sekdis Dinas Koperasi Kab. Garut' },
          { label: 'Hj. Erna Sugjarti', detail: 'Mantan Kadis BPKAD Kab. Garut' },
          { label: 'Ibu Kikan Davanca', detail: 'Ketua Hairdresser Community Indonesia' },
        ],
      },
    ],
  },
  {
    title: 'Promo diskon salon tour',
    subtitle: 'Pengingat MC · Diskon 30% untuk semua treatment GGS',
    sections: [
      {
        title: 'Diskon 30% untuk semua treatment',
        intro: 'MC mengingatkan promo ini kepada tamu selama salon tour, termasuk layanan:',
        entries: [
          { label: 'Nail Art' },
          { label: 'Salon & Spa' },
          { label: 'Makeup' },
          { label: 'Treatment lainnya' },
        ],
      },
    ],
  },
  {
    title: 'Hadiah & aturan undian',
    subtitle: 'Grand prize akhir tahun · Doorprize · Hadiah produk',
    sections: [
      {
        title: 'Grand prize akhir tahun',
        entries: [{ label: 'Motor listrik', detail: '1 unit' }],
        paragraphs: [
          'Setiap transaksi treatment Rp1.000.000 mendapat 1.000 poin.',
          'Setiap 1.000 poin mendapat 1 nomor undian.',
          'Pengundian: akhir Desember 2026',
        ],
      },
      {
        title: 'Doorprize',
        entries: [
          { label: 'Magicom', detail: '2 unit' },
          { label: 'Dispenser', detail: '2 unit' },
          { label: 'Setrika', detail: '1 unit' },
          { label: 'Kipas angin', detail: '2 unit' },
          { label: 'Hair dryer', detail: '3 unit' },
          { label: 'Karaoke mini', detail: '3 unit' },
          { label: 'Voucher Rp100.000', detail: '20 voucher · total Rp2.000.000' },
        ],
      },
      {
        title: 'Hadiah produk',
        entries: [
          { label: 'Body serum tone up', detail: '50 pcs' },
          { label: 'Hair powder', detail: '20 pcs' },
          { label: 'Matte clay', detail: '15 pcs' },
          { label: 'Curly clay', detail: '15 pcs' },
        ],
      },
    ],
  },
  {
    title: 'Cara ikut giveaway · apresiasi',
    subtitle: 'Penghargaan pelanggan dan karyawan',
    sections: [
      {
        title: 'Apresiasi loyalitas pelanggan',
        entries: [
          { label: 'Pa Teguh' },
          { label: 'Pa Hj. Asep Bibit' },
          { label: 'Bu Hj. Zahra MBG' },
          { label: 'Fitria', detail: 'Seleb TikTok' },
        ],
      },
      {
        title: 'Penghargaan sahabat owner',
        entries: [
          { label: 'Cindy Kitty', detail: 'Sahabat Owner yang menemani perjalanan GGS' },
        ],
        paragraphs: [
          'Dibacakan setelah Band Si Matakaca Set 1, sebelum Games Joged Terheboh dan Set 2.',
        ],
      },
      {
        title: 'Karyawan terbaik',
        entries: [
          { label: 'Asep Ahong', detail: 'Head Barberman' },
          { label: 'Ilham Araf', detail: 'Supervisor Barberman' },
          { label: 'Rizka Nabila', detail: 'Head Admin GGS' },
        ],
      },
      {
        title: 'Pilihan mekanisme',
        paragraphs: [
          'Kupon, Story, dan kuis dapat dipakai untuk doorprize acara. Undian motor listrik menggunakan poin treatment dan berakhir pada akhir Desember 2026.',
        ],
      },
    ],
  },
  {
    title: 'Undian kupon & Instagram Story',
    subtitle: 'Mekanisme 01–02',
    sections: [
      {
        title: '01 · Undian kupon',
        paragraphs: [
          'Tamu mendapat satu nomor saat registrasi. MC mengundi nomor secara terbuka untuk doorprize grand opening.',
        ],
        tag: 'Doorprize saat acara',
      },
      {
        title: '02 · Instagram Story Terkece',
        paragraphs: [
          'Unggah Instagram Story paling kreatif saat grand opening, lalu tag @ggsbeauty.hair.co dan @hairstudio.ggs.grt. Tunjukkan Story ke panitia; akun privat dapat menunjukkan tangkapan layar. Panitia memilih Story terkece.',
        ],
        tag: 'Kontes kreativitas saat acara',
      },
    ],
  },
  {
    title: 'Kuis MC & komentar Instagram',
    subtitle: 'Mekanisme 03–04',
    sections: [
      {
        title: '03 · Kuis cepat dari MC',
        intro: 'MC membacakan pertanyaan berikut. Berikan hadiah kepada peserta pertama yang menjawab benar.',
        entries: [
          { label: 'Siapa nama Owner GGS?', detail: 'Imel Arsawijaya' },
          { label: 'Kapan ulang tahun GGS?', detail: '25 Juni 2024' },
          { label: 'Sebutkan layanan yang ada di GGS.', detail: 'Perlu dikonfirmasi' },
          { label: 'Apa tagline GGS?', detail: '“Grooming is Better”' },
        ],
        tag: 'Selingan live music',
      },
      {
        title: '04 · Komentar & tag 5 teman',
        paragraphs: [
          'Di postingan Instagram GGS, tulis alasan kenapa harus datang ke Grand Opening GGS dan tag 5 teman. Pemenang dipilih lewat undian dari komentar yang memenuhi syarat.',
        ],
        tag: 'Aktivasi pra-acara',
      },
    ],
  },
  {
    title: 'Alur giveaway saat acara',
    subtitle: 'Panduan MC & panitia',
    sections: [
      {
        title: 'Alur saat acara',
        steps: [
          'MC menjelaskan cara ikut, hadiah, batas waktu, dan syarat klaim sebelum sesi dimulai.',
          'Panitia menutup pendaftaran atau verifikasi sesuai waktu yang diumumkan.',
          'MC mengundi kupon / memanggil pemenang kuis di sela penampilan band.',
          'Nomor pemenang dipanggil maksimal tiga kali; jika tidak hadir, lakukan undian ulang.',
          'Catat nama pemenang dan serah-terima hadiah untuk dokumentasi acara.',
        ],
      },
    ],
  },
  {
    title: 'Catatan sebelum publikasi',
    subtitle: 'Hal yang perlu dipastikan oleh panitia',
    sections: [
      {
        title: 'Perlu dipastikan sebelum publikasi',
        paragraphs: [
          'Perlu dipastikan sebelum publikasi: hashtag (bila digunakan), jumlah kupon/peserta, treatment yang memenuhi syarat poin, periode poin, tanggal pengundian, hadiah untuk tiap mekanisme, kriteria penilaian Story, serta batas waktu klaim. Tetapkan satu peserta satu kesempatan per mekanisme dan jangan meminta kata sandi atau kode OTP.',
        ],
      },
    ],
  },
  {
    title: 'Games interaktif',
    subtitle: 'Selingan hiburan malam',
    sections: [
      {
        title: 'Games interaktif',
        intro: 'Dimainkan bersama MC di sela penampilan band; urutan dan durasi menyesuaikan suasana acara.',
        entryLayout: 'stack',
        entries: [
          {
            label: '01 · Joged terheboh',
            detail:
              'Ajak beberapa tamu untuk joget saat musik diputar. MC atau panitia memilih peserta dengan jogetan paling seru; pastikan area tetap aman.',
          },
          {
            label: '02 · Sambung kata',
            detail:
              'MC memberi kata awal. Peserta bergiliran menyebut kata yang berhubungan tanpa mengulang; yang kehabisan ide atau terlalu lama menjawab gugur. Peserta terakhir menjadi pemenang.',
          },
          {
            label: '03 · Sambung lagu',
            detail:
              'MC memutar atau menyanyikan cuplikan lagu, lalu peserta melanjutkan bagian berikutnya. MC menentukan jawaban yang tepat dan pemenang tiap ronde.',
          },
        ],
      },
    ],
  },
];
