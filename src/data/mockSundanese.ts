export interface SundaneseWord {
  id: string;
  sunda: string;
  indonesia: string;
  pronunciation: string;
  category: string;
  example?: string;
  exampleId?: string;
  level: "dasar" | "menengah" | "lanjut";
}

export const mockSundanese: SundaneseWord[] = [
  /* ── Sapaan ─────────────────────────────── */
  { id: "1",  sunda: "Hatur Nuhun",    indonesia: "Terima Kasih",                   pronunciation: "ha·tur nu·hun",      category: "Sapaan",       level: "dasar",    example: "Hatur nuhun pisan kanggo bantosanana.",     exampleId: "Terima kasih banyak atas bantuannya." },
  { id: "3",  sunda: "Sampurasun",     indonesia: "Permisi / Halo (salam masuk)",    pronunciation: "sam·pu·ra·sun",      category: "Sapaan",       level: "dasar",    example: "Sampurasun, aya nu di bumina?",             exampleId: "Permisi, apakah ada orang di rumah?" },
  { id: "4",  sunda: "Rampes",         indonesia: "Ya / Silakan (balasan salam)",    pronunciation: "ram·pes",            category: "Sapaan",       level: "dasar",    example: "Rampes, mangga asup.",                     exampleId: "Silakan, silakan masuk." },
  { id: "31", sunda: "Wilujeng Sumping",indonesia: "Selamat Datang",                pronunciation: "wi·lu·jeng sum·ping", category: "Sapaan",       level: "dasar",    example: "Wilujeng sumping di Garut!",               exampleId: "Selamat datang di Garut!" },
  { id: "32", sunda: "Wilujeng Enjing", indonesia: "Selamat Pagi",                  pronunciation: "wi·lu·jeng en·jing",  category: "Sapaan",       level: "dasar",    example: "Wilujeng enjing, Kang.",                   exampleId: "Selamat pagi, Kak." },
  { id: "33", sunda: "Wilujeng Siang",  indonesia: "Selamat Siang",                 pronunciation: "wi·lu·jeng si·ang",   category: "Sapaan",       level: "dasar" },
  { id: "34", sunda: "Wilujeng Wengi",  indonesia: "Selamat Malam",                 pronunciation: "wi·lu·jeng weng·i",   category: "Sapaan",       level: "dasar" },
  { id: "35", sunda: "Punten Wae",      indonesia: "Permisi Saja",                  pronunciation: "pun·ten wa·e",        category: "Sapaan",       level: "menengah" },

  /* ── Tanya ─────────────────────────────── */
  { id: "2",  sunda: "Kumaha",         indonesia: "Bagaimana / Apa Kabar",          pronunciation: "ku·ma·ha",           category: "Tanya",        level: "dasar",    example: "Kumaha damang?",                           exampleId: "Apa kabar? (Bagaimana sehat?)" },
  { id: "7",  sunda: "Saha",           indonesia: "Siapa",                          pronunciation: "sa·ha",              category: "Tanya",        level: "dasar",    example: "Saha nu di bumi?",                         exampleId: "Siapa yang di rumah?" },
  { id: "8",  sunda: "Iraha",          indonesia: "Kapan",                          pronunciation: "i·ra·ha",            category: "Tanya",        level: "dasar",    example: "Iraha urang angkat?",                      exampleId: "Kapan kita berangkat?" },
  { id: "9",  sunda: "Di mana",        indonesia: "Di mana",                        pronunciation: "di ma·na",           category: "Tanya",        level: "dasar" },
  { id: "10", sunda: "Naon",           indonesia: "Apa",                            pronunciation: "na·on",              category: "Tanya",        level: "dasar",    example: "Naon nu dipikahayang?",                    exampleId: "Apa yang diinginkan?" },
  { id: "18", sunda: "Nuju Naon",      indonesia: "Sedang Apa",                     pronunciation: "nu·ju na·on",        category: "Tanya",        level: "dasar",    example: "Nuju naon di bumi?",                       exampleId: "Sedang apa di rumah?" },
  { id: "19", sunda: "Bade Kamana",    indonesia: "Mau ke Mana",                   pronunciation: "ba·de ka·ma·na",     category: "Tanya",        level: "dasar",    example: "Bade kamana, Neng?",                       exampleId: "Mau ke mana, Dek?" },
  { id: "36", sunda: "Sabaraha",       indonesia: "Berapa (Harga / Jumlah)",        pronunciation: "sa·ba·ra·ha",        category: "Tanya",        level: "dasar",    example: "Sabaraha ieu?",                            exampleId: "Berapa harga ini?" },
  { id: "37", sunda: "Naha",           indonesia: "Kenapa / Mengapa",               pronunciation: "na·ha",              category: "Tanya",        level: "dasar",    example: "Naha teu hayang tuang?",                   exampleId: "Kenapa tidak mau makan?" },

  /* ── Sopan Santun ──────────────────────── */
  { id: "5",  sunda: "Punten",         indonesia: "Permisi / Maaf",                 pronunciation: "pun·ten",            category: "Sopan Santun", level: "dasar",    example: "Punten, tiasa tumaros?",                   exampleId: "Permisi, boleh bertanya?" },
  { id: "6",  sunda: "Mangga",         indonesia: "Silakan",                        pronunciation: "mang·ga",            category: "Sopan Santun", level: "dasar",    example: "Mangga, calik heula.",                     exampleId: "Silakan, duduk dulu." },
  { id: "11", sunda: "Muhun",          indonesia: "Ya / Baik (halus)",              pronunciation: "mu·hun",             category: "Sopan Santun", level: "dasar",    example: "Muhun, leres pisan.",                      exampleId: "Ya, benar sekali." },
  { id: "38", sunda: "Hapunten",       indonesia: "Mohon Maaf",                     pronunciation: "ha·pun·ten",         category: "Sopan Santun", level: "dasar",    example: "Hapunten upami aya salah.",                exampleId: "Mohon maaf jika ada kesalahan." },
  { id: "39", sunda: "Nuhun",          indonesia: "Terima Kasih (informal)",         pronunciation: "nu·hun",             category: "Sopan Santun", level: "dasar" },

  /* ── Umum ──────────────────────────────── */
  { id: "12", sunda: "Henteu",         indonesia: "Tidak",                          pronunciation: "hen·teu",            category: "Umum",         level: "dasar",    example: "Henteu acan leres.",                       exampleId: "Belum benar." },
  { id: "20", sunda: "Pisan",          indonesia: "Sekali / Sangat",                pronunciation: "pi·san",             category: "Umum",         level: "dasar",    example: "Geulis pisan.",                            exampleId: "Cantik sekali." },
  { id: "40", sunda: "Enya",           indonesia: "Iya (informal)",                 pronunciation: "en·ya",              category: "Umum",         level: "dasar" },
  { id: "41", sunda: "Teu Acan",       indonesia: "Belum",                          pronunciation: "teu a·can",          category: "Umum",         level: "dasar",    example: "Abdi teu acan dahar.",                     exampleId: "Saya belum makan." },
  { id: "42", sunda: "Parantos",       indonesia: "Sudah",                          pronunciation: "pa·ran·tos",         category: "Umum",         level: "dasar",    example: "Parantos rengse.",                         exampleId: "Sudah selesai." },
  { id: "43", sunda: "Abdi",           indonesia: "Saya (halus)",                   pronunciation: "ab·di",              category: "Umum",         level: "dasar",    example: "Abdi ti Garut.",                           exampleId: "Saya dari Garut." },
  { id: "44", sunda: "Aing",           indonesia: "Saya (kasar / informal)",         pronunciation: "a·ing",              category: "Umum",         level: "dasar" },
  { id: "45", sunda: "Anjeun",         indonesia: "Kamu / Anda (halus)",            pronunciation: "an·jeun",            category: "Umum",         level: "dasar",    example: "Anjeun ti mana?",                          exampleId: "Kamu dari mana?" },
  { id: "46", sunda: "Urang",          indonesia: "Kita / Saya (sehari-hari)",      pronunciation: "u·rang",             category: "Umum",         level: "dasar",    example: "Urang angkat bareng.",                     exampleId: "Kita berangkat bersama." },

  /* ── Sifat ─────────────────────────────── */
  { id: "13", sunda: "Sae",            indonesia: "Bagus / Baik",                   pronunciation: "sa·e",               category: "Sifat",        level: "dasar",    example: "Eta barang sae pisan.",                    exampleId: "Barang itu sangat bagus." },
  { id: "16", sunda: "Geulis",         indonesia: "Cantik",                         pronunciation: "geu·lis",            category: "Sifat",        level: "dasar",    example: "Neng na geulis pisan.",                    exampleId: "Gadisnya cantik sekali." },
  { id: "17", sunda: "Kasep",          indonesia: "Tampan",                         pronunciation: "ka·sep",             category: "Sifat",        level: "dasar" },
  { id: "25", sunda: "Gancang",        indonesia: "Cepat",                          pronunciation: "gan·cang",           category: "Sifat",        level: "dasar",    example: "Leumpang gancang.",                        exampleId: "Jalan cepat." },
  { id: "26", sunda: "Lalaunan",       indonesia: "Pelan-pelan",                    pronunciation: "la·lau·nan",         category: "Sifat",        level: "dasar" },
  { id: "27", sunda: "Raos",           indonesia: "Enak (Makanan)",                 pronunciation: "ra·os",              category: "Sifat",        level: "dasar",    example: "Mangga, tuang, raos pisan!",               exampleId: "Silakan makan, enak sekali!" },
  { id: "47", sunda: "Alus",           indonesia: "Bagus / Halus",                  pronunciation: "a·lus",              category: "Sifat",        level: "dasar" },
  { id: "48", sunda: "Hese",           indonesia: "Susah / Sulit",                  pronunciation: "he·se",              category: "Sifat",        level: "dasar",    example: "Hese pisan soalnya.",                      exampleId: "Soalnya susah sekali." },
  { id: "49", sunda: "Gampil",         indonesia: "Mudah / Gampang",               pronunciation: "gam·pil",            category: "Sifat",        level: "dasar" },
  { id: "50", sunda: "Lapar",          indonesia: "Lapar",                          pronunciation: "la·par",             category: "Sifat",        level: "dasar",    example: "Abdi lapar pisan.",                        exampleId: "Saya sangat lapar." },

  /* ── Orang ─────────────────────────────── */
  { id: "14", sunda: "Awewé",          indonesia: "Perempuan",                      pronunciation: "a·we·we",            category: "Orang",        level: "dasar" },
  { id: "15", sunda: "Pameget",        indonesia: "Laki-laki",                      pronunciation: "pa·me·get",          category: "Orang",        level: "dasar" },
  { id: "51", sunda: "Indung",         indonesia: "Ibu",                            pronunciation: "in·dung",            category: "Orang",        level: "dasar",    example: "Indung abdi ti Garut.",                    exampleId: "Ibu saya dari Garut." },
  { id: "52", sunda: "Bapa",           indonesia: "Ayah / Bapak",                  pronunciation: "ba·pa",              category: "Orang",        level: "dasar" },
  { id: "53", sunda: "Adi",            indonesia: "Adik",                           pronunciation: "a·di",               category: "Orang",        level: "dasar" },
  { id: "54", sunda: "Lanceuk",        indonesia: "Kakak",                          pronunciation: "lan·ceuk",           category: "Orang",        level: "menengah", example: "Lanceuk abdi aya di bumi.",                exampleId: "Kakak saya ada di rumah." },
  { id: "55", sunda: "Aki",            indonesia: "Kakek",                          pronunciation: "a·ki",               category: "Orang",        level: "dasar" },
  { id: "56", sunda: "Nini",           indonesia: "Nenek",                          pronunciation: "ni·ni",              category: "Orang",        level: "dasar" },

  /* ── Waktu ─────────────────────────────── */
  { id: "21", sunda: "Sakedap",        indonesia: "Sebentar",                       pronunciation: "sa·ke·dap",          category: "Waktu",        level: "dasar",    example: "Sakedap deui sumping.",                    exampleId: "Sebentar lagi datang." },
  { id: "22", sunda: "Enjing",         indonesia: "Besok / Pagi",                   pronunciation: "en·jing",            category: "Waktu",        level: "dasar" },
  { id: "23", sunda: "Wengi",          indonesia: "Malam",                          pronunciation: "weng·i",             category: "Waktu",        level: "dasar" },
  { id: "24", sunda: "Dinten",         indonesia: "Hari",                           pronunciation: "din·ten",            category: "Waktu",        level: "dasar" },
  { id: "57", sunda: "Ayeuna",         indonesia: "Sekarang",                       pronunciation: "a·yeu·na",           category: "Waktu",        level: "dasar",    example: "Ayeuna urang angkat.",                     exampleId: "Sekarang kita berangkat." },
  { id: "58", sunda: "Kamari",         indonesia: "Kemarin",                        pronunciation: "ka·ma·ri",           category: "Waktu",        level: "dasar" },
  { id: "59", sunda: "Isuk-isuk",      indonesia: "Pagi-pagi",                      pronunciation: "i·suk·i·suk",        category: "Waktu",        level: "dasar" },
  { id: "60", sunda: "Peuting",        indonesia: "Malam (larut)",                  pronunciation: "peu·ting",           category: "Waktu",        level: "menengah" },

  /* ── Kata Kerja ─────────────────────────── */
  { id: "28", sunda: "Tuang",          indonesia: "Makan (halus)",                  pronunciation: "tu·ang",             category: "Kata Kerja",   level: "dasar",    example: "Mangga tuang heula.",                      exampleId: "Silakan makan dulu." },
  { id: "29", sunda: "Eueut",          indonesia: "Minum",                          pronunciation: "eu·eut",             category: "Kata Kerja",   level: "dasar" },
  { id: "30", sunda: "Kulem",          indonesia: "Tidur",                          pronunciation: "ku·lem",             category: "Kata Kerja",   level: "dasar" },
  { id: "61", sunda: "Leumpang",       indonesia: "Jalan / Berjalan",               pronunciation: "leum·pang",          category: "Kata Kerja",   level: "dasar",    example: "Urang leumpang ka pasar.",                 exampleId: "Kita berjalan ke pasar." },
  { id: "62", sunda: "Angkat",         indonesia: "Pergi / Berangkat",              pronunciation: "ang·kat",            category: "Kata Kerja",   level: "dasar",    example: "Abdi bade angkat ka Bandung.",             exampleId: "Saya mau pergi ke Bandung." },
  { id: "63", sunda: "Sumping",        indonesia: "Datang",                         pronunciation: "sum·ping",           category: "Kata Kerja",   level: "dasar",    example: "Iraha anjeun sumping?",                    exampleId: "Kapan kamu datang?" },
  { id: "64", sunda: "Dahar",          indonesia: "Makan (informal)",               pronunciation: "da·har",             category: "Kata Kerja",   level: "dasar" },
  { id: "65", sunda: "Calik",          indonesia: "Duduk (halus)",                  pronunciation: "ca·lik",             category: "Kata Kerja",   level: "dasar",    example: "Mangga calik di dieu.",                    exampleId: "Silakan duduk di sini." },
  { id: "66", sunda: "Nangtung",       indonesia: "Berdiri",                        pronunciation: "nang·tung",          category: "Kata Kerja",   level: "menengah" },
  { id: "67", sunda: "Ngomong",        indonesia: "Berbicara / Ngomong",            pronunciation: "ngo·mong",           category: "Kata Kerja",   level: "dasar" },

  /* ── Tempat ─────────────────────────────── */
  { id: "68", sunda: "Bumi",           indonesia: "Rumah (halus)",                  pronunciation: "bu·mi",              category: "Tempat",       level: "dasar",    example: "Abdi di bumi.",                            exampleId: "Saya di rumah." },
  { id: "69", sunda: "Imah",           indonesia: "Rumah (informal)",               pronunciation: "i·mah",              category: "Tempat",       level: "dasar" },
  { id: "70", sunda: "Pasar",          indonesia: "Pasar",                          pronunciation: "pa·sar",             category: "Tempat",       level: "dasar" },
  { id: "71", sunda: "Sawah",          indonesia: "Sawah",                          pronunciation: "sa·wah",             category: "Tempat",       level: "dasar" },
  { id: "72", sunda: "Gunung",         indonesia: "Gunung",                         pronunciation: "gu·nung",            category: "Tempat",       level: "dasar" },
  { id: "73", sunda: "Walungan",       indonesia: "Sungai",                         pronunciation: "wa·lu·ngan",         category: "Tempat",       level: "menengah" },

  /* ── Peribahasa ─────────────────────────── */
  { id: "74", sunda: "Ulah Taluk",     indonesia: "Jangan Menyerah",               pronunciation: "u·lah ta·luk",       category: "Peribahasa",   level: "lanjut",   example: "Ulah taluk najan beurat.",                 exampleId: "Jangan menyerah walau berat." },
  { id: "75", sunda: "Heug Bae",       indonesia: "Baiklah / Oke (santai)",         pronunciation: "heug ba·e",          category: "Peribahasa",   level: "menengah", example: "Heug bae, urang satuju.",                  exampleId: "Baiklah, kita setuju." },
  { id: "76", sunda: "Lain Tibatan",   indonesia: "Bukan Daripada",                pronunciation: "la·in ti·ba·tan",    category: "Peribahasa",   level: "lanjut" },
  { id: "77", sunda: "Tacan Cukup",    indonesia: "Belum Cukup",                   pronunciation: "ta·can cu·kup",      category: "Peribahasa",   level: "menengah" },
];

export const sundaCategories = [
  "Semua", "Sapaan", "Tanya", "Sopan Santun", "Umum",
  "Sifat", "Orang", "Waktu", "Kata Kerja", "Tempat", "Peribahasa"
];

export const phraseOfDay = mockSundanese[0];
