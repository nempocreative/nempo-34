export type JajanOrderRouting = "merchant_direct" | "admin_whatsapp";

export interface JajanMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface JajanDemoMerchant {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  location: string;
  description: string;
  featured: boolean;
  hours: string | null;
  price_range: string | null;
  rating: number | string | null;
  computed_rating: number | null;
  orderRouting: JajanOrderRouting;
  menu: JajanMenuItem[];
}

export const jajanYukDemoMerchants: JajanDemoMerchant[] = [
  {
    id: -1,
    slug: "baso-ronyok",
    name: "Baso Ronyok",
    category: "Makanan Berat",
    image: "",
    location: "Simpang Lima, Garut Kota",
    description: "Contoh merchant untuk memperlihatkan alur pilih menu dan checkout Jajan YUK.",
    featured: true,
    hours: "10.00–21.00",
    price_range: "Rp 15–22 ribu",
    rating: null,
    computed_rating: null,
    orderRouting: "admin_whatsapp",
    menu: [
      {
        id: "baso-ronyok-original",
        name: "Baso Ronyok Original",
        description: "Contoh baso dengan kuah gurih.",
        price: 15000,
      },
      {
        id: "baso-ronyok-mercon",
        name: "Baso Ronyok Mercon",
        description: "Contoh baso kuah pedas.",
        price: 18000,
      },
      {
        id: "baso-ronyok-komplit",
        name: "Baso Ronyok Komplit",
        description: "Contoh porsi komplit dengan tambahan pangsit.",
        price: 22000,
      },
    ],
  },
  {
    id: -2,
    slug: "seblak-contoh-garut",
    name: "Seblak Contoh Garut",
    category: "Street Food",
    image: "",
    location: "Pasar Ceplak, Garut Kota",
    description: "Contoh merchant jajanan pedas untuk demonstrasi daftar menu.",
    featured: false,
    hours: "11.00–21.00",
    price_range: "Rp 12–20 ribu",
    rating: null,
    computed_rating: null,
    orderRouting: "merchant_direct",
    menu: [
      {
        id: "seblak-campur",
        name: "Seblak Campur",
        description: "Contoh seblak dengan kerupuk dan sayuran.",
        price: 12000,
      },
      {
        id: "seblak-ceker",
        name: "Seblak Ceker",
        description: "Contoh seblak dengan tambahan ceker.",
        price: 17000,
      },
      {
        id: "seblak-seafood",
        name: "Seblak Seafood",
        description: "Contoh seblak dengan topping seafood.",
        price: 20000,
      },
    ],
  },
  {
    id: -3,
    slug: "cuanki-contoh-garut",
    name: "Cuanki Contoh Garut",
    category: "Street Food",
    image: "",
    location: "Kerkof, Garut Kota",
    description: "Contoh merchant baso cuanki untuk melihat alur pesanan langsung.",
    featured: false,
    hours: "10.00–20.00",
    price_range: "Rp 10–18 ribu",
    rating: null,
    computed_rating: null,
    orderRouting: "merchant_direct",
    menu: [
      {
        id: "cuanki-komplit",
        name: "Cuanki Komplit",
        description: "Contoh cuanki dengan siomay, tahu, dan baso.",
        price: 18000,
      },
      {
        id: "baso-cuanki",
        name: "Baso Cuanki",
        description: "Contoh semangkuk baso cuanki sederhana.",
        price: 12000,
      },
      {
        id: "cuanki-pedas",
        name: "Cuanki Pedas",
        description: "Contoh cuanki dengan kuah pedas.",
        price: 15000,
      },
    ],
  },
];

export function getJajanYukDemoMerchant(slug: string) {
  return jajanYukDemoMerchants.find((merchant) => merchant.slug === slug);
}