import React from "react";
import { Link } from "@/lib/wouter";
import { mainNavItems } from "@/data/main-nav-items";
import { HomeServiceIcon } from "@/components/home-service-icons";

/* ══════════════════════════════════════════════════════════════
   CATEGORY ICONS — Professional SVG illustrations
   All icons designed for 62×62 colored card backgrounds
   ══════════════════════════════════════════════════════════════ */

const IconWisata = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Sky backdrop */}
    <rect x="2" y="4" width="44" height="26" rx="5" fill="rgba(255,255,255,0.15)"/>
    {/* Sun with glow */}
    <circle cx="37" cy="11" r="8" fill="rgba(253,224,71,0.35)"/>
    <circle cx="37" cy="11" r="5.5" fill="#FDE047"/>
    <circle cx="37" cy="11" r="3.5" fill="#FCD34D"/>
    <line x1="37" y1="2" x2="37" y2="0" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round"/>
    <line x1="44" y1="5" x2="46" y2="3" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="46" y1="11" x2="48" y2="11" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="44" y1="17" x2="46" y2="19" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round"/>
    {/* Clouds */}
    <ellipse cx="12" cy="10" rx="6" ry="3.5" fill="rgba(255,255,255,0.7)"/>
    <ellipse cx="16" cy="9" rx="5" ry="3" fill="rgba(255,255,255,0.85)"/>
    <ellipse cx="8" cy="11" rx="4" ry="2.5" fill="rgba(255,255,255,0.7)"/>
    {/* Background mountain */}
    <path d="M0 38 L14 16 L22 28 L30 14 L44 38 Z" fill="rgba(255,255,255,0.18)"/>
    {/* Front mountains */}
    <path d="M0 46 L14 22 L22 34 L32 18 L46 46 Z" fill="rgba(255,255,255,0.88)"/>
    {/* Snow caps */}
    <path d="M14 22 L18 29 L10 29 Z" fill="white"/>
    <path d="M32 18 L36 26 L28 26 Z" fill="white"/>
    <path d="M14 22 L16 25 L12 25 Z" fill="rgba(186,230,253,0.6)"/>
    {/* Green ground */}
    <path d="M0 44 Q12 40 24 43 Q36 46 48 43 V48 H0 Z" fill="rgba(74,222,128,0.55)"/>
    {/* Palm tree */}
    <rect x="22" y="32" width="4" height="13" rx="2" fill="rgba(120,53,15,0.75)"/>
    <path d="M24 32 Q14 24 10 28 Q16 18 24 26" fill="#4ADE80"/>
    <path d="M24 32 Q34 24 38 28 Q32 18 24 26" fill="#22C55E"/>
    <path d="M24 32 Q20 22 20 18 Q26 22 24 30" fill="#16A34A" opacity="0.8"/>
  </svg>
);

const IconWisataCategory = () => (
  <svg
    viewBox="0 0 72 72"
    fill="none"
    aria-hidden="true"
    className="h-10 w-10 drop-shadow-[0_3px_2px_rgba(52,75,91,0.22)] lg:h-[52px] lg:w-[52px]"
  >
    <ellipse cx="36" cy="63" rx="24" ry="4" fill="#344b5b" opacity=".14" />
    <circle cx="52" cy="17" r="9" fill="#ffc653" stroke="#8b5a35" strokeWidth="2" />
    <path d="m6 49 20-28 17 24 11-16 15 21v12H6V49Z" fill="#b6d9ed" stroke="#6d3925" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="m18 33 8-12 9 13-6-3-4 4-3-3-4 2ZM47 38l7-9 8 11-6-3-3 3-3-2-3 1Z" fill="#fff8e8" stroke="#8b6245" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="m3 55 17-18 13 15 13-19 23 23v8H3v-9Z" fill="#77b4d2" stroke="#6d3925" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M5 54c9-7 17-7 26-1 8-7 17-8 25-2 5-2 9-1 13 2v11H5V54Z" fill="#71b56c" stroke="#6d3925" strokeWidth="2" strokeLinejoin="round" />
    <path d="M32 64c2-5 5-7 7-11 2-3 2-6-1-9" stroke="#fff0c7" strokeWidth="5" strokeLinecap="round" />
    <path d="M32 64c2-5 5-7 7-11 2-3 2-6-1-9" stroke="#e7a94e" strokeWidth="1.5" strokeLinecap="round" />
    <path d="m13 53 5-9 5 9h-3v7h-4v-7h-3ZM55 50l4-7 4 7h-2v6h-4v-6h-2Z" fill="#287b53" stroke="#6d3925" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const IconKuliner = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Steam lines */}
    <path d="M15 12 Q13 8 15 4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M24 10 Q22 6 24 2" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M33 12 Q31 8 33 4" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Bowl drop-shadow */}
    <ellipse cx="24" cy="43" rx="17" ry="4" fill="rgba(0,0,0,0.14)"/>
    {/* Bowl body */}
    <path d="M7 25 Q7 45 24 45 Q41 45 41 25 Z" fill="#FFFBEB"/>
    {/* Bowl inner shadow */}
    <path d="M7 25 Q10 35 24 39 Q38 35 41 25 Q38 27 24 27 Q10 27 7 25 Z" fill="#FEF3C7"/>
    {/* Bowl rim */}
    <ellipse cx="24" cy="25" rx="17" ry="4.5" fill="#FDE68A"/>
    <ellipse cx="24" cy="25" rx="17" ry="4.5" fill="none" stroke="#FBBF24" strokeWidth="1.2"/>
    {/* Noodle waves */}
    <path d="M12 31 Q16 28 20 31 Q24 34 28 31 Q32 28 36 31" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M11 36 Q15 33 19 36 Q23 39 27 36 Q31 33 37 36" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
    {/* Egg highlight */}
    <ellipse cx="24" cy="29" rx="4.5" ry="3" fill="rgba(255,255,255,0.55)"/>
    <ellipse cx="24" cy="29" rx="2.8" ry="1.8" fill="#FCD34D" opacity="0.75)"/>
    {/* Bowl shine */}
    <ellipse cx="15" cy="34" rx="3.5" ry="2" fill="rgba(255,255,255,0.45)"/>
    {/* Chopsticks */}
    <line x1="16" y1="14" x2="10" y2="28" stroke="rgba(255,255,255,0.92)" strokeWidth="2.8" strokeLinecap="round"/>
    <line x1="32" y1="14" x2="38" y2="28" stroke="rgba(255,255,255,0.92)" strokeWidth="2.8" strokeLinecap="round"/>
    {/* Chopstick tips (wood) */}
    <line x1="10" y1="28" x2="9" y2="30" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
    <line x1="38" y1="28" x2="39" y2="30" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const IconJajanYuk = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Skewer snack shadow */}
    <ellipse cx="24" cy="43" rx="15" ry="3" fill="rgba(0,0,0,0.16)" />
    {/* Skewers */}
    <path d="M14 8 22 35M24 6l2 29M34 8l-6 27" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 8 22 35M24 6l2 29M34 8l-6 27" stroke="#92400E" strokeWidth=".8" strokeLinecap="round" opacity=".8" />
    {/* Snack pieces */}
    <circle cx="16.5" cy="14" r="5" fill="#FFF7ED" />
    <circle cx="18.2" cy="25" r="5.2" fill="#FDBA74" />
    <circle cx="25" cy="13" r="5.2" fill="#FEF3C7" />
    <circle cx="26" cy="24" r="5.1" fill="#FBBF24" />
    <circle cx="32.5" cy="14" r="5" fill="#FFF7ED" />
    <circle cx="30.5" cy="25" r="5.2" fill="#FB7185" />
    {/* Highlights */}
    <circle cx="15" cy="12.5" r="1.4" fill="white" opacity=".75" />
    <circle cx="23.5" cy="11.5" r="1.4" fill="white" opacity=".75" />
    <circle cx="31" cy="12.5" r="1.4" fill="white" opacity=".75" />
    {/* Sauce tray */}
    <path d="M9 35c0-2.4 6.7-4.5 15-4.5S39 32.6 39 35v4.5c0 2.4-6.7 4.5-15 4.5S9 41.9 9 39.5V35Z" fill="#FFF7ED" />
    <ellipse cx="24" cy="35" rx="15" ry="4.5" fill="#FED7AA" stroke="#C2410C" strokeWidth="1" />
    <path d="M15 35c3.2 1.5 6.2 2.1 9 2.1s5.8-.6 9-2.1" stroke="#FB923C" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconPerlombaan = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Confetti — vivid colours that pop on purple */}
    <rect x="3" y="4" width="4" height="4" rx="1" fill="#FCD34D" transform="rotate(20 5 6)"/>
    <rect x="40" y="6" width="3" height="3" rx="0.8" fill="#FCA5A5" transform="rotate(-15 42 8)"/>
    <circle cx="8" cy="18" r="2" fill="#FDE68A"/>
    <circle cx="42" cy="16" r="1.5" fill="#FCD34D"/>
    {/* Stars */}
    <text x="2" y="12" fontSize="9" fill="#FDE68A">✦</text>
    <text x="38" y="10" fontSize="7" fill="#FDE68A">✦</text>
    {/* Base shadow */}
    <rect x="13" y="40" width="22" height="6" rx="3" fill="rgba(0,0,0,0.22)" transform="translate(0,2.5)"/>
    {/* Trophy handles — solid, no opacity fade */}
    <path d="M8 9 Q3 18 8 28 L16 28 L16 9 Z" fill="#F59E0B"/>
    <path d="M40 9 Q45 18 40 28 L32 28 L32 9 Z" fill="#F59E0B"/>
    <path d="M8 9 Q3 18 8 28" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 9 Q45 18 40 28" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Cup shadow */}
    <path d="M16 7 H32 V28 Q32 38 24 38 Q16 38 16 28 Z" fill="rgba(0,0,0,0.18)" transform="translate(0,3)"/>
    {/* Cup body — rich gold */}
    <path d="M16 7 H32 V28 Q32 38 24 38 Q16 38 16 28 Z" fill="#FBBF24"/>
    {/* Cup highlight */}
    <path d="M16 7 H20 V27 Q20 36 19 38 Q16 36 16 28 Z" fill="rgba(255,255,255,0.28)"/>
    {/* Cup rim */}
    <rect x="14" y="5" width="20" height="5.5" rx="2.75" fill="#F59E0B"/>
    {/* Medal star — white on gold */}
    <path d="M24 13 L25.8 18.5 H31.8 L26.8 21.8 L28.6 27.2 L24 24 L19.4 27.2 L21.2 21.8 L16.2 18.5 H22.2 Z" fill="white"/>
    {/* Stem */}
    <rect x="21.5" y="38" width="5" height="4" rx="2" fill="#F59E0B"/>
    {/* Base plate — white to contrast */}
    <rect x="13" y="42" width="22" height="5" rx="2.5" fill="#FFFFFF"/>
    <rect x="15" y="43" width="10" height="2" rx="1" fill="rgba(0,0,0,0.12)"/>
  </svg>
);

const IconTiketWisata = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Drop shadow */}
    <rect x="2" y="11" width="44" height="28" rx="7" fill="rgba(0,0,0,0.14)" transform="translate(0,3.5)"/>
    {/* Ticket body */}
    <rect x="2" y="11" width="44" height="28" rx="7" fill="white" opacity="0.95"/>
    {/* Left half-circle notch */}
    <circle cx="2" cy="25" r="6" fill="#2563EB"/>
    {/* Right half-circle notch */}
    <circle cx="46" cy="25" r="6" fill="#2563EB"/>
    {/* Perforated divider */}
    {[16,19,22,25,28,31].map((x, i) => (
      <circle key={i} cx={x} cy="25" r="1.2" fill="#BFDBFE"/>
    ))}
    {/* Photo thumbnail left */}
    <rect x="8" y="16" width="15" height="18" rx="3.5" fill="#DBEAFE"/>
    {/* Mountain scene in photo */}
    <path d="M8 28 L15 18 L22 26 V34 H8 Z" fill="#93C5FD"/>
    <path d="M8 34 L15 24 L22 32 V34 Z" fill="#60A5FA"/>
    {/* Sun in photo */}
    <circle cx="20" cy="19" r="2.8" fill="#FDE68A"/>
    {/* Destination name */}
    <rect x="27" y="18" width="16" height="3.5" rx="1.75" fill="#1D4ED8" opacity="0.85"/>
    {/* Subtitle lines */}
    <rect x="27" y="24" width="12" height="2.5" rx="1.25" fill="#93C5FD"/>
    <rect x="27" y="29" width="9" height="2" rx="1" fill="#BFDBFE"/>
    {/* Gold star badge */}
    <circle cx="36" cy="35" r="4.5" fill="#FCD34D"/>
    <text x="33.5" y="37.5" fontSize="7" fill="#92400E">★</text>
    {/* Barcode bottom */}
    {[8,10,12,14,16,18,20].map((x, i) => (
      <rect key={i} x={x} y="34" width={i%3===0?1.5:1} height="4" rx="0.5" fill="#93C5FD" opacity="0.8"/>
    ))}
    {/* Corner fold decoration */}
    <path d="M41 11 L46 11 L46 16" stroke="#BFDBFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IconEvent = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Shadow */}
    <rect x="4" y="8" width="40" height="37" rx="7" fill="rgba(0,0,0,0.16)" transform="translate(0,3)"/>
    {/* Calendar body */}
    <rect x="4" y="8" width="40" height="37" rx="7" fill="white" opacity="0.96"/>
    {/* Header */}
    <rect x="4" y="8" width="40" height="16" rx="7" fill="#EF4444"/>
    <rect x="4" y="17" width="40" height="7" fill="#EF4444"/>
    {/* Ring clips */}
    <rect x="13" y="4" width="6" height="12" rx="3" fill="white" opacity="0.92"/>
    <rect x="29" y="4" width="6" height="12" rx="3" fill="white" opacity="0.92"/>
    {/* Ring clip tops */}
    <rect x="14" y="4" width="4" height="3" rx="2" fill="#E5E7EB"/>
    <rect x="30" y="4" width="4" height="3" rx="2" fill="#E5E7EB"/>
    {/* Month label */}
    <text x="24" y="20" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="white" fontFamily="Arial, sans-serif" letterSpacing="1">APR</text>
    {/* Big date */}
    <text x="24" y="40" textAnchor="middle" fontSize="20" fontWeight="900" fill="#DC2626" fontFamily="Arial, sans-serif">17</text>
    {/* Weekday dots row */}
    {[9.5,16.5,23.5,30.5,37.5].map((x,i)=>(
      <circle key={i} cx={x} cy="30" r="2" fill={i===2?"#EF4444":"#E5E7EB"}/>
    ))}
    {/* Star decoration */}
    <text x="37" y="42" fontSize="9" fill="#FCD34D">★</text>
    {/* Sparkle left */}
    <text x="4" y="42" fontSize="7" fill="rgba(239,68,68,0.4)">✦</text>
  </svg>
);

const IconTransportasi = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Road */}
    <rect x="0" y="40" width="48" height="7" rx="3.5" fill="rgba(0,0,0,0.2)"/>
    {/* Lane markings */}
    {[6,14,22,30,38].map((x,i)=>(
      <rect key={i} x={x} y="43" width="5" height="1.5" rx="0.75" fill="rgba(255,255,255,0.6)"/>
    ))}
    {/* Car shadow */}
    <ellipse cx="24" cy="42" rx="19" ry="3" fill="rgba(0,0,0,0.22)"/>
    {/* Car body — navy blue, pops on yellow bg */}
    <path d="M4 33 L8 20 H40 L44 33 Z" fill="#1E3A8A"/>
    {/* Cabin */}
    <path d="M13 20 L17 8 H31 L35 20 Z" fill="#1D4ED8"/>
    {/* Cabin highlight */}
    <path d="M13 20 L17 8 H20 L17.5 20 Z" fill="rgba(255,255,255,0.15)"/>
    {/* Windshield glass */}
    <path d="M15 19.5 L18.5 9.5 H29.5 L33 19.5 Z" fill="#7DD3FA" opacity="0.85"/>
    {/* Windshield tint stripe */}
    <path d="M15 19.5 L18.5 9.5 H21 L18 19.5 Z" fill="rgba(147,197,253,0.4)"/>
    {/* Yellow checker stripe on navy */}
    {[4,8,12,16,20,24,28,32,36,40].map((x,i)=>(
      <rect key={i} x={x} y={26.5} width={4} height={4} fill={i%2===0?"#FCD34D":"rgba(255,255,255,0.08)"}/>
    ))}
    {/* Door lines */}
    <rect x="10" y="22" width="12" height="9" rx="2" fill="rgba(255,255,255,0.08)"/>
    <rect x="26" y="22" width="12" height="9" rx="2" fill="rgba(255,255,255,0.08)"/>
    {/* Door handles */}
    <rect x="19" y="26" width="2.5" height="1.5" rx="0.75" fill="#FCD34D"/>
    <rect x="35" y="26" width="2.5" height="1.5" rx="0.75" fill="#FCD34D"/>
    {/* Headlights */}
    <rect x="40" y="29" width="6" height="3.5" rx="1.75" fill="#FDE68A"/>
    <rect x="40" y="29" width="3" height="3.5" rx="1.75" fill="#FEF08A"/>
    <rect x="2" y="29" width="6" height="3.5" rx="1.75" fill="#FDE68A"/>
    {/* Wheels */}
    <circle cx="13" cy="37" r="7" fill="#111827"/>
    <circle cx="13" cy="37" r="4.8" fill="#4B5563"/>
    <circle cx="13" cy="37" r="2.8" fill="white"/>
    <circle cx="13" cy="37" r="1.2" fill="#1F2937"/>
    <circle cx="35" cy="37" r="7" fill="#111827"/>
    <circle cx="35" cy="37" r="4.8" fill="#4B5563"/>
    <circle cx="35" cy="37" r="2.8" fill="white"/>
    <circle cx="35" cy="37" r="1.2" fill="#1F2937"/>
  </svg>
);

const IconAdventure = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Bag shadow */}
    <path d="M10 17 C10 10 15 8 24 8 C33 8 38 10 38 17 V45 H10 Z" fill="rgba(0,0,0,0.2)" transform="translate(0,2.5)"/>
    {/* Bag body — tan/brown to contrast green bg */}
    <path d="M10 17 C10 10 15 8 24 8 C33 8 38 10 38 17 V45 H10 Z" fill="#D97706"/>
    {/* Bag body shade */}
    <path d="M28 17 C33 10 38 10 38 17 V45 H28 Z" fill="rgba(0,0,0,0.12)"/>
    {/* Highlight left face */}
    <path d="M10 17 C10 10 15 8 24 8 C20 8 16 10 13 13 L10 20 Z" fill="rgba(255,255,255,0.18)"/>
    {/* Top handle */}
    <path d="M18 8 C18 3 21 2 24 2 C27 2 30 3 30 8" stroke="#FEF3C7" strokeWidth="3.8" strokeLinecap="round" fill="none"/>
    {/* Left shoulder strap */}
    <path d="M10 19 Q5 27 7 42" stroke="#92400E" strokeWidth="5" strokeLinecap="round" fill="none"/>
    {/* Main front pocket */}
    <rect x="13" y="21" width="22" height="15" rx="4.5" fill="rgba(0,0,0,0.15)"/>
    {/* Compass circle */}
    <circle cx="24" cy="28.5" r="6.5" fill="white" opacity="0.96"/>
    <circle cx="24" cy="28.5" r="5" fill="#DBEAFE"/>
    {/* Compass markings */}
    <text x="22.5" y="23.5" fontSize="4.5" fill="#374151" fontWeight="bold">N</text>
    <text x="22.5" y="35.5" fontSize="4.5" fill="#374151">S</text>
    <text x="27.5" y="30" fontSize="4.5" fill="#374151">E</text>
    <text x="18.5" y="30" fontSize="4.5" fill="#374151">W</text>
    {/* Compass needle north (red) */}
    <path d="M24 24 L25.3 27.5 L24 26.5 L22.7 27.5 Z" fill="#EF4444"/>
    {/* Compass needle south (dark) */}
    <path d="M24 33 L25.3 29.5 L24 30.5 L22.7 29.5 Z" fill="#1F2937"/>
    <circle cx="24" cy="28.5" r="1.4" fill="white"/>
    {/* Zipper line */}
    <line x1="16" y1="25" x2="32" y2="25" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="24" cy="25" r="2.2" fill="#FCD34D"/>
    {/* Bottom pocket */}
    <rect x="13" y="37" width="22" height="7" rx="3.5" fill="rgba(0,0,0,0.12)"/>
    {/* Side water bottle */}
    <rect x="35" y="22" width="5" height="14" rx="2.5" fill="rgba(255,255,255,0.5)"/>
    <rect x="35.5" y="20" width="4" height="4" rx="2" fill="rgba(255,255,255,0.7)"/>
    <rect x="36" y="23" width="3" height="9" rx="1" fill="rgba(186,230,253,0.7)"/>
    {/* Shine */}
    <rect x="12" y="20" width="3" height="14" rx="1.5" fill="rgba(255,255,255,0.2)"/>
  </svg>
);

const IconPenginapan = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Night sky */}
    <circle cx="38" cy="8" r="7" fill="rgba(254,249,195,0.3)"/>
    <circle cx="41" cy="6.5" r="5" fill="#818CF8"/>
    {/* Stars */}
    <text x="3" y="11" fontSize="8" fill="rgba(255,255,255,0.85)">✦</text>
    <text x="29" y="7" fontSize="5.5" fill="rgba(255,255,255,0.6)">✦</text>
    <text x="10" y="5" fontSize="4" fill="rgba(255,255,255,0.5)">✦</text>
    {/* Building shadow */}
    <rect x="7" y="15" width="34" height="32" rx="5" fill="rgba(0,0,0,0.16)" transform="translate(0,3)"/>
    {/* Building body */}
    <rect x="7" y="15" width="34" height="32" rx="5" fill="white" opacity="0.94"/>
    {/* Hotel top bar */}
    <rect x="7" y="15" width="34" height="9" rx="5" fill="#6366F1"/>
    <rect x="7" y="19" width="34" height="5" fill="#6366F1"/>
    {/* Hotel sign */}
    <text x="24" y="22.5" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="white" fontFamily="Arial, sans-serif" letterSpacing="0.5">HOTEL</text>
    {/* Row 1 windows */}
    <rect x="11" y="28" width="9" height="8" rx="2.5" fill="#BFDBFE"/>
    <line x1="15.5" y1="28" x2="15.5" y2="36" stroke="white" strokeWidth="1.2"/>
    <line x1="11" y1="32" x2="20" y2="32" stroke="white" strokeWidth="1.2"/>
    <rect x="11" y="28" width="4" height="4" rx="0.5" fill="rgba(254,249,195,0.55)"/>
    <rect x="28" y="28" width="9" height="8" rx="2.5" fill="#BFDBFE"/>
    <line x1="32.5" y1="28" x2="32.5" y2="36" stroke="white" strokeWidth="1.2"/>
    <line x1="28" y1="32" x2="37" y2="32" stroke="white" strokeWidth="1.2"/>
    <rect x="33" y="28" width="4" height="4" rx="0.5" fill="rgba(254,249,195,0.55)"/>
    {/* Row 2 windows (smaller) */}
    <rect x="12" y="38" width="7" height="5" rx="2" fill="#E0E7FF" opacity="0.85"/>
    <rect x="29" y="38" width="7" height="5" rx="2" fill="#E0E7FF" opacity="0.85"/>
    {/* Door */}
    <rect x="18.5" y="38" width="11" height="9" rx="2.5" fill="#4338CA" opacity="0.85"/>
    <circle cx="27.5" cy="42.5" r="1.4" fill="#FCD34D"/>
    {/* Door arch */}
    <path d="M19 39.5 Q24 36 29 39.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none"/>
    {/* Ground */}
    <rect x="0" y="47" width="48" height="1.5" rx="0.75" fill="rgba(0,0,0,0.08)"/>
    {/* Path to door */}
    <rect x="20" y="45" width="8" height="2" rx="1" fill="rgba(203,213,225,0.5)"/>
  </svg>
);

const IconVoucher = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Ticket shadow */}
    <path d="M4 15 C4 12.8 5.8 11 8 11 H40 C42.2 11 44 12.8 44 15 V19 C41.5 19 40 20.8 40 23 C40 25.2 41.5 27 44 27 V31 C44 33.2 42.2 35 40 35 H8 C5.8 35 4 33.2 4 31 V27 C6.5 27 8 25.2 8 23 C8 20.8 6.5 19 4 19 Z" fill="rgba(0,0,0,0.12)" transform="translate(0,2)"/>
    {/* Ticket body */}
    <path d="M4 15 C4 12.8 5.8 11 8 11 H40 C42.2 11 44 12.8 44 15 V19 C41.5 19 40 20.8 40 23 C40 25.2 41.5 27 44 27 V31 C44 33.2 42.2 35 40 35 H8 C5.8 35 4 33.2 4 31 V27 C6.5 27 8 25.2 8 23 C8 20.8 6.5 19 4 19 Z" fill="white"/>
    {/* Perforation line */}
    <line x1="26" y1="13" x2="26" y2="33" stroke="#FDA4AF" strokeWidth="2" strokeDasharray="2.5 2.5" strokeLinecap="round"/>
    {/* Percent badge */}
    <circle cx="16" cy="23" r="6.2" fill="#FEE2E2"/>
    <circle cx="13.5" cy="20.5" r="1.6" fill="#F43F5E"/>
    <circle cx="18.5" cy="25.5" r="1.6" fill="#F43F5E"/>
    <line x1="13" y1="26" x2="19" y2="20" stroke="#F43F5E" strokeWidth="1.6" strokeLinecap="round"/>
    {/* Star sparkle right */}
    <path d="M35 17 L36 19.5 L38.5 20.5 L36 21.5 L35 24 L34 21.5 L31.5 20.5 L34 19.5 Z" fill="#FDA4AF"/>
    {/* Bottom text lines */}
    <rect x="30" y="27" width="9" height="1.6" rx="0.8" fill="#FECDD3"/>
    <rect x="30" y="30" width="6" height="1.6" rx="0.8" fill="#FECDD3"/>
  </svg>
);

const IconKomunitas = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Back person */}
    <circle cx="34" cy="16" r="6" fill="rgba(255,255,255,0.55)"/>
    <path d="M34 24 C27 24 23 28 23 34 V40 H45 V34 C45 28 41 24 34 24 Z" fill="rgba(255,255,255,0.55)"/>
    {/* Left person */}
    <circle cx="13" cy="18" r="6.5" fill="rgba(255,255,255,0.8)"/>
    <path d="M13 26 C6 26 2 31 2 37 V42 H24 V37 C24 31 20 26 13 26 Z" fill="rgba(255,255,255,0.8)"/>
    {/* Front/center person */}
    <circle cx="24" cy="20" r="8" fill="white"/>
    <path d="M24 30 C15 30 10 36 10 43 V46 H38 V43 C38 36 33 30 24 30 Z" fill="white"/>
    {/* Face dots */}
    <circle cx="21" cy="19.5" r="1.1" fill="#0369A1"/>
    <circle cx="27" cy="19.5" r="1.1" fill="#0369A1"/>
    <path d="M21 23.5 Q24 25.5 27 23.5" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    {/* Connecting link dots */}
    <circle cx="8" cy="10" r="1.6" fill="rgba(255,255,255,0.7)"/>
    <circle cx="40" cy="9" r="1.6" fill="rgba(255,255,255,0.6)"/>
    <circle cx="24" cy="4" r="1.6" fill="rgba(255,255,255,0.8)"/>
  </svg>
);

const IconBerita = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Back page shadow */}
    <rect x="8" y="6" width="34" height="38" rx="3" fill="rgba(0,0,0,0.14)" transform="translate(2,2)"/>
    {/* Paper body */}
    <rect x="8" y="6" width="34" height="38" rx="3" fill="white"/>
    {/* Masthead bar */}
    <rect x="12" y="10" width="26" height="6" rx="1.5" fill="#9A3412"/>
    <rect x="14" y="11.6" width="14" height="1.6" rx="0.8" fill="rgba(255,255,255,0.85)"/>
    {/* Photo block */}
    <rect x="12" y="19" width="13" height="12" rx="1.5" fill="#FED7AA"/>
    <path d="M13 29 L17 24 L20 27 L23 22 L24.5 29 Z" fill="#FB923C"/>
    <circle cx="21" cy="22.5" r="1.6" fill="#FDBA74"/>
    {/* Headline lines */}
    <rect x="28" y="19.5" width="10" height="2" rx="1" fill="#D1D5DB"/>
    <rect x="28" y="23.5" width="10" height="2" rx="1" fill="#D1D5DB"/>
    <rect x="28" y="27.5" width="7" height="2" rx="1" fill="#D1D5DB"/>
    {/* Body text lines */}
    <rect x="12" y="34" width="26" height="1.8" rx="0.9" fill="#E5E7EB"/>
    <rect x="12" y="37.5" width="26" height="1.8" rx="0.9" fill="#E5E7EB"/>
    <rect x="12" y="41" width="18" height="1.8" rx="0.9" fill="#E5E7EB"/>
  </svg>
);

const IconInfluencerHub = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Sparkle bursts */}
    <path d="M8 8 L9.5 12 L13.5 13.5 L9.5 15 L8 19 L6.5 15 L2.5 13.5 L6.5 12 Z" fill="rgba(255,255,255,0.8)"/>
    <circle cx="40" cy="10" r="2" fill="rgba(255,255,255,0.7)"/>
    <circle cx="38" cy="17" r="1.2" fill="rgba(255,255,255,0.55)"/>
    {/* Phone body */}
    <rect x="14" y="9" width="20" height="34" rx="4.5" fill="white"/>
    <rect x="16.5" y="13" width="15" height="21" rx="1.5" fill="#F9A8D4"/>
    {/* Play / camera lens */}
    <circle cx="24" cy="23.5" r="6" fill="white" opacity="0.95"/>
    <path d="M22 20.5 L28.5 23.5 L22 26.5 Z" fill="#EC4899"/>
    {/* Heart like */}
    <path d="M29.5 30 C29.5 28.5 31.5 28 32 29.5 C32.5 28 34.5 28.5 34.5 30 C34.5 31.6 32 33.5 32 33.5 C32 33.5 29.5 31.6 29.5 30 Z" fill="#F472B6"/>
    {/* Home button / speaker */}
    <rect x="20" y="10.5" width="8" height="1.6" rx="0.8" fill="rgba(236,72,153,0.4)"/>
    <circle cx="24" cy="39.5" r="2" fill="rgba(236,72,153,0.35)"/>
  </svg>
);

const IconTalent = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Ground shadow */}
    <ellipse cx="24" cy="43" rx="15" ry="3" fill="rgba(0,0,0,0.18)"/>
    {/* Spotlight beam */}
    <path d="M24 6 L34 40 H14 Z" fill="rgba(255,255,255,0.12)"/>
    {/* Mic body — white/gold to contrast purple bg */}
    <rect x="19.5" y="10" width="9" height="16" rx="4.5" fill="#FFFFFF"/>
    <rect x="19.5" y="10" width="4.5" height="16" rx="2.2" fill="#F5F5F5"/>
    {/* Mic grille lines */}
    <line x1="21.5" y1="14" x2="26.5" y2="14" stroke="#6B7280" strokeWidth="1" opacity="0.6"/>
    <line x1="21.5" y1="17" x2="26.5" y2="17" stroke="#6B7280" strokeWidth="1" opacity="0.6"/>
    <line x1="21.5" y1="20" x2="26.5" y2="20" stroke="#6B7280" strokeWidth="1" opacity="0.6"/>
    {/* Mic mesh overlay */}
    <rect x="20.5" y="11" width="7" height="13" rx="3.5" fill="rgba(0,0,0,0.06)"/>
    {/* Mic stand arc — gold/yellow to pop */}
    <path d="M15 24 C15 30 19 34 24 34 C29 34 33 30 33 24" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <line x1="24" y1="34" x2="24" y2="39" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round"/>
    <line x1="18" y1="39" x2="30" y2="39" stroke="#FCD34D" strokeWidth="2.8" strokeLinecap="round"/>
    {/* Star sparkles */}
    <path d="M34 8 L35.4 11.6 L39 13 L35.4 14.4 L34 18 L32.6 14.4 L29 13 L32.6 11.6 Z" fill="#FDE68A"/>
    <path d="M12 14 L12.8 16.1 L15 16.9 L12.8 17.7 L12 19.8 L11.2 17.7 L9 16.9 L11.2 16.1 Z" fill="#FDE68A"/>
    {/* Mic shine */}
    <rect x="21" y="12" width="2" height="8" rx="1" fill="rgba(255,255,255,0.7)"/>
  </svg>
);

const IconKamusSunda = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Book shadow */}
    <path d="M8 8 H24 V42 H8 C6 42 5 41 5 39 V11 C5 9 6 8 8 8 Z" fill="rgba(0,0,0,0.14)" transform="translate(1,2)"/>
    {/* Left page */}
    <path d="M8 8 H24 V42 H8 C6 42 5 41 5 39 V11 C5 9 6 8 8 8 Z" fill="#FDE68A"/>
    {/* Right page */}
    <path d="M40 8 H24 V42 H40 C42 42 43 41 43 39 V11 C43 9 42 8 40 8 Z" fill="white"/>
    {/* Spine */}
    <rect x="22.5" y="7" width="3" height="36" rx="1.2" fill="#92400E"/>
    {/* Left page lines */}
    <rect x="10" y="15" width="10" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)"/>
    <rect x="10" y="19.5" width="10" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)"/>
    <rect x="10" y="24" width="7" height="1.8" rx="0.9" fill="rgba(255,255,255,0.7)"/>
    {/* Right page - Sunda letter accent */}
    <text x="33" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#92400E" fontFamily="Georgia, serif">ᮃ</text>
    <rect x="28" y="31" width="10" height="1.8" rx="0.9" fill="#FEF3C7"/>
    <rect x="28" y="35" width="7" height="1.8" rx="0.9" fill="#FEF3C7"/>
    {/* Bookmark ribbon */}
    <path d="M18 8 V18 L21 15.5 L24 18 V8 Z" fill="#EA580C"/>
  </svg>
);

const IconLayananDigital = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Phone shadow */}
    <rect x="13" y="6" width="22" height="38" rx="5" fill="rgba(0,0,0,0.14)" transform="translate(0,2)"/>
    {/* Phone body */}
    <rect x="13" y="6" width="22" height="38" rx="5" fill="white"/>
    {/* Screen */}
    <rect x="15.5" y="10.5" width="17" height="26" rx="1.8" fill="#155E75"/>
    {/* App grid icons */}
    <rect x="18" y="13.5" width="5" height="5" rx="1.4" fill="#67E8F9"/>
    <rect x="25" y="13.5" width="5" height="5" rx="1.4" fill="#A5F3FC"/>
    <rect x="18" y="20.5" width="5" height="5" rx="1.4" fill="#A5F3FC"/>
    <rect x="25" y="20.5" width="5" height="5" rx="1.4" fill="#67E8F9"/>
    {/* Signal/wifi bars */}
    <rect x="18" y="29" width="2.4" height="4" rx="1" fill="rgba(255,255,255,0.8)"/>
    <rect x="21.3" y="27" width="2.4" height="6" rx="1" fill="rgba(255,255,255,0.8)"/>
    <rect x="24.6" y="25" width="2.4" height="8" rx="1" fill="rgba(255,255,255,0.8)"/>
    <rect x="27.9" y="23" width="2.4" height="10" rx="1" fill="rgba(255,255,255,0.9)"/>
    {/* Home button */}
    <circle cx="24" cy="40.5" r="1.8" fill="rgba(21,94,117,0.35)"/>
    {/* Speaker */}
    <rect x="21" y="8" width="6" height="1.4" rx="0.7" fill="rgba(21,94,117,0.35)"/>
  </svg>
);

const IconDaftarHarga = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Tag shadow */}
    <path d="M6 8 H24 L42 26 C43.5 27.5 43.5 30 42 31.5 L31.5 42 C30 43.5 27.5 43.5 26 42 L8 24 V8 Z" fill="rgba(0,0,0,0.14)" transform="translate(0,2)"/>
    {/* Tag body */}
    <path d="M6 8 H24 L42 26 C43.5 27.5 43.5 30 42 31.5 L31.5 42 C30 43.5 27.5 43.5 26 42 L8 24 V8 Z" fill="white"/>
    {/* Tag hole */}
    <circle cx="14" cy="16" r="3.4" fill="#365314"/>
    <circle cx="14" cy="16" r="1.6" fill="white"/>
    {/* Price text */}
    <text x="27" y="31" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4D7C0F" fontFamily="Arial, sans-serif">Rp</text>
    {/* Sparkle accent */}
    <path d="M37 12 L38 14.5 L40.5 15.5 L38 16.5 L37 19 L36 16.5 L33.5 15.5 L36 14.5 Z" fill="#D9F99D"/>
  </svg>
);

const IconMerchandise = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Shirt shadow */}
    <path d="M17 6 L8 12 L11 20 L15 18 V42 H33 V18 L37 20 L40 12 L31 6 C31 9 28 11 24 11 C20 11 17 9 17 6 Z" fill="rgba(0,0,0,0.14)" transform="translate(0,2)"/>
    {/* Shirt body */}
    <path d="M17 6 L8 12 L11 20 L15 18 V42 H33 V18 L37 20 L40 12 L31 6 C31 9 28 11 24 11 C20 11 17 9 17 6 Z" fill="white"/>
    {/* Collar */}
    <path d="M20 7 C21 9.5 22.3 11 24 11 C25.7 11 27 9.5 28 7 L24 10.5 Z" fill="#E5E7EB"/>
    {/* Left sleeve shade */}
    <path d="M17 6 L8 12 L11 20 L15 18 V13 Z" fill="#F3F4F6"/>
    {/* Right sleeve shade */}
    <path d="M31 6 L40 12 L37 20 L33 18 V13 Z" fill="#F9FAFB"/>
    {/* Logo circle on chest */}
    <circle cx="24" cy="26" r="7" fill="#0194f3"/>
    <circle cx="24" cy="26" r="4.6" fill="#7DD3FC"/>
    <text x="24" y="29" textAnchor="middle" fontSize="7" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">N</text>
    {/* Bottom hem shading */}
    <rect x="15" y="38" width="18" height="4" rx="1" fill="rgba(0,0,0,0.06)"/>
    {/* Sparkle accent */}
    <path d="M40 26 L41 28.5 L43.5 29.5 L41 30.5 L40 33 L39 30.5 L36.5 29.5 L39 28.5 Z" fill="#FDE68A"/>
  </svg>
);

const IconSponsorship = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
    {/* Bold handshake silhouette — kept large for the compact category card */}
    <path
      d="M3 18 L12 8 H20 L24 12 L28 8 H36 L45 18 L39 28 L33 24 L28 30 L24 27 L20 30 L15 24 L9 28 Z"
      fill="rgba(0,0,0,0.18)"
      transform="translate(0,2)"
    />
    {/* Left and right sleeves */}
    <path d="M3 17 L12 7 H20 L24 13 L17 21 L12 18 L8 25 Z" fill="#DBEAFE" stroke="#1E3A8A" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M45 17 L36 7 H28 L24 13 L31 21 L36 18 L40 25 Z" fill="#93C5FD" stroke="#1E3A8A" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Interlocked hands */}
    <path d="M15 16 L20 11 L25 16 L29 12 L35 18 L28 26 L24 29 L19 24 L14 27 L9 21 Z" fill="white" stroke="#1E3A8A" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M24 16 L29 12 L35 18 L28 26 L24 29 L20 25 L24 21 L28 18 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Cuffs */}
    <path d="M8 17 L13 21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 17 L35 21" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
    {/* Partnership accent */}
    <circle cx="24" cy="24" r="3" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
    <path d="M24 22.5 V25.5 M22.5 24 H25.5" stroke="#B45309" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const IconCafe = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Cup shadow */}
    <ellipse cx="20" cy="44" rx="11" ry="2.5" fill="rgba(0,0,0,0.2)"/>
    {/* Saucer */}
    <ellipse cx="20" cy="40" rx="13" ry="3" fill="#FDE8C8"/>
    <ellipse cx="20" cy="40" rx="10" ry="2" fill="#FBBF88"/>
    {/* Cup body — cream/white */}
    <path d="M10 22 L12 40 Q20 42 28 40 L30 22 Z" fill="#FFF8F0"/>
    {/* Cup shading */}
    <path d="M24 22 L26 40 Q28 41 28 40 L30 22 Z" fill="rgba(0,0,0,0.07)"/>
    {/* Cup top rim */}
    <ellipse cx="20" cy="22" rx="10" ry="2.5" fill="#FFE8CC"/>
    {/* Coffee surface — rich brown */}
    <ellipse cx="20" cy="22" rx="8" ry="2" fill="#6F3A1F"/>
    {/* Coffee foam swirl */}
    <ellipse cx="20" cy="22" rx="5" ry="1.2" fill="#A0522D" opacity="0.7"/>
    <ellipse cx="20" cy="22" rx="2.5" ry="0.6" fill="#D2906A" opacity="0.8"/>
    {/* Steam 1 */}
    <path d="M16 17 Q14 13 16 9" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Steam 2 */}
    <path d="M20 15 Q18 11 20 7" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Steam 3 */}
    <path d="M24 17 Q22 13 24 9" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* Handle — warm cream */}
    <path d="M30 26 Q39 26 39 31 Q39 36 30 36" stroke="#FFE8CC" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M30 26 Q37 26 37 31 Q37 36 30 36" stroke="#FBBF88" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Shine on cup */}
    <ellipse cx="14" cy="29" rx="1.5" ry="4" fill="rgba(255,255,255,0.45)" transform="rotate(-15 14 29)"/>
  </svg>
);

const IconSentraOlehOleh = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Box shadow */}
    <rect x="6" y="20" width="36" height="24" rx="3" fill="rgba(0,0,0,0.2)" transform="translate(0,2.5)"/>
    {/* Box body — white so it stands out from orange bg */}
    <rect x="6" y="20" width="36" height="24" rx="3" fill="#FFFFFF"/>
    {/* Box body shading */}
    <rect x="6" y="30" width="36" height="14" rx="3" fill="#FFF0E8"/>
    {/* Box lid — cream */}
    <rect x="4" y="14" width="40" height="9" rx="2.5" fill="#FFF8F0"/>
    {/* Ribbon vertical */}
    <rect x="20.5" y="14" width="7" height="30" fill="#DC2626"/>
    {/* Ribbon horizontal */}
    <rect x="4" y="17.5" width="40" height="6" fill="#DC2626"/>
    {/* Ribbon shine */}
    <rect x="22" y="14" width="2" height="30" fill="rgba(255,255,255,0.35)"/>
    {/* Bow left */}
    <path d="M24 15 C24 15 14 8 10 12 C6 16 14 19 24 15 Z" fill="#EF4444"/>
    {/* Bow right */}
    <path d="M24 15 C24 15 34 8 38 12 C42 16 34 19 24 15 Z" fill="#DC2626"/>
    {/* Bow knot */}
    <circle cx="24" cy="15" r="3.2" fill="#B91C1C"/>
    {/* Sparkles */}
    <path d="M9 26 L9.8 28.1 L12 28.9 L9.8 29.7 L9 31.8 L8.2 29.7 L6 28.9 L8.2 28.1 Z" fill="rgba(255,150,0,0.9)"/>
    <circle cx="37" cy="34" r="1.6" fill="rgba(255,150,0,0.8)"/>
    {/* Box shine */}
    <rect x="10" y="23" width="4" height="12" rx="2" fill="rgba(255,255,255,0.6)"/>
  </svg>
);

const IconCeritaRakyat = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    <path d="M9 9.5C13.4 7.2 18.8 7.4 24 10.2V41c-5.2-2.8-10.6-3-15-.7V9.5Z" fill="#FFF7ED" />
    <path d="M39 9.5C34.6 7.2 29.2 7.4 24 10.2V41c5.2-2.8 10.6-3 15-.7V9.5Z" fill="#FEF3C7" />
    <path d="M24 10.2V41" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 15.5c2.7-.8 5.2-.4 7.6.9M13 20.5c2.7-.8 5.2-.4 7.6.9M35 15.5c-2.7-.8-5.2-.4-7.6.9M35 20.5c-2.7-.8-5.2-.4-7.6.9" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 41.2c5.1-2.4 10.5-2.1 16 .7 5.5-2.8 10.9-3.1 16-.7" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 9.5c4.9-2.6 10.4-2.3 16 .7 5.6-3 11.1-3.3 16-.7" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ── Quick 4-icon links (top of home) ───────────────────────────── */
const quickLinks3D: { name: string; path: string; bg: string; shadow: string; Icon: React.ComponentType }[] = [
  { name: "Destinasi",  path: "/wisata",     bg: "#304489", shadow: "#1a2d6b", Icon: IconWisata    },
  { name: "Kuliner",    path: "/kuliner",    bg: "#B91C1C", shadow: "#7f1d1d", Icon: IconKuliner   },
  { name: "Penginapan", path: "/penginapan", bg: "#0F766E", shadow: "#134e4a", Icon: IconPenginapan},
  { name: "Event",      path: "/event",      bg: "#6D28D9", shadow: "#4c1d95", Icon: IconEvent     },
];

export function QuickLinkGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {quickLinks3D.map((q) => (
        <Link key={q.name} href={q.path} className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div
            className="w-12 h-12 rounded-2xl relative flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            style={{
              background: `linear-gradient(160deg, color-mix(in srgb, ${q.bg} 94%, white) 0%, ${q.bg} 50%, color-mix(in srgb, ${q.bg} 76%, black) 100%)`,
              boxShadow: `0 5px 0 ${q.shadow}, 0 8px 18px ${q.shadow}80`,
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.20) 0%, transparent 60%)" }} />
            <q.Icon />
          </div>
          <span className="text-[11px] text-gray-600 font-semibold text-center leading-tight">{q.name}</span>
        </Link>
      ))}
    </div>
  );
}

export function StatsRow({ destinasi, penginapan, event }: { destinasi: number; penginapan: number; event: number }) {
  const stats = [
    { label: "Destinasi",  value: destinasi, emoji: "🗺️", color: "#2563EB" },
    { label: "Penginapan", value: penginapan, emoji: "🏨", color: "#0F766E" },
    { label: "Event",      value: event,      emoji: "🎟️", color: "#6D28D9" },
    { label: "Pengunjung", value: "50K+",     emoji: "👥", color: "#10B981" },
  ];

  return (
    <div className="flex items-stretch divide-x divide-gray-100">
      {stats.map((s) => (
        <div key={s.label} className="flex-1 flex flex-col items-center gap-0.5 py-1 px-1">
          <span className="text-lg leading-none">{s.emoji}</span>
          <span className="font-extrabold text-gray-800 text-lg leading-tight" style={{ color: s.color }}>{s.value}</span>
          <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryGrid() {
  const serviceTrackRef = React.useRef<HTMLDivElement>(null);
  const [servicePage, setServicePage] = React.useState(0);
  const servicePages: (typeof mainNavItems)[number][][] = [];
  for (let i = 0; i < mainNavItems.length; i += 8) servicePages.push(mainNavItems.slice(i, i + 8));
  return (
    <>
      <style>{`
        .nempo-service__tile { transition: transform 180ms ease, box-shadow 180ms ease; }
        .nempo-service:hover .nempo-service__tile,
        .nempo-service:focus-visible .nempo-service__tile {
          transform: translateY(-3px);
          box-shadow: 0 6px 0 rgba(55,45,87,.23), 0 11px 17px -10px rgba(38,39,68,.38), inset 0 1px 0 rgba(255,255,255,.58) !important;
        }
        /* cahaya berjalan mengelilingi bentuk menu */
        @keyframes nempo-ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes nempo-ring-glow { 0%,100% { opacity: .3; } 50% { opacity: .75; } }
        @keyframes nempo-tile-shine { 0%, 72% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
        .nempo-service__ring {
          position: absolute; inset: -4px -4px -6px; border-radius: 21px; overflow: hidden; pointer-events: none;
          filter: drop-shadow(0 0 5px var(--ring-color)) saturate(1.2);
        }
        .nempo-service__ring::before {
          content: ""; position: absolute; left: 50%; top: 50%; width: 180%; height: 180%;
          background: conic-gradient(from 0deg, transparent 0deg 190deg, var(--ring-tail) 250deg, var(--ring-color) 320deg, #fff 352deg, transparent 360deg);
          animation: nempo-ring-spin 2.6s linear infinite; animation-delay: var(--ring-delay);
          transform: translate(-50%, -50%);
        }
        .nempo-service__glow {
          position: absolute; inset: -9px; border-radius: 26px; pointer-events: none;
          background: radial-gradient(circle, var(--ring-color) 0%, transparent 70%);
          filter: blur(8px); animation: nempo-ring-glow 3.2s ease-in-out infinite; animation-delay: var(--ring-delay);
        }
        .nempo-service__shine {
          position: absolute; inset: 0; width: 45%; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          animation: nempo-tile-shine 4.8s ease-in-out infinite; animation-delay: var(--ring-delay);
        }
        .nempo-service:hover .nempo-service__ring::before { animation-duration: 1.4s; }
        @media (prefers-reduced-motion: reduce) {
          .nempo-service__tile { transition: none; }
          .nempo-service__ring::before, .nempo-service__glow, .nempo-service__shine { animation: none; }
          .nempo-service__shine { display: none; }
        }
      `}</style>
      <div
        ref={serviceTrackRef}
        onScroll={(e) => { const el = e.currentTarget; setServicePage(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))); }}
        className="mx-auto flex w-full max-w-4xl snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicePages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="grid w-full shrink-0 snap-start grid-cols-4 content-start gap-x-2 gap-y-5 py-2 sm:gap-x-5 sm:gap-y-7">
        {pageItems.map((item, itemIndex) => {
          const index = pageIndex * 8 + itemIndex;
          const [firstWord, ...remainingWords] = item.label.split(" ");
          return (
            <Link
              key={item.id}
              href={item.href}
              data-testid={`category-${item.id}`}
              aria-label={item.label}
              className="nempo-service group flex min-w-0 flex-col items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[5px] focus-visible:outline-[#243D70]"
            >
              <span
                className="relative inline-flex"
                style={{ "--ring-color": item.color, "--ring-tail": `color-mix(in srgb, ${item.color} 35%, transparent)`, "--ring-delay": `${-index * 0.4}s` } as React.CSSProperties}
              >
                <span aria-hidden="true" className="nempo-service__glow" />
                <span aria-hidden="true" className="nempo-service__ring" />
              <span
                className="nempo-service__tile relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[17px] sm:h-[62px] sm:w-[62px]"
                style={{
                  background: `linear-gradient(148deg, color-mix(in srgb, ${item.color} 55%, white) 0%, ${item.color} 58%, color-mix(in srgb, ${item.color} 72%, black) 100%)`,
                  boxShadow: `0 4px 0 color-mix(in srgb, ${item.color} 82%, black), 0 8px 13px -9px ${item.color}88, inset 0 1px 0 rgba(255,255,255,.54)`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_27%_17%,rgba(255,255,255,.42),transparent_56%)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[1px] rounded-[16px] border border-white/20"
                />
                <span aria-hidden="true" className="nempo-service__shine" />
                <HomeServiceIcon className="relative z-10 h-[46px] w-[46px] drop-shadow-[0_1px_0_rgba(255,255,255,.2)] sm:h-[49px] sm:w-[49px]" id={item.id} />
              </span>
              </span>
              <span className="w-full text-center text-[9px] font-bold leading-[1.15] tracking-[-.015em] text-[#383A4A] sm:text-[11px]">
                <span className="block sm:inline">{firstWord}</span>{" "}
                <span className="block sm:inline">{remainingWords.join(" ")}</span>
              </span>
            </Link>
          );
        })}
        </div>
        ))}
      </div>
      {servicePages.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {servicePages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Halaman layanan ${i + 1}`}
              onClick={() => serviceTrackRef.current?.scrollTo({ left: i * serviceTrackRef.current.clientWidth, behavior: "smooth" })}
              className={`h-1.5 rounded-full transition-all ${servicePage === i ? "w-5 bg-[#243D70]" : "w-1.5 bg-[#243D70]/25"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
