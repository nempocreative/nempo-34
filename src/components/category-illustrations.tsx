type IllustrationProps = {
  className?: string;
};

const defaultClassName = "h-10 w-10 lg:h-[52px] lg:w-[52px]";
const outline = "#6d3925";
const softOutline = "#8b6245";
const cream = "#fff8e8";
const shadow = "#344b5b";

const IconKulinerIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="24" ry="4" fill={shadow} opacity=".14" />
    <path d="M13 36c1 15 9 23 23 23s22-8 23-23H13Z" fill="#f9c987" stroke={outline} strokeWidth="2.2" />
    <ellipse cx="36" cy="36" rx="23" ry="8" fill="#fff0c7" stroke={outline} strokeWidth="2.2" />
    <ellipse cx="36" cy="36" rx="18" ry="5" fill="#e8a95c" stroke={softOutline} strokeWidth="1.5" />
    <path d="M23 36c4-4 8 4 12 0s8 4 14 0M24 42c4-3 7 3 11 0s8 3 13 0" stroke="#a85d32" strokeWidth="2" strokeLinecap="round" />
    <path d="M29 29c-2-5 2-7 0-11M37 28c-2-5 2-7 0-12M45 30c-2-5 2-7 0-10" stroke="#fff8e8" strokeWidth="2.2" strokeLinecap="round" />
    <path d="m20 20 13 16M52 20 39 36" stroke="#dba45c" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="31" cy="34" r="2.3" fill="#f7d56d" />
    <ellipse cx="22" cy="44" rx="4" ry="2" fill="#fff8e8" opacity=".45" />
  </svg>
);

const IconJajanYukIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="23" ry="4" fill={shadow} opacity=".14" />
    <path d="M22 14 35 55M37 11l1 44M52 14 40 55" stroke="#d39a52" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M22 14 35 55M37 11l1 44M52 14 40 55" stroke="#fff0c7" strokeWidth=".9" strokeLinecap="round" />
    <circle cx="24" cy="21" r="8" fill="#fff8e8" stroke={outline} strokeWidth="1.8" />
    <circle cx="28" cy="38" r="8.5" fill="#f49b62" stroke={outline} strokeWidth="1.8" />
    <circle cx="39" cy="20" r="8.5" fill="#f7d56d" stroke={outline} strokeWidth="1.8" />
    <circle cx="40" cy="38" r="8.2" fill="#e77a62" stroke={outline} strokeWidth="1.8" />
    <circle cx="22" cy="18" r="2.1" fill="#fff" opacity=".65" />
    <circle cx="37" cy="17" r="2.1" fill="#fff" opacity=".65" />
    <path d="M14 53c4-4 11-6 22-6s18 2 22 6v5c0 3-11 5-22 5s-22-2-22-5v-5Z" fill="#fff8e8" stroke={outline} strokeWidth="2" />
    <ellipse cx="36" cy="53" rx="22" ry="6" fill="#f6c483" stroke="#b56b36" strokeWidth="1.6" />
    <path d="M25 53c4 3 18 4 23 0" stroke="#d4773e" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconCafeIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="35" cy="63" rx="25" ry="4" fill={shadow} opacity=".14" />
    <ellipse cx="34" cy="57" rx="22" ry="5" fill="#e9aa67" stroke={outline} strokeWidth="2" />
    <ellipse cx="34" cy="55" rx="18" ry="3" fill="#fff0c7" opacity=".8" />
    <path d="M18 31h32l-3 24c-7 4-19 4-26 0l-3-24Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M45 36c15-4 16 14 3 16" stroke={outline} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M47 39c8-1 8 8 1 9" stroke="#e2a15f" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="34" cy="31" rx="16" ry="5" fill="#f7d4a0" stroke={outline} strokeWidth="2" />
    <ellipse cx="34" cy="31" rx="12.5" ry="3.2" fill="#70452f" />
    <path d="M27 30c4-2 8 2 13-1" stroke="#c68b5b" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M28 24c-2-5 2-7 0-12M36 23c-2-5 2-7 0-13M44 25c-2-5 2-7 0-11" stroke="#fff8e8" strokeWidth="2.1" strokeLinecap="round" />
    <path d="M22 36c1 7 1 11 3 15" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
  </svg>
);

const IconWarungIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="25" ry="4" fill={shadow} opacity=".14" />
    <path d="M12 28 19 12h34l7 16v30H12V28Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M16 23h40l4 9H12l4-9Z" fill="#d77954" stroke={outline} strokeWidth="2" strokeLinejoin="round" />
    <path d="M20 23h8v9h-8zM36 23h8v9h-8zM52 23h4l4 9h-8z" fill="#f7d56d" />
    <path d="M16 32c0 4 6 4 6 0 0 4 7 4 7 0 0 4 7 4 7 0 0 4 7 4 7 0 0 4 7 4 7 0 0 4 7 4 7 0" stroke={outline} strokeWidth="1.6" strokeLinecap="round" />
    <rect x="17" y="38" width="19" height="14" rx="2" fill="#b6d9ed" stroke={outline} strokeWidth="1.8" />
    <path d="M26.5 38v14M17 45h19" stroke="#fff8e8" strokeWidth="1.5" />
    <rect x="42" y="39" width="12" height="19" rx="2" fill="#d98548" stroke={outline} strokeWidth="1.8" />
    <circle cx="51" cy="49" r="1" fill="#fff0c7" />
    <path d="M22 17h28" stroke="#fff8e8" strokeWidth="2" strokeLinecap="round" opacity=".8" />
  </svg>
);

const IconTiketEventIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="61" rx="25" ry="4" fill={shadow} opacity=".14" />
    <path d="M10 20c0-3 2-5 5-5h42c3 0 5 2 5 5v7c-4 0-6 2-6 5s2 5 6 5v7c0 3-2 5-5 5H15c-3 0-5-2-5-5v-7c4 0 6-2 6-5s-2-5-6-5v-7Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <path d="M35 17v30" stroke="#db9e57" strokeWidth="2" strokeDasharray="3 3" />
    <path d="M17 24h13M17 29h9" stroke="#d77954" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="23" cy="39" r="7" fill="#f6c866" stroke="#b46b35" strokeWidth="1.5" />
    <path d="m23 34 1.4 3h3.2l-2.6 2 1 3.1-3-1.8-2.8 1.8 1-3.1-2.7-2h3.2l1.3-3Z" fill="#fff8e8" />
    <rect x="41" y="24" width="13" height="3" rx="1.5" fill="#b6d9ed" />
    <rect x="41" y="30" width="9" height="2.5" rx="1.25" fill="#e9c88d" />
    <rect x="41" y="36" width="11" height="2.5" rx="1.25" fill="#e9c88d" />
    <path d="M45 43h9M45 47h5" stroke="#d77954" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="56" cy="18" r="3" fill="#f6c866" stroke={outline} strokeWidth="1.2" />
  </svg>
);

const IconSewaMobilIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="61" rx="27" ry="4" fill={shadow} opacity=".16" />
    <path d="M8 48h56" stroke="#fff0c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 47v8M56 47v8" stroke="#6d8b9a" strokeWidth="2.5" strokeLinecap="round" />
    <path d="m12 43 5-16c1-3 3-5 6-5h25c3 0 5 2 6 5l6 16v8H12v-8Z" fill="#f2b866" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="m22 23 3-10h22l4 10H22Z" fill="#b6d9ed" stroke={outline} strokeWidth="2" strokeLinejoin="round" />
    <path d="m25 21 2-6h8v6H25ZM38 15h7l3 6H38v-6Z" fill="#e3f0ed" />
    <path d="M16 34h40v8H16z" fill="#d9814d" opacity=".8" />
    <path d="M19 36h8M45 36h8" stroke="#fff0c7" strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="39" width="8" height="5" rx="2" fill="#f7d56d" stroke={outline} strokeWidth="1.5" />
    <rect x="56" y="39" width="8" height="5" rx="2" fill="#f7d56d" stroke={outline} strokeWidth="1.5" />
    <circle cx="22" cy="51" r="7" fill="#344b5b" stroke={outline} strokeWidth="2" />
    <circle cx="22" cy="51" r="3" fill="#fff0c7" />
    <circle cx="50" cy="51" r="7" fill="#344b5b" stroke={outline} strokeWidth="2" />
    <circle cx="50" cy="51" r="3" fill="#fff0c7" />
  </svg>
);

const IconAdventureIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="22" ry="4" fill={shadow} opacity=".14" />
    <path d="M20 23c0-9 6-14 16-14s16 5 16 14v36H20V23Z" fill="#d98548" stroke={outline} strokeWidth="2.2" />
    <path d="M28 11c0-5 3-7 8-7s8 2 8 7" stroke="#fff0c7" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 24c-7 5-8 15-6 29M52 24c7 5 8 15 6 29" stroke="#995332" strokeWidth="5" strokeLinecap="round" />
    <path d="M25 29h22v17H25z" fill="#bd643c" stroke="#7b432d" strokeWidth="1.8" />
    <circle cx="36" cy="37" r="7" fill="#fff8e8" stroke="#7b624d" strokeWidth="1.5" />
    <path d="m36 31 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#f6c866" />
    <path d="M27 25h18M28 49h16" stroke="#f4c07b" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="49" y="32" width="7" height="19" rx="3.5" fill="#b6d9ed" stroke={outline} strokeWidth="1.6" />
    <rect x="50.5" y="28" width="4" height="5" rx="2" fill="#fff0c7" stroke={outline} strokeWidth="1.3" />
    <path d="M51 37h3v9h-3z" fill="#8ac5d6" />
  </svg>
);

const IconPenginapanIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="25" ry="4" fill={shadow} opacity=".14" />
    <circle cx="54" cy="14" r="9" fill="#f7d56d" stroke={outline} strokeWidth="1.7" />
    <path d="M50 9c4 2 6 5 6 10-3 0-6-1-8-4-2-2-2-4-1-6" fill="#fff0c7" opacity=".8" />
    <path d="M13 22c0-3 2-5 5-5h36c3 0 5 2 5 5v38H13V22Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <path d="M13 22c0-3 2-5 5-5h36c3 0 5 2 5 5v10H13V22Z" fill="#d77954" stroke={outline} strokeWidth="2.2" />
    <path d="M22 26h8M42 26h8" stroke="#fff0c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 38h11v10H20zM41 38h11v10H41z" fill="#b6d9ed" stroke={outline} strokeWidth="1.8" />
    <path d="M25.5 38v10M20 43h11M46.5 38v10M41 43h11" stroke="#fff8e8" strokeWidth="1.3" />
    <rect x="30" y="49" width="12" height="11" rx="2" fill="#b66b3e" stroke={outline} strokeWidth="1.7" />
    <circle cx="39" cy="55" r="1.2" fill="#f7d56d" />
    <path d="M30 54h12" stroke="#fff0c7" strokeWidth="1.2" opacity=".6" />
  </svg>
);

const IconTalentIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="18" ry="4" fill={shadow} opacity=".14" />
    <path d="m36 7 17 52H19L36 7Z" fill="#fff8e8" opacity=".18" />
    <rect x="29" y="16" width="14" height="25" rx="7" fill="#fff8e8" stroke={outline} strokeWidth="2" />
    <path d="M32 22h8M32 27h8M32 32h8" stroke="#d4a46a" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 32c0 11 6 17 14 17s14-6 14-17M36 49v9M27 58h18" stroke="#f7d56d" strokeWidth="3" strokeLinecap="round" />
    <path d="m54 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5ZM16 22l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" fill="#fff0c7" stroke={outline} strokeWidth="1" strokeLinejoin="round" />
    <path d="M32 18v13" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".55" />
  </svg>
);

const IconLayananDigitalIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="19" ry="4" fill={shadow} opacity=".14" />
    <rect x="20" y="7" width="32" height="54" rx="7" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <rect x="24" y="15" width="24" height="34" rx="2.5" fill="#5bafbb" stroke="#265d68" strokeWidth="1.6" />
    <rect x="28" y="20" width="7" height="7" rx="2" fill="#f7d56d" />
    <rect x="38" y="20" width="7" height="7" rx="2" fill="#fff0c7" />
    <rect x="28" y="30" width="7" height="7" rx="2" fill="#fff0c7" />
    <rect x="38" y="30" width="7" height="7" rx="2" fill="#f6c08b" />
    <path d="M28 43h4M34 41v2M40 39v4M46 36v7" stroke="#fff8e8" strokeWidth="2.1" strokeLinecap="round" />
    <rect x="31" y="10.5" width="10" height="2" rx="1" fill="#c5e4dc" />
    <circle cx="36" cy="55" r="2.3" fill="#83cbd0" />
    <path d="M54 31c5 2 7 6 7 11" stroke="#f7d56d" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M57 26c7 3 10 8 10 16" stroke="#fff0c7" strokeWidth="2.2" strokeLinecap="round" opacity=".85" />
    <circle cx="54" cy="44" r="1.8" fill="#f7d56d" />
  </svg>
);

const IconDaftarHargaIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="35" cy="62" rx="23" ry="4" fill={shadow} opacity=".14" />
    <path d="M12 13h25l25 25c2 2 2 5 0 7L49 58c-2 2-5 2-7 0L17 33H12V13Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M37 13 62 38c2 2 2 5 0 7L49 58c-2 2-5 2-7 0L17 33" fill="#f4dfb5" opacity=".5" />
    <circle cx="21" cy="22" r="4.5" fill="#9abd57" stroke={outline} strokeWidth="1.6" />
    <circle cx="21" cy="22" r="1.7" fill="#fff8e8" />
    <path d="M36 36c4-4 11-3 12 2 1 5-4 9-9 8-5-1-7 3-4 6M48 37c-3-2-6-1-7 2" stroke="#d77954" strokeWidth="2.3" strokeLinecap="round" />
    <path d="M31 29h10M34 49h8" stroke="#d8a15b" strokeWidth="1.7" strokeLinecap="round" />
    <path d="m53 16 1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5Z" fill="#f7d56d" stroke={outline} strokeWidth="1" />
  </svg>
);

const IconKomunitasIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="25" ry="4" fill={shadow} opacity=".14" />
    <circle cx="51" cy="26" r="10" fill="#b6d9ed" stroke={outline} strokeWidth="2" />
    <path d="M51 37c-9 0-15 6-15 15v8h30v-8c0-9-6-15-15-15Z" fill="#8bc1d7" stroke={outline} strokeWidth="2" />
    <circle cx="21" cy="29" r="11" fill="#f4c487" stroke={outline} strokeWidth="2" />
    <path d="M21 41C11 41 5 47 5 57v3h32v-3c0-10-6-16-16-16Z" fill="#e7a45f" stroke={outline} strokeWidth="2" />
    <circle cx="36" cy="24" r="12" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <path d="M36 37c-11 0-18 7-18 18v5h36v-5c0-11-7-18-18-18Z" fill="#fff0c7" stroke={outline} strokeWidth="2.2" />
    <circle cx="32" cy="24" r="1.5" fill={outline} />
    <circle cx="40" cy="24" r="1.5" fill={outline} />
    <path d="M31 29c3 3 7 3 10 0" stroke="#d77954" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 12h46" stroke="#f7d56d" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
  </svg>
);

const IconBeritaIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="23" ry="4" fill={shadow} opacity=".14" />
    <rect x="17" y="9" width="39" height="50" rx="4" fill="#f2dfb8" stroke={outline} strokeWidth="2" transform="rotate(5 17 9)" />
    <rect x="13" y="11" width="39" height="50" rx="4" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <path d="M18 17h29v8H18z" fill="#d77954" />
    <path d="M21 19h17" stroke="#fff0c7" strokeWidth="2" strokeLinecap="round" />
    <rect x="18" y="30" width="15" height="14" rx="2" fill="#b6d9ed" stroke="#7aa6b5" strokeWidth="1.2" />
    <path d="m19 42 5-7 4 4 3-5 2 8H19Z" fill="#7bb58f" />
    <circle cx="29" cy="34" r="2" fill="#f7d56d" />
    <path d="M37 31h11M37 36h10M37 41h7M18 49h30M18 54h23" stroke="#d8b980" strokeWidth="2" strokeLinecap="round" />
    <path d="m54 18 1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5Z" fill="#f7d56d" stroke={outline} strokeWidth="1" />
  </svg>
);

const IconInfluencerHubIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="19" ry="4" fill={shadow} opacity=".14" />
    <rect x="23" y="9" width="26" height="50" rx="6" fill="#fff8e8" stroke={outline} strokeWidth="2.2" transform="rotate(6 23 9)" />
    <rect x="26" y="15" width="20" height="31" rx="2.5" fill="#e99bb2" stroke="#a44f68" strokeWidth="1.5" transform="rotate(6 26 15)" />
    <circle cx="37" cy="30" r="8" fill="#fff8e8" opacity=".95" />
    <path d="m34 26 8 4-7 5-1-9Z" fill="#d77954" />
    <path d="M39 42c-3-5 4-8 6-4 2-4 8 0 5 4-3 3-5 4-5 4s-3-1-6-4Z" fill="#e77b83" stroke="#a44f68" strokeWidth="1.1" />
    <path d="M31 12h9" stroke="#e6b7bf" strokeWidth="2" strokeLinecap="round" />
    <circle cx="36" cy="54" r="2" fill="#e6b7bf" />
    <path d="m14 13 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5ZM56 19l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="#f7d56d" stroke={outline} strokeWidth="1" />
  </svg>
);

const IconMerchandiseIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="23" ry="4" fill={shadow} opacity=".14" />
    <path d="m27 11-14 9 5 12 7-4v31h22V28l7 4 5-12-14-9c-2 5-5 7-9 7s-7-2-9-7Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="m27 11-14 9 5 12 7-4v9l-9 4-3-9 5-12 14-9c1 3 2 5 4 6-4 1-8-1-9-6ZM45 11l14 9-5 12-7-4v9l9 4 3-9-5-12-14-9c-1 3-2 5-4 6 4 1 8-1 9-6Z" fill="#f0d7a8" opacity=".75" />
    <path d="M31 12c1 4 3 6 5 6s4-2 5-6" stroke="#c89152" strokeWidth="1.8" />
    <circle cx="36" cy="39" r="10" fill="#86bdd0" stroke="#2c6d80" strokeWidth="1.5" />
    <path d="m36 31 2.3 6h6l-5 3.7 1.8 6.2-5.1-3.7-5.1 3.7 1.8-6.2-5-3.7h6L36 31Z" fill="#fff0c7" />
    <path d="M25 57h22" stroke="#db9e57" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconCulturalTourIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="62" rx="25" ry="4" fill={shadow} opacity=".14" />
    <path d="m7 31 29-18 29 18-4 4H11l-4-4Z" fill="#d77954" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M16 31h40v7H16z" fill="#f7d56d" stroke={outline} strokeWidth="2" />
    <path d="M20 38h32v20H20z" fill="#fff8e8" stroke={outline} strokeWidth="2" />
    <path d="M24 38v20M48 38v20" stroke="#d77954" strokeWidth="2.4" />
    <path d="M29 58V46c0-4 3-7 7-7s7 3 7 7v12" fill="#b7793d" stroke={outline} strokeWidth="2" />
    <path d="M33 58V46a3 3 0 0 1 6 0v12" fill="#5b3929" />
    <path d="M11 61h50M28 22h16" stroke="#fff0c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 7v6M33 9h6" stroke="#f7d56d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconVoucherIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="61" rx="25" ry="4" fill={shadow} opacity=".14" />
    <path d="M10 22c0-3 2-5 5-5h42c3 0 5 2 5 5v6c-4 0-6 2-6 5s2 5 6 5v6c0 3-2 5-5 5H15c-3 0-5-2-5-5v-6c4 0 6-2 6-5s-2-5-6-5v-6Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" />
    <path d="M40 19v38" stroke="#e68c88" strokeWidth="2" strokeDasharray="3 3" />
    <circle cx="25" cy="33" r="9" fill="#f7d4a0" stroke="#b46345" strokeWidth="1.7" />
    <circle cx="22" cy="30" r="2" fill="#d77954" />
    <circle cx="28" cy="36" r="2" fill="#d77954" />
    <path d="m29 28-8 10" stroke="#d77954" strokeWidth="2" strokeLinecap="round" />
    <path d="m51 25 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5 1.5-4Z" fill="#f7d56d" stroke={outline} strokeWidth="1" />
    <path d="M46 42h10M46 47h7" stroke="#e7b5a8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="57" cy="19" r="2" fill="#f7d56d" />
  </svg>
);

const IconKamusSundaIllustration = ({ className = defaultClassName }: IllustrationProps) => (
  <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" className={className}>
    <ellipse cx="36" cy="63" rx="24" ry="4" fill={shadow} opacity=".14" />
    <path d="M36 16c-8-5-16-6-24-2v42c8-4 16-3 24 2V16Z" fill="#f7d56d" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M36 16c8-5 16-6 24-2v42c-8-4-16-3-24 2V16Z" fill="#fff8e8" stroke={outline} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M36 16v42" stroke="#9b5b32" strokeWidth="2.2" />
    <path d="M18 25h12M18 31h11M18 37h8" stroke="#fff8e8" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 25H42M54 31H42M54 37h-8" stroke="#edcf91" strokeWidth="2" strokeLinecap="round" />
    <path d="M47 44V25M42 31h10M44 25l6 19M50 25l-6 19" stroke="#a45b33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M22 14v13l5-4 5 4V14Z" fill="#d77954" stroke={outline} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="m59 9 1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5 1.5-3.5Z" fill="#f7d56d" stroke={outline} strokeWidth="1" />
  </svg>
);

export const categoryIllustrations = {
  "kuliner": IconKulinerIllustration,
  "jajan-yuk": IconJajanYukIllustration,
  "cafe": IconCafeIllustration,
  "warung": IconWarungIllustration,
  "tiket-event": IconTiketEventIllustration,
  "sewa-mobil": IconSewaMobilIllustration,
  "adventure": IconAdventureIllustration,
  "penginapan": IconPenginapanIllustration,
  "talent": IconTalentIllustration,
  "layanan-digital": IconLayananDigitalIllustration,
  "daftar-harga": IconDaftarHargaIllustration,
  "komunitas": IconKomunitasIllustration,
  "influencer-hub": IconInfluencerHubIllustration,
  "merchandise": IconMerchandiseIllustration,
  "cultural-tour": IconCulturalTourIllustration,
  "voucher": IconVoucherIllustration,
  "kamus-sunda": IconKamusSundaIllustration,
};