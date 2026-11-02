export interface Wisata {
  id: string;
  name: string;
  category: string;
  rating: number;
  entryFee: number;
  image: string;
  location: string;
  description: string;
  partner?: boolean;
}

export const mockWisata: Wisata[] = [
  {
    id: "1",
    name: "Gunung Papandayan",
    category: "Alam",
    rating: 4.8,
    entryFee: 30000,
    image: "",
    location: "Cisurupan, Garut",
    description: "Gunung api aktif dengan pemandangan kawah yang indah, padang edelweis, dan hutan mati yang eksotis.",
    partner: true,
  },
  {
    id: "2",
    name: "Kawah Darajat",
    category: "Alam",
    rating: 4.5,
    entryFee: 35000,
    image: "",
    location: "Pasirwangi, Garut",
    description: "Kawasan wisata pemandian air panas alami dengan pemandangan perbukitan yang hijau dan udara sejuk.",
    partner: true,
  },
  {
    id: "3",
    name: "Situ Bagendit",
    category: "Alam",
    rating: 4.6,
    entryFee: 20000,
    image: "",
    location: "Banyuresmi, Garut",
    description: "Danau indah dengan latar belakang pegunungan, cocok untuk rekreasi keluarga menggunakan perahu atau rakit.",
    partner: true,
  },
  {
    id: "4",
    name: "Candi Cangkuang",
    category: "Sejarah",
    rating: 4.3,
    entryFee: 15000,
    image: "",
    location: "Leles, Garut",
    description: "Candi Hindu peninggalan abad ke-8 peninggalan Kerajaan Galuh yang terletak di sebuah pulau kecil di tengah danau.",
  },
  {
    id: "5",
    name: "Kampung Naga",
    category: "Budaya",
    rating: 4.7,
    entryFee: 25000,
    image: "",
    location: "Neglasari, Salawu",
    description: "Perkampungan adat Sunda yang masih memegang teguh tradisi leluhur, tanpa aliran listrik dan bangunan modern.",
    partner: true,
  },
  {
    id: "6",
    name: "Taman Satwa Cikembulan",
    category: "Buatan",
    rating: 4.4,
    entryFee: 40000,
    image: "",
    location: "Kadungora, Garut",
    description: "Taman konservasi satwa yang menampilkan berbagai jenis hewan langka dan dilindungi, cocok untuk edukasi anak.",
    partner: true,
  },
  {
    id: "7",
    name: "Pantai Rancabuaya",
    category: "Alam",
    rating: 4.4,
    entryFee: 15000,
    image: "",
    location: "Caringin, Garut",
    description: "Pantai selatan Garut dengan tebing karang dan ombak besar, menjadi daya tarik bagi para pecinta alam dan fotografer.",
  },
  {
    id: "8",
    name: "Curug Orok",
    category: "Alam",
    rating: 4.5,
    entryFee: 10000,
    image: "",
    location: "Cibalong, Garut",
    description: "Air terjun tersembunyi di tengah hutan tropis dengan aliran air segar yang menyejukkan.",
    partner: true,
  },
];
