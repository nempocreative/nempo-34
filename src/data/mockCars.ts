export interface Car {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  priceWithDriver: number;
  fuelType: string;
  transmission: string;
  image: string;
  description: string;
  features: string[];
  available: boolean;
  featured?: boolean;
}

export const mockCars: Car[] = [
  {
    id: "1",
    name: "Toyota Avanza",
    type: "MPV",
    capacity: 7,
    pricePerDay: 350000,
    priceWithDriver: 550000,
    fuelType: "Bensin",
    transmission: "Manual",
    image: "",
    description: "Mobil keluarga serbaguna yang nyaman dan irit bahan bakar, cocok untuk perjalanan wisata Garut.",
    features: ["AC", "Audio", "GPS"],
    available: true,
    featured: true,
  },
  {
    id: "2",
    name: "Toyota Kijang Innova",
    type: "MPV",
    capacity: 7,
    pricePerDay: 550000,
    priceWithDriver: 750000,
    fuelType: "Diesel",
    transmission: "Otomatis",
    image: "",
    description: "Innova diesel yang tangguh untuk medan pegunungan Garut, transmisi otomatis yang nyaman.",
    features: ["AC", "Audio", "GPS", "USB Charger"],
    available: true,
    featured: true,
  },
  {
    id: "3",
    name: "Suzuki Ertiga",
    type: "MPV",
    capacity: 7,
    pricePerDay: 320000,
    priceWithDriver: 500000,
    fuelType: "Bensin",
    transmission: "Otomatis",
    image: "",
    description: "Mobil keluarga kompak dengan konsumsi bahan bakar efisien, transmisi matic untuk kenyamanan.",
    features: ["AC", "Audio", "USB Charger"],
    available: true,
    featured: true,
  },
  {
    id: "4",
    name: "Mitsubishi Elf",
    type: "Minibus",
    capacity: 12,
    pricePerDay: 800000,
    priceWithDriver: 1100000,
    fuelType: "Diesel",
    transmission: "Manual",
    image: "",
    description: "Ideal untuk rombongan wisata, kapasitas besar dengan kenyamanan perjalanan jarak jauh.",
    features: ["AC", "Audio", "Recline Seat"],
    available: true,
    featured: true,
  },
  {
    id: "5",
    name: "Toyota Fortuner",
    type: "SUV",
    capacity: 7,
    pricePerDay: 900000,
    priceWithDriver: 1200000,
    fuelType: "Diesel",
    transmission: "Otomatis",
    image: "",
    description: "SUV tangguh untuk petualangan off-road ke kawasan gunung dan alam terbuka Garut.",
    features: ["AC", "Audio", "GPS", "4WD", "USB Charger"],
    available: true,
    featured: true,
  },
  {
    id: "6",
    name: "Daihatsu Xenia",
    type: "MPV",
    capacity: 7,
    pricePerDay: 300000,
    priceWithDriver: 480000,
    fuelType: "Bensin",
    transmission: "Manual",
    image: "",
    description: "Mobil keluarga ekonomis yang lincah dan mudah dikendarai di jalanan kota maupun pedesaan.",
    features: ["AC", "Audio"],
    available: false,
  },
];
