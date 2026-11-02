import type { mainNavItems } from "@/data/main-nav-items";

export type HomeServiceIconId = (typeof mainNavItems)[number]["id"];

type ServiceArtProps = {
  id: HomeServiceIconId;
};

function ServiceArt({ id }: ServiceArtProps) {
  const outline = "#704C3A";
  const cream = "#FFF8E9";
  const gold = "#F7D56D";

  switch (id) {
    case "event-organizer":
      return (
        <>
          <ellipse cx="32" cy="57" rx="16" ry="3" fill="#633F7C" opacity=".18" />
          <rect x="18" y="12" width="28" height="38" rx="5" fill={cream} stroke={outline} strokeWidth="2" />
          <path d="M24 9v7m16-7v7M18.5 22h27" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          <path d="m32 28 2 4.2 4.6.6-3.3 3.1.8 4.5-4.1-2.2-4.1 2.2.8-4.5-3.3-3.1 4.6-.6L32 28Z" fill={gold} stroke={outline} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M24 46h16" stroke="#D7B17A" strokeWidth="2" strokeLinecap="round" />
          <path d="m49 15 1.3 3 3 1.3-3 1.2-1.3 3-1.2-3-3-1.2 3-1.3 1.2-3Z" fill={gold} stroke={outline} strokeWidth="1" />
        </>
      );
    case "wedding-organizer":
      return (
        <>
          <ellipse cx="32" cy="56" rx="16" ry="3" fill="#633F7C" opacity=".18" />
          <path d="M32 48S15 38 15 27c0-8 11-11 17-2 6-9 17-6 17 2 0 11-17 21-17 21Z" fill="#FFE8E7" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M32 43S20 35 20 28c0-4 5-6 9-1 1 2 2 4 3 5 2-5 6-9 11-7" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
          <path d="m18 15 1.3 3 3 1.3-3 1.2-1.3 3-1.2-3-3-1.2 3-1.3 1.2-3Z" fill={gold} stroke={outline} strokeWidth="1" />
          <circle cx="48" cy="18" r="3" fill={gold} stroke={outline} strokeWidth="1.2" />
        </>
      );
    case "sosmed-management":
      return (
        <>
          <ellipse cx="32" cy="57" rx="17" ry="3" fill="#633F7C" opacity=".18" />
          <rect x="17" y="11" width="30" height="42" rx="8" fill={cream} stroke={outline} strokeWidth="2.1" transform="rotate(-5 17 11)" />
          <rect x="22" y="17" width="21" height="24" rx="5" fill="#F4B7C6" stroke="#A34D62" strokeWidth="1.5" transform="rotate(-5 22 17)" />
          <circle cx="32" cy="29" r="5.5" fill="#FFF6E7" />
          <circle cx="32" cy="29" r="2.3" fill="#E11D48" />
          <circle cx="39" cy="21" r="1.6" fill="#A34D62" />
          <path d="M27 47h12" stroke="#D3A979" strokeWidth="2" strokeLinecap="round" />
          <path d="m50 14 1.2 3 3 1.2-3 1.3-1.2 3-1.3-3-3-1.3 3-1.2 1.3-3Z" fill={gold} stroke={outline} strokeWidth="1" />
        </>
      );
    case "wedding-invitation":
      return (
        <>
          <ellipse cx="32" cy="56" rx="17" ry="3" fill="#633F7C" opacity=".18" />
          <rect x="13" y="20" width="38" height="27" rx="4" fill="#F4D9B9" stroke={outline} strokeWidth="2" transform="rotate(-5 13 20)" />
          <rect x="15" y="17" width="34" height="27" rx="4" fill={cream} stroke={outline} strokeWidth="2.1" />
          <path d="m17 20 15 12 15-12" fill="#F6E3D0" stroke={outline} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M27 37c-3-3 2-7 5-3 3-4 8 0 5 3l-5 4-5-4Z" fill="#E88093" stroke="#A34D62" strokeWidth="1.2" />
          <path d="m47 12 1.2 3 3 1.2-3 1.3-1.2 3-1.3-3-3-1.3 3-1.2 1.3-3Z" fill={gold} stroke={outline} strokeWidth="1" />
          <circle cx="14" cy="49" r="2" fill={gold} />
        </>
      );
    case "web-development":
      return (
        <>
          <ellipse cx="32" cy="56" rx="18" ry="3" fill="#633F7C" opacity=".18" />
          <rect x="11" y="15" width="42" height="29" rx="5" fill={cream} stroke={outline} strokeWidth="2.1" />
          <path d="M12 23h40" stroke={outline} strokeWidth="1.8" />
          <circle cx="18" cy="19" r="1.4" fill="#E98373" />
          <circle cx="23" cy="19" r="1.4" fill={gold} />
          <circle cx="28" cy="19" r="1.4" fill="#86C6A5" />
          <rect x="17" y="27" width="30" height="12" rx="2.2" fill="#BCE7F1" />
          <path d="m27 29-4 4 4 4m10-8 4 4-4 4m-4-9-2 10" stroke="#247A91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 44v5m-8 0h16" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          <path d="m48 12 1.2 3 3 1.2-3 1.3-1.2 3-1.3-3-3-1.3 3-1.2 1.3-3Z" fill={gold} stroke={outline} strokeWidth="1" />
        </>
      );
    case "design-creative":
      return (
        <>
          <ellipse cx="32" cy="56" rx="16" ry="3" fill="#633F7C" opacity=".18" />
          <path d="M19 35c0-10 7-17 16-17s15 7 15 16c0 6-3 9-7 12-2 1-3 3-3 5H28c0-3-1-4-4-6-3-2-5-5-5-10Z" fill="#FFE7B2" stroke={outline} strokeWidth="2.1" />
          <path d="M28 51h12m-10 4h8" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          <path d="M35 27c-1 5-5 7-5 11 0 3 2 5 5 5 4 0 6-3 5-6-.7-2-2-3-2-6-1 2-2 3-3 4" fill="#F6B64D" stroke="#A45B2F" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M17 16v5m-2.5-2.5h5M51 15v5m-2.5-2.5h5" stroke="#FFF5D8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="31" r="2" fill={gold} />
        </>
      );
    case "talent-management":
      return (
        <>
          <ellipse cx="32" cy="57" rx="18" ry="3" fill="#633F7C" opacity=".18" />
          <circle cx="32" cy="25" r="9" fill="#FFE9CB" stroke={outline} strokeWidth="2" />
          <path d="M15 51c1-10 7-15 17-15s16 5 17 15v2H15v-2Z" fill="#E7C6F2" stroke={outline} strokeWidth="2" strokeLinejoin="round" />
          <path d="M26 26c2 2 4 3 6 3s4-1 6-3" stroke="#B86C64" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="29" cy="24" r="1" fill={outline} />
          <circle cx="35" cy="24" r="1" fill={outline} />
          <path d="m47 13 1.3 3 3 1.3-3 1.2-1.3 3-1.2-3-3-1.2 3-1.3 1.2-3Z" fill={gold} stroke={outline} strokeWidth="1" />
          <path d="m18 20 .8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" fill="#FFE9CB" stroke={outline} strokeWidth=".8" />
        </>
      );
    case "business-system":
      return (
        <>
          <ellipse cx="32" cy="57" rx="18" ry="3" fill="#633F7C" opacity=".18" />
          <path d="M15 18h34v35H15z" fill="#D3EEE1" stroke={outline} strokeWidth="2.1" />
          <path d="M21 25h9v9h-9zm14 0h9v9h-9zm-14 14h9v9h-9zm14 0h9v9h-9z" fill={cream} stroke="#4A9183" strokeWidth="1.4" />
          <path d="M11 20h42" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23 14h18" stroke="#F5C25F" strokeWidth="3" strokeLinecap="round" />
          <path d="m49 12 1.2 3 3 1.2-3 1.3-1.2 3-1.3-3-3-1.3 3-1.2 1.3-3Z" fill={gold} stroke={outline} strokeWidth="1" />
        </>
      );
    case "nempo-community":
      return (
        <>
          <ellipse cx="32" cy="57" rx="18" ry="3" fill="#633F7C" opacity=".18" />
          <circle cx="20" cy="24" r="6" fill="#DBEAFE" stroke={outline} strokeWidth="2" />
          <circle cx="44" cy="24" r="6" fill="#DBEAFE" stroke={outline} strokeWidth="2" />
          <path d="M9 48c0-8 5-13 11-13s9 3 10 6M55 48c0-8-5-13-11-13s-9 3-10 6" fill="#BFDBFE" stroke={outline} strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="29" r="7.5" fill={cream} stroke={outline} strokeWidth="2.1" />
          <path d="M19 52c0-9 6-14 13-14s13 5 13 14Z" fill="#2563EB" stroke={outline} strokeWidth="2.1" strokeLinejoin="round" />
          <path d="m50 9 1.2 3 3 1.2-3 1.3-1.2 3-1.3-3-3-1.3 3-1.2 1.3-3Z" fill={gold} stroke={outline} strokeWidth="1" />
        </>
      );
    default:
      return null;
  }
}

export function HomeServiceIcon({
  id,
  className,
}: {
  id: HomeServiceIconId;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <ServiceArt id={id} />
    </svg>
  );
}
