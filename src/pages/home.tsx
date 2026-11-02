import React, { useEffect, useState, useRef } from "react";
import { SEO } from "@/components/seo";
import musicomedyPoster from "@/assets/musicomedy-night-poster.webp.asset.json";
import { Layout } from "@/components/layout";
import { PlacePhoto } from "@/components/place-photo";
import { Search, MapPin, MapPinned, Route, TrainFront, ChevronRight, ArrowRight, Flame, ThumbsUp, Info, Map, CalendarDays, Users, Building2, Ticket, Leaf, Award, Gift, TreePine, Heart, Mountain, Compass, Droplets, Wind, Eye, Thermometer, Newspaper, Clock, Radio, UtensilsCrossed, UserPlus, Star, Shield, Crown, Coffee, Music, Tv, Mic, BookOpen, Instagram } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useLocation } from "@/lib/wouter";
import { CategoryGrid } from "@/components/icons3d";
import { TrainArrivalPlayer } from "@/components/train-arrival-player";
import { ALL_CITIES, useCityFilter, type CityName } from "@/contexts/city-filter-context";
import { HOME_SERVICE_BANNERS } from "@/data/home-service-banners";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import { NempoFactsSection } from "@/components/nempo-facts-section";
import { NempoHomeCtaBanner } from "@/components/nempo-home-cta-banner";
import { NempoPartnershipCarousel } from "@/components/nempo-partnership-carousel";
import { NempoCreatorTeamCard } from "@/components/nempo-creator-team-card";
import adventureHeroImage from "@/assets/5c92c12744ccc725fce2d971df3dd4b4_1789407665394.jpg";
import stayHeroImage from "@/assets/4a995825d019114708a042b06256a9f9_1789407625253.jpg";
import eventHeroImage from "@/assets/6999fa21d5935dd58a0c1c2e375212a1_1789407991954.jpg";
import natureHeroImage from "@/assets/e51616056f69ad317e6c3a4e960c52f4_1789408035923.jpg";
import culinaryHeroImage from "@/assets/c225d4fb4ba1595ae8e06fe3c5abeb05_1789408460390.jpg";
import venueHeroImage from "@/assets/36b2a2caf7f2749ca53bb3190322259d_1789408390264.jpg";
import collaborationHeroImage from "@/assets/076ae51bf23030e0b8cfb7975b94609a_1789408708055.jpg";
import kalaMudaHeroImage from "@/assets/94d218d05080a6554bc7214283cb8a88_1789408730013.jpg";
import digiNempoHeroImage from "@/assets/d8bb582f2f075b716c1d0d1dc01bb672_1789408801865.jpg";
import digitalGrowthBannerImage from "@/assets/nempo-team-banner.jpg";
import ggsBeautyOpeningImage from "@/assets/event-ggs-beauty-opening.jpg";
import riuhRonaPosterImage from "@/assets/event-riuh-rona-poster.jpg";
import secangkirKopiPosterImage from "@/assets/event-secangkir-kopi-poster.jpg";
import universityCoffeeNightPosterImage from "@/assets/event-university-coffee-night-poster.jpg";
import lalanaPagiPosterImage from "@/assets/event-lalana-pagi-poster.jpg";
import ngahijiBoboranSiamPosterImage from "@/assets/event-ngahiji-boboran-siam-poster.jpg";
import temuTarungPosterImage from "@/assets/event-temu-tarung-poster.jpg";
import nightOutMaxiPosterImage from "@/assets/event-night-out-maxi-poster.jpg";
import colorTheBeatPosterImage from "@/assets/event-color-the-beat-poster.jpg";
import cafePartnershipBannerImage from "@/assets/generated_images/cafe-partnership-banner.jpg";

type HeroBanner = {
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


function voucherColors(type: string): { from: string; to: string; shadow: string } {
  const map: Record<string, { from: string; to: string; shadow: string }> = {
    new_user:     { from: "#0194f3", to: "#0172B1", shadow: "#003d8f" },
    point_reward: { from: "#D97706", to: "#B45309", shadow: "#78350f" },
    wisata:       { from: "#3B82F6", to: "#1D4ED8", shadow: "#1e3a8a" },
    kuliner:      { from: "#F97316", to: "#E11D48", shadow: "#881337" },
    tiket_wisata: { from: "#8B5CF6", to: "#7C3AED", shadow: "#4c1d95" },
    hotel:        { from: "#14B8A6", to: "#0194f3", shadow: "#134e4a" },
    adventure:    { from: "#0194f3", to: "#D97706", shadow: "#78350f" },
    sewa:         { from: "#6366F1", to: "#4338CA", shadow: "#1e1b4b" },
  };
  return map[type] ?? { from: "#0194f3", to: "#0172B1", shadow: "#003d8f" };
}

const HOME_PROMO_CARDS = [
  {
    id: "promo-wedding-organizer",
    colorType: "new_user",
    badge: "PROMO WEDDING",
    kind: "bonus",
    amount: "BONUS",
    amountLabel: "WEDDING",
    title: "Wedding Organizer",
    description: "Bonus undangan digital + WCC (Wedding Content Creator).",
    ctaLabel: "Tanya Promo",
  },
  {
    id: "promo-first-service",
    colorType: "point_reward",
    badge: "PROMO NEMPO",
    kind: "discount",
    amount: "50",
    amountLabel: "DISKON",
    title: "Layanan Pertama",
    description: "Berlaku untuk semua layanan Nempo Organizer.",
    ctaLabel: "Tanya Promo",
  },
] as const;

function getGoogleRating(item: Record<string, any>) {
  const rating = Number(item.rating);
  return Number.isFinite(rating) && rating > 0 ? rating : null;
}

type HeroCopy = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  place: string;
};

type DigitalServiceHero = {
  kind: "digital-service";
  title: string;
  description: string;
  label: string;
  link: string;
  image: string;
};

type KalaMudaHero = {
  kind: "kala-muda";
  title: string;
  description: string;
  label: string;
  link: string;
  image: string;
};

type HeroSlide = HeroBanner | DigitalServiceHero | KalaMudaHero;

const digitalServiceSlides: DigitalServiceHero[] = [
  {
    kind: "digital-service",
    title: "Digi Nempo",
    description: "Rapikan operasional, layani pelanggan lebih cepat, dan kembangkan bisnis dengan solusi digital yang saling terhubung.",
    label: "SOLUSI DIGITAL UNTUK BISNIS",
    link: "/digital-services",
    image: digiNempoHeroImage,
  },
];

const kalaMudaSlide: KalaMudaHero = {
  kind: "kala-muda",
  title: "Temui ruangmu di Kala Muda",
  description: "Komunitas anak muda Garut untuk berkarya, berbagi cerita, dan tumbuh bersama.",
  label: "KOMUNITAS ANAK MUDA GARUT",
  link: "/komunitas",
  image: kalaMudaHeroImage,
};

function getHeroCopy(slide: HeroBanner): HeroCopy {
  const title = (slide.title || "").toLowerCase();
  const fallback: HeroCopy = {
    eyebrow: "Cerita pilihan Nempo",
    title: slide.title || "Temukan cerita baru di Jawa Barat",
    description: slide.description || "Temukan inspirasi baru di Jawa Barat.",
    cta: slide.btn_text || "Lihat selengkapnya",
    place: slide.category || slide.subtitle || "Layanan Nempo Organizer",
  };

  if (title.includes("wisata")) {
    return {
      eyebrow: "Jelajah alam",
      title: "Jelajah alam Jawa Barat",
      description: "Gunung, air terjun, dan udara segar.",
      cta: "Jelajahi wisata",
      place: "Destinasi Jawa Barat",
    };
  }
  if (title.includes("kuliner")) {
    return {
      eyebrow: "Rasa lokal",
      title: "Nikmati rasa Sunda",
      description: "Sajian lokal yang selalu ingin dicoba.",
      cta: "Cari kuliner",
      place: "Kuliner Jawa Barat",
    };
  }
  if (title.includes("bikin event") || title.includes("venue")) {
    return {
      eyebrow: "Venue pilihanmu",
      title: "Bikin event beda",
      description: "Pilih cafe atau tempat wisata untuk momen spesial.",
      cta: "Cari venue",
      place: "Cafe & wisata Jawa Barat",
    };
  }
  if (title.includes("kolaborasi")) {
    return {
      eyebrow: "Kolaborasi bareng Nempo Organizer",
      title: "Kenalkan tempatmu",
      description: "Naikkan insight dan awareness bersama.",
      cta: "Ajak kolaborasi",
      place: "Cafe & wisata Jawa Barat",
    };
  }
  if (title.includes("event")) {
    return {
      eyebrow: "Agenda akhir pekan",
      title: "Temukan event pilihan",
      description: "Seni, tradisi, dan perayaan yang hidup.",
      cta: "Lihat event",
      place: "Event pilihan",
    };
  }
  if (title.includes("penginapan")) {
    return {
      eyebrow: "Tempat singgah",
      title: "Tempat singgah nyaman",
      description: "Tempat singgah nyaman setelah seharian berjalan.",
      cta: "Cari penginapan",
      place: "Penginapan pilihan",
    };
  }
  if (title.includes("petualangan") || title.includes("adventure")) {
    return {
      eyebrow: "Siap berangkat",
      title: "Mulai petualanganmu",
      description: "Gear pilihan untuk jelajah alam terbuka.",
      cta: "Lihat perlengkapan",
      place: "Adventure Jawa Barat",
    };
  }

  return fallback;
}

const westJavaFacts = [
  { icon: "🏔️", title: "Pesona Pegunungan", desc: "Jawa Barat punya bentang pegunungan, kebun teh, dan udara sejuk untuk berbagai petualangan." },
  { icon: "🌊", title: "Ragam Pantai & Alam", desc: "Dari pesisir selatan hingga hutan dan air terjun, Jawa Barat menyimpan banyak lanskap untuk dijelajahi." },
  { icon: "🍜", title: "Kuliner Khas Sunda", desc: "Nasi timbel, karedok, lotek, peuyeum, dan banyak rasa khas Sunda hadir di berbagai kota Jawa Barat." },
  { icon: "🎭", title: "Kota Kreatif & Budaya", desc: "Bandung, Cirebon, Bogor, dan kota lainnya punya seni, tradisi, serta ruang kreatif yang beragam." },
];

const homeMoodConfigs = [
  {
    key: "alam",
    title: "Alam & udara sejuk",
    description: "Gunung, kebun teh, air terjun, dan lanskap terbuka Jawa Barat.",
    label: "JELAJAH ALAM",
    source: "wisata",
    href: "/wisata",
    accent: "#0f766e",
    fallbackImage: `${import.meta.env.BASE_URL}images/hero/papandayan.webp`,
  },
  {
    key: "kuliner",
    title: "Kulineran",
    description: "Rasa lokal dari kota-kota Jawa Barat yang layak dicoba.",
    label: "RASA LOKAL",
    source: "kuliner",
    href: "/kuliner",
    accent: "#c2410c",
    fallbackImage: `${import.meta.env.BASE_URL}images/hero/sate-maranggi.webp`,
  },
  {
    key: "santai",
    title: "Santai & nongkrong",
    description: "Cafe dan ruang nyaman untuk menikmati waktu dengan ritme sendiri.",
    label: "WAKTU SANTAI",
    source: "cafe",
    href: "/cafe",
    accent: "#1d4ed8",
    fallbackImage: `${import.meta.env.BASE_URL}images/hero/sampireun.webp`,
  },
  {
    key: "petualangan",
    title: "Petualangan",
    description: "Aktivitas seru untuk bergerak lebih aktif dan mencoba hal baru.",
    label: "SIAP BERANGKAT",
    source: "wisata",
    href: "/wisata",
    accent: "#7c3aed",
    fallbackImage: `${import.meta.env.BASE_URL}images/hero/gunung-guntur.webp`,
  },
];

// ── Weather helpers ──────────────────────────────────────────────────────────
/** Lottie weather icon mapped from WMO weather code */
function WxIcon({ code, size = 64 }: { code: number; size?: number }) {
  const BASE = import.meta.env.BASE_URL;
  let src = `${BASE}animations/wx-sunny.json`;
  if (code === 0)        src = `${BASE}animations/wx-sunny.json`;
  else if (code <= 2)    src = `${BASE}animations/wx-beach.json`;
  else if (code <= 48)   src = `${BASE}animations/wx-cloudy.json`;
  else if (code <= 77)   src = `${BASE}animations/wx-rain.json`;
  else if (code <= 82)   src = `${BASE}animations/wx-rain.json`;
  else if (code <= 86)   src = `${BASE}animations/wx-windy.json`;
  else                   src = `${BASE}animations/wx-storm.json`;
  return (
    <DotLottieReact
      src={src}
      loop autoplay
      style={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}

function wmoLabel(code: number) {
  if (code === 0) return "Cerah";
  if (code === 1) return "Cerah Berawan";
  if (code === 2) return "Berawan";
  if (code === 3) return "Mendung";
  if (code <= 48) return "Berkabut";
  if (code <= 55) return "Gerimis";
  if (code <= 65) return "Hujan";
  if (code <= 82) return "Hujan";
  if (code <= 99) return "Badai Petir";
  return "Berawan";
}
const HARI = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

const WEATHER_COORDINATES: Record<CityName, { latitude: number; longitude: number }> = {
  [ALL_CITIES]:  { latitude: -6.9175, longitude: 107.6191 },
  Banjar:        { latitude: -7.3700, longitude: 108.5340 },
  Bandung:       { latitude: -6.9175, longitude: 107.6191 },
  "Bandung Barat": { latitude: -6.8400, longitude: 107.4800 },
  Bekasi:        { latitude: -6.2383, longitude: 106.9756 },
  Bogor:         { latitude: -6.5950, longitude: 106.8167 },
  Cianjur:       { latitude: -6.8200, longitude: 107.1400 },
  Cimahi:        { latitude: -6.8722, longitude: 107.5425 },
  Cirebon:       { latitude: -6.7320, longitude: 108.5523 },
  Depok:         { latitude: -6.4025, longitude: 106.7942 },
  Garut:         { latitude: -7.2178, longitude: 107.9078 },
  Indramayu:     { latitude: -6.3274, longitude: 108.3247 },
  Karawang:      { latitude: -6.3050, longitude: 107.3000 },
  Kuningan:      { latitude: -6.9833, longitude: 108.4833 },
  Majalengka:    { latitude: -6.8367, longitude: 108.2278 },
  Pangandaran:   { latitude: -7.6900, longitude: 108.6500 },
  Purwakarta:    { latitude: -6.5569, longitude: 107.4433 },
  Subang:        { latitude: -6.5717, longitude: 107.7589 },
  Sukabumi:      { latitude: -6.9214, longitude: 106.9267 },
  Sumedang:      { latitude: -6.8586, longitude: 107.9231 },
  Tasikmalaya:   { latitude: -7.3274, longitude: 108.2207 },
};

function nearestWeatherCity(latitude: number, longitude: number): CityName {
  let nearest: CityName = "Garut";
  let shortestDistance = Number.POSITIVE_INFINITY;

  for (const city of Object.keys(WEATHER_COORDINATES) as CityName[]) {
    if (city === ALL_CITIES) continue;
    const coordinate = WEATHER_COORDINATES[city];
    const latitudeDistance = coordinate.latitude - latitude;
    const longitudeDistance = coordinate.longitude - longitude;
    const distance = latitudeDistance * latitudeDistance + longitudeDistance * longitudeDistance;
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}

/* ── Animated weather icons ──────────────────────────────────────────────── */
function WeatherWidget() {
  const { selectedCity } = useCityFilter();
  const [wx, setWx] = useState<{
    temp: number; code: number;
    updatedAt: string;
    daily: { day: string; code: number; hi: number; precip: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState<{
    city: CityName;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"detecting" | "detected" | "fallback" | "manual">("detecting");
  const weatherLocation = selectedCity !== ALL_CITIES
    ? selectedCity
    : detectedLocation?.city ?? (locationStatus === "detecting" ? "Mendeteksi lokasi..." : "Jawa Barat");

  useEffect(() => {
    if (selectedCity !== ALL_CITIES) {
      setDetectedLocation(null);
      setLocationStatus("manual");
      return;
    }

    if (!navigator.geolocation) {
      setDetectedLocation(null);
      setLocationStatus("fallback");
      return;
    }

    setLocationStatus("detecting");
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setDetectedLocation({
        city: nearestWeatherCity(latitude, longitude),
        latitude,
        longitude,
      });
      setLocationStatus("detected");
    };
    const handleError = () => {
      setDetectedLocation(null);
      setLocationStatus("fallback");
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      maximumAge: 15 * 60 * 1000,
      timeout: 8000,
    });
  }, [selectedCity]);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const coordinates = selectedCity === ALL_CITIES && detectedLocation
      ? detectedLocation
      : WEATHER_COORDINATES[selectedCity];
    setLoading(true);
    setWx(null);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}` +
      "&current_weather=true" +
      "&daily=weathercode,temperature_2m_max,precipitation_probability_max" +
      "&timezone=Asia%2FJakarta&forecast_days=3",
      { signal: ctrl.signal }
    )
      .then(r => {
        if (!r.ok) throw new Error(`Weather request failed: ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (!d?.daily?.time?.length || !d?.current_weather) {
          throw new Error("Weather response is incomplete");
        }
        const daily = d.daily.time.map((t: string, i: number) => {
          const dt = new Date(t + "T00:00:00");
          return {
            day: i === 0 ? "Hari ini" : HARI[dt.getDay()],
            code: d.daily.weathercode[i],
            hi: Math.round(d.daily.temperature_2m_max[i]),
            precip: d.daily.precipitation_probability_max[i] ?? 0,
          };
        });
        setWx({
          temp: Math.round(d.current_weather.temperature),
          code: d.current_weather.weathercode,
          updatedAt: d.current_weather.time,
          daily,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .finally(() => clearTimeout(timer));
    return () => { ctrl.abort(); clearTimeout(timer); };
  }, [selectedCity, detectedLocation]);

  const todayCode = wx?.code ?? 0;
  const todayPrecip = wx?.daily[0]?.precip ?? 0;
  const isGo  = todayCode <= 3  && todayPrecip < 45;
  const isMeh = !isGo && (todayCode <= 57 || todayPrecip < 70);
  const weatherTime = wx?.updatedAt
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(new Date(`${wx.updatedAt}:00+07:00`)).replace(/\./g, ":")
    : "Memuat waktu";

  const reco = isGo ? {
    label: "Yuk Jalan!",
    sub: "Cuaca cerah — hari terbaik buat wisata",
    bg: "linear-gradient(150deg, #0194f3 0%, #0077E6 50%, #0EA5E9 100%)",
    overlay: "radial-gradient(ellipse at 88% 15%, rgba(255,255,255,.18) 0%, transparent 55%)",
    dot: "#7dd3fc",
    pill: "rgba(255,255,255,0.15)",
    dayBg: ["rgba(255,255,255,0.22)","rgba(255,255,255,0.10)","rgba(255,255,255,0.10)"],
  } : isMeh ? {
    label: "Lumayan",
    sub: "Bawa jas hujan, cuaca kurang menentu",
    bg: "linear-gradient(150deg, #0194f3 0%, #0055B3 50%, #003D8F 100%)",
    overlay: "radial-gradient(ellipse at 85% 10%, rgba(255,255,255,.14) 0%, transparent 55%)",
    dot: "#93c5fd",
    pill: "rgba(255,255,255,0.14)",
    dayBg: ["rgba(255,255,255,0.20)","rgba(255,255,255,0.09)","rgba(255,255,255,0.09)"],
  } : {
    label: "Tunda Dulu",
    sub: "Cuaca buruk — rencanakan ulang",
    bg: "linear-gradient(150deg, #001553 0%, #002B99 50%, #0194f3 100%)",
    overlay: "radial-gradient(ellipse at 75% 10%, rgba(255,255,255,.10) 0%, transparent 55%)",
    dot: "#60a5fa",
    pill: "rgba(255,255,255,0.12)",
    dayBg: ["rgba(255,255,255,0.18)","rgba(255,255,255,0.08)","rgba(255,255,255,0.08)"],
  };

  /* Compact travel card: use the wide row for practical departure information. */
  return (
    <div className="overflow-hidden rounded-2xl relative flex items-center gap-2 px-3 py-3 sm:gap-3"
      style={{ background: reco.bg }}>
      {/* Subtle overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: reco.overlay }} />

      {/* Weather icon */}
      <div className="shrink-0 relative z-10">
        {loading
          ? <div className="w-9 h-9 rounded-xl bg-white/15 animate-pulse" />
          : <WxIcon code={todayCode} size={36} />
        }
      </div>

      {/* Recommendation + destination + update time */}
      <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center">
        {loading ? (
          <div className="h-3.5 w-32 bg-white/20 rounded animate-pulse" />
        ) : (
          <p className="text-white font-black text-[13px] leading-none truncate">{reco.label}</p>
        )}
        {!loading && (
          <p className="mt-1 truncate text-[9px] font-semibold leading-tight text-white/70">{reco.sub}</p>
        )}
        <div className="mt-1 flex min-w-0 items-center gap-1 text-[9px]">
          <MapPin className="w-2 h-2 text-white/50 shrink-0" strokeWidth={2.5} />
          <span className="truncate font-medium text-white/60">{weatherLocation}</span>
          {!loading && (
            <>
              <span className="shrink-0 text-white/35">•</span>
              <Clock className="h-2.5 w-2.5 shrink-0 text-white/50" strokeWidth={2.5} />
              <span className="shrink-0 font-medium text-white/60">{weatherTime} WIB</span>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 w-px h-6 bg-white/15 relative z-10" />

      {/* Temp + condition stacked */}
      {!loading && wx ? (
        <div className="shrink-0 relative z-10 text-center">
          <p className="text-white font-black text-base leading-none">{wx.temp}°C</p>
          <p className="text-white/55 text-[9px] mt-0.5 font-semibold whitespace-nowrap">{wmoLabel(wx.code)}</p>
          <p className="mt-1 whitespace-nowrap text-[8px] font-semibold text-white/60">
            Hujan {todayPrecip}%
          </p>
        </div>
      ) : (
        <div className="shrink-0 w-10 h-8 bg-white/15 rounded animate-pulse" />
      )}

      {/* Live pill */}
      <div className="shrink-0 relative z-10 flex items-center gap-1 rounded-full px-2 py-1"
        style={{ background: "rgba(255,255,255,0.12)" }}>
        <span className="h-1.5 w-1.5 rounded-full animate-pulse shrink-0" style={{ background: reco.dot }} />
        <span className="text-[9px] font-black tracking-wide" style={{ color: reco.dot }}>Live</span>
      </div>
    </div>
  );
}


/* ── Animated stats counter for the home page stats bar ── */
const statsSchema = [
  { Icon: Map,              suffix: "",   label: "Wisata",    color: "#ffffff", key: "destinasi"  as const },
  { Icon: UtensilsCrossed,  suffix: "",   label: "Kuliner",   color: "#ffffff", key: "kuliner"    as const },
  { Icon: CalendarDays,     suffix: "",   label: "Event",     color: "#ffffff", key: "events"     as const },
  { Icon: Users,            suffix: "K+", label: "Pengunjung",color: "#ffffff", key: "visitors"   as const },
];

function HomeAnimatedStat({ target, suffix, Icon, label, color, idx, total }: {
  target: number; suffix: string; Icon: React.ElementType;
  label: string; color: string; idx: number; total: number;
}) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered) {
        setTriggered(true);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1400;
    const startDelay = idx * 130;
    let frame: number;
    const start = performance.now() + startDelay;
    const tick = (now: number) => {
      if (now < start) { frame = requestAnimationFrame(tick); return; }
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = suffix === "K+" ? Math.floor(eased * (target / 1000)) : Math.floor(eased * target);
      setCount(val);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [triggered, target, suffix, idx]);

  const displayStr = suffix === "K+" ? `${count}K+` : String(count);

  return (
    <div ref={ref}
      className={`flex flex-col items-center gap-2 relative z-10 py-1 ${idx < total - 1 ? "border-r border-white/10" : ""}`}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
           style={{ background: "rgba(255,255,255,0.13)" }}>
        <Icon className="w-[18px] h-[18px]" style={{ color }} strokeWidth={2} />
      </div>
      <div className="text-center">
        <div className="text-white font-black leading-none tabular-nums"
             style={{ fontSize: 22 }}>
          {displayStr}
        </div>
        <div className="text-white/55 font-semibold mt-0.5" style={{ fontSize: 10 }}>{label}</div>
      </div>
    </div>
  );
}

const EVENT_GRADIENTS: Record<string, [string, string]> = {
  Budaya:    ["#9333ea", "#7c3aed"],
  Musik:     ["#f97316", "#e11d48"],
  Kuliner:   ["#16a34a", "#0194f3"],
  Olahraga:  ["#0ea5e9", "#6366f1"],
  Festival:  ["#0194f3", "#ef4444"],
  Wisata:    ["#0194f3", "#001E6E"],
  Perlombaan:["#dc2626", "#f87171"],
  default:   ["#475569", "#1e293b"],
};


/* ── Ruang Temu Cafe card ───────────────────────────────────────────────── */
type CafeBadge = { label: string; color: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> };

function detectCafeBadge(title: string): CafeBadge {
  const t = (title || "").toLowerCase();
  if (t.includes("nobar"))                                       return { label: "Nobar",      color: "#c2410c", Icon: Tv };
  if (t.includes("live") || t.includes("musik") || t.includes("acoustic")) return { label: "Live Music", color: "#7c3aed", Icon: Music };
  if (t.includes("workshop"))                                    return { label: "Workshop",   color: "#0172B1", Icon: BookOpen };
  if (t.includes("arisan"))                                      return { label: "Arisan",     color: "#b45309", Icon: Users };
  if (t.includes("talkshow") || t.includes("talk show"))         return { label: "Talkshow",   color: "#16a34a", Icon: Mic };
  if (t.includes("komunitas"))                                   return { label: "Komunitas",  color: "#0ea5e9", Icon: Users };
  return { label: "Event Cafe", color: "#92400e", Icon: Coffee };
}

function CafeEventCard({ ev }: { ev: Record<string, any> }) {
  const { label: badgeLabel, color: badgeColor, Icon: BadgeIcon } = detectCafeBadge(ev.title || ev.name || "");
  const dateStr = ev.date
    ? new Date(ev.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <Link
      href={`/event/${ev.slug || ev.id}`}
      className="shrink-0 snap-center block group"
      style={{ width: "min(58vw, 220px)", minWidth: 170 }}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1"
        style={{ aspectRatio: "9 / 16", boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}
      >
        {/* Full-bleed photo */}
        {(ev.banner_image || ev.image)
          ? <img src={ev.banner_image || ev.image} alt={ev.title || ev.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, #78350f 0%, #92400e 35%, #b45309 65%, #d97706 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Coffee className="w-20 h-20 text-white" strokeWidth={1} />
              </div>
            </div>
          )
        }
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.05) 62%, rgba(0,0,0,0) 100%)" }} />

        {/* Badge pill — top left */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white leading-none"
          style={{ background: badgeColor, boxShadow: "0 2px 8px rgba(0,0,0,0.28)" }}
        >
          <BadgeIcon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
          {badgeLabel}
        </div>

        {/* Unggulan badge — top right */}
        {ev.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 leading-none">
            <Star className="w-2.5 h-2.5 shrink-0 fill-amber-900" strokeWidth={0} />
            Unggulan
          </div>
        )}

        {/* Text block over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h3 className="font-extrabold text-white text-[16px] leading-snug line-clamp-2 mb-2">
            {ev.title || ev.name}
          </h3>
          <div className="flex items-center gap-1.5 min-w-0 mb-1">
            <MapPin className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{ev.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 mb-2">
            <CalendarDays className="h-3 w-3 shrink-0 text-white/75" strokeWidth={2} />
            <span className="text-[11px] text-white/85 font-medium truncate">{dateStr}</span>
          </div>
          <p className="font-black text-base leading-none" style={{ color: "#fbbf24" }}>
            {ev.price === 0 ? "Gratis" : `Rp ${Number(ev.price).toLocaleString("id")}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

const INFO_BANNERS = [
  {
    id: "cafe",
    image: cafePartnershipBannerImage,
    alt: "Cafe terbuka dengan pemandangan perbukitan hijau",
    title: "Cafe kamu, lebih mudah ditemukan.",
    description: "Bawa suasana dan cerita terbaikmu ke penjelajah bersama Nempo.",
    cta: "Gabung sebagai mitra",
  },
  {
    id: "wisata",
    image: digitalGrowthBannerImage,
    alt: "Tim kreatif NEMPO berdiskusi konsep wedding, event, dan konten",
    title: "Tumbuh bersama NEMPO Organizer.",
    description: "Acara, wedding, sosmed, desain, sampai talent — semua ada di satu tim.",
    cta: "Lihat layanan & harga",
  },

] as const;

function InfoPhotoBanner({ banner }: { banner: (typeof INFO_BANNERS)[number] }) {
  return (
    <>
      <img
        src={banner.image}
        alt={banner.alt}
        className="absolute inset-0 h-full w-full object-cover object-[center_47%] transition-transform duration-700 group-hover:scale-[1.025]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061b2c]/90 via-[#061b2c]/55 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex max-w-[84%] items-center px-4 py-3 md:max-w-[78%] md:px-5">
        <div>
          <h2 className="max-w-[340px] text-[15px] font-black leading-[1.08] text-white md:text-[18px]">
            {banner.title}
          </h2>
          <p className="mt-1.5 max-w-[330px] text-[10px] font-medium leading-relaxed text-white/75 md:mt-2 md:text-[11px]">
            {banner.description}
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-white md:mt-3 md:text-[11px]">
            {banner.cta}
            <ArrowRight className="h-3 w-3" strokeWidth={2.7} />
          </span>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const isAppFrame = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("app") === "1";
  const { selectedCity, matchesCity } = useCityFilter();
  const [activeHero, setActiveHero] = useState(0);
  const [activeEvent, setActiveEvent] = useState(0);
  const [activeDiskon, setActiveDiskon] = useState(0);
  const diskonTouchX = useRef(0);
  const [infoBannerIdx, setInfoBannerIdx] = useState(0);
  const infoBannerTouchX = useRef(0);
  const [showCafeModal, setShowCafeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [factIdx, setFactIdx] = useState(0);
  const [journeyPlaceKey, setJourneyPlaceKey] = useState("");
  const [journeyFoodStop, setJourneyFoodStop] = useState(true);
  const [heroHeight, setHeroHeight] = useState(280);
  const [heroCardWidth, setHeroCardWidth] = useState("56%");
  const [isMobile, setIsMobile] = useState(false);
  const [partnersDb, setPartnersDb] = useState<{ id: number; name: string; color: string }[]>([]);
  // The shared CMS banner feed is used by other pages; keep this hero focused on the eight service menus.
  const heroSlides: HeroSlide[] = HOME_SERVICE_BANNERS;
  const total = heroSlides.length;
  const [autoAdvanceKey, setAutoAdvanceKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ApiItem = Record<string, any>;
  const [wisataItems, setWisataItems] = useState<ApiItem[] | null>(null);
  const [kulinerItems, setKulinerItems] = useState<ApiItem[] | null>(null);
  const [cafeItems, setCafeItems] = useState<ApiItem[] | null>(null);
  const [eventItems, setEventItems] = useState<ApiItem[] | null>(null);

  const [liveStats, setLiveStats] = useState<{ destinasi: number; kuliner: number; events: number; visitors: number } | null>(null);
  const [donationStats, setDonationStats] = useState<{ total_bibit: number; total_donors: number; pohon_tumbuh: number } | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setInfoBannerIdx((current) => (current + 1) % INFO_BANNERS.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = (path: string, setter: (d: ApiItem[]) => void) =>
      fetch(`/api${path}`)
        .then(r => r.ok ? r.json() : [])
        .then((data: ApiItem[]) => setter(Array.isArray(data) ? data : []))
        .catch(() => setter([]));

    const fetchAll = () => {
      load("/wisata", setWisataItems);
      load("/kuliner", setKulinerItems);
      load("/cafe", setCafeItems);
      load("/events", setEventItems);

      fetch("/api/stats")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setLiveStats(data); })
        .catch(() => {});

      fetch("/api/donations/stats")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setDonationStats(data); })
        .catch(() => {});

      fetch("/api/partners")
        .then(r => r.ok ? r.json() : [])
        .then(data => { if (Array.isArray(data) && data.length > 0) setPartnersDb(data); })
        .catch(() => {});
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Responsive hero sizing: 16:9 on mobile, fixed on desktop
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        const cardWidth = isAppFrame ? 0.88 : 0.93;
        const h = Math.round(window.innerWidth * cardWidth * (9 / 16));
        setHeroHeight(h);
        setHeroCardWidth(isAppFrame ? "88%" : "93%");
      } else {
        setHeroHeight(280);
        setHeroCardWidth("56%");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isAppFrame]);

  // Typewriter effect for search placeholder
  useEffect(() => {
    const phrases = [
      "Event organizer untuk acaramu...",
      "Wedding organizer hari istimewamu...",
      "Konten kreatif untuk brand...",
      "Kelola media sosial bisnismu...",
      "Undangan digital yang personal...",
      "Website profesional untuk bisnis...",
      "Talenta lokal siap berkolaborasi...",
      "Sistem digital untuk operasional...",
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === current.length) {
          deleting = true;
          timeout = setTimeout(tick, 1400);
          return;
        }
        timeout = setTimeout(tick, 50);
      } else {
        charIdx--;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 28);
      }
    };

    timeout = setTimeout(tick, 600);
    return () => clearTimeout(timeout);
  }, []);

  // Reset ke slide 0 saat banner utama selesai dimuat
  useEffect(() => {
    if (total > 0) setActiveHero(0);
  }, [total]);

  // Auto-advance hero — reset timer when user manually swipes (autoAdvanceKey)
  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(() => {
      setActiveHero((prev) => {
        const next = (prev + 1) % total;
        return Number.isNaN(next) ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [total, autoAdvanceKey]);

  // Touch swipe handlers for hero banner
  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const handleHeroTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleHeroTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveHero((prev) => (prev + 1) % total);
      } else {
        setActiveHero((prev) => (prev - 1 + total) % total);
      }
      setAutoAdvanceKey(k => k + 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-advance fact cards slider
  useEffect(() => {
    const t = setInterval(() => setFactIdx(i => (i + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  // Filter event yang belum selesai (today atau upcoming)
  const activeEventItems = (eventItems ?? []).filter(ev => {
    const t   = new Date().toISOString().slice(0, 10);
    const end = ev.date_end && ev.date_end > ev.date ? ev.date_end : ev.date;
    return end >= t && matchesCity(ev.location, "Garut");
  });

  // Auto-advance event fan carousel
  useEffect(() => {
    const len = activeEventItems.length || 1;
    const interval = setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % len);
    }, 3000);
    return () => clearInterval(interval);
  }, [eventItems?.length]);

  const prevIndex = (activeHero - 1 + total) % total;
  const nextIndex = (activeHero + 1) % total;

  const getSlideStyle = (i: number): React.CSSProperties => {
    if (i === activeHero) {
      return {
        transform: "translateX(0%) scale(1)",
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 20,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    if (i === prevIndex) {
      return {
        transform: "translateX(-76%) scale(0.82)",
        opacity: 0.55,
        filter: "blur(2px)",
        zIndex: 10,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    if (i === nextIndex) {
      return {
        transform: "translateX(76%) scale(0.82)",
        opacity: 0.55,
        filter: "blur(2px)",
        zIndex: 10,
        transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    return {
      transform: "translateX(0%) scale(0.7)",
      opacity: 0,
      zIndex: 0,
      transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  const nonCafeKuliner = kulinerItems
    ? kulinerItems.filter((k: any) => k.category !== "Cafe" && matchesCity(k.location, "Garut"))
    : [];
  const cityWisata = wisataItems
    ? wisataItems.filter((w: any) => matchesCity(w.location, "Garut"))
    : [];
  const eventPortfolioItems = [
    {
      id: "secangkir-kopi-biang-2025",
      name: "Secangkir Kopi dengan Alunan Musik Tradisi di Akhir Tahun",
      image: secangkirKopiPosterImage,
      location: "Biang",
      date: "31 Desember 2025",
      badge: "Musik Tradisi",
    },
    {
      id: "university-coffee-night-2026",
      name: "University Coffee Night",
      image: universityCoffeeNightPosterImage,
      location: "Domusa",
      date: "18 Januari 2026",
      badge: "Coffee Night",
    },
    {
      id: "lalana-pagi-2026",
      name: "Lalana Pagi",
      image: lalanaPagiPosterImage,
      location: "Kopi Jaya",
      date: "1 Februari 2026",
      badge: "Acara Pagi",
    },
    {
      id: "ngahiji-boboran-siam-2026",
      name: "Ngahiji dina Kebagjaan Boboran Siam",
      image: ngahijiBoboranSiamPosterImage,
      location: "Situ Bagendit",
      date: "23 Maret 2026",
      badge: "Boboran Siam",
    },
    {
      id: "temu-tarung-2026",
      name: "Temu Tarung",
      image: temuTarungPosterImage,
      location: "SOR",
      date: "20–21 Juni 2026",
      badge: "Olahraga",
    },
    {
      id: "night-out-maxi-2026",
      name: "Night Out Maxi",
      image: nightOutMaxiPosterImage,
      location: "Temu Space",
      date: "22 Agustus 2026",
      badge: "Night Out",
    },
    {
      id: "color-the-beat-2026",
      name: "Color The Beat",
      image: colorTheBeatPosterImage,
      location: "Biang",
      date: "29 Agustus 2026",
      badge: "Musik",
    },
    {
      id: "riuh-rona-2026",
      name: "Riuh Rona",
      image: riuhRonaPosterImage,
      location: "Maru",
      date: "5 September 2026",
      badge: "Event",
    },
    {
      id: "opening-ggs-2026",
      name: "Grand Opening GGS Beauty",
      image: ggsBeautyOpeningImage,
      location: "GGS Beauty",
      date: "18 Oktober 2026",
      badge: "Opening",
    },
  ];
  const [eventRowEl, eventRowRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = eventRowEl;
    if (!el) return;
    let raf = 0;
    let pausedUntil = 0;
    let pos = el.scrollLeft;
    const pause = () => { pausedUntil = Date.now() + 2500; };
    const tick = () => {
      if (Date.now() > pausedUntil) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          pos = Math.abs(el.scrollLeft - pos) > 2 ? el.scrollLeft : pos;
          pos += 0.5;
          if (pos >= max) pos = 0;
          el.scrollLeft = pos;
        }
      } else {
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [eventRowEl]);
  const homeMoodPicks = homeMoodConfigs
    .map((mood) => {
      const sourceItems = mood.source === "wisata"
        ? (wisataItems ?? [])
        : mood.source === "kuliner"
          ? (kulinerItems ?? []).filter((item: any) => item.category !== "Cafe")
          : (cafeItems ?? []);
      const citySourceItems = sourceItems.filter((item) => matchesCity(item.location, "Garut"));
      const items = citySourceItems.filter((item) => {
        if (mood.key === "kuliner" || mood.key === "santai") return true;
        const searchable = [
          item.name,
          item.category,
          item.description,
          item.location,
          item.facilities,
        ].filter(Boolean).join(" ").toLowerCase();
        const keywords = mood.key === "alam"
          ? ["alam", "gunung", "air terjun", "curug", "pantai", "kawah", "kebun", "danau", "situ", "taman", "hutan"]
          : ["petualang", "adventure", "hiking", "trekking", "camping", "rafting", "arung", "offroad", "outbound", "gunung", "curug"];
        return keywords.some((keyword) => searchable.includes(keyword));
      }).slice(0, 3);

      return { ...mood, items };
    })
    .filter((mood) => mood.items.length > 0);
  const usesGarutJourneyFallback = selectedCity === "Garut" || selectedCity === ALL_CITIES;
  const fallbackJourneyPlace = {
    id: "gunung-papandayan",
    name: "Gunung Papandayan",
    location: "Cisurupan, Garut",
    description: "Kawah, hutan mati, dan udara pegunungan.",
  };
  const cityJourneyFallback = {
    id: `city-${selectedCity.toLowerCase().replace(/\s+/g, "-")}`,
    name: selectedCity === ALL_CITIES ? "Jelajah Jawa Barat" : `Jelajah ${selectedCity}`,
    location: selectedCity === ALL_CITIES ? "Jawa Barat" : `${selectedCity}, Jawa Barat`,
    description: selectedCity === ALL_CITIES
      ? "Temukan tempat menarik di berbagai kota Jawa Barat."
      : `Temukan tempat menarik di ${selectedCity}.`,
  };
  const journeyPlaceCandidates = cityWisata
    .filter((item) => {
      const searchable = [item.name, item.category, item.description, item.location, item.facilities]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return ["gunung", "alam", "curug", "air terjun", "pantai", "kawah", "kebun", "danau", "hutan"]
        .some((keyword) => searchable.includes(keyword));
    })
    .reduce<ApiItem[]>((items, item) => {
      const itemKey = String(item.id ?? item.name ?? "");
      if (itemKey && !items.some((saved) => String(saved.id ?? saved.name ?? "") === itemKey)) items.push(item);
      return items;
    }, [])
    .slice(0, 6);
  const papandayanPlace = journeyPlaceCandidates.find((item) =>
    String(item.name ?? "").toLowerCase().includes("papandayan"),
  );
  const journeyPlaces = papandayanPlace
    ? journeyPlaceCandidates
    : usesGarutJourneyFallback
        ? [fallbackJourneyPlace, ...journeyPlaceCandidates].slice(0, 6)
        : journeyPlaceCandidates.length > 0
          ? journeyPlaceCandidates
          : [cityJourneyFallback];
  const selectedJourneyPlace = journeyPlaces.find((item) =>
    String(item.id ?? item.name ?? "") === journeyPlaceKey,
  ) ?? papandayanPlace ?? journeyPlaces[0] ?? (usesGarutJourneyFallback ? fallbackJourneyPlace : cityJourneyFallback);
  const selectedPlaceName = String(selectedJourneyPlace.name ?? cityJourneyFallback.name);
  const selectedPlaceLocation = String(selectedJourneyPlace.location ?? cityJourneyFallback.location);
  const selectedPlaceSearch = `${selectedPlaceName} ${selectedPlaceLocation}`.toLowerCase();
  const selectedIsPapandayan = selectedPlaceSearch.includes("papandayan");
  const journeyFood = [...nonCafeKuliner]
    .sort((a, b) => (getGoogleRating(b) ?? 0) - (getGoogleRating(a) ?? 0))[0];
  const journeyOrigin = selectedCity === ALL_CITIES ? "Garut" : selectedCity;
  const isLocalCityJourney = selectedCity !== ALL_CITIES && matchesCity(selectedPlaceLocation);
  const journeyDuration = selectedIsPapandayan
    ? journeyFoodStop && journeyFood ? "± 2 jam 05 menit" : "± 1 jam 25 menit"
    : isLocalCityJourney
      ? journeyFoodStop && journeyFood ? "± 35 menit" : "± 20 menit"
      : journeyFoodStop && journeyFood ? "± 1 jam 45 menit" : "± 1 jam 10 menit";
  const journeyDistance = selectedIsPapandayan
    ? "± 27 km"
    : `rute lokal ${selectedCity === ALL_CITIES ? "Jawa Barat" : selectedCity}`;
  const journeyWaypoint = journeyFoodStop && journeyFood
    ? `&waypoints=${encodeURIComponent(`${journeyFood.name} ${journeyFood.location ?? `${selectedCity}, Jawa Barat`}`)}`
    : "";
  const journeyOriginQuery = selectedCity === ALL_CITIES ? "Jawa Barat" : `${selectedCity}, Jawa Barat`;
  const journeyMapsUrl =
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(journeyOriginQuery)}` +
    `&destination=${encodeURIComponent(`${selectedPlaceName}, ${selectedPlaceLocation}`)}${journeyWaypoint}`;
  const showHomeMoodPicks = homeMoodPicks.length > 0;
  const showHomeTrainSection = false;

  // Auto-scroll cafe carousel — CSS animation (iOS Safari compatible)
  // requestAnimationFrame + scrollLeft is ignored on iOS when WebkitOverflowScrolling:touch is set;
  // CSS translateX animation works reliably on all platforms including iOS Safari.

  const modalCafeEvents = activeEventItems;
  const modalHasCafe = modalCafeEvents.length > 0;

  return (
    <>
    <Layout>
      <SEO
          title="Destinasi Wisata, Kuliner & Budaya Jawa Barat"
          description="Temukan wisata alam Jawa Barat, kuliner khas Sunda, penginapan terbaik, dan event budaya lokal. Platform pariwisata digital untuk menjelajahi Jawa Barat."
          keywords="wisata jawa barat, kuliner jawa barat, penginapan jawa barat, wisata alam jawa barat, pariwisata jawa barat"
        path="/"
      />
      {/* ══ HERO — 3-Card Coverflow ══════════════════════════════════════════ */}
      <section className="w-full bg-white overflow-hidden pt-4 pb-3 md:pt-6 md:pb-4 mt-2 md:mt-0" style={{ contain: "layout paint", isolation: "isolate" }}>
        {/* Coverflow track — overflow:hidden + translate3d forces iOS to clip transforms */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{ maxWidth: 1100, height: heroHeight, transform: "translateZ(0)" }}
          onTouchStart={handleHeroTouchStart}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
        >

          {heroSlides.map((slide, i) => {
            const isActive = i === activeHero;
            const isPrev  = i === prevIndex;
            const isNext  = i === nextIndex;
            const isDigitalService = "kind" in slide && slide.kind === "digital-service";
            const isKalaMuda = "kind" in slide && slide.kind === "kala-muda";
            const instagramHandle = "instagramHandle" in slide && slide.instagramHandle
              ? slide.instagramHandle
              : "nempo.id";
            const copy = isKalaMuda
              ? {
                  eyebrow: "Kala Muda",
                  title: "Temui Kala Muda",
                  description: slide.description,
                  cta: "Kenali Kala Muda",
                  place: slide.label,
                }
              : isDigitalService
              ? {
                  eyebrow: "Digi Nempo",
                  title: slide.title,
                  description: slide.description,
                  cta: "Jelajahi Digi Nempo",
                  place: slide.label,
                }
              : getHeroCopy(slide as HeroBanner);
            const smoothTransition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease, filter 0.55s ease, box-shadow 0.55s ease";

            const cardStyle: React.CSSProperties = isActive ? {
              transform: "translateX(-50%) scale(1)",
              opacity: 1,
              zIndex: 20,
              filter: "blur(0px) brightness(1)",
              boxShadow: "none",
              transition: smoothTransition,
              willChange: "transform",
             } : isPrev ? {
               transform: isMobile ? "translateX(-50%) translateX(-120%) scale(0.84)" : "translateX(-50%) translateX(-46%) scale(0.84)",
              opacity: isMobile ? 0 : 0.65,
               zIndex: 10,
              filter: "blur(1.5px) brightness(0.65)",
               boxShadow: "none",
               transition: smoothTransition,
               willChange: "transform",
               pointerEvents: isMobile ? "none" : "auto",
             } : isNext ? {
               transform: isMobile ? "translateX(-50%) translateX(120%) scale(0.84)" : "translateX(-50%) translateX(46%) scale(0.84)",
              opacity: isMobile ? 0 : 0.65,
               zIndex: 10,
              filter: "blur(1.5px) brightness(0.65)",
               boxShadow: "none",
               transition: smoothTransition,
               willChange: "transform",
               pointerEvents: isMobile ? "none" : "auto",
             } : {
               transform: "translateX(-50%) scale(0.72)",
               opacity: 0,
               zIndex: 0,
               boxShadow: "none",
               transition: smoothTransition,
            };

            return (
              <div
                key={i}
                onClick={() => {
                  if (isPrev) { setActiveHero(prevIndex); return; }
                  if (isNext) { setActiveHero(nextIndex); return; }
                  if (isActive && slide.link) navigate(slide.link);
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: heroCardWidth,
                  height: "100%",
                  borderRadius: 24,
                  overflow: "hidden",
                  cursor: "pointer",
                  ...cardStyle,
                }}
              >
                {isKalaMuda ? (
                  <div
                    className="absolute inset-0 overflow-hidden"
                  >
                    <img
                      src={kalaMudaSlide.image}
                      alt="Anak muda sedang berkolaborasi"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, rgba(4,30,67,.9) 0%, rgba(5,59,120,.68) 42%, rgba(5,59,120,.2) 100%), linear-gradient(0deg, rgba(4,30,67,.42), transparent 55%)",
                      }}
                    />
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/15" />
                    <div className="absolute -right-2 top-4 h-28 w-28 rounded-full border border-white/15" />
                    <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-7 right-8 flex items-end gap-1.5 opacity-80">
                      <span className="h-16 w-2 rounded-full bg-white/35" />
                      <span className="h-24 w-2 rounded-full bg-white/55" />
                      <span className="h-11 w-2 rounded-full bg-[#9ddcff]" />
                      <span className="h-20 w-2 rounded-full bg-white/30" />
                      <span className="h-14 w-2 rounded-full bg-white/45" />
                    </div>
                    <div className="absolute bottom-7 right-20 text-right text-white/90">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em]">Kala</p>
                      <p className="text-4xl font-black leading-[0.8] tracking-[-0.08em]">Muda</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={"image" in slide ? slide.image : ""}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, rgba(7,18,35,.88) 0%, rgba(7,18,35,.56) 36%, rgba(7,18,35,.08) 78%, rgba(7,18,35,.02) 100%), linear-gradient(0deg, rgba(7,18,35,.44) 0%, transparent 42%)"
                          : "linear-gradient(90deg, rgba(7,18,35,.15), transparent 65%)",
                      }}
                    />
                  </>
                )}
                <div
                  className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between p-4 md:p-7"
                  style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.45s ease" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={`https://instagram.com/${instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold text-white/80 transition-colors hover:text-white"
                      aria-label={`Instagram @${instagramHandle}`}
                    >
                      <Instagram className="h-3.5 w-3.5" />
                      @{instagramHandle}
                    </a>
                  </div>
                  <div className="max-w-[480px]">
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-white/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ffc300]" aria-hidden="true" />
                      {copy.place}
                    </p>
                    <h2 className="max-w-[440px] whitespace-nowrap text-[22px] md:text-[36px] font-black leading-[1.06] tracking-[-0.045em] text-white">
                      {copy.title}
                    </h2>
                    <p className="mt-2 max-w-[390px] text-[11px] md:text-[13px] leading-relaxed text-white/80">
                      {copy.description}
                    </p>
                    <Link
                      href={slide.link}
                      onClick={(event) => event.stopPropagation()}
                      className="mt-3 inline-flex self-start shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[10px] md:text-[11px] font-extrabold text-slate-900 shadow-xl shadow-black/15"
                    >
                      {copy.cta}
                      <ArrowRight className="h-3.5 w-3.5 text-[#0194f3]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Prev / Next arrows */}
          {heroSlides.length > 1 && <>
          <button
            onClick={() => setActiveHero(prevIndex)}
            className="hidden md:flex absolute z-30 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white items-center justify-center transition-all text-xl font-bold shadow-lg"
            style={{ left: "calc(22% - 20px)", top: "50%", transform: "translateY(-50%)" }}
          >‹</button>
          <button
            onClick={() => setActiveHero(nextIndex)}
            className="hidden md:flex absolute z-30 h-9 w-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white items-center justify-center transition-all text-xl font-bold shadow-lg"
            style={{ right: "calc(22% - 20px)", top: "50%", transform: "translateY(-50%)" }}
          >›</button>
          </>}

        </div>

        {/* Dots — outside overflow:hidden so they're never clipped */}
        {heroSlides.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3 mb-1">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveHero(i)}
                style={{
                  height: 5,
                  width: i === activeHero ? 22 : 5,
                  background: i === activeHero ? "#0194f3" : "#cbd5e1",
                  borderRadius: 9999,
                  transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease",
                }}
              />
            ))}
          </div>
        )}
        <div className="h-2" />
      </section>

      {/* Search bar — straddling hero bottom & content top */}
      <div className="relative z-20 px-4 md:px-8 mt-3 overflow-visible">
        <div className="max-w-3xl mx-auto overflow-visible">

          {/* ── Search box with bird inside ── */}
          <style>{`
            @keyframes birdBob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
            @keyframes searchPop { from{transform:scale(0.95) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
          `}</style>
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center pr-1.5 overflow-visible"
            style={{ animation:"searchPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}
          >
            {/* Bird — smaller on mobile, normal on md+ */}
            <div style={{ animation:"birdBob 2.4s ease-in-out infinite", flexShrink:0, marginLeft:2, marginTop:4 }}>
              <DotLottieReact
                src={`${import.meta.env.BASE_URL}animations/bird.json`}
                loop
                autoplay
                className="w-10 h-10 md:w-14 md:h-14"
              />
            </div>

            {/* Divider */}
            <div className="w-px self-stretch my-2 mx-1.5 shrink-0" style={{ background:"#E5E7EB" }} />

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              placeholder={typedPlaceholder || "Cari layanan yang kamu butuhkan..."}
              className="flex-1 min-w-0 outline-none text-sm text-gray-700 placeholder-gray-400 font-medium bg-transparent py-3 px-1"
            />

            {/* Button: icon-only on mobile, text on md+ */}
            <button
              onClick={() => {
                if (searchQuery.trim()) navigate(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
              }}
              className="shrink-0 active:scale-95 transition-all rounded-xl flex items-center justify-center gap-1.5"
              style={{ background:"#22c55e", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.35)", padding:"10px 12px" }}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-sm font-bold">Cari</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════════════ */}
      <style>{`
        .home-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .home-section-categories { order: 10; }
        .home-section-tagline { order: 15; }
        .home-section-recommendations { order: 30; }
        .home-section-itineraries { order: 40; }
        .home-section-creator-team { order: 18; }
        .home-section-promo { order: 51; }
        .home-section-cafe { order: 52; }
        .home-section-events { order: 50; }
        .home-section-service-promos { order: 20; }
        .home-section-facts { order: 11; }
        .home-section-upcoming { order: 12; }
        .home-section-partnership { order: 90; }
        .home-section-organizer { order: 110; }
        .home-section-partners { order: 120; }
      `}</style>
      <div className="home-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 md:pb-10 overflow-x-hidden">

        {/* ── Categories ── */}
        <section className="home-section-categories">
          <CategoryGrid />
        </section>

        {/* ── Nempo introduction and service CTA ── */}
        <div className="home-section-tagline mt-4">
          <NempoHomeCtaBanner />
        </div>

        {/* ── Naik dan jelajah Jawa Barat: animated railway journey ── */}
        {showHomeTrainSection && showHomeMoodPicks && (
          <section className="home-section-itineraries relative isolate overflow-hidden text-[#17314a]">
            <style>{`
              @keyframes homeTrackGlow {
                0%, 100% { opacity: .35; }
                50% { opacity: .85; }
              }
              @keyframes homeLandscapeDrift {
                from { transform: translateX(0); }
                to { transform: translateX(-24px); }
              }
              .home-track-glow { animation: homeTrackGlow 2.8s ease-in-out infinite; }
              .home-landscape-drift { animation: homeLandscapeDrift 10s ease-in-out infinite alternate; }
              .home-train-ride {
                position: absolute;
                z-index: 21;
                left: -28%;
                bottom: 31%;
                width: clamp(104px, 14vw, 156px);
                aspect-ratio: 180 / 76;
                pointer-events: none;
                transform-origin: 50% 100%;
                animation: homeTrainRide 18s linear infinite;
              }
              .home-train-svg {
                display: block;
                width: 100%;
                height: 100%;
                overflow: visible;
              }
              @keyframes homeTrainRide {
                0% { left: -28%; bottom: 35%; transform: rotate(-2deg); }
                18% { left: 5%; bottom: 31%; transform: rotate(3deg); }
                38% { left: 32%; bottom: 36%; transform: rotate(-3deg); }
                58% { left: 58%; bottom: 32%; transform: rotate(3deg); }
                78% { left: 84%; bottom: 28%; transform: rotate(-2deg); }
                100% { left: 110%; bottom: 36%; transform: rotate(2deg); }
              }
              @media (prefers-reduced-motion: reduce) {
                .home-track-glow, .home-landscape-drift { animation: none; }
                .home-train-ride {
                  left: 42%;
                  bottom: 36%;
                  animation: none;
                  transform: rotate(0deg);
                }
              }
              @media (max-width: 639px) {
                .home-journey-copy {
                  max-width: 100%;
                }
                .home-journey-scene { height: 248px; border-radius: 1.5rem; }
                .home-journey-route { left: 0.75rem; right: 0.75rem; max-width: none; }
                .home-journey-stations { top: 154px; left: 0.25rem; right: 0.25rem; }
                .home-station-name { max-width: 80px; min-height: 2.2em; font-size: 9px; line-height: 1.15; }
                .home-journey-stop-label {
                  min-height: 18px;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                  line-height: 1.15;
                  letter-spacing: 0.02em;
                }
                .home-train-ride { width: clamp(104px, 29vw, 124px); }
              }
            `}</style>
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute left-1/3 top-12 h-36 w-36 rounded-full bg-[#b9e2fb]/35 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_20%_20%,rgba(1,148,243,.12)_0_1px,transparent_1px),radial-gradient(circle_at_70%_38%,rgba(14,165,233,.12)_0_1px,transparent_1px)] [background-size:80px_60px,110px_80px]" />
            </div>

            <div className="relative z-10 px-1 pb-0 pt-5 sm:px-2 sm:pt-7 md:px-4 md:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="home-journey-copy">
                  <h2 className="text-2xl font-black leading-[1.05] tracking-[-0.045em] text-[#17314a] sm:text-3xl md:text-[2.2rem]">
                    Jelajah {selectedCity === ALL_CITIES ? "Jawa Barat" : selectedCity}
                  </h2>
                  <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
                    Pilih jalur, ikuti keretanya, dan temukan tempat singgahmu.
                  </p>
                  <TrainArrivalPlayer city={selectedCity} />
                </div>
                <Link
                  href="/cari?q=Jawa%20Barat"
                  className="mt-1 hidden shrink-0 items-center gap-1 rounded-full border border-[#c6e7fa] bg-white/70 px-3 py-2 text-[11px] font-bold text-[#0172b1] backdrop-blur-sm transition hover:bg-white sm:flex"
                >
                  Semua rute <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="home-journey-scene relative z-10 mt-5 h-[248px] overflow-hidden rounded-[1.5rem] border border-[#cfe6f7] bg-[linear-gradient(180deg,#eef8ff_0%,#fafdff_62%,#e7f4ff_100%)] sm:mt-8 sm:h-[242px] sm:rounded-[2rem]">
              {/* Layered hills keep this feeling like a moving railway scene, not a card grid. */}
              <div className="home-landscape-drift pointer-events-none absolute -bottom-2 -left-8 h-24 w-[calc(100%+4rem)] bg-[#d2e9f8] [clip-path:polygon(0_76%,8%_55%,16%_68%,25%_30%,35%_68%,47%_43%,57%_72%,67%_24%,77%_63%,86%_40%,94%_67%,100%_52%,100%_100%,0_100%)]" />
              <div className="pointer-events-none absolute -bottom-2 left-0 h-16 w-full bg-[#bcdcf2] [clip-path:polygon(0_60%,10%_34%,19%_67%,29%_45%,39%_70%,51%_28%,61%_65%,72%_38%,83%_69%,92%_42%,100%_59%,100%_100%,0_100%)]" />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-[150px] bg-white/20" />
              <div className="home-track-glow pointer-events-none absolute inset-x-0 top-[112px] h-12 rounded-full bg-[#7bc9f6]/30 blur-xl" />
              <svg className="pointer-events-none absolute inset-x-0 top-[52px] z-20 h-[150px] w-full overflow-visible" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
                <path d="M-10 94 C 108 84, 178 106, 300 94 S 478 86, 600 101 S 804 111, 1010 91" fill="none" stroke="#638eaf" strokeWidth="4" opacity=".88" />
                <path d="M-10 106 C 108 96, 178 118, 300 106 S 478 98, 600 113 S 804 123, 1010 103" fill="none" stroke="#638eaf" strokeWidth="3" opacity=".55" />
                <path d="M-10 94 C 108 84, 178 106, 300 94 S 478 86, 600 101 S 804 111, 1010 91" fill="none" stroke="#a5cfee" strokeWidth="18" strokeDasharray="2 34" opacity=".42" />
              </svg>
               <div className="home-train-ride" aria-hidden="true">
                 <svg className="home-train-svg" viewBox="0 -78 180 76" preserveAspectRatio="xMidYMid meet">
                   <defs>
                     <linearGradient id="homeTrainLoco" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0" stopColor="#7bd0ff" />
                       <stop offset="0.55" stopColor="#159fe5" />
                       <stop offset="1" stopColor="#0872b8" />
                     </linearGradient>
                     <linearGradient id="homeTrainCarriage" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0" stopColor="#1aa7e8" />
                       <stop offset="1" stopColor="#0569a8" />
                     </linearGradient>
                     <linearGradient id="homeTrainGlass" x1="0" y1="0" x2="1" y2="1">
                       <stop offset="0" stopColor="#e7f9ff" />
                       <stop offset="0.45" stopColor="#8dd7f6" />
                       <stop offset="1" stopColor="#2f8fc4" />
                     </linearGradient>
                   </defs>
                   <g transform="translate(4 0) scale(.9)">
                     <path d="M3 -8h163" stroke="#082532" strokeWidth="6" strokeLinecap="round" opacity=".28" />
                     <path d="M0 -14h165" stroke="#d8f0ff" strokeWidth="2" opacity=".5" />

                     <g>
                       <path d="M0 -17V-46Q0 -55 10 -57H45Q57 -57 63 -47L69 -35V-17Z" fill="url(#homeTrainLoco)" stroke="#d8f0ff" strokeWidth="2.5" />
                       <path d="M29 -50h16q7 0 11 7l3 9H29Z" fill="url(#homeTrainGlass)" stroke="#d8f0ff" strokeWidth="2" />
                       <path d="M7 -48h17v14H7Z" fill="url(#homeTrainGlass)" stroke="#d8f0ff" strokeWidth="2" />
                       <path d="M0 -17h69l-6 6H3Z" fill="#075d95" opacity=".9" />
                       <path d="M63 -34h8v13h-8Z" fill="#075d95" />
                       <circle cx="59" cy="-28" r="3.2" fill="#fff8c7" stroke="#d8f0ff" strokeWidth="1.5" />
                       <circle cx="6" cy="-26" r="2.2" fill="#ffeb9a" />
                       <path d="M4 -12h13M52 -12h13" stroke="#d8f0ff" strokeWidth="2" strokeLinecap="round" />
                     </g>

                     <path d="M69 -31h7M119 -31h7" stroke="#082532" strokeWidth="3" strokeLinecap="round" opacity=".65" />
                     <g>
                       <rect x="77" y="-50" width="42" height="34" rx="6" fill="url(#homeTrainCarriage)" stroke="#9de0fa" strokeWidth="2.5" />
                       <path d="M83 -45h10v12H83zm17 0h14v12h-14z" fill="url(#homeTrainGlass)" stroke="#bcecff" strokeWidth="1.5" />
                       <path d="M96 -48v28" stroke="#bcecff" strokeWidth="1.5" opacity=".7" />
                       <path d="M81 -17h34" stroke="#064f80" strokeWidth="3" opacity=".65" />
                     </g>
                     <g>
                       <rect x="128" y="-50" width="42" height="34" rx="6" fill="url(#homeTrainCarriage)" stroke="#9de0fa" strokeWidth="2.5" />
                       <path d="M134 -45h10v12H134zm17 0h14v12H151z" fill="url(#homeTrainGlass)" stroke="#bcecff" strokeWidth="1.5" />
                       <path d="M147 -48v28" stroke="#bcecff" strokeWidth="1.5" opacity=".7" />
                       <path d="M132 -17h34" stroke="#064f80" strokeWidth="3" opacity=".65" />
                     </g>

                     <g fill="#9bc8e4" stroke="#082532" strokeWidth="2.5">
                       <circle cx="16" cy="-8" r="6" />
                       <circle cx="57" cy="-8" r="6" />
                       <circle cx="91" cy="-8" r="6" />
                       <circle cx="111" cy="-8" r="6" />
                       <circle cx="142" cy="-8" r="6" />
                       <circle cx="162" cy="-8" r="6" />
                     </g>
                     <g fill="#d8f0ff" opacity=".9">
                       <circle cx="16" cy="-8" r="2" />
                       <circle cx="57" cy="-8" r="2" />
                       <circle cx="91" cy="-8" r="2" />
                       <circle cx="111" cy="-8" r="2" />
                       <circle cx="142" cy="-8" r="2" />
                       <circle cx="162" cy="-8" r="2" />
                     </g>
                     <circle cx="7" cy="-64" r="4" fill="#b8d8e9" opacity=".42" />
                     <circle cx="0" cy="-74" r="7" fill="#b8d8e9" opacity=".25" />
                   </g>
                 </svg>
               </div>

              <div className="home-journey-route absolute left-4 top-4 z-30 max-w-[68%] rounded-2xl border border-white/80 bg-white/85 px-3 py-2 shadow-[0_8px_20px_rgba(1,87,145,.10)] backdrop-blur-sm sm:left-5 sm:top-5 sm:max-w-[280px]">
                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-[#0194f3]">
                  <MapPinned className="h-3 w-3" /> Rute hari ini
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] font-black text-[#17314a]">
                  <span className="shrink-0">{journeyOrigin}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-[#0e8bd4]" />
                  <span className="truncate" title={selectedPlaceName}>{selectedPlaceName}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[9px] font-bold text-slate-400">
                  <span>{journeyDuration}</span>
                  <span className="h-1 w-1 rounded-full bg-[#68baf0]" />
                  <span>{journeyDistance}</span>
                </div>
              </div>

              <div
                className="home-journey-stations absolute inset-x-2 top-[150px] grid"
                style={{ gridTemplateColumns: `repeat(${homeMoodPicks.length}, minmax(0, 1fr))` }}
              >
                {homeMoodPicks.map((mood, index) => (
                  <Link
                    key={mood.key}
                    href={mood.href}
                    className="group relative flex min-w-0 flex-col items-center text-center"
                  >
                    <span className="absolute -top-8 left-1/2 h-7 w-px -translate-x-1/2 bg-[#78b9df]/60" />
                    <span className="relative z-30 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-[#eef8ff] bg-[#5eb9ee] text-[9px] font-black text-[#17314a] shadow-[0_0_0_2px_#4a9dcc] transition group-hover:scale-125 group-hover:bg-[#a4dcff]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="home-journey-stop-label mt-4 flex flex-col items-center gap-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#0194f3] transition group-hover:text-[#0172b1] sm:flex-row sm:gap-1">
                      <MapPinned className="h-2.5 w-2.5 shrink-0" />
                      <span className="min-w-0 text-center">
                        {mood.key === "alam" ? "Pegunungan" : mood.key === "kuliner" ? "Rasa lokal" : mood.key === "santai" ? "Tempat santai" : "Petualangan"}
                      </span>
                    </span>
                    <h3 className="home-station-name mt-1 max-w-[130px] line-clamp-2 text-[10px] font-black leading-tight text-[#17314a] sm:line-clamp-none sm:text-[12px]">{mood.title}</h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative z-10 border-t border-[#cfe6f7] px-1 py-3 sm:px-2 md:px-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0e84c3]">Jalur pilihan</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                  <MapPin className="h-3 w-3 text-[#0194f3]" /> Mulai
                </span>
                <ArrowRight className="h-3 w-3 text-slate-300" />
                {journeyFoodStop && journeyFood && (
                  <>
                    <span className="flex max-w-[120px] items-center gap-1 truncate text-[10px] font-bold text-[#0e84c3] sm:max-w-[150px]" title={`Rekomendasi singgah: ${journeyFood.name}`}>
                      <UtensilsCrossed className="h-3 w-3 shrink-0" /> Mampir makan
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-300" />
                  </>
                )}
                <span className="flex max-w-[130px] items-center gap-1 truncate text-[10px] font-black text-[#0194f3] sm:max-w-[180px]" title={selectedPlaceLocation}>
                  <Mountain className="h-3 w-3 shrink-0" /> {selectedPlaceName}
                </span>
                <span className="ml-auto flex items-center gap-3 text-[9px] font-bold text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{journeyDuration}</span>
                  <span className="hidden sm:flex items-center gap-1"><Route className="h-3 w-3" />{journeyDistance}</span>
                </span>
              </div>

              <div className="relative mt-3 h-1.5 rounded-full bg-[#dbeefb]">
                <span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-gradient-to-r from-[#0194f3] via-[#68bdf2] to-[#0194f3]" />
                <span className="absolute -top-1 left-0 h-3.5 w-3.5 rounded-full border-2 border-[#eef8ff] bg-[#0194f3]" />
                {journeyFoodStop && journeyFood && <span className="absolute -top-1 left-1/2 h-3.5 w-3.5 rounded-full border-2 border-[#eef8ff] bg-[#58b3ea]" title={`Singgah: ${journeyFood.name}`} />}
                <span className="absolute -top-1 left-2/3 h-3.5 w-3.5 rounded-full border-2 border-[#eef8ff] bg-[#0194f3]" title={selectedPlaceName} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none]">
                  {journeyPlaces.map((place) => {
                    const placeKey = String(place.id ?? place.name ?? "");
                    const isSelected = placeKey === String(selectedJourneyPlace.id ?? selectedJourneyPlace.name ?? "");
                    return (
                      <button
                        key={placeKey}
                        type="button"
                        onClick={() => setJourneyPlaceKey(placeKey)}
                        aria-pressed={isSelected}
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold transition ${
                          isSelected
                            ? "border-[#0194f3]/40 bg-[#e8f5ff] text-[#0172b1]"
                            : "border-[#cfe6f7] text-slate-400 hover:border-[#9dd2f2] hover:text-[#0194f3]"
                        }`}
                      >
                        {place.name}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setJourneyFoodStop((current) => !current)}
                  aria-pressed={journeyFoodStop}
                  title={journeyFoodStop ? "Matikan rekomendasi singgah kuliner" : "Tambahkan rekomendasi singgah kuliner"}
                  className={`flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[9px] font-black transition ${
                    journeyFoodStop ? "border-[#68bdf2]/70 bg-[#e8f5ff] text-[#0172b1]" : "border-[#cfe6f7] text-slate-400"
                  }`}
                >
                  <UtensilsCrossed className="h-3 w-3" /> <span className="hidden sm:inline">+ Kuliner</span>
                </button>
                <a
                  href={journeyMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-[#0194f3] px-2.5 text-[9px] font-black text-white transition hover:bg-[#0172b1]"
                >
                  <Map className="h-3 w-3" /> Maps
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── Tahukah Anda ── */}
        <NempoFactsSection factIdx={factIdx} onFactChange={setFactIdx} />

        {/* ── Event Mendatang spotlight ── */}
        <section className="home-section-upcoming relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
              <CalendarDays className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-foreground font-black text-base leading-tight">Event Mendatang</h2>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.10em] mt-0.5">Catat tanggalnya, ayo datang bareng!</p>
            </div>
          </div>
          <Link
            href="/event/musicomedy-night"
            className="group block w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            style={{
              willChange: "transform",
              animation: "cafe-zigzag 3.8s ease-in-out infinite",
              "--cafe-arc-y": "0px",
              "--cafe-arc-r": "0deg",
              "--cafe-zigzag-y": "6px",
              "--cafe-zigzag-x": "3px",
              "--cafe-zigzag-x-negative": "-3px",
              "--cafe-zigzag-r": "0.6deg",
              "--cafe-zigzag-r-negative": "-0.6deg",
            } as React.CSSProperties}
          >
            <div className="flex flex-col sm:h-[360px] sm:flex-row">
              <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden sm:h-full sm:w-auto">
                <img
                  src={musicomedyPoster.url}
                  alt="Poster MusiComedy Night"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:gap-3 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Rabu, 4 November 2026</p>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-primary">Gratis</span>
                </div>
                <h3 className="text-2xl font-black leading-tight text-foreground sm:text-3xl lg:text-4xl">MusiComedy Night</h3>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 py-1 pl-1.5 pr-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Mic className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <p className="text-[13px] font-bold leading-tight text-foreground sm:text-sm">
                    bersama <span className="font-black">Saduli Ragap</span>
                  </p>
                </div>

                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Malam musik dan komedi bareng NEMPO.ID × Kala Muda di Good Story Cafe.
                </p>
                <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                  Lihat detail event
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
              <aside className="hidden w-[290px] shrink-0 flex-col justify-center gap-5 border-l border-border bg-muted/30 p-8 lg:flex">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Rabu, 4 November 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Good Story Cafe, Jl. Sudirman Copong No. 11, Garut</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mic className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Bintang Tamu</p>
                    <p className="text-sm font-bold leading-snug text-foreground">bersama Saduli Ragap</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">

                  <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Harga</p>
                    <p className="text-sm font-bold leading-snug text-foreground">Gratis, langsung datang aja</p>
                  </div>
                </div>
              </aside>
            </div>
          </Link>



        </section>



        <section className="home-section-service-promos mt-2 sm:mt-0">
          <NempoPartnershipCarousel />
        </section>

        {/* ── Kuliner Populer ── */}
        {eventPortfolioItems.length > 0 && (
          <div className="home-section-cafe">
          <style>{`
            @keyframes cafe-badge-pulse {
              0%, 100% { box-shadow: 0 0 0 0 rgba(251,146,60,0.55); }
              50% { box-shadow: 0 0 0 6px rgba(251,146,60,0); }
            }
            @keyframes cafe-shine {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            @keyframes cafe-icon-spin {
              0% { transform: rotate(-10deg) scale(1); }
              50% { transform: rotate(10deg) scale(1.15); }
              100% { transform: rotate(-10deg) scale(1); }
            }
            @keyframes cafe-dot-blink {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.4; transform: scale(0.7); }
            }
            .cafe-title-shine {
              background: linear-gradient(105deg, #92400e 0%, #d97706 30%, #f97316 50%, #fbbf24 65%, #d97706 80%, #92400e 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: cafe-shine 3s linear infinite;
            }
          `}</style>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)", animation: "cafe-badge-pulse 2s ease-in-out infinite" }}>
                  <Coffee className="h-4 w-4 text-white" strokeWidth={2}
                    style={{ animation: "cafe-icon-spin 3s ease-in-out infinite" }} />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white"
                  style={{ animation: "cafe-dot-blink 1.5s ease-in-out infinite" }} />
              </div>
              <div>
                <h2 className="cafe-title-shine font-black text-base leading-none">Event Kami</h2>
                 <p className="text-[#f97316] text-[10px] font-bold uppercase tracking-widest mt-0.5">
                   Portofolio
                 </p>
              </div>
            </div>
            <Link href="/event" className="flex items-center gap-0.5 text-[#f97316] text-xs font-bold hover:underline">
              Semua <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
           <section ref={eventRowRef} className="touch-card-row relative -mx-4 overflow-x-auto scrollbar-hide px-4 md:mx-0 md:px-0">
            <div
               className="flex items-end gap-3"
              style={{
                width: "max-content",
                 paddingLeft: 2,
                 paddingTop: 16,
                 paddingBottom: 56,
              }}
            >
              {eventPortfolioItems.map((event, idx) => (
                <Link key={event.id} href="/event"
                   className="cafe-card-snap shrink-0 rounded-3xl overflow-hidden relative active:scale-95 transition-transform"
                   style={(() => {
                     const progress = eventPortfolioItems.length > 1
                       ? idx / (eventPortfolioItems.length - 1)
                       : 0.5;
                     const arcOffset = Math.round(34 - Math.sin(Math.PI * progress) * 34);
                     const arcRotation = (0.5 - progress) * 2.2;
                     const seed = idx * 17;
                     const direction = seed % 2 === 0 ? 1 : -1;
                     const zigzagY = 5 + (seed % 8);
                     const zigzagX = direction * (2 + (seed % 5));
                     const zigzagRotation = direction * (0.7 + (seed % 5) * 0.22);
                     const zigzagDuration = 3.2 + (seed % 5) * 0.42;
                     return {
                       width: "clamp(148px, 42vw, 184px)",
                       aspectRatio: "9 / 16",
                       boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                       willChange: "transform",
                       animation: `cafe-zigzag ${zigzagDuration}s ease-in-out infinite`,
                       animationDelay: `${-(seed % 11) * 0.24}s`,
                       "--cafe-arc-y": `${arcOffset}px`,
                       "--cafe-arc-r": `${arcRotation}deg`,
                       "--cafe-zigzag-y": `${zigzagY}px`,
                       "--cafe-zigzag-x": `${zigzagX}px`,
                       "--cafe-zigzag-x-negative": `${-zigzagX}px`,
                       "--cafe-zigzag-r": `${zigzagRotation}deg`,
                       "--cafe-zigzag-r-negative": `${-zigzagRotation}deg`,
                     } as React.CSSProperties;
                   })()}>
                  <PlacePhoto
                    kind="cafe"
                    src={event.image}
                    alt={event.name}
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                   <span
                     className="absolute top-2 left-0 z-10 flex items-center gap-1 text-[10px] font-bold text-white"
                     style={{
                       borderRadius: "0 6px 6px 0",
                       padding: "4px 10px",
                       boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
                       background: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                     }}
                   >
                     {event.badge}
                   </span>
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                    <h3 className="font-bold text-white text-[11px] line-clamp-3 leading-tight">{event.name}</h3>
                    <div className="flex items-center gap-0.5 text-white/70 text-[9px] mt-1">
                      <MapPin className="h-2 w-2 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-white/70 text-[9px] mt-0.5">
                      <CalendarDays className="h-2 w-2 shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </section>
          </div>
        )}

        {/* ── Promo ── */}
        {(() => {
          const pair = HOME_PROMO_CARDS;
          const mobilePages = [HOME_PROMO_CARDS];
          return (
            <section className="home-section-promo pt-2">
              <style>{`
                @keyframes promoShine { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
                .promo-shine::after { content:''; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.14) 50%,transparent 70%); background-size:300% 100%; animation:promoShine 4s linear infinite; pointer-events:none; }
                .promo-card { transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease; }
                .promo-card:hover { transform: translateY(-3px); }
                .promo-card:active { transform: scale(0.98); }
              `}</style>

              {/* ── Mobile: two compact cards per frame with touch ── */}
              <div className="md:hidden">
                <div
                  className="overflow-hidden rounded-2xl"
                  onTouchStart={(e) => { diskonTouchX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - diskonTouchX.current;
                    if (Math.abs(dx) > 40) {
                      setActiveDiskon(i =>
                        dx < 0
                          ? (i + 1) % mobilePages.length
                          : (i - 1 + mobilePages.length) % mobilePages.length
                      );
                    }
                  }}
                >
                  <div
                    className="flex"
                    style={{ transform: `translateX(-${activeDiskon * 100}%)`, transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)" }}
                  >
                    {mobilePages.map((page, pageIndex) => (
                      <div key={pageIndex} className="flex w-full flex-shrink-0 items-stretch gap-2">
                        {page.map((c) => {
                      const clr = voucherColors(c.colorType);
                      const isBonusPromo = c.kind === "bonus";
                      return (
                         <div key={c.id} className="promo-card promo-shine relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.35rem] ring-1 ring-white/15 cursor-pointer select-none"
                          style={{ background:`linear-gradient(145deg,${clr.from} 0%,${clr.to} 100%)` }}>
                           <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                           <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                           <div className="absolute -right-1 -bottom-2 font-black text-white/[0.07] leading-none select-none pointer-events-none" style={{ fontSize:68, fontFamily:"system-ui" }}>{c.amount}</div>
                          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.07)" }} />
                          <div className="relative flex flex-1 flex-col p-2.5" style={{ zIndex:2, minHeight:150 }}>
                            <span className="inline-flex h-5 max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider" style={{ background:"rgba(255,255,255,0.22)", color:"white" }}>
                              {c.colorType === "new_user" ? <UserPlus className="w-2.5 h-2.5" strokeWidth={2.5} /> : <Award className="w-2.5 h-2.5" strokeWidth={2.5} />}
                              {c.badge}
                            </span>
                            <div className="flex h-8 items-end gap-1">
                              {isBonusPromo ? (
                                <div className="flex flex-col">
                                  <span className="text-white font-black leading-none" style={{ fontSize:16 }}>{c.amount}</span>
                                  <span className="text-white/50 text-[7px] font-bold uppercase">{c.amountLabel}</span>
                                </div>
                              ) : (
                                <>
                                  <span className="font-black text-white leading-none" style={{ fontSize:26, lineHeight:1 }}>{c.amount}</span>
                                  <div className="flex flex-col mb-0.5 ml-1">
                                    <span className="text-white/90 font-black text-sm leading-none">%</span>
                                    <span className="text-white/50 text-[8px] font-bold uppercase">{c.amountLabel}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <p className="h-8 overflow-hidden text-white font-extrabold text-[11px] leading-snug line-clamp-2">{c.title}</p>

                            <div className="flex min-h-7 w-full min-w-0 items-center gap-0.5 overflow-hidden">
                              <p className="line-clamp-2 text-white/85 text-[8px] font-semibold leading-snug">
                                {c.description}
                              </p>
                            </div>

                             <div className="relative -mx-2.5 mb-2 h-3">
                               <div aria-hidden="true" className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/35" />
                               <div aria-hidden="true" className="absolute -left-2 top-0 h-3 w-3 rounded-full bg-white/95" />
                               <div aria-hidden="true" className="absolute -right-2 top-0 h-3 w-3 rounded-full bg-white/95" />
                             </div>
                            <a
                              href={NEMPO_CONSULT_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-7 w-full items-center justify-center rounded-xl text-xs font-extrabold no-underline transition-all active:scale-95"
                              style={{ background:"rgba(255,255,255,0.95)", color:clr.to }}
                            >
                              {c.ctaLabel} →
                            </a>
                            <div className="mt-1.5 h-3.5" />
                          </div>
                        </div>
                      );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Dots indicator */}
                {mobilePages.length > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    {mobilePages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDiskon(i)}
                        style={{ transition: "all 0.3s ease" }}
                        className={`rounded-full ${i === activeDiskon ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-gray-300"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Desktop: compact horizontal cards ── */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                {pair.map((c) => {
                  const clr = voucherColors(c.colorType);
                  const isBonusPromo = c.kind === "bonus";

                  return (
                    <div key={`d-${c.id}`} className="promo-card promo-shine relative overflow-hidden rounded-[1.35rem] ring-1 ring-white/15 cursor-pointer select-none"
                      style={{ background:`linear-gradient(135deg,${clr.from} 0%,${clr.to} 100%)` }}>

                      {/* Decorative blobs */}
                      <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                      <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-1/2 z-[3] h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
                      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.06)" }} />
                      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full pointer-events-none" style={{ background:"rgba(255,255,255,0.05)" }} />

                      {/* Horizontal inner layout */}
                      <div className="relative flex items-center gap-0" style={{ zIndex:2 }}>

                        {/* Left: discount display */}
                           <div className="flex flex-col items-center justify-center px-4 py-4 shrink-0 border-r border-dashed border-white/25" style={{ minWidth:80 }}>
                            {isBonusPromo ? (
                             <>
                                <span className="text-white font-black leading-none" style={{ fontSize:18 }}>{c.amount}</span>
                                <span className="text-white/60 text-[8px] font-black uppercase tracking-widest mt-1">{c.amountLabel}</span>
                             </>
                           ) : (
                             <>
                               <div className="flex items-start leading-none">
                                 <span className="font-black text-white/80 text-base mt-0.5 mr-0.5">%</span>
                                  <span className="font-black text-white leading-none" style={{ fontSize:42 }}>{c.amount}</span>
                               </div>
                                <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mt-0.5">{c.amountLabel}</span>
                             </>
                           )}
                        </div>

                        {/* Middle: content */}
                        <div className="flex-1 flex flex-col justify-center px-4 py-3 min-w-0 gap-1">
                          {/* Type badge */}
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full self-start whitespace-nowrap" style={{ background:"rgba(255,255,255,0.2)", color:"white" }}>
                            {c.colorType === "new_user" ? <UserPlus className="w-2.5 h-2.5" strokeWidth={2.5} /> : <Award className="w-2.5 h-2.5" strokeWidth={2.5} />}
                            {c.badge}
                          </span>

                          {/* Title — 2 lines max */}
                          <h3 className="text-white font-black text-sm leading-tight line-clamp-2">{c.title}</h3>

                          <p className="text-white/80 text-[10px] font-semibold leading-snug line-clamp-2">
                            {c.description}
                          </p>
                        </div>

                        {/* Right: CTA */}
                         <div className="flex flex-col items-center justify-center px-4 py-4 shrink-0 border-l border-dashed border-white/25 gap-1.5">
                          <a
                            href={NEMPO_CONSULT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap no-underline transition-all hover:scale-105 active:scale-95"
                            style={{ background:"rgba(255,255,255,0.97)", color:clr.to, boxShadow:"0 3px 12px rgba(0,0,0,0.18)" }}
                          >
                            {c.ctaLabel}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* ── AI photo banners ── */}
        <div className="home-section-partnership">
        <div
          className="relative overflow-hidden rounded-2xl md:hidden"
          style={{ height: 130 }}
          onTouchStart={(event) => { infoBannerTouchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            const distance = event.changedTouches[0].clientX - infoBannerTouchX.current;
            if (Math.abs(distance) > 40) {
              setInfoBannerIdx((current) =>
                distance < 0
                  ? (current + 1) % INFO_BANNERS.length
                  : (current - 1 + INFO_BANNERS.length) % INFO_BANNERS.length,
              );
            }
          }}
        >
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${infoBannerIdx * 100}%)`,
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {INFO_BANNERS.map((banner) => (
              <Link
                key={banner.id}
                href="/price-list"
                aria-label={banner.title}
                className="group relative block h-full w-full shrink-0 overflow-hidden rounded-2xl shadow-sm"
              >
                <InfoPhotoBanner banner={banner} />
              </Link>
            ))}
          </div>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {INFO_BANNERS.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Tampilkan banner ${index + 1}`}
                onClick={() => setInfoBannerIdx(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === infoBannerIdx ? 18 : 5,
                  height: 5,
                  background: index === infoBannerIdx
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="hidden grid-cols-2 gap-3 md:grid">
          {INFO_BANNERS.map((banner) => (
            <Link
              key={banner.id}
              href="/price-list"
              aria-label={banner.title}
              className="group relative block h-[180px] overflow-hidden rounded-2xl shadow-sm"
            >
              <InfoPhotoBanner banner={banner} />
            </Link>
          ))}
        </div>
        </div>

        {/* ── Creator Team ── */}
        <section className="home-section-creator-team">
          <NempoCreatorTeamCard />
        </section>

        {/* ── Kuliner Paling Populer — dihapus ── */}


        {/* ── Donasi Bibit Jawa Barat Hijau — hidden ── */}
        {/* <section className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80"
                 alt="hutan" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-emerald-950/85 to-green-900/70" />
          </div>
          <div className="relative z-10 p-4 md:p-8 flex items-center gap-4">
            <div className="hidden md:flex shrink-0 rounded-2xl bg-emerald-500/20 border border-emerald-400/25 items-center justify-center overflow-hidden" style={{ width: 80, height: 80 }}>
              <DotLottieReact
                src={`${import.meta.env.BASE_URL}animations/tree-green.json`}
                loop autoplay
                style={{ width: 72, height: 72 }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-wide mb-0.5 truncate">Program Penghijauan · Jawa Barat</p>
              <h2 className="text-white font-extrabold text-base md:text-2xl leading-tight mb-2">
                Donasi Bibit <span className="text-emerald-400">Jawa Barat Lebih Hijau</span>
              </h2>
              {(() => {
                const totalBibit = donationStats?.total_bibit ?? 0;
                const pct = Math.min(100, Math.round((totalBibit / 50000) * 100));
                const totalDonors = donationStats?.total_donors ?? 0;
                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                      <span className="text-white/50 text-[10px] shrink-0">{totalBibit.toLocaleString("id")}/50rb</span>
                    </div>
                    <p className="text-emerald-300/70 text-[10px]">{pct}% · {totalDonors.toLocaleString("id")} donatur</p>
                  </div>
                );
              })()}
            </div>
            <Link href="/donasi-bibit" className="shrink-0">
              <button className="inline-flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-gray-900 font-bold text-xs md:text-sm px-3 md:px-5 py-2.5 md:py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/30 whitespace-nowrap">
                <Leaf className="h-3.5 w-3.5" /> Donasi
              </button>
            </Link>
          </div>
        </section> */}

        {/* ── Event Organizer CTA ── */}
        <section className="home-section-organizer border border-[#bae6fd] bg-[linear-gradient(135deg,#e0f2fe_0%,#dbeafe_100%)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: "#0194f3", boxShadow: "0 8px 20px rgba(1,148,243,0.30)" }}>
              <Ticket className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-0.5">Ingin Mengadakan Event?</h2>
              <p className="text-gray-600 text-sm">Konsultasikan kebutuhan event Anda bersama tim kami dan dapatkan penawaran terbaik.</p>
            </div>
          </div>
          <a
            href={NEMPO_CONSULT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-md text-white"
            style={{ background: "#0194f3", boxShadow: "0 4px 12px rgba(1,148,243,0.35)" }}
          >
            Hubungi Tim via DM Instagram
          </a>
        </section>

        {/* ══ BRAND PARTNERS ══════════════════════════════════════════════════════ */}
        {(() => {
          const brands = partnersDb.length > 0 ? partnersDb : [
            { name: "Temu Tarung",  color: "#e63946" },
            { name: "Kopi Jaya",    color: "#c77c3c" },
            { name: "Domusa",       color: "#7b61ff" },
            { name: "Biang Coffee", color: "#a0522d" },
            { name: "Nazumi Cafe",  color: "#2a9d8f" },
            { name: "GGS Beauty",   color: "#d6336c" },
          ];
          const items = [...brands, ...brands];
          return (
            <div className="home-section-partners relative overflow-hidden py-2">
              <style>{`
                @keyframes bp-scroll {
                  from { transform: translateX(0); }
                  to   { transform: translateX(-50%); }
                }
                .bp-track { animation: bp-scroll 32s linear infinite; }
                .bp-brand {
                  display: inline-flex;
                  align-items: baseline;
                  gap: 5px;
                  cursor: default;
                  white-space: nowrap;
                  transition: opacity 0.3s ease;
                  opacity: 0.5;
                }
                .bp-brand:hover { opacity: 1; }
                .bp-brand:hover .bp-word-accent {
                  text-shadow: 0 0 28px color-mix(in srgb, var(--bc) 70%, transparent);
                }
                .bp-word-thin {
                  font-size: 11px;
                  font-weight: 400;
                  letter-spacing: 0.25em;
                  text-transform: uppercase;
                  color: #475569;
                  align-self: center;
                  padding-top: 2px;
                }
                .bp-word-accent {
                  font-size: 20px;
                  font-weight: 900;
                  letter-spacing: 0.04em;
                  text-transform: uppercase;
                  font-style: italic;
                  color: var(--bc);
                  transition: text-shadow 0.3s ease;
                  line-height: 1;
                }
              `}</style>

              {/* label */}
              <div className="flex items-center justify-center pt-4 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Mitra Kami</span>
              </div>

              {/* marquee */}
              <div className="relative overflow-hidden py-3">
                <div
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
                  style={{ background: "linear-gradient(to right, white, transparent)" }}
                />
                <div
                  className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
                  style={{ background: "linear-gradient(to left, white, transparent)" }}
                />

                <div className="bp-track flex items-center px-4" style={{ width: "max-content", gap: "36px" }}>
                  {items.map((b, i) => {
                    const parts = b.name.split(" ");
                    const thin = parts.length > 1 ? parts.slice(0, -1).join(" ") : null;
                    const bold = parts[parts.length - 1];
                    return (
                      <span key={i} className="flex items-center shrink-0" style={{ gap: "36px" }}>
                        <span
                          className="bp-brand select-none"
                          style={{ "--bc": b.color } as React.CSSProperties}
                        >
                          {thin && <span className="bp-word-thin">{thin}</span>}
                          <span className="bp-word-accent">{bold}</span>
                        </span>
                        <span style={{ color: "#cbd5e1", fontSize: 10, letterSpacing: "0.1em" }}>◆</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

    </Layout>

    {showCafeModal && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        onClick={() => setShowCafeModal(false)}
      >
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: "min(88vw, 360px)",
            maxHeight: "78vh",
            borderRadius: 28,
            background: "linear-gradient(160deg, #fffbf5 0%, #fef3e2 60%, #fef9ee 100%)",
            border: "1.5px solid rgba(251,191,36,0.45)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #92400e, transparent)" }} />
          <div className="pointer-events-none absolute -bottom-10 -left-6 w-36 h-36 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #d97706, transparent)" }} />

          <button
            onClick={() => setShowCafeModal(false)}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(146,64,14,0.12)", color: "#92400e" }}
            aria-label="Tutup"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <div className="flex items-center gap-3 px-5 pt-5 pb-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 55%, #d97706 100%)", boxShadow: "0 4px 14px rgba(180,83,9,0.36)" }}>
              <Coffee className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-gray-900 font-black text-base leading-tight">Upcoming Event</h2>
              <p className="text-amber-600/80 text-[10px] font-bold uppercase tracking-[0.10em] mt-0.5">Jangan sampai ketinggalan</p>
            </div>
          </div>

          <div className="mx-5 border-t border-amber-100" />

          <div className="px-5 pt-4 pb-5 overflow-y-auto flex-1">
            {modalHasCafe ? (
              <div className="flex flex-col gap-3">
                {modalCafeEvents.slice(0, 4).map(ev => <CafeEventCard key={ev.id} ev={ev} />)}
                <Link href="/event" onClick={() => setShowCafeModal(false)}
                  className="w-full flex items-center justify-center gap-1 py-2.5 rounded-2xl text-xs font-bold"
                  style={{ background: "rgba(146,64,14,0.09)", color: "#92400e" }}>
                  Semua Event <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #fef3e2, #fde68a40)" }}>
                  <Coffee className="w-8 h-8 text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-sm leading-snug mb-2">Belum ada acara aktif saat ini</p>
                  <p className="text-gray-500 text-[11.5px] leading-relaxed">
                    Nobar Persib, live acoustic, arisan komunitas, talkshow — jadwalkan acaramu bersama kami!
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <a href={NEMPO_CONSULT_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #b45309, #d97706)", boxShadow: "0 4px 14px rgba(180,83,9,0.30)" }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Jadwalkan Acara
                  </a>
                  <Link href="/event" onClick={() => setShowCafeModal(false)}
                    className="inline-flex items-center justify-center gap-1 w-full py-2.5 rounded-2xl text-xs font-semibold"
                    style={{ background: "rgba(146,64,14,0.09)", color: "#92400e" }}>
                    Event Lainnya <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
