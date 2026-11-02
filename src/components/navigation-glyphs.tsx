import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement>;

const glyphProps = (className?: string, style?: GlyphProps["style"]) => ({
  className,
  style,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true as const,
});

export const NavWisataIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M12 21s6.5-5.7 6.5-11.1A6.5 6.5 0 1 0 5.5 9.9C5.5 15.3 12 21 12 21Z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="m15.8 4.2.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

export const NavKulinerIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 4v7M8 4v7M5 8h3M6.5 11v9M18 4v16M18 4c-2.2 1.4-3 3.5-3 6 0 1.3 1.1 2.3 3 2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 20h15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".42" />
  </svg>
);

export const NavJajanIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 12h14v5.2A2.8 2.8 0 0 1 16.2 20H7.8A2.8 2.8 0 0 1 5 17.2V12Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 12a8 8 0 0 1 16 0H4Z" fill="currentColor" opacity=".26" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 8.8V6.7M12 8.2V5.8M16 8.8V6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const NavCafeIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 8.5h11v5.2A5.3 5.3 0 0 1 10.7 19h-.4A5.3 5.3 0 0 1 5 13.7V8.5Z" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 10h1.2a2.8 2.8 0 0 1 0 5.6H16M4 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 5.8c-.8-.8.8-1.5 0-2.3M11 5.8c-.8-.8.8-1.5 0-2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".62" />
  </svg>
);

export const NavEventIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2.2" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 4v3M16 4v3M4.5 9.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m12 12 .7 1.6 1.8.2-1.3 1.2.4 1.8-1.6-.9-1.6.9.4-1.8-1.3-1.2 1.8-.2L12 12Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

export const NavBeritaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 4.5h10.5L19 8v11.5H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M15.5 4.8V8H19M7 11h8M7 14h8M7 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 7.8h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".62" />
  </svg>
);

export const NavCeritaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M12 19.5c-2-1.4-4.1-1.8-7-1.2V5.8c2.8-.7 5.1-.2 7 1.2v12.5Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 19.5c2-1.4 4.1-1.8 7-1.2V5.8c-2.8-.7-5.1-.2-7 1.2v12.5Z" fill="currentColor" opacity=".22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7v12.5M7.5 9h2M14.5 9h2M7.5 12h2M14.5 12h2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity=".72" />
  </svg>
);

export const NavHotelIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 19.5V9.2l8-5.2 8 5.2v10.3" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M3 19.5h18M7.5 19.5v-5h9v5M9 10h1.5M13.5 10H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavAdventureIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 18.5 8.5 10l3 4.5L15 7l5 11.5H4Z" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M15 7V3.5M15 4h4l-2 2 2 2h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavKomunitasIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="12" cy="12" r="8.5" fill="currentColor" opacity=".11" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.8 12h16.4M12 3.5c2 2.3 3 5.1 3 8.5s-1 6.2-3 8.5c-2-2.3-3-5.1-3-8.5s1-6.2 3-8.5Z" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    <path d="M5.2 7.2h13.6M5.2 16.8h13.6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity=".58" />
  </svg>
);

export const NavMerchandiseIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="m8 5 2-2h4l2 2 4 2.5-2 4-2-1v9H8v-9l-2 1-2-4L8 5Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 3c0 2 4 2 4 0M16 8.5l-1.5-1.2M8 8.5l1.5-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavTravelIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M5 18.5c3-5.2 5.3-7.2 8.5-6.7 2.2.3 3.3-1 2.7-3.3-.5-2.1.4-3.1 2.8-2.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="5" cy="18.5" r="2" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="19" cy="5.5" r="2" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1.6" />
    <path d="m12 11.5 1.6-3.2M12 11.5l-3.1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".72" />
  </svg>
);

export const NavDigiIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <rect x="3.5" y="5" width="17" height="12" rx="2" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 20h8M12 17v3M12 8.5v4M12 8.5l-2 2M12 8.5l2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavKerjaSamaIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 19.5V7.5l4-3 4 3v12M12 19.5V5.5l4-2 4 2v14" fill="currentColor" opacity=".11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M7 10h2M7 13h2M15 9h2M15 12h2M3 19.5h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavSponsorshipIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M7 4h10l2 4-7 12L5 8l2-4Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M5 8h14M9.5 4 12 8l2.5-4M12 8v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavTalentIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="12" cy="8" r="3.5" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 20c.5-3.7 2.9-5.7 7-5.7s6.5 2 7 5.7" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m18.3 4.2.4 1 .9.4-.9.4-.4 1-.4-1-.9-.4.9-.4.4-1Z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const NavInfluencerIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 5.5h16v10H9l-4 3v-3H4v-10Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="9" cy="10" r="1.6" fill="currentColor" />
    <circle cx="12.7" cy="10" r="1.6" fill="currentColor" opacity=".75" />
    <circle cx="16.4" cy="10" r="1.6" fill="currentColor" opacity=".5" />
  </svg>
);

export const NavHomeIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="m4 10.5 8-6.5 8 6.5v8.2a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 18.7v-8.2Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 20v-5.5h5V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const NavWishlistIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M12 19.8S4.5 15.3 4.5 9.7A4 4 0 0 1 12 7.4a4 4 0 0 1 7.5 2.3c0 5.6-7.5 10.1-7.5 10.1Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8.2 10.1c.2-1 1-1.7 2-1.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
  </svg>
);

export const NavOrdersIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M6.2 8.8h11.6l1 10.7H5.2l1-10.7Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 8.8V7.2a3 3 0 0 1 6 0v1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9.2 12.2h5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".58" />
  </svg>
);

export const NavTicketIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 7.2A2.2 2.2 0 0 0 6.2 9.4 2.2 2.2 0 0 0 8.4 7.2h7.2a2.2 2.2 0 0 0 2.2 2.2A2.2 2.2 0 0 0 20 7.2V17a2.2 2.2 0 0 0-2.2-2.2 2.2 2.2 0 0 0-2.2 2.2H8.4a2.2 2.2 0 0 0-2.2-2.2A2.2 2.2 0 0 0 4 17V7.2Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 7.5v1.3M12 10.7V12M12 13.7V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NavProfileIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="12" cy="8" r="3.5" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 20c.6-3.6 2.9-5.5 7-5.5s6.4 1.9 7 5.5" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const NavRecruitmentIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <circle cx="10" cy="8" r="3.3" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c.5-3.4 2.6-5.2 6-5.2s5.5 1.8 6 5.2" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18.2 8.2v5M15.7 10.7h5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const NavPortfolioIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4 8.6A2 2 0 0 1 6 6.6h3.4l1.6 2.1H18a2 2 0 0 1 2 2v6.7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.6Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 11.6h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
    <path d="M9.6 15.4h4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".55" />
  </svg>
);

export const NavContactIcon = ({ className, style, ...props }: GlyphProps) => (
  <svg {...glyphProps(className, style)} {...props}>
    <path d="M4.4 6.6A2.2 2.2 0 0 1 6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v7.4a2.2 2.2 0 0 1-2.2 2.2h-6L7 20.2v-3.9a2.2 2.2 0 0 1-2.6-2.1V6.6Z" fill="currentColor" opacity=".13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8.6 8.8h6.8M8.6 11.8h4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
  </svg>
);

