export interface Kuliner {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  location: string;
  description: string;
  featured?: boolean;
  hours?: string;
  priceRange?: string;
}

export const mockKuliner: Kuliner[] = [
  {
    id: "1",
    name: "Sate Maranggi Pak Nur",
    category: "Makanan Berat",
    rating: 4.8,
    image: "",
    location: "Jl. Otto Iskandardinata",
    description: "Sate maranggi khas Garut dengan bumbu kacang rahasia turun-temurun yang lezat dan menggugah selera.",
    featured: true,
    hours: "10.00–21.00",
  },
  {
    id: "2",
    name: "Soto Ayam Garut Asli",
    category: "Makanan Berat",
    rating: 4.6,
    image: "",
    location: "Jl. Ciledug",
    description: "Soto ayam dengan kuah bening segar dan rempah pilihan, disajikan dengan nasi putih hangat.",
    featured: true,
    hours: "07.00–15.00",
  },
  {
    id: "3",
    name: "Dodol Picnic",
    category: "Snack",
    rating: 4.9,
    image: "",
    location: "Jl. Pasundan",
    description: "Dodol Garut paling terkenal dengan berbagai varian rasa, cocok sebagai oleh-oleh khas Garut.",
    featured: true,
    hours: "08.00–20.00",
  },
  {
    id: "4",
    name: "Chocodot Garut",
    category: "Snack",
    rating: 4.7,
    image: "",
    location: "Jl. Siliwangi",
    description: "Coklat dodol inovatif perpaduan dodol Garut dan coklat premium, oleh-oleh paling hits di Garut.",
    featured: true,
    hours: "09.00–21.00",
  },
  {
    id: "5",
    name: "Es Goyobod Mang Dadang",
    category: "Minuman",
    rating: 4.5,
    image: "",
    location: "Alun-Alun Garut",
    description: "Minuman segar khas Garut berisi goyobod, alpukat, dan kelapa muda yang menyegarkan.",
    featured: true,
    hours: "09.00–17.00",
  },
  {
    id: "6",
    name: "Surabi Garut",
    category: "Dessert",
    rating: 4.4,
    image: "",
    location: "Jl. Cimanuk",
    description: "Serabi tradisional dengan berbagai topping manis, dimasak di atas tungku tanah liat.",
    hours: "07.00–13.00",
  },
  {
    id: "7",
    name: "Nasi Liwet Bancakan",
    category: "Makanan Berat",
    rating: 4.6,
    image: "",
    location: "Jl. Ahmad Yani",
    description: "Nasi liwet khas Sunda dengan lauk pauk tradisional, disajikan di atas daun pisang.",
    hours: "11.00–21.00",
  },
  {
    id: "8",
    name: "Mie Kocok Garut",
    category: "Makanan Berat",
    rating: 4.5,
    image: "",
    location: "Jl. Pramuka",
    description: "Mie kocok khas Garut dengan kuah sumsum sapi gurih dan taburan bawang goreng melimpah.",
    hours: "09.00–20.00",
  },
  {
    id: "9",
    name: "Kopi Papandayan",
    category: "Minuman",
    rating: 4.7,
    image: "",
    location: "Jl. Mandalagiri",
    description: "Kopi single origin dari kebun Papandayan dengan cita rasa khas pegunungan Garut.",
    hours: "07.00–22.00",
  },
  {
    id: "10",
    name: "Peuyeum Garut",
    category: "Snack",
    rating: 4.3,
    image: "",
    location: "Pasar Ceplak",
    description: "Tape singkong fermentasi khas Garut dengan rasa manis asam yang khas dan unik.",
    hours: "06.00–16.00",
  },
];
