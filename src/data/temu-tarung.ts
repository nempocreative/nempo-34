export type MatchStatus = "belum" | "berlangsung" | "selesai";

export interface MatchItem {
  no: number;
  kategori: string;
  berat: string;
  merah: string;
  campMerah: string;
  biru: string;
  campBiru: string;
  status: MatchStatus;
  pemenang?: "merah" | "biru";
  metode?: string;
}

export function getTypeLabel(k: string): "Stand Up Fight" | "MMA" | "For Men" | "Panco" | "Lainnya" {
  const kl = k.toLowerCase();
  if (kl.startsWith("mma")) return "MMA";
  if (kl.startsWith("for men")) return "For Men";
  if (kl.startsWith("panco")) return "Panco";
  return "Stand Up Fight";
}

export function getAgeLabel(k: string): string {
  const kl = k.toLowerCase();
  if (kl.startsWith("mma"))     return "MMA";
  if (kl.startsWith("for men")) return "For Men";
  if (kl.includes("anak"))      return "Anak";
  if (kl.includes("junior"))    return "Junior";
  if (kl.includes("senior"))    return "Senior";
  return "Open";
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Stand Up Fight": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "MMA":            { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "For Men":        { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  "Panco":          { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Lainnya":        { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
};

/* ── Jadwal Pertandingan ──────────────────────────────────────────
   Mulai   : 08:00
   Selesai : ±17:30  (99 match × 5,3 mnt + 2 istirahat = 569,7 mnt)
   Istirahat 1 — Zuhur  : setelah posisi ke-46  (≈12:04–12:34, 30 mnt)
   Istirahat 2 — Ashar  : setelah posisi ke-74  (≈15:02–15:17, 15 mnt)
   Urutan : Anak (1–6) · Stand Up Junior (7–23) · Street Boxing Junior (24–42)
            · Street Boxing Senior (43–68) · Stand Up+MMA Senior (69–99)
   getMatchJam menggunakan POSISI di array (bukan nilai no) agar gap
   nomor (75, 80, 93 dihapus; 117 dll) tidak menggeser jadwal.
─────────────────────────────────────────────────────────────────── */
const PER_MATCH   = 5.3;    // menit per match (99 match selesai jam 17:30)
const START_MIN   = 480;    // 08:00 → menit dari tengah malam
const ZUHUR_AFTER = 46;     // break setelah posisi ke-46 (~12:04)
const ASHAR_AFTER = 74;     // break setelah posisi ke-74 (~15:02)
const ZUHUR_DUR   = 30;     // menit
const ASHAR_DUR   = 15;     // menit

export function getMatchJam(no: number): string {
  // Gunakan posisi (1-based) di MATCHES array, bukan nilai no
  // sehingga gap nomor tidak menggeser jam
  const pos = MATCHES.findIndex(m => m.no === no) + 1;
  if (pos === 0) return "--:--";
  let minutes: number;
  if (pos <= ZUHUR_AFTER) {
    minutes = START_MIN + (pos - 1) * PER_MATCH;
  } else if (pos <= ASHAR_AFTER) {
    minutes = START_MIN + ZUHUR_AFTER * PER_MATCH + ZUHUR_DUR + (pos - ZUHUR_AFTER - 1) * PER_MATCH;
  } else {
    minutes =
      START_MIN +
      ZUHUR_AFTER * PER_MATCH + ZUHUR_DUR +
      (ASHAR_AFTER - ZUHUR_AFTER) * PER_MATCH + ASHAR_DUR +
      (pos - ASHAR_AFTER - 1) * PER_MATCH;
  }
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface MatchBreak {
  afterMatch: number;
  label: string;
  duration: string;
  jamMulai: string;
  jamSelesai: string;
}

export const MATCH_BREAKS: MatchBreak[] = [
  { afterMatch: 46,  label: "Istirahat Shalat Zuhur", duration: "30 menit", jamMulai: "12:04", jamSelesai: "12:34" },
  { afterMatch: 74,  label: "Istirahat Shalat Ashar", duration: "15 menit", jamMulai: "15:02", jamSelesai: "15:17" },
];

/* ── Matches ─────────────────────────────────────────────────────
   Urutan: ANAK (1–6) · Stand Up JUNIOR (7–23) · Street Boxing JUNIOR (24–42)
           · Street Boxing SENIOR (43–68) · Stand Up+MMA SENIOR (69–99)
   Laskar Daboribo diacak agar tidak berturut-turut dalam tiap kelompok.
   Darrell Narendra & Muhammad Fajar Majalaya: main malam (tidak termasuk bagan siang)
─────────────────────────────────────────────────────────────────── */
export const MATCHES: MatchItem[] = [

  /* ══════════════════ ANAK ══════════════════ */
  { no:1,  kategori:"Street Boxing (Anak)",                              berat:"30 kg", merah:"Taufik Yudistira Setiawan",    campMerah:"Laskar Daboribo Fighting Camp",              biru:"Haikal Faqihnaffidin",           campBiru:"Beta Boxing",                              status:"belum" },
  { no:2,  kategori:"Street Boxing (Putra Anak)",                        berat:"33 kg", merah:"Jonas Arthur",                 campMerah:"Beta Boxing",                                biru:"Syahrul Ramadhani Ritonga",      campBiru:"Trisula Camp",                             status:"belum" },
  { no:3,  kategori:"Street Boxing (Putri Anak)",                        berat:"31 kg", merah:"Tania Putri Setiawan",         campMerah:"Laskar Daboribo Fighting Camp",              biru:"Salwa Aulia",                    campBiru:"Dw Boxing",                                status:"belum" },
  { no:4,  kategori:"Stand Up Fight (Putra Anak)",                       berat:"36 kg", merah:"Rei Bahri",                    campMerah:"Baja Fight Academy",                         biru:"Hilal Wilka Fitra",              campBiru:"Muaythai Majalaya",                        status:"belum" },
  { no:5,  kategori:"Street Boxing Zero Junior Putra (0-1 X Main)",     berat:"63 kg", merah:"Maska Khalfani Fathir",        campMerah:"Fighter Of Mom",                             biru:"Phasya Muhammad Afrizal",        campBiru:"Sfc (secret Fighter Club)",                status:"belum" },
  { no:6,  kategori:"Street Boxing Anak Putra",                          berat:"36 kg", merah:"Muhammad Reyhan Herdian",      campMerah:"Garuda Intan Boxing",                        biru:"Muhamad Arkha Mirza",            campBiru:"Baja Fight Selatan",                       status:"belum" },

  /* ══════════════════ STAND UP JUNIOR ══════════════════ */
  /* 45 kg */
  { no:7,  kategori:"Stand Up Fight Zero Junior",                        berat:"45 kg", merah:"Iqbal Fauzan Munawar",         campMerah:"Laskar Daboribo",                            biru:"Zibal Akbar",                    campBiru:"Laskar Daboribo",                          status:"belum" },
  /* 48 kg */
  { no:8,  kategori:"Stand Up Fight (Putra Junior)",                     berat:"48 kg", merah:"Al - Gibran Mauladan",         campMerah:"Ciber Fighter Academy",                      biru:"Ori Perdiansyah Mulyadi",        campBiru:"B O.s.s Tasikmalaya",                      status:"belum" },
  { no:9,  kategori:"Stand Up Fight (Putri Zero) Junior",                berat:"48 kg", merah:"Resti Oktapiani",              campMerah:"Baja Fight Academy",                         biru:"Azkia Fauziah",                  campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:10, kategori:"Stand Up Fight (Putra Junior Zero)",                berat:"48 kg", merah:"Septian Syarif Hidayat",       campMerah:"Muaythai Majalaya",                          biru:"M Fajar Padilah",                campBiru:"Second House",                             status:"belum" },
  { no:11, kategori:"Stand Up Junior Putra Zero",                        berat:"48 kg", merah:"Rafa Ramadhan",                campMerah:"Baja Fight Garut Selatan",                   biru:"Muhammad Reski Ardiansyah",      campBiru:"Laskar Daboribo",                          status:"belum" },
  { no:12, kategori:"Stand Up Fight Zero Junior Putra",                  berat:"52 kg", merah:"Ilman Sabit",                  campMerah:"B.o.s.s Tasikmalaya",                        biru:"Fadhlan Abdurrofi",              campBiru:"Cibatu Street Fighter",                    status:"belum" },
  { no:13, kategori:"Stand Up Fight Zero Junior",                        berat:"48 kg", merah:"Sultan Albi Ramadan",          campMerah:"Laskar Daboribo",                            biru:"Atep Darmawan",                  campBiru:"Laskar Daboribo",                          status:"belum" },
  /* 52 kg */
  { no:14, kategori:"Stand Up Fight (Putra Junior)",                     berat:"52 kg", merah:"Jeri Alsipa",                  campMerah:"Boxing Sman 7garut",                         biru:"Perdinan Syakifah Al Insani",    campBiru:"Orluq",                                    status:"belum" },
  { no:15, kategori:"Stand Up Fight (Putra Junior)",                     berat:"52 kg", merah:"Adnan Oktar Al-Faruqi",        campMerah:"Shurulkhan",                                 biru:"Dafa Zahidan",                   campBiru:"Sanekala Fighting Camp",                   status:"belum" },
  { no:16, kategori:"Stand Up Fight Zero Junior Putra (0-1 X Main)",    berat:"52 kg", merah:"Reihan Febrian",               campMerah:"Thifan Po Khan",                             biru:"Fathan Azfarully Permadi",       campBiru:"Muaythai Pasma",                           status:"belum" },
  { no:17, kategori:"Stand Up Fight (Putra Junior)",                     berat:"52 kg", merah:"Rulian Husna Pratama",         campMerah:"Laskar Daboribo",                            biru:"Dennis Sandya Wiwaha",           campBiru:"B.o.s.s Tasikmalaya",                      status:"belum" },
  { no:18, kategori:"Stand Up Fight Zero Junior Putra",                  berat:"52 kg", merah:"Risan Aliansah",               campMerah:"Nbo",                                        biru:"Ruslan Nurjaman",                campBiru:"Mushajuku Mma",                            status:"belum" },
  /* 56 kg */
  { no:19, kategori:"Stand Up Fight (Putra Elite Junior)",               berat:"56 kg", merah:"Ricky Dwi",                    campMerah:"Sexyroad Fighting Club Balaqutax",           biru:"Sembara Carlos Setiawan",        campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:20, kategori:"Stand Up Junior Putra Zero",                        berat:"56 kg", merah:"Ganjar Prasetyo",              campMerah:"Boxing Sman 7 Garut",                        biru:"Rayi Nawwafi",                   campBiru:"B.o.s.s Tasikmalaya",                      status:"belum" },
  { no:21, kategori:"Stand Up Fight Zero Junior Putra",                  berat:"56 kg", merah:"Hifdi Rifa'i Nurjaman",        campMerah:"Komunitas Cikarang",                         biru:"Fitra Viking Ramadhan",          campBiru:"Sanekala Fighting Camp",                   status:"belum" },
  /* 61 kg */
  { no:22, kategori:"Stand Up Fight (Putra Junior)",                     berat:"61 kg", merah:"M Fahrul Muhajir",             campMerah:"Shurulkhan",                                 biru:"Fahmi Hermawan",                 campBiru:"Samba",                                    status:"belum" },
  /* 75 kg */
  { no:23, kategori:"Stand Up Fight Zero Junior Putri",                  berat:"75 kg", merah:"Savaira Nurtanisha Tantowi",   campMerah:"Mushajuku Mma",                              biru:"Nazma Sofi Sabrina",             campBiru:"Mushajuku Mma",                            status:"belum" },

  /* ══════════════════ STREET BOXING JUNIOR ══════════════════ */
  /* 48 kg */
  { no:24, kategori:"Street Boxing (Putra Elite Junior)",                berat:"48 kg", merah:"Geirend Firdaus Nurjaman",     campMerah:"Baja Fight Academy",                         biru:"Diwan Arjuraksa",                campBiru:"Laskar Daboribo",                          status:"belum" },
  { no:25, kategori:"Street Boxing (Junior Zero)",                       berat:"48 kg", merah:"Muhammad Fadly Tsaubudin",     campMerah:"Baja Fight Academy",                         biru:"Firman",                         campBiru:"Beta Boxing",                              status:"belum" },
  { no:26, kategori:"Street Boxing (Putra Junior)",                      berat:"48 kg", merah:"Moch Nazril Hanif",             campMerah:"Laskar Daboribo",                            biru:"Muhammad Irpan Hamid",            campBiru:"Riot Of Joy",                              status:"belum" },
  { no:27, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"48 kg", merah:"Sansan Setiawan",              campMerah:"Forty One Training Camp",                    biru:"Muhamad Daim Nur Cahya",         campBiru:"Garuda Intan Boxing",                      status:"belum" },
  { no:28, kategori:"Street Boxing (Putra) Junior",                      berat:"48 kg", merah:"Eshal Malik Ar Razi",          campMerah:"Laskar Daboribo",                            biru:"Azka Misdaq Munawwir",           campBiru:"Guardian Fighting Club",                   status:"belum" },
  { no:29, kategori:"Street Boxing (Putra Junior)",                      berat:"48 kg", merah:"Herdiansyah",                  campMerah:"Beta Boxing",                                biru:"Julpatul Sastra Wijaya",         campBiru:"Dw Boxing",                                status:"belum" },
  { no:30, kategori:"Street Boxing (Putra) Junior",                      berat:"48 kg", merah:"Fawwaz Ghasani Karir",         campMerah:"Laskar Daboribo",                            biru:"Fikri Alghani Wahyudi",          campBiru:"Guardian Fighting Club",                   status:"belum" },
  /* 52 kg */
  { no:31, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"52 kg", merah:"Helmi Agustina",               campMerah:"Baja Garut Selatan",                         biru:"Fajar Nursaid",                  campBiru:"Sman 7 Grt",                               status:"belum" },
  { no:32, kategori:"Street Boxing Junior Putra",                        berat:"48 kg", merah:"Thomas Julian",                campMerah:"Laskar Daboribo Fighting Camp",              biru:"Reksa Adiva",                    campBiru:"Taesyukhan",                               status:"belum" },
  { no:33, kategori:"Street Boxing (Putra Junior)",                      berat:"52 kg", merah:"Muhamad Fadlan",               campMerah:"Riot Of Joy",                                biru:"Leo Muhamad",                    campBiru:"No Camp",                                  status:"belum" },
  { no:34, kategori:"Street Boxing (Putra Junior)",                      berat:"52 kg", merah:"Muhamad Fitra",                campMerah:"Laskar Daboribo",                            biru:"Muhammad Khairul Ibad",          campBiru:"Walangsungsang",                           status:"belum" },
  { no:35, kategori:"Street Boxing (Putra) Junior",                      berat:"52 kg", merah:"M Ramdan Rizqi Al Mubaroh",    campMerah:"Beta Boxing",                                biru:"Refly Alfiah Supriatna",         campBiru:"Baja Garut Selatan",                       status:"belum" },
  /* 56 kg */
  { no:36, kategori:"Street Boxing (Putra Junior)",                      berat:"56 kg", merah:"Dihya Fayyad Fairuz",          campMerah:"Fighter Of Mom",                             biru:"Azka Rahman",                    campBiru:"3363 Fighting Club",                       status:"belum" },
  { no:37, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"56 kg", merah:"Revan Septian",                campMerah:"Cibatu Street Fighter",                      biru:"M Agni Aulia",                   campBiru:"Sw Fight Academy",                         status:"belum" },
  { no:38, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"56 kg", merah:"Aldo Mohamad Syawal Lukman",   campMerah:"3363 Fighting Club",                         biru:"Willy Wijaya",                   campBiru:"Baja Fight Academy",                       status:"belum" },
  { no:39, kategori:"Street Boxing Junior Zero",                         berat:"56 kg", merah:"Oswald Ritonga",               campMerah:"Baja Fight Academy",                         biru:"Davin Ziyad Hayfa",              campBiru:"Fighter Of Mom",                           status:"belum" },
  /* 61 kg */
  { no:40, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"61 kg", merah:"M Zulfan Raihan",              campMerah:"Baja Garut Selatan",                         biru:"Muhamad Helvin Fabian",          campBiru:"Beta Boxing",                              status:"belum" },
  { no:41, kategori:"Street Boxing (Putra Junior Zero)",                 berat:"61 kg", merah:"Satria Arif Rahman",           campMerah:"Cibatu Street Fighter",                      biru:"Al Kahfi Muhammad Pahlevi",      campBiru:"Mushajuku Camp",                           status:"belum" },
  /* 63 kg */
  { no:42, kategori:"Stand Up Fight Anak Putra",                         berat:"36 kg", merah:"Taufik Yudistira Setiawan",    campMerah:"Laskar Daboribo Fighting Camp",              biru:"Rediansyah",                     campBiru:"Nbo",                                      status:"belum" },

  /* ══════════════════ STREET BOXING SENIOR ══════════════════ */
  /* 45 kg */
  { no:43, kategori:"Street Boxing (Senior Zero Putri)",                 berat:"45 kg", merah:"Desi Listriana",               campMerah:"Laskar Daboribo Fighting Camp",              biru:"Rezqia Alnatasya",               campBiru:"No Camp",                                  status:"belum" },
  /* 48 kg */
  { no:44, kategori:"Street Boxing (Putri Zero)",                        berat:"48 kg", merah:"Bela Aulia",                   campMerah:"Baja Garut Selatan",                         biru:"Aura Putri Yusup",               campBiru:"Beta Boxing",                              status:"belum" },
  { no:45, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"48 kg", merah:"Ajri Cahya Firdaus",           campMerah:"Fighter Of Mom",                             biru:"Arifaldi Hermanto Ariga",        campBiru:"Baja Garut Selatan",                       status:"belum" },
  { no:46, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"48 kg", merah:"Riyadillah Fatul Zulmi",       campMerah:"Baja Fight Academy",                         biru:"Iwan Nirwana",                   campBiru:"Sfc (secret Fighter Club)",                status:"belum" },
  /* ── ISTIRAHAT ZUHUR setelah match #46 ── */
  /* 52 kg */
  { no:47, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"52 kg", merah:"Muhammad Bilal Abdulhaq",      campMerah:"Fighter Of Mom",                             biru:"Denis",                          campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:48, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"52 kg", merah:"Sundani",                      campMerah:"Sfc (secret Fighter Club)",                  biru:"Muhammad Afgan Maulana",         campBiru:"3363 Fighting Club",                       status:"belum" },
  { no:49, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"52 kg", merah:"Adam",                         campMerah:"Garuda Intan Boxing Camp",                   biru:"Rijal",                          campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:50, kategori:"Street Boxing (Putra Senior)",                      berat:"52 kg", merah:"Zamzam Khoerudin",             campMerah:"Riot Of Joy",                                biru:"Jibril Abdul Rahman",            campBiru:"Fighter Of Mom",                           status:"belum" },
  { no:51, kategori:"Street Boxing (Putra)",                             berat:"52 kg", merah:"Satria Ramanda",               campMerah:"Boxing Sman 7 Garut",                        biru:"Moch Fawwaz Alvarizzy",          campBiru:"3363 Fighting Club",                       status:"belum" },
  { no:52, kategori:"Street Boxing Zero Senior Putra (0-1 X Main)",     berat:"52 kg", merah:"Fandi Andriansah",             campMerah:"Baja Garut Selatan",                         biru:"Heri Herdiansyah",               campBiru:"Karsamedika X Nbo",                        status:"belum" },
  /* 56 kg */
  { no:53, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"56 kg", merah:"Ali Sahab",                   campMerah:"Baja Garut Selatan",                         biru:"Rifqi Nurfarhan",                campBiru:"No Camp",                                  status:"belum" },
  { no:54, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"56 kg", merah:"Hendro Nugraha",              campMerah:"Cakrabuana",                                 biru:"Guruh Gumilang",                 campBiru:"Garuda Intan Boxing",                      status:"belum" },
  /* 61 kg */
  { no:55, kategori:"Street Boxing (Putra Senior)",                      berat:"61 kg", merah:"Ridwan Maulana",              campMerah:"Cakra Buana",                                biru:"Asep Maulana Yusup",             campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:56, kategori:"Street Boxing (Putra Senior)",                      berat:"61 kg", merah:"Albar M Sofwann",             campMerah:"Per4tan",                                    biru:"Anggi Moh Ridwan",               campBiru:"Beta Boxing",                              status:"belum" },
  { no:57, kategori:"Street Boxing (Putra Senior)",                      berat:"61 kg", merah:"Hilal Muharom",               campMerah:"Taesyukhan",                                 biru:"Habiby Albukhori",               campBiru:"Ikatan Pelajar Sexy Road",                 status:"belum" },
  /* 63 kg */
  { no:58, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"63 kg", merah:"Muhammad Hisam",              campMerah:"Dagiang Aji Satria",                         biru:"Mochamad Dava Putra",            campBiru:"No Camp",                                  status:"belum" },
  { no:59, kategori:"Street Boxing Zero Senior Putra (0-1 X Main)",     berat:"63 kg", merah:"Dody Aria",                   campMerah:"Walasungsang",                               biru:"Andri Nurdiansah",               campBiru:"Dagiang Aji Satria",                       status:"belum" },
  /* 65 kg */
  { no:60, kategori:"Street Boxing (Putra)",                             berat:"65 kg", merah:"Muhammad Ananda Afgan",       campMerah:"Sman 19 Garut",                              biru:"Yusuf Mahendra",                 campBiru:"Ateng Fighting Club",                      status:"belum" },
  { no:61, kategori:"Street Boxing (Putra Senior)",                      berat:"65 kg", merah:"Fahri Abdillah Holilullah",   campMerah:"Komunitas Cikarang Berkelahi",               biru:"Ilham Wahyudi",                  campBiru:"Fighter Of Mom",                           status:"belum" },
  /* 70 kg */
  { no:62, kategori:"Street Boxing (Putra Senior)",                      berat:"70 kg", merah:"Nabil Ahmad Arroyan",         campMerah:"Poltekkes Kemeskes Jakarta 2",               biru:"Aldiyana",                       campBiru:"Fighter Of Mom",                           status:"belum" },
  { no:63, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"70 kg", merah:"Raziq Pratama Liraputra",     campMerah:"Mushajuku Mma",                              biru:"Muhammad Seprianda",             campBiru:"Walang Sungsang Fighter",                  status:"belum" },
  { no:64, kategori:"Street Boxing Zero Senior Putra (0-1 X Main)",     berat:"70 kg", merah:"Rabil Muhammad Sena",         campMerah:"Gold Lion Fight House",                      biru:"Muhamad Taopik",                 campBiru:"Sfc (secret Fighter Club)",                status:"belum" },
  /* 77 kg */
  { no:65, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"77 kg", merah:"Moch Dzikry Amarulloh",       campMerah:"Beta Boxing",                                biru:"Naufal Fadlan Rahayu",           campBiru:"Laskar Daboribo",                          status:"belum" },
  /* 83 kg */
  { no:66, kategori:"Street Boxing (Putra Senior Zero)",                 berat:"83 kg", merah:"Reza Andika",                 campMerah:"Sfc (secret Fighter Club)",                  biru:"Agung Pratama",                  campBiru:"Sw Fight Academy",                         status:"belum" },
  /* 77 kg */
  { no:67, kategori:"Street Boxing Senior Putra Zero",                   berat:"77 kg", merah:"Fathur Jamil",                campMerah:"Walasungsang",                               biru:"Ahmad Saeful Habib",             campBiru:"Laskar Daboribo",                          status:"belum" },
  /* 83 kg */
  { no:68, kategori:"Street Boxing (Putra Senior)",                      berat:"83 kg", merah:"Muhammad Rafsanjani Sonagar", campMerah:"Fighter Of Mom",                             biru:"Rais Sulaiman",                  campBiru:"Baja Fight Academy",                       status:"belum" },

  /* ══════════════════ STAND UP FIGHT SENIOR + MMA ══════════════════ */
  /* 52 kg */
  { no:69, kategori:"Stand Up Fight Senior Putra",                       berat:"52 kg", merah:"M Rizky Abdul Azis Mujamil",   campMerah:"Afa Training Camp",                         biru:"M. Rizki Mulyana",               campBiru:"Shurulkhan",                               status:"belum" },
  { no:70, kategori:"Stand Up Fight Senior Putra",                       berat:"52 kg", merah:"Fawwaz Mumtaz Hibrizi",        campMerah:"Baja Fight Academy",                         biru:"Rifaldy",                        campBiru:"Adipati Camp",                             status:"belum" },
  { no:71, kategori:"MMA (Putra Senior)",                                berat:"52 kg", merah:"Dikri Sulaiman",               campMerah:"Laskar Daboribo Fighting Camp",              biru:"Putra Pransetia Sembiring",      campBiru:"Ibca Mma Kota Bekasi",                     status:"belum" },
  { no:72, kategori:"MMA (Putra Senior)",                                berat:"52 kg", merah:"Muhammad Zaky Albaihaqi",      campMerah:"Pusaka Patali Wargi",                        biru:"Muhamad Riziq Ramdani",          campBiru:"Mushajuku Mma",                            status:"belum" },
  { no:73, kategori:"MMA (Putri Senior)",                                berat:"52 kg", merah:"Tyas Rianti",                  campMerah:"Mushajuku Mma",                              biru:"Estania Herawati",               campBiru:"Independent",                              status:"belum" },
  { no:74, kategori:"Stand Up Fight Zero Senior Putri (0-1 X Main)",    berat:"52 kg", merah:"Risris Riska Sanitri",         campMerah:"Baja Fight Academy",                         biru:"Chelsea Caroline",               campBiru:"Ibca Kota Bekasi",                         status:"belum" },
  /* ── ISTIRAHAT ASHAR setelah match #75 ── */
  /* 54 kg */
  { no:75, kategori:"For Men Striking MMA",                              berat:"54 kg", merah:"Anggi Kurniawan",              campMerah:"Bandung",                                    biru:"Moch Rivad",                     campBiru:"Majalaya",                                 status:"belum" },
  { no:76, kategori:"MMA (Putri Senior)",                                 berat:"56 kg", merah:"Elisa Bahtiar",                campMerah:"Mushajuku Mma",                              biru:"Oktavia Sintari Fani",           campBiru:"Kota Bekasi",                              status:"belum" },
  /* 56 kg */
  { no:77, kategori:"Stand Up Fight Senior Putra",                       berat:"56 kg", merah:"Aidil Ramadhani",             campMerah:"Afa Training Camp",                          biru:"Ryandi Heryana",                 campBiru:"Ibca Mma Kota Bekasi",                     status:"belum" },
  { no:78, kategori:"Stand Up Fight (Putra Zero)",                       berat:"56 kg", merah:"Daffa Dzakwan Muhadzdzib",     campMerah:"Baja Fight Academy",                         biru:"Galih Prabu Mulia",              campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:79, kategori:"MMA (Putra Senior)",                                berat:"56 kg", merah:"Asep Ricky Maulana",          campMerah:"Tarogong Fighter",                           biru:"Muhamad Iqbal",                  campBiru:"Independent Muaythai",                     status:"belum" },
  { no:80, kategori:"Stand Up Fight Putra Senior",                       berat:"56 kg", merah:"Nabil Al-Hakiim Mulyana",     campMerah:"Forty One Training Camp",                    biru:"Rico Firmansyah",                campBiru:"Independent Muaythai",                  status:"belum" },
  { no:81, kategori:"Stand Up Fight Putra Senior",                       berat:"63 kg", merah:"Wijaya Haerunas",             campMerah:"Baja Garut Selatan",                         biru:"Setiaji",                        campBiru:"Forty One Training Camp",                  status:"belum" },
  { no:82, kategori:"MMA Putra Senior",                                  berat:"56 kg", merah:"Eli Pangaribuan",             campMerah:"Ibca Kota Bekasi",                           biru:"Rizky Maulana",                  campBiru:"Dharma Kesatria Siswa Fighting Club",      status:"belum" },
  { no:82, kategori:"MMA Putra Senior",                                  berat:"56 kg", merah:"Rafli Muhammad Fachrizal",    campMerah:"Devenders Bois",                             biru:"Rizki Darmawan Siahaan",         campBiru:"Satria Negara",                            status:"belum" },
  /* 61 kg */
  { no:83, kategori:"Stand Up Fight (Putra Zero)",                       berat:"61 kg", merah:"Muhammad Arija Sakti Kadjaga",campMerah:"Baja Fight Academy",                         biru:"Fajar Muzaki",                   campBiru:"B.o.s.s Tasikmalaya",                      status:"belum" },
  { no:84, kategori:"MMA (Putra Senior)",                                berat:"61 kg", merah:"Mohammad Alfarraz Trirama",   campMerah:"Ibca Kota Bekasi",                           biru:"Alex Skander Siahaan",           campBiru:"Walangsungsang Fighter",                   status:"belum" },
  { no:85, kategori:"Stand Up Fight Zero Putra",                         berat:"61 kg", merah:"Pandu Dwi Putra",             campMerah:"Baja Garut Selatan",                         biru:"Junaidi Sugiarta Setiawan",      campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:86, kategori:"Stand Up Fight (Putra)",                            berat:"61 kg", merah:"Moch Regi Andalas Putra",     campMerah:"Vills Camp",                                 biru:"Asep Suherman",                  campBiru:"Forty One Training Camp",                  status:"belum" },
  { no:87, kategori:"MMA (Putra Senior)",                                berat:"61 kg", merah:"Kamal Akmaludin",             campMerah:"Mushajuku Mma",                              biru:"Ridho Ahmad Fauzan",             campBiru:"Laskar Daboribo Fighting Camp",            status:"belum" },
  { no:88, kategori:"Stand Up Fight Zero Senior Putra (0-1 X Main)",    berat:"61 kg", merah:"Andika Lahallo Mayor",        campMerah:"Ibca Kota Bekasi",                           biru:"Taufik Ramadan",                 campBiru:"Das Komanaga",                             status:"belum" },
  /* 63 kg */
  { no:89, kategori:"For Men Striking MMA",                              berat:"54 kg", merah:"Ucu Rohendi",                  campMerah:"Garut",                                      biru:"Dea Rendiansyah",                campBiru:"Garut",                                    status:"belum" },
  { no:90, kategori:"Stand Up Senior Putra Zero",                        berat:"63 kg", merah:"Rio Kurniawan",               campMerah:"Satria Negara Fighting Camp",                biru:"Roy Gunawan",                    campBiru:"Walasungsang",                             status:"belum" },
  /* 65 kg */
  /* 70 kg */
  { no:91, kategori:"MMA (Putra Senior)",                                berat:"70 kg", merah:"Bimo Catur Prasetyo",         campMerah:"Ibca Kota Bekasi",                           biru:"Rio Cahyadi",                    campBiru:"Mushajuku Mma",                            status:"belum" },
  { no:92, kategori:"Stand Up Fight Elite Senior Putra",                 berat:"70 kg", merah:"Faisal Maulana",              campMerah:"Ibca Mma Kota Bekasi",                       biru:"Amin Rajabi",                    campBiru:"Walasungsang Fighter",                     status:"belum" },
  { no:93, kategori:"Stand Up Fight (Putra Senior Zero)",                berat:"70 kg", merah:"Mihlayel Muhammad Saif",      campMerah:"Satria Negara Fighting Camp",                biru:"Muhammad Ibnu Al Athoriq",       campBiru:"Muaythai Majalaya",                        status:"belum" },
  /* 83 kg */
  { no:94, kategori:"MMA (Putra Senior)",                                berat:"83 kg", merah:"Mochamad Rafael Andinata",    campMerah:"Laskar Daboribo Fighting Camp",              biru:"Faizal Adriano",                 campBiru:"Walangsungsang Fighter",                   status:"belum" },
  { no:95, kategori:"MMA (Putra Senior)",                                berat:"83 kg", merah:"Mahesa Kusuma",               campMerah:"Mushajuku Mma",                              biru:"Rizqi Akbar Purnama",            campBiru:"Kota Bekasi",                              status:"belum" },
  { no:96,  kategori:"Stand Up Fight Zero Senior Putra (0-1 X Main)",    berat:"83 kg", merah:"Devaldo Dewani Putra",        campMerah:"Walangsungsang",                             biru:"Ikhsan Maula Zuhri",             campBiru:"Rbc Boxing",                               status:"belum" },

  /* ══════════════════ TAMBAHAN ══════════════════ */
  { no:97, kategori:"MMA Putra Senior",                                  berat:"65 kg", merah:"Muhammad Alrisal Firdaus",    campMerah:"Baja Fight Academy",                         biru:"Ahmad Pauzi",                    campBiru:"Satria Negara Fighting Camp",               status:"belum" },
  { no:98, kategori:"Street Boxing Zero Junior Putra",                   berat:"61 kg", merah:"Jordhan Immanuel",            campMerah:"Beta Boxing",                                biru:"Satria Sakit Putra Garma",       campBiru:"Garuda Intan Boxing",                      status:"belum" },

  { no:99, kategori:"MMA Putra Senior",                berat:"72 kg",      merah:"Muhammad Refin Saban M", campMerah:"Serdadu Team",                      biru:"Crisna Daniel",           campBiru:"Satria Negara Fighting Camp",       status:"belum" },

];

/* ══════════════════ PANCO (terpisah dari MATCHES utama) ═════════════════
   Sistem gugur — dua kelas berat
   Putra Ringan : ≤ 60 kg  (9 peserta — 1 preliminary + 4 R1 + 2 SF + 1 Final)
   Putra Berat  : > 61 kg s/d 85 kg  (8 peserta — 4 R1 + 2 SF + 1 Final)
════════════════════════════════════════════════ */
export const PANCO_MATCHES: MatchItem[] = [
  /* — Panco Putra Ringan ≤ 60 kg — */
  { no:102, kategori:"Panco Putra Ringan — Preliminary", berat:"≤ 60 kg",    merah:"Eli Pangaribuan",         campMerah:"", biru:"Abdul Aziz Aliansyah",   campBiru:"", status:"belum" },
  { no:103, kategori:"Panco Putra Ringan — Babak 1",     berat:"≤ 60 kg",    merah:"Hamdan Umara S",          campMerah:"", biru:"IDANG",                  campBiru:"", status:"belum" },
  { no:104, kategori:"Panco Putra Ringan — Babak 1",     berat:"≤ 60 kg",    merah:"M. Alwi Husein",          campMerah:"", biru:"Abdul Ghani",            campBiru:"", status:"belum" },
  { no:105, kategori:"Panco Putra Ringan — Babak 1",     berat:"≤ 60 kg",    merah:"Bahrul Ulum",             campMerah:"", biru:"Nawab Syaiban Pasahira", campBiru:"", status:"belum" },
  { no:106, kategori:"Panco Putra Ringan — Babak 1",     berat:"≤ 60 kg",    merah:"Shaka Fajar Maulana",     campMerah:"", biru:"Winner Match 102",       campBiru:"", status:"belum" },
  { no:107, kategori:"Panco Putra Ringan — Semifinal",   berat:"≤ 60 kg",    merah:"Winner Match 103",        campMerah:"", biru:"Winner Match 104",       campBiru:"", status:"belum" },
  { no:108, kategori:"Panco Putra Ringan — Semifinal",   berat:"≤ 60 kg",    merah:"Winner Match 105",        campMerah:"", biru:"Winner Match 106",       campBiru:"", status:"belum" },
  { no:109, kategori:"Panco Putra Ringan — Final",       berat:"≤ 60 kg",    merah:"Winner Match 107",        campMerah:"", biru:"Winner Match 108",       campBiru:"", status:"belum" },

  /* — Panco Putra Berat > 61 kg s/d 85 kg — */
  { no:110, kategori:"Panco Putra Berat — Babak 1",      berat:"> 61–85 kg", merah:"Algi",                    campMerah:"", biru:"Abil",                   campBiru:"", status:"belum" },
  { no:111, kategori:"Panco Putra Berat — Preliminary",  berat:"> 61–85 kg", merah:"Yusup Ginanjar",          campMerah:"", biru:"Nawab Syaiban Pasahira", campBiru:"", status:"belum" },
  { no:117, kategori:"Panco Putra Berat — Babak 1",      berat:"75 kg",      merah:"Winner Match 111",        campMerah:"", biru:"Soni",                   campBiru:"", status:"belum" },
  { no:112, kategori:"Panco Putra Berat — Babak 1",      berat:"> 61–85 kg", merah:"Muhammad Faqig Nurrahim", campMerah:"", biru:"Akbar Putra Pratama",    campBiru:"", status:"belum" },
  { no:113, kategori:"Panco Putra Berat — Babak 1",      berat:"> 61–85 kg", merah:"dudicvlog@gmail.com",     campMerah:"", biru:"Fadhil Khalifa Kahlan",  campBiru:"", status:"belum" },
  { no:114, kategori:"Panco Putra Berat — Semifinal",    berat:"> 61–85 kg", merah:"Winner Match 110",        campMerah:"", biru:"Winner Match 117",       campBiru:"", status:"belum" },
  { no:115, kategori:"Panco Putra Berat — Semifinal",    berat:"> 61–85 kg", merah:"Winner Match 112",        campMerah:"", biru:"Winner Match 113",       campBiru:"", status:"belum" },
  { no:116, kategori:"Panco Putra Berat — Final",        berat:"> 61–85 kg", merah:"Winner Match 114",        campMerah:"", biru:"Winner Match 115",       campBiru:"", status:"belum" },
];

/* ── Street Fight Day 1 (fun match, terpisah dari bracket utama) ── */
export interface StreetFightMatch {
  no: number;
  merah: string;
  biru: string;
  berat: string;
  pemenang?: "merah" | "biru";
  status: MatchStatus;
}

export const streetFightDay1: StreetFightMatch[] = [
  { no:1, merah:"Moch Edwards",          biru:"Diki Maulana",       berat:"60 kg", status:"belum" },
  { no:2, merah:"Muhammad Isal Setiawan", biru:"Rifky Dafani",       berat:"56 kg", status:"belum" },
  { no:3, merah:"Sandi Agustin",          biru:"Yuki Okta Garcia",   berat:"60 kg", status:"belum" },
  { no:4, merah:"Reki",                   biru:"Iqbal",              berat:"—",     status:"belum" },
  { no:5, merah:"Sidiq",                  biru:"Moch Guntur Verdian", berat:"55 kg", status:"belum" },
  { no:6, merah:"Andika Suryadi Reza",    biru:"Farhan S.R",         berat:"47 kg", status:"belum" },
  { no:7, merah:"Raka Radikha",           biru:"Rega Yudhistira",    berat:"60 kg", status:"belum" },
  { no:8, merah:"Fadhil Muhammad Fauzan", biru:"Revanza Hermawan",   berat:"—",     status:"belum" },
  { no:9, merah:"Muhammad Ghaisan",       biru:"Ridho Perwira",      berat:"—",     status:"belum" },
];

export const streetFightDay1Peserta = [
  { no:1,  nama:"Moch Edwards",           usia:19, bb:60, tb:168 },
  { no:2,  nama:"Sandi Agustin",          usia:19, bb:60, tb:170 },
  { no:3,  nama:"Farhan S.R",             usia:18, bb:49, tb:168 },
  { no:4,  nama:"Ridho Perwira",          usia:18, bb:90, tb:173 },
  { no:5,  nama:"Muhammad Isal Setiawan", usia:18, bb:56, tb:173 },
  { no:6,  nama:"Diki Maulana",           usia:18, bb:60, tb:170 },
  { no:7,  nama:"Raka Radikha",           usia:18, bb:59, tb:168 },
  { no:8,  nama:"Rifky Dafani",           usia:17, bb:55, tb:165 },
  { no:9,  nama:"Yuki Okta Garcia",       usia:17, bb:61, tb:160 },
  { no:10, nama:"Muhammad Ghaisan",       usia:16, bb:64, tb:165 },
  { no:11, nama:"Revanza Hermawan",       usia:16, bb:46, tb:164 },
  { no:12, nama:"Sidiq",                  usia:16, bb:55, tb:163 },
  { no:13, nama:"Andika Suryadi Reza",    usia:15, bb:47, tb:167 },
  { no:14, nama:"Rega Yudhistira",        usia:24, bb:60, tb:0   },
  { no:15, nama:"Fadhil Muhammad Fauzan", usia:18, bb:52, tb:166 },
  { no:16, nama:"Moch Guntur Verdian",    usia:20, bb:58, tb:164 },
];

/* ─────────────────────────────────────────────────────────────────
   RUNDOWN DATA (shared: crew portal + event detail public page)
───────────────────────────────────────────────────────────────── */
export interface RundownItem {
  bn: number;
  bt: string;
  time: string;
  end: string;
  activity: string;
  loc: string;
  div: string;
  block: string;
  type: "admin" | "meeting" | "ceremony" | "match" | "special" | "break";
}

export const RUNDOWN_DAY1: RundownItem[] = [
  { bn: 1, bt: "08.00–11.00",   time: "08.00", end: "08.15",    activity: "Setup & Administrasi Timbang Badan",                    loc: "Indoor Gedung SOR",          div: "Tim Medis & Security",                 block: "Timbang Badan & Cek Medis",          type: "admin"    },
  { bn: 1, bt: "08.00–11.00",   time: "08.15", end: "09.15",    activity: "Timbang Badan & Cek Medis Kloter 1",                    loc: "Indoor Gedung SOR",          div: "Tim Medis & Matchmaker",               block: "Timbang Badan & Cek Medis",          type: "admin"    },
  { bn: 1, bt: "08.00–11.00",   time: "09.15", end: "10.15",    activity: "Timbang Badan & Cek Medis Kloter 2",                    loc: "Indoor Gedung SOR",          div: "Tim Medis & Matchmaker",               block: "Timbang Badan & Cek Medis",          type: "admin"    },
  { bn: 1, bt: "08.00–11.00",   time: "10.15", end: "11.00",    activity: "Final Check & Sinkronisasi Data Medis",                 loc: "Indoor Gedung SOR",          div: "Matchmaker & Juri",                    block: "Timbang Badan & Cek Medis",          type: "admin"    },
  { bn: 2, bt: "11.00–12.00",   time: "11.00", end: "11.10",    activity: "Pembukaan & Roll Call Briefing",                        loc: "Dispora",                    div: "Ikhsan",                               block: "Rules Briefing & Technical Meeting",  type: "meeting"  },
  { bn: 2, bt: "11.00–12.00",   time: "11.10", end: "11.40",    activity: "Pemaparan Aturan & Sistem Poin",                        loc: "Indoor Gedung SOR",          div: "Promotor & Wasit Kepala",              block: "Rules Briefing & Technical Meeting",  type: "meeting"  },
  { bn: 2, bt: "11.00–12.00",   time: "11.40", end: "12.00",    activity: "Tanya Jawab & Lock Dokumen / Pakta",                    loc: "Indoor Gedung SOR",          div: "Promotor & Wasit Kepala",              block: "Rules Briefing & Technical Meeting",  type: "meeting"  },
  { bn: 3, bt: "12.00–13.00",   time: "12.00", end: "12.30",    activity: "Jeda Teknis — Makan Siang Panitia",                     loc: "Area Luar / Lapangan",       div: "Divisi Konsumsi & PJ Lapangan",        block: "Transisi & Persiapan Pawai",         type: "break"    },
  { bn: 3, bt: "12.00–13.00",   time: "12.30", end: "13.00",    activity: "Persiapan 2 Bis Sonagar & Barisan Moge",                loc: "Halaman Depan SOR",          div: "Koordinator Motor & LO Transportasi",  block: "Transisi & Persiapan Pawai",         type: "admin"    },
  { bn: 4, bt: "13.00–14.30",   time: "13.00", end: "13.15",    activity: "Kick-Off Pelepasan Rombongan Pawai",                    loc: "Gerbang Utama SOR",          div: "Promotor & Humas",                     block: "Pawai Protokol Kota",                type: "ceremony" },
  { bn: 4, bt: "13.00–14.30",   time: "13.15", end: "14.15",    activity: "Pawai Atlet — 2 Bis Sonagar Keliling Garut",            loc: "Merdeka → Kerkof → Leuwi Daun → Jayaraga → Simpang Lima → Pataruman → Ciateul → SOR", div: "PJ: Candra · LO: Rifki & Fiki", block: "Pawai Protokol Kota", type: "ceremony" },
  { bn: 4, bt: "13.00–14.30",   time: "14.15", end: "14.30",    activity: "Rombongan Kembali & Pengkondisian",                     loc: "Panggung Ekspresi Luar",     div: "Stage Manager & MC Outdoor",           block: "Pawai Protokol Kota",                type: "admin"    },
  { bn: 5, bt: "14.30–15.30",   time: "14.30", end: "15.30",    activity: "MC Masuk: Ice Breaking bersama Komunitas & Tenant UMKM", loc: "Panggung Ekspresi Luar",   div: "MC Outdoor & Tenant UMKM",             block: "Ice Breaking & UMKM",                type: "special"  },
  { bn: 6, bt: "15.30–16.30",   time: "15.30", end: "16.30",    activity: "TALKSHOW PANEL EDUKASI OUTDOOR",                        loc: "Panggung Ekspresi Luar",     div: "Stage Manager & Divisi Acara",         block: "Talkshow Panel Edukasi",             type: "special"  },
  { bn: 7, bt: "16.30–18.45",   time: "16.30", end: "18.45",    activity: "Iringan DJ — Sepanjang Sesi Community War",             loc: "Mega Arena (Aspal Tengah)",  div: "DJ & Sound Engineer",                  block: "Community War & Festival Sore",      type: "special"  },
  { bn: 7, bt: "16.30–18.45",   time: "16.30", end: "16.45",    activity: "Opening Community War: Moge Entry",                     loc: "Mega Arena (Aspal Tengah)",  div: "PJ: Candra",                           block: "Community War & Festival Sore",      type: "ceremony" },
  { bn: 7, bt: "16.30–18.45",   time: "16.45", end: "17.05",    activity: "STREET FIGHT JALANAN — LAGA 1",                         loc: "Matras Tengah Sirkuit Moge", div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 7, bt: "16.30–18.45",   time: "17.05", end: "17.25",    activity: "PANCO BATTLE — Babak Penyisihan",                       loc: "Meja Panco Sirkuit Moge",    div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 7, bt: "16.30–18.45",   time: "17.25", end: "17.45",    activity: "STREET FIGHT JALANAN — LAGA 2",                         loc: "Matras Tengah Sirkuit Moge", div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 7, bt: "16.30–18.45",   time: "17.45", end: "18.05",    activity: "PANCO BATTLE — Babak Semifinal",                        loc: "Meja Panco Sirkuit Moge",    div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 7, bt: "16.30–18.45",   time: "18.05", end: "18.25",    activity: "STREET FIGHT — MAIN EVENT KO",                          loc: "Matras Tengah Sirkuit Moge", div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 7, bt: "16.30–18.45",   time: "18.25", end: "18.45",    activity: "FINAL PANCO & OPEN CHALLENGE",                          loc: "Meja Panco Sirkuit Moge",    div: "PJ: Iky & Pandu",                      block: "Community War & Festival Sore",      type: "match"    },
  { bn: 8, bt: "18.45–19.15",   time: "18.45", end: "19.00",    activity: "Jeda Suara Total — Adzan Maghrib",                      loc: "Seluruh Area Venue",         div: "PJ Sound System & Keamanan",           block: "Jeda Maghrib & Night Prep",          type: "break"    },
  { bn: 8, bt: "18.45–19.15",   time: "19.00", end: "19.10",    activity: "Transaksi Kuliner & Istirahat Malam",                   loc: "Area Festival / UMKM",       div: "Tenant UMKM & Multimedia",             block: "Jeda Maghrib & Night Prep",          type: "break"    },
  { bn: 9, bt: "19.15–20.00",   time: "19.15", end: "19.20",    activity: "Opening Gimmick: Blackout Panggung",                    loc: "Panggung Ekspresi Luar",     div: "Show Director & Lighting",             block: "Grand Opening Night Show",           type: "ceremony" },
  { bn: 9, bt: "19.15–20.00",   time: "19.20", end: "19.40",    activity: "OFFICIAL PRESS CONFERENCE OUTDOOR",                    loc: "Panggung Ekspresi Luar",     div: "Promotor & Humas",                     block: "Grand Opening Night Show",           type: "meeting"  },
  { bn: 9, bt: "19.15–20.00",   time: "19.40", end: "20.00",    activity: "THE FACE-OFF ADRENALIN! (Staredown)",                  loc: "Panggung Ekspresi Luar",     div: "Show Director & Security",             block: "Grand Opening Night Show",           type: "ceremony" },
  { bn:10, bt: "20.00–21.15",   time: "20.00", end: "21.00",    activity: "GALA DINNER VIP",                                       loc: "Tenda Lounge Outdoor",       div: "PJ Lounge VIP & Konsumsi",             block: "Night Festival & Gala Dinner",       type: "special"  },
  { bn:10, bt: "20.00–21.15",   time: "20.00", end: "20.15",    activity: "CEREMONY HADIAH KOMUNITAS",                             loc: "Panggung Ekspresi Luar",     div: "Promotor / Sponsor Utama",             block: "Night Festival & Gala Dinner",       type: "ceremony" },
  { bn:10, bt: "20.00–21.15",   time: "20.15", end: "21.15",    activity: "NIGHT FESTIVAL: LIVE DJ PARTY",                        loc: "Panggung Ekspresi Luar",     div: "DJ & Stage Manager Outdoor",           block: "Night Festival & Gala Dinner",       type: "special"  },
  { bn:11, bt: "21.15–Selesai", time: "21.15", end: "21.30",    activity: "DJ Closing Set & Imbauan Bubar Tertib",                 loc: "Panggung Ekspresi Luar",     div: "MC Outdoor & Security",                block: "Penutupan",                          type: "ceremony" },
  { bn:11, bt: "21.15–Selesai", time: "21.30", end: "Selesai",  activity: "Briefing Kamar Gelap Panitia",                          loc: "Tenda Lounge VIP",           div: "Promotor & Semua Koordinator",         block: "Penutupan",                          type: "meeting"  },
];

export const RUNDOWN_DAY2: RundownItem[] = [
  { bn: 1, bt: "07.00–12.00", time: "07.00", end: "07.40", activity: "Open Gate Penonton & Registrasi Atlet",               loc: "Pintu Masuk & Backstage",     div: "LO Atlet & LO Tribun",              block: "Sesi Pagi",          type: "admin"    },
  { bn: 1, bt: "07.00–12.00", time: "07.40", end: "07.45", activity: "Opening Pagi: Welcoming MC",                          loc: "Octagon",                     div: "Stage Manager (SM)",                block: "Sesi Pagi",          type: "ceremony" },
  { bn: 1, bt: "07.00–12.00", time: "07.45", end: "07.50", activity: "Seremoni Pagi: Indonesia Raya & Doa",                 loc: "Octagon",                     div: "LO Wasit & MC",                     block: "Sesi Pagi",          type: "ceremony" },
  { bn: 1, bt: "07.00–12.00", time: "07.50", end: "07.55", activity: "Sambutan Ketua Panitia",                               loc: "Octagon",                     div: "LO VIP",                            block: "Sesi Pagi",          type: "meeting"  },
  { bn: 1, bt: "07.00–12.00", time: "07.55", end: "08.00", activity: "Fighter Briefing & Janji Wasit",                       loc: "Octagon",                     div: "LO Wasit",                          block: "Sesi Pagi",          type: "meeting"  },
  { bn: 1, bt: "07.00–12.04", time: "08.00", end: "08.53", activity: "KLOTER 1: Match 01–10",                               loc: "Octagon",                     div: "Wasit Kepala & Announcer Meja",     block: "Sesi Pagi",          type: "match"    },
  { bn: 1, bt: "07.00–12.04", time: "08.53", end: "09.47", activity: "KLOTER 2: Match 11–20",                               loc: "Octagon",                     div: "Wasit Kepala & Announcer Meja",     block: "Sesi Pagi",          type: "match"    },
  { bn: 1, bt: "07.00–12.04", time: "09.47", end: "10.40", activity: "KLOTER 3: Match 21–30",                               loc: "Octagon",                     div: "Wasit Kepala & Announcer Meja",     block: "Sesi Pagi",          type: "match"    },
  { bn: 1, bt: "07.00–12.04", time: "10.40", end: "11.33", activity: "KLOTER 4: Match 31–40",                               loc: "Octagon",                     div: "Wasit Kepala & Announcer Meja",     block: "Sesi Pagi",          type: "match"    },
  { bn: 1, bt: "07.00–12.04", time: "11.33", end: "12.04", activity: "KLOTER 5: Match 41–46",                               loc: "Octagon",                     div: "Wasit Kepala & Announcer Meja",     block: "Sesi Pagi",          type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "12.04", end: "12.34", activity: "ISHOMA Zuhur & Re-Set Arena",                         loc: "Stand Kuliner UMKM",          div: "LO Konsumsi & Kru Ring",            block: "Sesi Siang & Sore",  type: "break"    },
  { bn: 2, bt: "12.04–17.30", time: "12.34", end: "13.27", activity: "KLOTER 6: Match 47–56",                               loc: "Octagon",                     div: "LO Atlet & Wasit",                  block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "13.27", end: "14.20", activity: "KLOTER 7: Match 57–66",                               loc: "Octagon",                     div: "LO Atlet & Wasit",                  block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "14.20", end: "15.02", activity: "KLOTER 8: Match 67–74",                               loc: "Octagon",                     div: "LO Atlet & Wasit",                  block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "15.02", end: "15.17", activity: "Ishoma Asar (Break 15 Menit)",                        loc: "Tribun Arena",                div: "LO Konsumsi",                       block: "Sesi Siang & Sore",  type: "break"    },
  { bn: 2, bt: "12.04–17.30", time: "15.17", end: "16.10", activity: "KLOTER 9: Match 76–84",                               loc: "Octagon",                     div: "LO Atlet & Wasit",                  block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "16.10", end: "17.03", activity: "KLOTER 10: Match 85–94",                              loc: "Octagon",                     div: "LO Atlet & Wasit",                  block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 2, bt: "12.04–17.30", time: "17.03", end: "17.30", activity: "KLOTER 11: Match 95–99 (Final Matches)",              loc: "Octagon",                     div: "Wasit Kepala & LO Atlet",           block: "Sesi Siang & Sore",  type: "match"    },
  { bn: 3, bt: "17.30–18.30", time: "17.30", end: "18.00", activity: "Live Musik Sunda",                                    loc: "Main Stage Arena",            div: "LO Talent & Sound Eng.",            block: "Sterilisasi & Gladi Bersih",         type: "special"  },
  { bn: 3, bt: "17.30–18.30", time: "18.00", end: "18.30", activity: "Break Maghrib & Sterilisasi VIP",                     loc: "Indoor Gedung SOR",           div: "Stage Manager & Security",          block: "Sterilisasi & Gladi Bersih",         type: "break"    },
  { bn: 4, bt: "18.30–Selesai", time: "18.30", end: "18.50", activity: "SUPER ELITE 1: Exsel Vernaldo (Satria Negara/IBCA) vs Feanaldo (Walasungsang) — MMA Putra 65 kg",                                             loc: "Ring Utama", div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "18.50", end: "18.53", activity: "MC: Post-Match Super Elite 1",                                  loc: "Ring Utama",        div: "MC Utama",                         block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "18.53", end: "19.13", activity: "SUPER ELITE 2: Agil Septian (Baja Fight Academy) vs Satria Nazarheksa Nandika (B.O.S.S Kick Boxing) — Stand Up Fight Senior Putra 52 kg",    loc: "Ring Utama", div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "19.13", end: "19.16", activity: "MC: Post-Match Super Elite 2",                                  loc: "Ring Utama",        div: "MC Utama",                         block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "19.16", end: "19.36", activity: "SUPER ELITE 3: Muhammad Fhajar (Muaythai Boxing Majalaya) vs Darrell Narendra (Baja X Dulur) — Stand Up Fight Putra Junior 52 kg",           loc: "Ring Utama", div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "19.36", end: "19.39", activity: "MC: Post-Match Super Elite 3",                                  loc: "Ring Utama",        div: "MC Utama",                         block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "19.39", end: "19.44", activity: "ALUR 1: Mapag Sunda — Penyambutan Tamu VVIP",                   loc: "Karpet Merah & Pintu VVIP", div: "LO VIP & Sanggar Seni",   block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "19.44", end: "19.49", activity: "ALUR 2: Tari Sampurasun",                                       loc: "Area Panggung & Ring",      div: "Sanggar Seni & SM",       block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "19.49", end: "19.51", activity: "ALUR 3: BLACKOUT ARENA",                                        loc: "Seluruh Arena SOR",         div: "Lighting & SM",           block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "19.51", end: "19.56", activity: "ALUR 4: Video Bumper Temu Tarung",                              loc: "LED Screen Arena",          div: "Multimedia Screen Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "19.56", end: "20.01", activity: "ALUR 5: Berkibarlah Bendera Negeriku × Tari Bendera",           loc: "Area Panggung & Ring",      div: "LO Talent & Sound Eng.", block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.01", end: "20.06", activity: "ALUR 6: Pertunjukan Silat",                                     loc: "Kanvas Ring Utama",         div: "LO Talent 1 & Lighting",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.06", end: "20.15", activity: "ALUR 7: Lagu Negeriku × Tari Bendera & 4 Penari Tradisional",   loc: "Area Panggung & Ring",      div: "LO Talent & Sound Eng.", block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.15", end: "20.20", activity: "ALUR 8: Pemanggilan Atlet Pro ke Ring",                         loc: "Kanvas Ring Utama",         div: "LO Atlet & Duet MC",      block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "20.20", end: "20.23", activity: "ALUR 9: Grand Stand Fighter & Guest Star — Indonesia Raya",     loc: "Seluruh Arena SOR",         div: "MC Utama & Session Singer", block: "Malam Puncak — Super Elite & Pro", type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "20.23", end: "20.25", activity: "ALUR 10: Jingle Temu Tarung × Videotron → MC Masuk",           loc: "LED Videotron & Panggung",  div: "Multimedia & MC Utama",   block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.25", end: "20.33", activity: "ALUR 11: Bumper Promotor",                                      loc: "LED Screen Arena",          div: "Multimedia Screen Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.33", end: "20.40", activity: "ALUR 12: Sambutan Promotor & Sponsor Recognition",              loc: "Kanvas Ring Utama",         div: "MC Utama & LO Sponsor",   block: "Malam Puncak — Super Elite & Pro",  type: "meeting"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.40", end: "20.45", activity: "ALUR 13: Sambutan Bupati Garut",                                loc: "Kanvas Ring Utama",         div: "LO VIP & Protokoler",     block: "Malam Puncak — Super Elite & Pro",  type: "meeting"  },
  { bn: 4, bt: "18.30–Selesai", time: "20.45", end: "20.50", activity: "ALUR 14: MC Hype Build-up (Persiapan Match 1)",                 loc: "Kanvas Ring Utama",         div: "MC Utama",                block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "20.50", end: "21.10", activity: "MATCH 1: Resnu Sundava (Bandung) vs Ifandi Saputra (Sumatera Selatan)",                           loc: "Kanvas Ring Utama",         div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "21.10", end: "21.13", activity: "MC: Seremoni Post-Match 1 & Pengumuman Hasil",                  loc: "Kanvas Ring Utama",         div: "MC Utama",                block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "21.13", end: "21.33", activity: "MATCH 2: Aziz Yousofi vs Ahmad Fathurrohman — Perebutan Piala Dandim",                           loc: "Kanvas Ring Utama",         div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "21.33", end: "21.36", activity: "MC: Seremoni Post-Match 2 & Pengumuman Hasil",                  loc: "Kanvas Ring Utama",         div: "MC Utama",                block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "21.36", end: "21.56", activity: "Penampilan DJ × Penari Mojang Priangan — Hiburan Jeda",         loc: "Main Stage Arena",          div: "Guest DJ & LO Talent",    block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "21.56", end: "22.16", activity: "MATCH 3: Bimo Catur Prasetyo (IBCA Kota Bekasi) vs Rio Cahyadi (Mushajuku MMA) — MMA Putra Senior 70 kg", loc: "Kanvas Ring Utama", div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "22.16", end: "22.19", activity: "MC: Seremoni Post-Match 3 & Pengumuman Hasil",                  loc: "Kanvas Ring Utama",         div: "MC Utama",                block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "22.19", end: "22.39", activity: "MATCH 4: Fauzzan Hasanuddin (Bandung) vs Albi Dianto (Garut) — Perebutan Piala Kapolres",        loc: "Kanvas Ring Utama",         div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "22.39", end: "22.42", activity: "MC: Seremoni Post-Match 4 & Pengumuman Hasil",                  loc: "Kanvas Ring Utama",         div: "MC Utama",                block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "22.42", end: "23.00", activity: "Penampilan Bajidor — Hiburan Jeda Spesial",                     loc: "Main Stage Arena",          div: "LO Talent & Sound Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "23.00", end: "23.20", activity: "MATCH 5: Finalis 4 Men — Perebutan Piala Bupati Garut",         loc: "Kanvas Ring Utama",         div: "Wasit Kepala & LO Atlet", block: "Malam Puncak — Super Elite & Pro",  type: "match"    },
  { bn: 4, bt: "18.30–Selesai", time: "23.20", end: "23.23", activity: "MC: Seremoni Post-Match 5, Pengumuman Hasil & Penyerahan Piala Bupati", loc: "Kanvas Ring Utama",  div: "MC Utama & LO VIP",       block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "23.23", end: "23.38", activity: "Penampilan Pleasure Noise — Pemanasan Menuju Main Event",        loc: "Main Stage Arena",          div: "LO Talent & Sound Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "23.38", end: "00.08", activity: "MATCH 6 ★ MAIN EVENT: Papi Malik 🇵🇰 vs Hoordad Golpour 🇮🇷 — Perebutan Piala Biduri", loc: "Kanvas Ring Utama Premium", div: "LO Seleb & Security", block: "Malam Puncak — Super Elite & Pro", type: "match" },
  { bn: 4, bt: "18.30–Selesai", time: "00.08", end: "00.11", activity: "MC: Seremoni Grand Closing & Penyerahan Piala Biduri",           loc: "Kanvas Ring Utama",         div: "MC Utama & LO VIP",       block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
  { bn: 4, bt: "18.30–Selesai", time: "00.11", end: "00.26", activity: "Penampilan Pleasure Noise — Penutup Malam Puncak",               loc: "Main Stage Arena",          div: "LO Talent & Sound Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "00.26", end: "00.46", activity: "Penampilan Musik Sunda Asik — Persembahan Penutup",              loc: "Main Stage Arena",          div: "LO Talent & Sound Eng.",  block: "Malam Puncak — Super Elite & Pro",  type: "special"  },
  { bn: 4, bt: "18.30–Selesai", time: "00.46", end: "Selesai", activity: "DJ Closing & Grand Awarding — Sign-Off Resmi Temu Tarung Vol. 2", loc: "Main Stage Arena",       div: "DJ & Seluruh Panitia",    block: "Malam Puncak — Super Elite & Pro",  type: "ceremony" },
];

export interface WaitlistItem {
  nama: string;
  camp: string;
  kategori: string;
  berat: string;
}

export const daftarTunggu: WaitlistItem[] = [
  { nama: "Ilham Akbar",            camp: "Baladewa TC",          kategori: "Stand Up Fight Senior Putra",              berat: "52 kg" },
  { nama: "Abdan Kurniawan",        camp: "Fighter Of Mom",        kategori: "Street Boxing Elite Junior Putra (2-5 X Main)", berat: "56 kg" },
  { nama: "Raka Maulana Sidik",     camp: "Baja Fight Academy",    kategori: "Stand Up Fight Zero Junior Putra (0-1 X Main)", berat: "65 kg" },
  { nama: "Ahmad Nurrodin",         camp: "Baja Garut Selatan",    kategori: "Street Boxing Zero Senior Putra (0-1 X Main)",  berat: "65 kg" },
  { nama: "Viea Putri Rohendi",     camp: "Kota Bekasi",           kategori: "Stand Up Fight Zero Senior Putri (0-1 X Main)", berat: "56 kg" },
  { nama: "Dini Hermadiani",        camp: "SMAN 7 Garut",          kategori: "Street Boxing Zero Junior Putri (0-1 X Main)",  berat: "61 kg" },
  { nama: "Nazma Maulia Maharani",  camp: "Laskar Daboribo",       kategori: "Street Boxing Zero Junior Putri (0-1 X Main)",  berat: "52 kg" },
  { nama: "Nazwa Oktaviani",        camp: "Garuda Intan Boxing",   kategori: "Street Boxing Anak Putri",                      berat: "39 kg" },
  { nama: "Oktavia Sintari Fani",   camp: "Kota Bekasi",           kategori: "MMA Putri Senior",                              berat: "56 kg" },
  { nama: "Aprillia Rahmawati",     camp: "Pengcab Kota Bekasi",   kategori: "Standup Fight Elite Senior Putri (2-5 X Main)", berat: "52 kg" },
  { nama: "Alphard Atharik",        camp: "Boxing SMAN 7 Garut",   kategori: "Street Boxing Putra Junior Zero",               berat: "52 kg" },
  { nama: "Jeremia Hutahaean",      camp: "Warrior MMA",           kategori: "MMA Putra Senior",                              berat: "77 kg" },
  { nama: "Kyan Yudit Aditya",      camp: "Walasungsang",          kategori: "MMA Putra Senior",                              berat: "83 kg" },
  { nama: "Eslam Ahmed Mohammed",   camp: "Satria Negara",         kategori: "MMA Putra Senior",                              berat: "75 kg" },
];
