// Source: Kenalan Nempo, wedding slides 10–13 (nempocreative/organizer).
export const weddingPackages = [
  {
    name: "Essential", price: 2500000, team: 4,
    intro: "Koordinasi inti untuk hari yang tertata.",
    items: ["Konsultasi dan koordinasi persiapan", "Penyusunan rundown acara", "Koordinasi vendor dan briefing", "Koordinasi pada hari-H"],
    digitalInvitationAndSawer: false,
  },
  {
    name: "Signature", price: 4000000, team: 6,
    intro: "Ruang koordinasi lebih luas untuk keluarga dan tamu.",
    items: ["Semua layanan Essential", "Koordinasi vendor lebih detail", "Koordinasi keluarga, tamu, dan alur acara", "PIC khusus lapangan", "Persiapan teknis dan evaluasi rundown"],
    digitalInvitationAndSawer: true,
  },
  {
    name: "Premium", price: 6000000, team: 8,
    intro: "Pengawasan menyeluruh dari persiapan hingga acara selesai.",
    items: ["Semua layanan Signature", "Timeline persiapan menyeluruh", "Koordinasi vendor lintas divisi", "Koordinasi keluarga dan tamu VIP", "Pengawasan rundown dari awal hingga akhir", "PIC utama dan PIC lapangan"],
    digitalInvitationAndSawer: true,
  },
] as const;

export const weddingAdatOptions = [
  {
    name: "Dengan musik live", normal: 3500000, special: 2800000,
    description: "Iringan musik tradisional untuk menghadirkan suasana adat Sunda secara langsung.",
    music: "Kendang · Kecapi · Suling · Sinden · Perkusi",
    performers: "4 penari · Lengser · Ambu · Baksa",
  },
  {
    name: "Tanpa musik live", normal: 2500000, special: 1800000,
    description: "Fokus pada prosesi dan pertunjukan adat tanpa kelompok musik live.",
    music: null,
    performers: "4 penari · Lengser · Ambu · Baksa",
  },
] as const;

export function weddingTotal(woPrice: number, adatPrice: number) {
  return woPrice + adatPrice;
}

export function weddingRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

export const weddingVendorNote = "Harga WO mencakup layanan manajemen, bukan vendor independen seperti dekorasi, catering, MUA, dokumentasi, atau hiburan—kecuali disepakati terpisah.";
export const weddingAdatNote = "Tarif spesial berlaku untuk klien WO yang memilih salah satu dari dua opsi adat. Harga, ketersediaan vendor, jadwal, durasi, transportasi, dan kebutuhan teknis perlu dikonfirmasi kembali dengan vendor rekanan.";