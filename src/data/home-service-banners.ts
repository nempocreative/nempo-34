import { mainNavItems } from "@/data/main-nav-items";
import collaborationHeroImage from "@/assets/076ae51bf23030e0b8cfb7975b94609a_1789408708055.jpg";
import kalaMudaHeroImage from "@/assets/94d218d05080a6554bc7214283cb8a88_1789408730013.jpg";
import digiNempoHeroImage from "@/assets/business-system-banner.jpg";
import digitalGrowthBannerImage from "@/assets/nempo-team-banner.jpg";
import digitalServicesHeroImage from "@/assets/generated_images/digital-services-hero.jpg";
import designCreativeBannerImage from "@/assets/design-creative-banner.jpg";

type MainMenuId = (typeof mainNavItems)[number]["id"];

type ServiceBannerContent = {
  menuId: MainMenuId;
  headline: string;
  description: string;
  cta: string;
  image: string;
  instagramHandle?: string;
};

export type HomeServiceBanner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  btn_text: string;
  link: string;
  image: string;
  accent: string;
  sort_order: number;
  active: boolean;
  instagramHandle?: string;
};

const publicImage = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const serviceBannerContent: ServiceBannerContent[] = [
  {
    menuId: "event-organizer",
    headline: "Acara lebih tertata",
    description: "Dari konsep sampai pelaksanaan, kami bantu acara berjalan lebih rapi.",
    cta: "Rencanakan event",
    image: collaborationHeroImage,
  },
  {
    menuId: "wedding-organizer",
    headline: "Hari bahagia, dirancang rapi",
    description: "Rangkaian pernikahan terencana dengan tim yang menjaga setiap detail.",
    cta: "Rencanakan wedding",
    image: publicImage("images/invitation-story.jpg"),
  },
  {
    menuId: "sosmed-management",
    headline: "Brand tampil konsisten",
    description: "Kelola strategi konten dan media sosial agar brand lebih konsisten.",
    cta: "Kelola sosmed",
    image: digitalGrowthBannerImage,
  },
  {
    menuId: "wedding-invitation",
    headline: "Undangan terasa personal",
    description: "Bagikan cerita hari bahagia lewat undangan digital yang praktis.",
    cta: "Buat undangan",
    image: publicImage("images/invitation-hero.jpg"),
  },
  {
    menuId: "web-development",
    headline: "Website untuk bisnis Anda",
    description: "Website responsif untuk memperkuat layanan dan identitas bisnis.",
    cta: "Bangun website",
    image: digitalServicesHeroImage,
  },
  {
    menuId: "design-creative",
    headline: "Visual kreatif untuk brand",
    description: "Materi visual yang selaras dengan karakter dan tujuan brand.",
    cta: "Lihat layanan kreatif",
    image: designCreativeBannerImage,
  },
  {
    menuId: "talent-management",
    headline: "Talenta lokal siap bersinar",
    description: "Kembangkan potensi talenta lokal lewat manajemen dan kolaborasi.",
    cta: "Jelajahi talenta",
    image: kalaMudaHeroImage,
    instagramHandle: "kalamudacom",
  },
  {
    menuId: "business-system",
    headline: "Operasional lebih terhubung",
    description: "Rapikan proses bisnis dengan sistem digital yang saling terhubung.",
    cta: "Lihat sistem bisnis",
    image: digiNempoHeroImage,
  },
];

export const HOME_SERVICE_BANNERS: HomeServiceBanner[] = serviceBannerContent.map((content, index) => {
  const menu = mainNavItems.find((item) => item.id === content.menuId);
  if (!menu) throw new Error(`Missing homepage menu: ${content.menuId}`);

  return {
    id: index + 1,
    title: content.headline,
    subtitle: menu.label,
    description: content.description,
    category: menu.label,
    btn_text: content.cta,
    link: menu.href,
    image: content.image,
    accent: menu.color,
    sort_order: index + 1,
    active: true,
    instagramHandle: content.instagramHandle,
  };
});
