export type ChatMsg = { from: "bot" | "user"; text: string; chips?: string[]; wa?: boolean };

export const GREET_MSG: ChatMsg = {
  from: "bot",
  text: "Halo, aku Buddy! Mau menyiapkan acara atau mengembangkan usahamu? Aku bisa bantu mengenalkan layanan Nempo Organizer. Pilih layanan di bawah atau ceritakan kebutuhanmu.",
  chips: ["Event Organizer", "Wedding Organizer", "Wedding Invitation", "Sosmed Management", "Web Development", "Design Creative", "Talent Management", "Business System"],
};

const SERVICES = [
  { id: "invitation", keys: ["wedding invitation", "undangan", "invitation"], answer: "Wedding Invitation membantu membuat undangan pernikahan digital. Buka halaman Wedding Invitation untuk melihat contoh undangan, fitur, dan paket yang tersedia.", chips: ["Wedding Organizer", "Hubungi Admin CS"] },
  { id: "wedding", keys: ["wedding organizer", "wedding", "pernikahan", "nikah", "wo"], answer: "Wedding Organizer membantu menyiapkan dan mengoordinasikan hari pernikahanmu. Di halaman Wedding Organizer ada paket Essential, Signature, Premium, serta pilihan adat Sunda. Ceritakan tanggal, lokasi, dan kebutuhan acaramu kepada admin untuk membahas paketnya.", chips: ["Wedding Invitation", "Talent Management", "Hubungi Admin CS"] },
  { id: "sosmed", keys: ["sosmed", "social media", "sosial media", "media sosial", "instagram", "konten", "reels", "tiktok"], answer: "Sosmed Management membantu kebutuhan konten dan pengelolaan media sosial usahamu. Lihat paket dan layanan satuan di halaman Sosmed Management; sampaikan jenis usaha serta kebutuhan kontenmu kepada admin.", chips: ["Design Creative", "Hubungi Admin CS"] },
  { id: "business", keys: ["business system", "sistem", "system", "kasir", "pos", "crm", "stok", "inventory", "super app"], answer: "Business System menyediakan modul untuk kebutuhan operasional usaha. Halamannya memuat pilihan modul, perbandingan paket, dan kalkulator biaya agar kamu bisa menyusun sistem sesuai kebutuhan bisnis.", chips: ["Web Development", "Hubungi Admin CS"] },
  { id: "web", keys: ["web development", "website", "web", "company profile", "link bio", "ticketing"], answer: "Web Development melayani Company Website, Link Bio, Event Ticketing, dan pilihan sistem usaha. Buka halaman Web Development untuk membandingkan paket, lalu ceritakan tujuan website dan fitur yang kamu perlukan.", chips: ["Business System", "Design Creative", "Hubungi Admin CS"] },
  { id: "design", keys: ["design", "desain", "creative", "logo", "branding", "poster", "grafis"], answer: "Design Creative membantu kebutuhan desain dan materi kreatif untuk brand, usaha, atau acara. Biaya disesuaikan dengan kebutuhan desain; kirim jenis desain, referensi, dan tenggatmu kepada admin untuk penawaran.", chips: ["Sosmed Management", "Hubungi Admin CS"] },
  { id: "talent", keys: ["talent", "penari", "band", "mc", "host", "model", "penyanyi", "musik", "dancer"], answer: "Talent Management mencakup MC & host, band, penari, penyanyi, model, dan talent lainnya. Kamu bisa menyusun pilihan talent di halaman Talent Management. Ketersediaan dan biaya perlu dikonfirmasi sesuai tanggal, lokasi, serta kebutuhan acara.", chips: ["Event Organizer", "Wedding Organizer", "Hubungi Admin CS"] },
  { id: "event", keys: ["event organizer", "eo", "event", "acara", "festival", "konser", "gathering"], answer: "Event Organizer membantu merencanakan dan menjalankan acara, dari kebutuhan konsep sampai koordinasi pelaksanaan. Lihat layanan dan paket di halaman Event Organizer, lalu sampaikan jenis acara, tanggal, lokasi, dan perkiraan peserta kepada admin.", chips: ["Talent Management", "Design Creative", "Hubungi Admin CS"] },
];

export function matchBuddyService(input: string) {
  const text = input.toLowerCase();
  return SERVICES.find(service => service.keys.some(key =>
    key.length <= 3 ? new RegExp(`\\b${key}\\b`, "i").test(text) : text.includes(key),
  ));
}

export function botReply(input: string): ChatMsg {
  const service = matchBuddyService(input);
  if (service) return { from: "bot", text: service.answer, chips: service.chips };
  if (/harga|paket|biaya|budget|anggaran/i.test(input)) {
    return { from: "bot", text: "Paket dan biaya berbeda untuk setiap layanan. Pilih layanan yang kamu butuhkan untuk melihat informasi di halaman terkait; admin dapat membantu mengonfirmasi penawaran sesuai kebutuhanmu.", chips: GREET_MSG.chips };
  }
  if (/admin|hubungi|bantuan|booking|pesan|konsultasi|kerja sama|mitra|refund|batal|akun|login/i.test(input)) {
    return { from: "bot", text: "Hubungi Admin Nempo melalui DM Instagram. Untuk konsultasi atau pemesanan, sampaikan layanan yang dipilih dan kebutuhanmu. Ketentuan pembayaran, perubahan, dan pembatalan perlu dikonfirmasi langsung dengan admin.", wa: true };
  }
  return { from: "bot", text: "Nempo Organizer melayani acara, pernikahan, undangan digital, sosmed, website, desain, talent, dan sistem bisnis. Kamu ingin membahas layanan yang mana?", chips: GREET_MSG.chips };
}