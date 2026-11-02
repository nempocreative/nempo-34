// Wedding Invitation (undangan digital) — same price and inclusions as the Digital Services price list.
import { weddingPackages } from "@/data/wedding-packages";

export const INVITATION_PRICE = 199_000;
export const INVITATION_BILLING = "sekali bayar";

export const INVITATION_FEATURES = [
  { id: "rsvp", title: "RSVP Online", desc: "Tamu konfirmasi hadir langsung dari undangan, kamu tinggal pantau jumlahnya." },
  { id: "acara", title: "Detail Acara & Lokasi", desc: "Jadwal akad dan resepsi lengkap dengan alamat yang bisa disalin tamu." },
  { id: "cerita", title: "Cerita Kalian", desc: "Ruang untuk kisah perjalanan berdua sebelum menuju hari bahagia." },
  { id: "galeri", title: "Galeri Momen", desc: "Foto prewedding tampil rapi dan nyaman dilihat di HP." },
  { id: "ucapan", title: "Ucapan & Doa Tamu", desc: "Tamu bisa menulis ucapan yang tampil langsung di undangan." },
  { id: "musik", title: "Musik Latar", desc: "Lagu pilihan kalian mengiringi tamu saat membuka undangan." },
  { id: "kado", title: "Kado Digital", desc: "Info rekening atau amplop digital yang tinggal disalin." },
  { id: "share", title: "Link Siap Dibagikan", desc: "Satu link undangan, tinggal kirim lewat WhatsApp atau Instagram." },
] as const;

export const INVITATION_INCLUDED = ["RSVP", "Galeri", "Ucapan tamu", "Musik", "Link undangan"] as const;

export const INVITATION_CONSULT_EXTRAS = ["Custom domain", "Revisi tambahan", "Kebutuhan khusus"] as const;

/** WO packages that already include the digital invitation for free. */
export const woPackagesWithFreeInvitation = () =>
  weddingPackages.filter((p) => p.digitalInvitationAndSawer).map((p) => p.name);

export const invitationRupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
