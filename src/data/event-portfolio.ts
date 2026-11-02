import colorTheBeatPosterImage from "@/assets/event-color-the-beat-poster.jpg";
import ggsBeautyOpeningImage from "@/assets/event-ggs-beauty-opening.jpg";
import lalanaPagiPosterImage from "@/assets/event-lalana-pagi-poster.jpg";
import nightOutMaxiPosterImage from "@/assets/event-night-out-maxi-poster.jpg";
import ngahijiBoboranSiamPosterImage from "@/assets/event-ngahiji-boboran-siam-poster.jpg";
import riuhRonaPosterImage from "@/assets/event-riuh-rona-poster.jpg";
import secangkirKopiPosterImage from "@/assets/event-secangkir-kopi-poster.jpg";
import temuTarungPosterImage from "@/assets/event-temu-tarung-poster.jpg";
import universityCoffeeNightPosterImage from "@/assets/event-university-coffee-night-poster.jpg";

export interface EventPortfolioItem {
  id: string;
  name: string;
  image: string;
  location: string;
  date: string;
  badge: string;
}

/**
 * Poster asli tiap acara Nempo, dipakai beranda dan halaman Portofolio.
 * Tambah satu di sini, muncul di keduanya.
 */
export const eventPortfolioItems: EventPortfolioItem[] = [
  {
    id: "secangkir-kopi-biang-2025",
    name: "Secangkir Kopi dengan Alunan Musik Tradisi di Akhir Tahun",
    image: secangkirKopiPosterImage,
    location: "Biang",
    date: "31 Desember 2025",
    badge: "Musik Tradisi",
  },
  {
    id: "university-coffee-night-2026",
    name: "University Coffee Night",
    image: universityCoffeeNightPosterImage,
    location: "Domusa",
    date: "18 Januari 2026",
    badge: "Coffee Night",
  },
  {
    id: "lalana-pagi-2026",
    name: "Lalana Pagi",
    image: lalanaPagiPosterImage,
    location: "Kopi Jaya",
    date: "1 Februari 2026",
    badge: "Acara Pagi",
  },
  {
    id: "ngahiji-boboran-siam-2026",
    name: "Ngahiji dina Kebagjaan Boboran Siam",
    image: ngahijiBoboranSiamPosterImage,
    location: "Situ Bagendit",
    date: "23 Maret 2026",
    badge: "Boboran Siam",
  },
  {
    id: "temu-tarung-2026",
    name: "Temu Tarung",
    image: temuTarungPosterImage,
    location: "SOR",
    date: "20–21 Juni 2026",
    badge: "Olahraga",
  },
  {
    id: "night-out-maxi-2026",
    name: "Night Out Maxi",
    image: nightOutMaxiPosterImage,
    location: "Temu Space",
    date: "22 Agustus 2026",
    badge: "Night Out",
  },
  {
    id: "color-the-beat-2026",
    name: "Color The Beat",
    image: colorTheBeatPosterImage,
    location: "Biang",
    date: "29 Agustus 2026",
    badge: "Musik",
  },
  {
    id: "riuh-rona-2026",
    name: "Riuh Rona",
    image: riuhRonaPosterImage,
    location: "Maru",
    date: "5 September 2026",
    badge: "Event",
  },
  {
    id: "opening-ggs-2026",
    name: "Grand Opening GGS Beauty",
    image: ggsBeautyOpeningImage,
    location: "GGS Beauty",
    date: "18 Oktober 2026",
    badge: "Opening",
  },
];
