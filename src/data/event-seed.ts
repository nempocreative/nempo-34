// Browser-safe seed data for events that must exist in the database.
// After a remix the new project's database starts without rows, so this module is
// the source of truth for re-applying them with the database query tool.
// Values here come from the homepage card in src/pages/home.tsx — never invent extras.

export interface EventSeed {
  slug: string;
  name: string;
  title: string;
  category: string;
  date: string;
  time_start: string;
  time_end: string;
  location: string;
  description: string;
  organizer: string;
  price: number;
  guest_stars: { name: string; role: string }[];
  image: string;
  active: boolean;
  featured: boolean;
}

export const EVENT_SEEDS: EventSeed[] = [
  {
    slug: "musicomedy-night",
    name: "MusiComedy Night",
    title: "MusiComedy Night",
    category: "Musik",
    date: "2026-11-04",
    location: "Good Story Cafe, Jl. Sudirman Copong No. 11, Garut",
    description:
      "Malam musik dan komedi bareng NEMPO.ID × Kala Muda di Good Story Cafe.",
    organizer: "NEMPO.ID × Kala Muda",
    price: 0,
    guest_stars: [{ name: "Saduli Ragap", role: "Bintang Tamu" }],
    image:
      "/__l5e/assets-v1/9728d72c-f93f-4a46-ba6d-240e86fde753/musicomedy-night-poster.webp",
    active: true,
    featured: true,
  },
];

export function eventSeedBySlug(slug: string): EventSeed | undefined {
  return EVENT_SEEDS.find((event) => event.slug === slug);
}

export function eventSeedInsertSql(event: EventSeed): string {
  const json = JSON.stringify(event.guest_stars);
  const text = (value: string) => `'${value.replace(/'/g, "''")}'`;
  return [
    "insert into public.events (slug, name, title, category, date, location, description, organizer, price, guest_stars, image, banner_image, active, featured, crew_active, allow_voucher, service_fee_percent, visitors)",
    `values (${text(event.slug)}, ${text(event.name)}, ${text(event.title)}, ${text(event.category)}, ${text(event.date)}, ${text(event.location)}, ${text(event.description)}, ${text(event.organizer)}, ${event.price}, ${text(json)}::jsonb, ${text(event.image)}, ${text(event.image)}, ${event.active}, ${event.featured}, false, false, 0, 0);`,
  ].join("\n");
}
