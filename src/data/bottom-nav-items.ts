import {
  NavContactIcon,
  NavEventIcon,
  NavHomeIcon,
  NavPortfolioIcon,
  NavRecruitmentIcon,
} from "@/components/navigation-glyphs";

/**
 * Isi navigasi bawah di layar kecil. Satu sumber supaya halaman dan tesnya
 * memakai daftar yang sama.
 */
export const bottomNavItems = [
  { href: "/", icon: NavHomeIcon, label: "Beranda" },
  { href: "/recruitment", icon: NavRecruitmentIcon, label: "Recruitment" },
  { href: "/event", icon: NavEventIcon, label: "Event" },
  { href: "/portofolio", icon: NavPortfolioIcon, label: "Portofolio" },
  { href: "/contact", icon: NavContactIcon, label: "Contact" },
];
