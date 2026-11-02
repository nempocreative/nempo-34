export interface Gear {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  image: string;
  description: string;
  condition: "Baru" | "Bagus" | "Baik";
  stock: number;
  featured?: boolean;
  weight?: string;
  brand?: string;
}

export const mockGear: Gear[] = [
  {
    id: "1",
    name: "Tenda Dome 4 Orang",
    category: "Tenda",
    pricePerDay: 50000,
    image: "",
    description: "Tenda dome kapasitas 4 orang, anti air, cocok untuk camping di Papandayan dan Cikuray.",
    condition: "Bagus",
    stock: 5,
    featured: true,
    weight: "3.2 kg",
  },
  {
    id: "2",
    name: "Sleeping Bag -5°C",
    category: "Tidur",
    pricePerDay: 25000,
    image: "",
    description: "Sleeping bag suhu hingga -5°C, ideal untuk pendakian gunung di malam hari yang dingin.",
    condition: "Bagus",
    stock: 8,
    featured: true,
    weight: "1.1 kg",
  },
  {
    id: "3",
    name: "Carrier 60L Osprey",
    category: "Tas",
    pricePerDay: 35000,
    image: "",
    description: "Carrier 60 liter dengan frame aluminium, ideal untuk pendakian 2–3 hari ke puncak gunung.",
    condition: "Baru",
    stock: 6,
    featured: true,
    weight: "2.0 kg",
  },
  {
    id: "4",
    name: "Kompor Portable + Gas",
    category: "Masak",
    pricePerDay: 20000,
    image: "",
    description: "Kompor gas portable ringan dengan satu kaleng gas, cocok untuk memasak di basecamp.",
    condition: "Bagus",
    stock: 10,
    featured: true,
    weight: "0.4 kg",
  },
  {
    id: "5",
    name: "Matras Gulung EVA",
    category: "Tidur",
    pricePerDay: 10000,
    image: "",
    description: "Matras gulung ringan untuk alas tidur di tenda, tahan lembab dan mudah dibawa.",
    condition: "Baik",
    stock: 15,
    featured: true,
    weight: "0.6 kg",
  },
  {
    id: "6",
    name: "Headlamp LED 200 Lumen",
    category: "Penerangan",
    pricePerDay: 15000,
    image: "",
    description: "Headlamp LED terang 200 lumen dengan mode merah untuk malam hari, baterai tahan 8 jam.",
    condition: "Baru",
    stock: 12,
    weight: "0.1 kg",
  },
  {
    id: "7",
    name: "Trekking Pole (2 batang)",
    category: "Perlengkapan",
    pricePerDay: 20000,
    image: "",
    description: "Tongkat trekking aluminium adjustable, membantu keseimbangan saat mendaki jalur curam.",
    condition: "Bagus",
    stock: 7,
    weight: "0.5 kg",
  },
  {
    id: "8",
    name: "Raincover & Ponco",
    category: "Perlengkapan",
    pricePerDay: 10000,
    image: "",
    description: "Jas hujan dan raincover tas, wajib dibawa untuk menghadapi cuaca tak terduga di gunung.",
    condition: "Baru",
    stock: 20,
    weight: "0.3 kg",
  },
  {
    id: "9",
    name: "Nesting / Cookware Set",
    category: "Masak",
    pricePerDay: 15000,
    image: "",
    description: "Set peralatan masak aluminium: panci, wajan, dan sendok lipat dalam satu set ringkas.",
    condition: "Bagus",
    stock: 8,
    weight: "0.5 kg",
  },
  {
    id: "10",
    name: "Tenda Family 6 Orang",
    category: "Tenda",
    pricePerDay: 80000,
    image: "",
    description: "Tenda besar kapasitas 6 orang, cocok untuk kemping keluarga atau grup bersama.",
    condition: "Bagus",
    stock: 3,
    weight: "5.5 kg",
  },
];
