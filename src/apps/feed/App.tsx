import gscLogoAsset from '@/assets/good-story-cafe-logo.jpg.asset.json';
import slide32VideoAsset from '@/assets/nempo-feed-slide-32.mp4.asset.json';
import {
  FaFileExcel,
  FaFileWord,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa6';
import { SiCanvas, SiGoogledocs } from 'react-icons/si';
import kamalCvProfileImage from '@/assets/generated_images/nempo-feed-kamal-profile.png';
import raniCvProfileImage from '@/assets/generated_images/nempo-feed-rani-profile.png';
import sangkuriangBackground from '@/assets/generated_images/cerita/sangkuriang-background-20.webp';
import sangkuriangBackground21 from '@/assets/generated_images/cerita/sangkuriang-background-21.webp';
import sangkuriangBackground22 from '@/assets/generated_images/cerita/sangkuriang-background-22.webp';
import sangkuriangBackground23 from '@/assets/generated_images/cerita/sangkuriang-background-23.webp';
import sangkuriangBackground24 from '@/assets/generated_images/cerita/sangkuriang-background-24.webp';
import sangkuriangBackground27 from '@/assets/generated_images/cerita/sangkuriang-background-27.png';
import sangkuriangCoverImage from '@/assets/generated_images/cerita/sangkuriang.jpg';
import {
  Archive,
  BriefcaseBusiness,
  Check,
  Code2,
  Clock3,
  Database,
  Download,
  Globe2,
  Headset,
  Languages,
  Mail,
  MapPin,
  MonitorCog,
  Palette,
  Phone,
  ScanEye,
  ShieldCheck,
  UsersRound,
  LoaderCircle,
} from 'lucide-react';
import { toCanvas, toSvg } from 'html-to-image';
import { domToCanvas } from 'modern-screenshot';
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { SlideTenLove as ScrapbookSlideTenLove } from './components/SlideTenLove';
import { SlideElevenGreetingPrice } from './components/SlideElevenGreetingPrice';
import { SlideTwelveLove } from './components/SlideTwelveLove';
import { SlideThirteenLoveLetter } from './components/SlideThirteenLoveLetter';
import { SlideFifteenProductPoster } from './components/SlideFifteenProductPoster';
import { SlideSixteenPosterExample } from './components/SlideSixteenPosterExample';
import { SlideEighteenDancePhoto } from './components/SlideEighteenDancePhoto';
import { SlideSangkuriangComic } from './components/SlideSangkuriangComic';
import { SlideSangkuriangCover } from './components/SlideSangkuriangCover';
import { SlideTwentyNineCafeCover } from './components/SlideTwentyNineCafeCover';
import { SlideThirtySumpahPemuda } from './components/SlideThirtySumpahPemuda';
import { SlideThirtyOneBackground } from './components/SlideThirtyOneBackground';
import { renderNempoSlide20Png } from './lib/renderNempoSlide20Png';
import {
  GgsBeautySlideOne,
  GgsBeautyStorySlideTwo,
} from './components/GgsBeautySlideOne';
import { GgsBeautyStorySlideThree } from './components/GgsBeautyStorySlideThree';
import { GgsBeautyContentSlide } from './components/GgsBeautyContentSlide';
import { GgsCouponDesigner } from './components/GgsCouponDesigner';
import { GgsQCardCover } from './components/GgsQCardCover';
import { GgsBeautyPhotobooth } from './components/GgsBeautyPhotobooth';
import { GgsMemberCardDesigner } from './components/GgsMemberCardDesigner';
import { Ggs2027Calendar } from './components/Ggs2027Calendar';

const SpreadsheetViewer = lazy(async () => {
  const module = await import('./components/SpreadsheetViewer');
  return { default: module.SpreadsheetViewer };
});

const assetBase = "/nempo-feed/";
type FeedSlide =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32;

type ClientSlide = 1 | 2 | 3 | 4 | 5 | 6;

const cafes = [
  {
    number: '01',
    name: 'Two Days Coffee & Space',
    image: `${assetBase}assets/cafe-cards/two-days-vintage.jpg`,
    imageAlt: 'Ilustrasi interior kafe vintage bernuansa hangat, bukan foto lokasi Two Days.',
    story:
      'Suasana malam bernuansa vintage untuk ngopi lama dan foto-foto.',
    fit: 'VINTAGE NIGHT',
  },
  {
    number: '02',
    name: 'Gudras',
    image: `${assetBase}assets/cafe-cards/gudras-vintage.jpg`,
    imageAlt: 'Ilustrasi sudut kafe retro dengan dekorasi klasik, bukan foto lokasi Gudras.',
    story:
      'Detail retro jadi latar foto yang beda, lalu lanjut nongkrong santai.',
    fit: 'DETAIL RETRO',
  },
  {
    number: '03',
    name: 'Serloka',
    image: `${assetBase}assets/cafe-cards/serloka-vintage.jpg`,
    imageAlt: 'Ilustrasi sudut foto kafe vintage, bukan foto lokasi Serloka.',
    story:
      'Sudut klasik buat foto bareng dan menikmati waktu tanpa buru-buru.',
    fit: 'FOTO BARENG',
  },
];

function TravelingOtter() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" fill="#f8e8c8" opacity="0.96" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="#f9c74f"
        strokeWidth="1.5"
        strokeDasharray="2 4"
        opacity="0.85"
      />

      <path
        d="M66 26c8 4 12 11 12 20v29H57V38c0-7 3-11 9-12Z"
        fill="#d87845"
        stroke="#183f4d"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M63 34h13M62 41h15M62 48h15"
        fill="none"
        stroke="#f7c46d"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M72 25c1-6 5-9 10-10l-1 12"
        fill="none"
        stroke="#183f4d"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M79 15c4 1 6 4 6 7-3 0-6-2-7-5"
        fill="#f9c74f"
        stroke="#183f4d"
        strokeWidth="1.8"
      />

      <path
        d="M26 72c-4-10-1-22 8-28 5-4 13-5 20-2 9 4 14 13 12 25l-2 9H31l-5-4Z"
        fill="#a86643"
        stroke="#183f4d"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 68c-8 4-12 10-14 16 8 3 17-1 22-8"
        fill="#a86643"
        stroke="#183f4d"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62 65c6 1 11 5 13 11-8 3-16 1-21-5"
        fill="#a86643"
        stroke="#183f4d"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="43" cy="39" r="16" fill="#b97850" stroke="#183f4d" strokeWidth="2.4" />
      <circle cx="33" cy="27" r="6" fill="#b97850" stroke="#183f4d" strokeWidth="2.2" />
      <circle cx="54" cy="27" r="6" fill="#b97850" stroke="#183f4d" strokeWidth="2.2" />
      <circle cx="35" cy="27" r="2.5" fill="#f1c08a" />
      <circle cx="52" cy="27" r="2.5" fill="#f1c08a" />
      <circle cx="38" cy="38" r="1.8" fill="#183f4d" />
      <circle cx="49" cy="38" r="1.8" fill="#183f4d" />
      <path
        d="M41 44c3 2 7 2 10 0-1 6-9 7-10 0Z"
        fill="#f1c08a"
        stroke="#183f4d"
        strokeWidth="1.5"
      />
      <path
        d="M38 53c5 3 11 3 16 0"
        fill="none"
        stroke="#f9c74f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M51 54c1 4 5 7 9 8"
        fill="none"
        stroke="#183f4d"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M39 68c4 3 11 4 16 1"
        fill="none"
        stroke="#f1c08a"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29 76c3 3 7 4 11 3M49 78c4 2 8 1 11-1"
        fill="none"
        stroke="#183f4d"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WestJavaFooterArt() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[40%] overflow-hidden">
      <img
        src={`${assetBase}assets/nempo-jabar-otter-footer-transparent.png`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 22%, black 100%)',
        }}
      />
    </div>
  );
}

function BlueTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-soft-light"
      aria-hidden="true"
      style={{
        backgroundImage:
          'radial-gradient(circle at 16% 24%, rgba(255,255,255,0.72) 0 0.7px, transparent 0.9px), radial-gradient(circle at 72% 68%, rgba(0,45,90,0.7) 0 0.8px, transparent 1px), repeating-linear-gradient(118deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 7px)',
        backgroundSize: '11px 13px, 17px 19px, auto',
      }}
    />
  );
}

function FeedMotif() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <div className="absolute -right-8 top-[19%] h-32 w-32 rounded-full border border-white/10" />
      <div className="absolute right-[8%] top-[24%] h-14 w-14 rounded-full border border-[#ffdd00]/20" />
      <p className="absolute -right-[2%] top-[41%] rotate-90 text-[9px] font-black tracking-[0.4em] text-white/[0.12]">
        NEMPO
      </p>
    </div>
  );
}

function CompactFooterArt() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30%] overflow-hidden opacity-[0.82]">
      <img
        src={`${assetBase}assets/nempo-footer-user-transparent.png`}
        alt=""
        className="absolute bottom-0 left-0 h-auto w-full max-w-none"
        style={{
          filter: 'saturate(0.82) brightness(0.94)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 24%, black 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 24%, black 100%)',
        }}
      />
    </div>
  );
}

function CvSectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-1 flex items-center gap-1.5">
      <span className="h-px w-2.5 shrink-0 bg-[#a52b45]" />
      <h3 className="whitespace-nowrap text-[5px] font-black uppercase leading-none tracking-[0.11em] text-[#292a28] sm:text-[6px]">
        {children}
      </h3>
    </div>
  );
}

const slideFourExperience = [
  {
    role: 'Staf Administrasi',
    date: '2023–2024',
    place: 'Toko Sinar Jaya · Garut',
    detail:
      'Mengelola arsip dan transaksi harian, memeriksa kelengkapan dokumen, serta membantu pelanggan mendapatkan informasi produk.',
  },
  {
    role: 'Asisten Administrasi',
    date: '2022',
    place: 'Praktik kerja lapangan · Garut',
    detail:
      'Menginput data, menata berkas, menyiapkan dokumen, dan membantu kebutuhan administrasi harian.',
  },
  {
    role: 'Relawan Administrasi',
    date: '2021',
    place: '',
    detail:
      'Membantu pencatatan dan persiapan kegiatan warga di lingkungan setempat.',
  },
];

const slideFourTechnicalSkills = [
  { label: 'Microsoft Office', Icon: MonitorCog },
  { label: 'Administrasi', Icon: BriefcaseBusiness },
  { label: 'Input data', Icon: Database },
  { label: 'Pengarsipan', Icon: Archive },
  { label: 'Layanan pelanggan', Icon: Headset },
];

const slideFourSoftSkills = [
  { label: 'Komunikasi dan kerja tim', Icon: UsersRound },
  { label: 'Teliti dan terorganisir', Icon: ScanEye },
  { label: 'Manajemen waktu', Icon: Clock3 },
  { label: 'Adaptif dan bertanggung jawab', Icon: ShieldCheck },
];

const slideFourSoftware = [
  { label: 'Word', Icon: FaFileWord, color: '#2b579a' },
  { label: 'Excel', Icon: FaFileExcel, color: '#217346' },
  { label: 'Google Docs', Icon: SiGoogledocs, color: '#4285f4' },
  { label: 'Canva', Icon: SiCanvas, color: '#00a8cc' },
];

function SlideFourCv() {
  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-[#c9c9c5] bg-[#efefec] text-left text-[#292a28] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 18% 16%, rgba(45,43,40,0.05) 0 0.6px, transparent 0.9px), radial-gradient(circle at 82% 72%, rgba(45,43,40,0.04) 0 0.7px, transparent 1px), repeating-linear-gradient(0deg, rgba(80,76,69,0.01) 0 1px, transparent 1px 4px)',
        backgroundSize: '11px 13px, 17px 19px, auto',
      }}
    >
      <span className="pointer-events-none absolute left-[5%] top-[4%] h-2 w-2 border-l border-t border-dashed border-[#777]/60" />

      <div className="relative grid h-full w-full grid-cols-[0.94fr_1.06fr] gap-2.5 p-2.5 sm:gap-3 sm:p-3">
        <div className="flex min-h-0 flex-col justify-between gap-1">
          <div className="flex shrink-0 flex-col">
            <div className="relative mx-auto aspect-[0.72] w-[74%] shrink-0">
              <span className="absolute -right-[18%] top-[18%] z-0 text-[42px] font-black leading-none tracking-[-0.09em] text-transparent sm:text-[50px] [-webkit-text-stroke:0.7px_rgba(65,63,61,0.32)]">
                RK
              </span>
              <div className="absolute inset-0 z-10 overflow-hidden bg-[#d4d4d1]">
              <img
                src={raniCvProfileImage}
                alt="Foto profil Rani Kurniawati"
                className="h-full w-full object-cover grayscale"
                style={{ objectPosition: 'center 30%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
              </div>
              <span className="absolute -left-1 -top-1 z-20 h-2 w-2 border-l border-t border-dashed border-[#777]/70" />
              <span className="absolute bottom-0 right-0 z-20 h-2 w-2 border-b border-r border-dashed border-[#777]/70" />
            </div>

            <section className="mt-2 border-b border-[#777]/40 pb-1">
              <h2 className="whitespace-nowrap text-[12px] font-black leading-none tracking-[-0.045em] text-[#292a28] sm:text-[15px]">
                Rani Kurniawati
              </h2>
              <p className="mt-1 text-[5px] font-bold uppercase tracking-[0.15em] text-[#5e5c59] sm:text-[6px]">
                Staf Administrasi
              </p>
            </section>
          </div>

          <section>
            <CvSectionTitle>Tentang saya</CvSectionTitle>
            <p className="text-[4.8px] leading-[1.28] text-[#444442] sm:text-[5.7px]">
              Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
              Terbiasa mengelola dokumen, mencatat data, dan membantu pelanggan.
              Mampu bekerja mandiri maupun bersama tim, cepat beradaptasi, serta
              siap belajar hal baru.
            </p>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Kontak</CvSectionTitle>
            <div className="grid grid-cols-2 gap-x-1 gap-y-1">
              {[
                { Icon: Phone, value: '08xx-xxxx-xxxx' },
                { Icon: Mail, value: 'rani.kurniawati@example.com' },
                { Icon: MapPin, value: 'Garut, Jawa Barat' },
                { Icon: Globe2, value: 'rani-kurniawati.example' },
              ].map(({ Icon, value }) => (
                <div key={value} className="flex min-w-0 items-center gap-1">
                  <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full bg-[#a32348]/10 text-[#a32348]">
                    <Icon className="h-1.5 w-1.5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="truncate text-[3.8px] leading-tight text-[#454442] sm:text-[4.5px]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Pengalaman kerja</CvSectionTitle>
            <div className="space-y-1">
              {slideFourExperience.map((item) => (
                <div key={item.role}>
                  <p className="text-[4.8px] font-bold leading-tight text-[#30302e] sm:text-[5.6px]">
                    {item.role}{' '}
                    <span className="font-semibold text-[#a32348]">
                      {item.date}
                    </span>
                  </p>
                  {item.place && (
                    <p className="mt-0.5 text-[4px] leading-tight text-[#66645f] sm:text-[4.6px]">
                      {item.place}
                    </p>
                  )}
                  <p className="mt-0.5 text-[4.2px] leading-[1.2] text-[#555350] sm:text-[4.8px]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex min-h-0 flex-col justify-between gap-1 border-l border-dashed border-[#777]/45 pl-2 sm:pl-2.5">
          <section>
            <CvSectionTitle>Keahlian teknis</CvSectionTitle>
            <div className="grid grid-cols-2 gap-x-1 gap-y-1 text-[4.5px] leading-[1.2] text-[#4c4a47] sm:text-[5.2px]">
              {slideFourTechnicalSkills.map(({ label, Icon }) => (
                <span key={label} className="flex min-w-0 items-center gap-1">
                  <Icon
                    className="h-1.5 w-1.5 shrink-0 text-[#a32348]"
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap leading-none">{label}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Soft skills</CvSectionTitle>
            <ul className="space-y-0.5 text-[4.5px] leading-[1.2] text-[#444442] sm:text-[5.2px]">
              {slideFourSoftSkills.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-1">
                  <Icon
                    className="h-1.5 w-1.5 shrink-0 text-[#a32348]"
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap leading-none">{label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Bahasa & minat</CvSectionTitle>
            <ul className="space-y-0.5 text-[4.5px] leading-[1.2] text-[#444442] sm:text-[5.2px]">
              {['Indonesia', 'Sunda', 'Inggris dasar'].map((language) => (
                <li key={language} className="flex items-center gap-1">
                  <Globe2
                    className="h-1.5 w-1.5 shrink-0 text-[#a32348]"
                    strokeWidth={2.1}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap leading-none">{language}</span>
                </li>
              ))}
            </ul>
            <p className="mt-0.5 text-[4.2px] leading-[1.25] text-[#66645f] sm:text-[4.8px]">
              Minat: Membaca · desain · kegiatan sosial
            </p>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Pendidikan</CvSectionTitle>
            <div className="flex items-start gap-1.5">
              <span className="border-r border-[#a32348] pr-1 text-[4.8px] font-black leading-[1.05] text-[#a32348] sm:text-[5.5px]">
                20<br />23
              </span>
              <div>
                <p className="text-[4.8px] font-bold leading-tight text-[#30302e] sm:text-[5.6px]">
                  SMK Negeri 1 Garut
                </p>
                <p className="mt-0.5 text-[4.2px] leading-[1.2] text-[#555350] sm:text-[4.8px]">
                  Otomatisasi dan Tata Kelola Perkantoran · 2020–2023
                </p>
                <p className="mt-0.5 text-[4px] leading-[1.2] text-[#66645f] sm:text-[4.5px]">
                  Prestasi: Siswa teladan · Lulus dengan baik
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Pelatihan</CvSectionTitle>
            <div className="space-y-0.5 text-[4.3px] leading-[1.2] text-[#555350] sm:text-[4.9px]">
              <p><span className="font-bold text-[#30302e]">Microsoft Excel Dasar</span> · 2023</p>
              <p><span className="font-bold text-[#30302e]">Pelayanan Pelanggan</span> · 2022</p>
            </div>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Proyek & organisasi</CvSectionTitle>
            <p className="text-[4.2px] leading-[1.2] text-[#555350] sm:text-[4.8px]">
              Membantu menyusun arsip kegiatan sekolah dan menjadi panitia
              administrasi acara kelas.
            </p>
          </section>

          <section className="border-t border-dashed border-[#777]/45 pt-1">
            <CvSectionTitle>Software</CvSectionTitle>
            <div className="grid grid-cols-4 gap-1 text-center">
              {slideFourSoftware.map(({ label, Icon, color }) => (
                <div key={label} className="flex flex-col items-center">
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-[#777]/10 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  >
                    <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color }} />
                  </span>
                  <p className="mt-[2px] text-[3.8px] leading-tight text-[#686560] sm:text-[4.4px]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex items-center justify-between border-t border-[#777]/35 pt-1 text-[3.8px] font-bold uppercase tracking-[0.08em] text-[#77736f] sm:text-[4.4px]">
            <span>Profil profesional</span>
            <span className="text-[#a32348]">Nempo Karir</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

function SlideFiveSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-0.5 flex items-center gap-1.5 sm:mb-1">
      <span className="h-2 w-[1.5px] shrink-0 rounded-full bg-[#16817c]" />
      <h3 className="whitespace-nowrap text-[5px] font-black uppercase leading-none tracking-[0.1em] text-[#183f42] sm:text-[6px]">
        {children}
      </h3>
    </div>
  );
}

function SlideFiveCv() {
  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative translate-y-2 scale-[0.92] flex aspect-[0.75] w-full max-w-[430px] overflow-hidden border border-[#d4dfdc] bg-[#f8faf8] text-left text-[#253b3b] shadow-[0_12px_30px_rgba(0,0,0,0.3)] sm:scale-100 sm:w-[86%]"
    >
      <div className="grid h-full w-full grid-rows-[0.27fr_0.73fr]">
        <header className="grid min-h-0 grid-cols-[0.34fr_0.66fr] gap-2.5 bg-[#123f46] p-2.5 text-white sm:gap-3 sm:p-3">
          <div className="relative aspect-square w-full self-center overflow-hidden rounded-[3px] border border-white/30 bg-[#d9e6e2]">
            <img
              src={raniCvProfileImage}
              alt="Foto profil Rani Kurniawati"
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <span className="mb-1 w-fit border-b border-[#a6d8cc]/60 pb-0.5 text-[3.8px] font-bold uppercase tracking-[0.14em] text-[#c8e7df] sm:text-[4.4px]">
              Curriculum Vitae
            </span>
            <h2 className="text-[12px] font-black leading-none tracking-[-0.04em] sm:text-[15px]">
              Rani Kurniawati
            </h2>
            <p className="mt-1 text-[5px] font-bold uppercase tracking-[0.16em] text-[#a6d8cc] sm:text-[6px]">
              Staf Administrasi
            </p>
            <div className="mt-2 grid min-w-0 grid-cols-2 gap-x-2 gap-y-1 text-[3.8px] leading-tight text-white/85 sm:text-[4.5px]">
              <span className="flex min-w-0 items-center gap-1">
                <Phone className="h-1.5 w-1.5 shrink-0 text-[#a6d8cc]" aria-hidden="true" />
                <span className="truncate">08xx-xxxx-xxxx</span>
              </span>
              <span className="flex min-w-0 items-center gap-1">
                <MapPin className="h-1.5 w-1.5 shrink-0 text-[#a6d8cc]" aria-hidden="true" />
                <span className="truncate">Garut, Jawa Barat</span>
              </span>
              <span className="col-span-2 flex min-w-0 items-center gap-1">
                <Mail className="h-1.5 w-1.5 shrink-0 text-[#a6d8cc]" aria-hidden="true" />
                <span className="truncate">rani.kurniawati@example.com</span>
              </span>
            </div>
          </div>
        </header>

        <div className="grid min-h-0 grid-cols-[1fr_1fr] gap-2.5 p-2.5 pb-0 sm:grid-cols-[0.82fr_1.18fr] sm:gap-3 sm:p-3 sm:pb-3">
          <aside className="flex min-h-0 flex-col justify-start gap-px rounded-t-[5px] rounded-b-none bg-[#eaf3ef] p-1 sm:gap-1 sm:rounded-[5px] sm:p-2">
            <section>
              <SlideFiveSectionTitle>Profil</SlideFiveSectionTitle>
              <p className="text-[3.8px] leading-[1.2] text-[#4c5d5a] sm:text-[5px] sm:leading-[1.3]">
                Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
                Berpengalaman mendukung operasional toko, mengelola arsip,
                transaksi, dan data pelanggan. Terbiasa bekerja rapi serta
                menjaga kelengkapan dokumen.
              </p>
            </section>

            <section>
              <SlideFiveSectionTitle>Keahlian</SlideFiveSectionTitle>
              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                {[
                  'Administrasi',
                  'Microsoft Office',
                  'Input data',
                  'Pengarsipan',
                  'Layanan pelanggan',
                  'Surat-menyurat',
                  'Rekap transaksi',
                  'Dokumentasi',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-[2px] border border-[#d5e3dd] bg-white/70 px-1 py-[1px] text-[3.8px] font-semibold leading-tight text-[#245b55] sm:px-1.5 sm:py-0.5 sm:text-[4.4px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SlideFiveSectionTitle>Soft skills</SlideFiveSectionTitle>
              <ul className="space-y-0.5 text-[4px] leading-[1.2] text-[#4c5d5a] sm:space-y-1 sm:text-[4.6px]">
                {[
                  { label: 'Komunikasi dan kerja tim', Icon: UsersRound },
                  { label: 'Teliti dan terorganisir', Icon: ScanEye },
                  { label: 'Manajemen waktu', Icon: Clock3 },
                  { label: 'Adaptif dan bertanggung jawab', Icon: ShieldCheck },
                ].map(({ label, Icon }) => (
                  <li key={label} className="flex items-center gap-1">
                    <Icon
                      className="h-1.5 w-1.5 shrink-0 text-[#16817c]"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SlideFiveSectionTitle>Pendidikan</SlideFiveSectionTitle>
              <p className="text-[4.6px] font-bold leading-tight text-[#263c3a] sm:text-[5.2px]">
                SMK Negeri 1 Garut
              </p>
              <p className="mt-0.5 text-[4px] leading-[1.25] text-[#596966] sm:text-[4.6px]">
                Otomatisasi dan Tata Kelola Perkantoran · 2020–2023
              </p>
            </section>

            <section>
              <SlideFiveSectionTitle>Bahasa & minat</SlideFiveSectionTitle>
              <p className="text-[4px] leading-[1.3] text-[#4c5d5a] sm:text-[4.6px]">
                Indonesia · Sunda · Inggris dasar
                <br />
                Membaca · desain · kegiatan sosial
              </p>
            </section>

            <section className="border-t border-[#c9d8d4] pt-1.5">
              <SlideFiveSectionTitle>Software</SlideFiveSectionTitle>
              <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                {slideFourSoftware.map(({ label, Icon, color }) => (
                  <span key={label} className="flex min-w-0 items-center gap-1">
                    <Icon
                      className="h-2 w-2 shrink-0"
                      style={{ color }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-[3.8px] leading-tight text-[#4c5d5a] sm:text-[4.4px]">
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          </aside>

          <div className="flex min-h-0 flex-col justify-start gap-0.5 sm:justify-between sm:gap-2">
            <section>
              <SlideFiveSectionTitle>Pengalaman kerja</SlideFiveSectionTitle>
              <div className="relative ml-0.5 space-y-1.5 border-l border-[#16817c]/40 pl-2.5">
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full bg-[#16817c]" />
                  <p className="text-[4.6px] font-bold leading-tight text-[#263c3a] sm:text-[5.2px]">
                    Staf Administrasi <span className="font-medium text-[#16817c]">· 2023–2024</span>
                  </p>
                  <p className="mt-0.5 text-[4px] leading-tight text-[#687572] sm:text-[4.6px]">
                    Toko Sinar Jaya · Garut
                  </p>
                  <p className="mt-0.5 text-[4px] leading-[1.25] text-[#4c5d5a] sm:text-[4.6px]">
                    Merapikan arsip dan memeriksa dokumen transaksi, membuat
                    rekap harian, serta membantu pelanggan memperoleh informasi produk.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full bg-[#16817c]" />
                  <p className="text-[4.6px] font-bold leading-tight text-[#263c3a] sm:text-[5.2px]">
                    Asisten Administrasi <span className="font-medium text-[#16817c]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4px] leading-[1.25] text-[#4c5d5a] sm:text-[4.6px]">
                    Praktik kerja lapangan · Garut. Memasukkan data, memeriksa
                    kelengkapan berkas, menata dokumen, dan menyiapkan kebutuhan administrasi.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[13px] top-0.5 h-1.5 w-1.5 rounded-full bg-[#16817c]" />
                  <p className="text-[4.6px] font-bold leading-tight text-[#263c3a] sm:text-[5.2px]">
                    Relawan Administrasi <span className="font-medium text-[#16817c]">· 2021</span>
                  </p>
                  <p className="mt-0.5 text-[4px] leading-[1.25] text-[#4c5d5a] sm:text-[4.6px]">
                    Membantu pencatatan, menyiapkan daftar kebutuhan, dan
                    berkoordinasi dengan panitia kegiatan warga.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-[#c9d8d4] pt-1.5">
              <SlideFiveSectionTitle>Pelatihan</SlideFiveSectionTitle>
              <div className="space-y-1 text-[4px] leading-[1.3] text-[#4c5d5a] sm:text-[4.6px]">
                <p>
                  <strong className="text-[#263c3a]">Microsoft Excel Dasar</strong> · 2023
                  <br />
                  Menyusun tabel, mengelola data, dan membuat rekap sederhana.
                </p>
                <p>
                  <strong className="text-[#263c3a]">Pelayanan Pelanggan</strong> · 2022
                  <br />
                  Komunikasi yang sopan dan responsif dalam melayani pelanggan.
                </p>
              </div>
            </section>

            <section className="border-t border-[#c9d8d4] pt-1.5">
              <SlideFiveSectionTitle>Proyek & organisasi</SlideFiveSectionTitle>
              <p className="text-[4px] leading-[1.3] text-[#4c5d5a] sm:text-[4.6px]">
                Panitia administrasi acara kelas: membantu menyusun arsip,
                menyiapkan daftar kebutuhan, dan menjaga dokumen kegiatan tetap teratur.
              </p>
            </section>

            <section className="border-t border-[#c9d8d4] pt-1.5">
              <SlideFiveSectionTitle>Pencapaian</SlideFiveSectionTitle>
              <p className="text-[4px] leading-[1.3] text-[#4c5d5a] sm:text-[4.6px]">
                <strong className="text-[#263c3a]">Siswa teladan</strong>
                <br />
                Lulus dengan baik dari program Otomatisasi dan Tata Kelola Perkantoran.
              </p>
            </section>

            <footer className="mt-auto flex items-center justify-between border-t border-[#c9d8d4] pt-1 text-[3.8px] font-bold uppercase tracking-[0.08em] text-[#7a8985] sm:mt-0 sm:text-[4.4px]">
              <span>Profil profesional</span>
              <span className="text-[#16817c]">Nempo Karir</span>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}

function SlideSixSectionTitle({
  children,
  dark = false,
}: {
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mb-1 flex items-center gap-1.5">
      <span className={`h-2 w-[2px] shrink-0 ${dark ? 'bg-[#d3b675]' : 'bg-[#344e6b]'}`} />
      <h3
        className={`text-[5px] font-black uppercase leading-none tracking-[0.1em] sm:text-[6px] ${
          dark ? 'text-white/90' : 'text-[#263a52]'
        }`}
      >
        {children}
      </h3>
      <span className={`h-px flex-1 ${dark ? 'bg-white/20' : 'bg-[#d6dde3]'}`} />
    </div>
  );
}

function SlideSixCv() {
  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-[#d8dce0] bg-[#fbfaf7] text-left text-[#263a52] shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
    >
      <div className="grid h-full w-full grid-cols-[0.36fr_0.64fr]">
        <aside className="flex min-h-0 flex-col justify-between gap-2 bg-[#263a52] p-2.5 text-white sm:p-3">
          <div className="flex flex-col items-center text-center">
            <div className="aspect-square w-[72%] max-w-[100px] overflow-hidden border border-white/35 bg-[#dce1e4]">
              <img
                src={`${assetBase}assets/nempo-karir-hero.jpg`}
                alt="Foto profil Rani Kurniawati"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: '72% 25%',
                  transform: 'scale(1.5)',
                  transformOrigin: '68% 25%',
                }}
              />
            </div>
            <span className="mt-1.5 text-[4px] font-bold uppercase tracking-[0.16em] text-[#d3b675] sm:text-[4.6px]">
              Curriculum Vitae
            </span>
          </div>

          <section>
            <SlideSixSectionTitle dark>Kontak</SlideSixSectionTitle>
            <div className="space-y-1 text-[3.8px] leading-tight text-white/85 sm:text-[4.4px]">
              {[
                { Icon: Phone, value: '08xx-xxxx-xxxx' },
                { Icon: Mail, value: 'rani.kurniawati@example.com' },
                { Icon: MapPin, value: 'Garut, Jawa Barat' },
              ].map(({ Icon, value }) => (
                <div key={value} className="flex min-w-0 items-center gap-1">
                  <Icon className="h-1.5 w-1.5 shrink-0 text-[#d3b675]" aria-hidden="true" />
                  <span className="truncate">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SlideSixSectionTitle dark>Keahlian</SlideSixSectionTitle>
            <ul className="space-y-1 text-[3.8px] leading-tight text-white/85 sm:text-[4.4px]">
              {[
                { label: 'Administrasi perkantoran', Icon: BriefcaseBusiness },
                { label: 'Microsoft Office', Icon: MonitorCog },
                { label: 'Input data dan rekap', Icon: Database },
                { label: 'Pengarsipan dokumen', Icon: Archive },
                { label: 'Layanan pelanggan', Icon: Headset },
              ].map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-1">
                  <Icon className="h-1.5 w-1.5 shrink-0 text-[#d3b675]" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SlideSixSectionTitle dark>Software</SlideSixSectionTitle>
            <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
              {slideFourSoftware.map(({ label, Icon, color }) => (
                <span key={label} className="flex min-w-0 items-center gap-1">
                  <Icon
                    className="h-2 w-2 shrink-0"
                    style={{ color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-[3.8px] leading-tight text-white/85 sm:text-[4.4px]">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </section>

          <section>
            <SlideSixSectionTitle dark>Bahasa</SlideSixSectionTitle>
            <p className="text-[3.8px] leading-[1.35] text-white/85 sm:text-[4.4px]">
              Indonesia · Sunda
              <br />
              Inggris dasar
            </p>
          </section>

          <section>
            <SlideSixSectionTitle dark>Soft skills</SlideSixSectionTitle>
            <ul className="space-y-1 text-[3.8px] leading-tight text-white/85 sm:text-[4.4px]">
              {[
                { label: 'Komunikasi dan kerja tim', Icon: UsersRound },
                { label: 'Teliti dan terorganisir', Icon: ScanEye },
                { label: 'Manajemen waktu', Icon: Clock3 },
                { label: 'Adaptif dan bertanggung jawab', Icon: ShieldCheck },
              ].map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-1">
                  <Icon className="h-1.5 w-1.5 shrink-0 text-[#d3b675]" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="flex min-h-0 flex-col justify-between gap-2 p-2.5 sm:p-3">
          <header className="border-b-2 border-[#d3b675] pb-2">
            <p className="text-[4px] font-bold uppercase tracking-[0.18em] text-[#60758a] sm:text-[4.8px]">
              Curriculum Vitae
            </p>
            <h2 className="mt-1 text-[15px] font-black leading-[0.95] tracking-[-0.045em] text-[#263a52] sm:text-[18px]">
              Rani Kurniawati
            </h2>
            <p className="mt-1 text-[5px] font-bold uppercase tracking-[0.14em] text-[#526d82] sm:text-[6px]">
              Staf Administrasi
            </p>
          </header>

          <section>
            <SlideSixSectionTitle>Profil profesional</SlideSixSectionTitle>
            <p className="text-[4.2px] leading-[1.35] text-[#4e5c69] sm:text-[4.9px]">
              Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
              Berpengalaman mengelola dokumen, transaksi, dan data pelanggan
              serta mendukung kebutuhan administrasi harian. Terbiasa
              berkoordinasi dengan tim dan menjaga kerapian informasi.
            </p>
          </section>

          <section>
            <SlideSixSectionTitle>Pengalaman</SlideSixSectionTitle>
            <div className="space-y-1.5">
              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <p className="text-[4.6px] font-bold leading-tight text-[#263a52] sm:text-[5.2px]">
                    Staf Administrasi
                  </p>
                  <span className="shrink-0 text-[3.8px] font-semibold text-[#657a8b] sm:text-[4.4px]">
                    2023–2024
                  </span>
                </div>
                <p className="text-[4px] italic leading-tight text-[#657a8b] sm:text-[4.6px]">
                  Toko Sinar Jaya · Garut
                </p>
                <p className="mt-0.5 text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.6px]">
                  Menata arsip, memeriksa dokumen transaksi, membuat rekap
                  harian, membantu pelanggan, serta memastikan catatan tersimpan rapi.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <p className="text-[4.6px] font-bold leading-tight text-[#263a52] sm:text-[5.2px]">
                    Asisten Administrasi
                  </p>
                  <span className="shrink-0 text-[3.8px] font-semibold text-[#657a8b] sm:text-[4.4px]">
                    2022
                  </span>
                </div>
                <p className="text-[4px] italic leading-tight text-[#657a8b] sm:text-[4.6px]">
                  Praktik kerja lapangan · Garut
                </p>
                <p className="mt-0.5 text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.6px]">
                  Memasukkan data, merapikan berkas, dan menyiapkan dokumen
                  administrasi untuk mendukung kelancaran operasional kantor.
                </p>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <p className="text-[4.6px] font-bold leading-tight text-[#263a52] sm:text-[5.2px]">
                    Relawan Administrasi
                  </p>
                  <span className="shrink-0 text-[3.8px] font-semibold text-[#657a8b] sm:text-[4.4px]">
                    2021
                  </span>
                </div>
                <p className="mt-0.5 text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.6px]">
                  Membantu pencatatan, menyiapkan daftar kebutuhan, dan
                  berkoordinasi dengan panitia kegiatan warga.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SlideSixSectionTitle>Pendidikan</SlideSixSectionTitle>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[4.6px] font-bold leading-tight text-[#263a52] sm:text-[5.2px]">
                  SMK Negeri 1 Garut
                </p>
                <p className="mt-0.5 text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.6px]">
                  Otomatisasi dan Tata Kelola Perkantoran
                </p>
              </div>
              <span className="shrink-0 border-l border-[#d3b675] pl-1.5 text-[4px] font-bold leading-tight text-[#526d82] sm:text-[4.6px]">
                2020
                <br />— 2023
              </span>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-2 border-t border-[#d6dde3] pt-1.5">
            <div>
              <SlideSixSectionTitle>Pelatihan</SlideSixSectionTitle>
              <p className="text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.5px]">
                Excel Dasar · 2023
                <br />
                Mengolah tabel dan rekap data.
                <br />
                Pelayanan Pelanggan · 2022
                <br />
                Komunikasi layanan yang responsif.
              </p>
            </div>
            <div>
              <SlideSixSectionTitle>Organisasi</SlideSixSectionTitle>
              <p className="text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.5px]">
                Panitia administrasi acara kelas: menyiapkan daftar kebutuhan
                dan merapikan dokumen kegiatan.
              </p>
            </div>
          </section>

          <section>
            <SlideSixSectionTitle>Pencapaian</SlideSixSectionTitle>
            <p className="text-[4px] leading-[1.3] text-[#4e5c69] sm:text-[4.6px]">
              <strong className="text-[#263a52]">Siswa teladan</strong> · Lulus
              dengan baik dari program keahlian.
            </p>
          </section>

          <footer className="flex items-center justify-between border-t border-[#d6dde3] pt-1 text-[3.8px] font-bold uppercase tracking-[0.08em] text-[#7b8791] sm:text-[4.4px]">
            <span>Profil profesional</span>
            <span className="text-[#526d82]">Nempo Karir</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

function SlideSevenCv() {
  const coreSkills = [
    { label: 'Administrasi', Icon: BriefcaseBusiness },
    { label: 'Microsoft Office', Icon: MonitorCog },
    { label: 'Input data', Icon: Database },
    { label: 'Pengarsipan', Icon: Archive },
    { label: 'Layanan pelanggan', Icon: Headset },
  ];
  const softSkills = ['Komunikasi', 'Kerja tim', 'Teliti'];

  return (
    <article
      aria-label="Contoh CV Rani Kurniawati"
      className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-[#d7c9ba] bg-[#f5efeb] text-left text-[#171717] shadow-[0_12px_30px_rgba(0,0,0,0.3)] max-[640px]:aspect-[0.86] max-[640px]:w-[94%] max-[640px]:translate-y-0"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <div className="flex h-full w-full flex-col">
        <header className="relative grid min-h-[20%] shrink-0 grid-cols-[1fr_0.25fr] items-center gap-2.5 overflow-hidden border-b-2 border-[#171717] bg-[#f5efeb] px-3 py-2.5 text-[#171717] sm:gap-3 sm:px-4 sm:py-3">
          <span
            className="pointer-events-none absolute -right-3 -top-8 h-24 w-24 rounded-full border border-[#d71920]/15"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -right-1 -top-6 h-16 w-16 rounded-full border border-[#d71920]/20"
            aria-hidden="true"
          />
          <div className="relative z-10 min-w-0">
            <p className="mb-1 text-[4px] font-black uppercase tracking-[0.2em] text-[#d71920] sm:text-[4.8px]">
              Curriculum Vitae
            </p>
            <h2 className="font-['Bricolage_Grotesque',Arial,sans-serif] text-[14px] font-extrabold uppercase leading-[0.94] tracking-[-0.055em] sm:text-[18px]">
              Rani <span className="text-[#d71920]">Kurniawati</span>
            </h2>
            <p className="mt-1 w-fit whitespace-nowrap border-l-2 border-[#d71920] bg-[#eae2d8] px-1.5 py-0.5 text-[5px] font-bold uppercase leading-none tracking-[0.1em] text-[#28231f] sm:text-[6px]">
              Staf Administrasi
            </p>
            <div className="mt-2 grid grid-cols-2 items-center gap-x-2 gap-y-1 text-[5px] leading-none text-[#38332e] sm:text-[5.8px]">
              <span className="min-w-0">08xx-xxxx-xxxx</span>
              <span className="min-w-0 truncate">rani.kurniawati@example.com</span>
              <span className="min-w-0">Garut, Jawa Barat</span>
            </div>
          </div>
          <div className="relative z-10 aspect-[0.77] w-full overflow-hidden border border-[#171717] bg-[#eae2d8]">
            <img
              src={raniCvProfileImage}
              alt="Foto profil Rani Kurniawati"
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            <span className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-[#d71920]" aria-hidden="true" />
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[1.04fr_0.96fr] gap-2 p-2 sm:gap-3 sm:p-3">
          <div className="grid min-h-0 grid-rows-[1.25fr_0.52fr_1.08fr] gap-2">
            <section className="flex min-h-0 flex-col rounded-[3px] border border-[#dfd5c8] bg-white/65 p-2">
              <div className="mb-1.5 flex min-h-2 items-center gap-1.5 border-b border-[#d8cec2] pb-1">
                <span className="h-2 w-[2px] bg-[#d71920]" />
                <h3 className="whitespace-nowrap text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                  Pengalaman kerja
                </h3>
                <span className="ml-auto flex min-h-2 items-center text-[4.8px] font-bold leading-none text-[#d71920] sm:text-[5.5px]">
                  2021—2024
                </span>
              </div>
              <div className="relative ml-[3px] flex min-h-0 flex-1 flex-col gap-1 border-l border-[#d71920]/45 pl-3">
                <div className="relative">
                  <span className="absolute -left-[15px] top-0 h-2 w-2 rounded-full border border-white bg-[#d71920]" />
                  <p className="whitespace-nowrap text-[5.5px] font-bold leading-none text-[#171717] sm:text-[6.3px]">
                    Staf Administrasi <span className="text-[#d71920]">· 2023–2024</span>
                  </p>
                  <p className="mt-0.5 text-[4.8px] italic leading-none text-[#6d655d] sm:text-[5.5px]">
                    Toko Sinar Jaya · Garut
                  </p>
                  <p className="mt-0.5 text-[5px] leading-[1.15] text-[#4a453f] sm:text-[5.8px]">
                    Mengelola arsip, transaksi, rekap, dan layanan&nbsp;pelanggan.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[15px] top-0 h-2 w-2 rounded-full border border-white bg-[#d71920]" />
                  <p className="whitespace-nowrap text-[5.5px] font-bold leading-none text-[#171717] sm:text-[6.3px]">
                    Asisten Administrasi <span className="text-[#d71920]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.8px] italic leading-none text-[#6d655d] sm:text-[5.5px]">
                    Praktik kerja lapangan · Garut
                  </p>
                  <p className="mt-0.5 text-[5px] leading-[1.15] text-[#4a453f] sm:text-[5.8px]">
                    Input data dan menyiapkan dokumen.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[15px] top-0 h-2 w-2 rounded-full border border-white bg-[#d71920]" />
                  <p className="whitespace-nowrap text-[5.5px] font-bold leading-none text-[#171717] sm:text-[6.3px]">
                    Relawan Administrasi <span className="text-[#d71920]">· 2021</span>
                  </p>
                  <p className="mt-0.5 text-[5px] leading-[1.15] text-[#4a453f] sm:text-[5.8px]">
                    Mencatat kebutuhan dan koordinasi warga.
                  </p>
                </div>
              </div>
            </section>

            <section className="min-h-0 rounded-[3px] border border-[#dfd5c8] bg-white/65 p-1.5">
              <div className="mb-1.5 flex min-h-2 items-center gap-1.5 border-b border-[#d8cec2] pb-1">
                <span className="h-2 w-[2px] bg-[#d71920]" />
                <h3 className="text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                  Pendidikan
                </h3>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[5.7px] font-bold text-[#171717] sm:text-[6.5px]">
                    SMK Negeri 1 Garut
                  </p>
                  <p className="mt-0.5 text-[4.8px] leading-[1.35] text-[#4a453f] sm:text-[5.5px]">
                    Otomatisasi dan Tata Kelola Perkantoran
                  </p>
                </div>
                <span className="shrink-0 border-l border-[#d71920] pl-1.5 text-[4.8px] font-bold leading-tight text-[#d71920] sm:text-[5.5px]">
                  2020—2023
                </span>
              </div>
            </section>

            <section className="min-h-0 rounded-[3px] border border-[#dfd5c8] bg-white/65 p-2">
              <div className="mb-1.5 flex min-h-2 items-center gap-1.5 border-b border-[#d8cec2] pb-1">
                <span className="h-2 w-[2px] bg-[#d71920]" />
                <h3 className="text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                  Pelatihan & pengalaman organisasi
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border-l-2 border-[#d71920] pl-1.5">
                  <p className="text-[5.2px] font-bold text-[#171717] sm:text-[6px]">
                    Microsoft Excel Dasar <span className="font-medium text-[#d71920]">· 2023</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#4a453f] sm:text-[5.2px]">
                    Tabel & rekap sederhana.
                  </p>
                  <p className="mt-1 text-[5.2px] font-bold text-[#171717] sm:text-[6px]">
                    Pelayanan Pelanggan <span className="font-medium text-[#d71920]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#4a453f] sm:text-[5.2px]">
                    Komunikasi responsif.
                  </p>
                </div>
                <div className="border-l-2 border-[#d71920] pl-1.5">
                  <p className="text-[5.2px] font-bold text-[#171717] sm:text-[6px]">
                    Panitia administrasi <span className="font-medium text-[#d71920]">· 2022</span>
                  </p>
                  <p className="mt-0.5 text-[4.6px] text-[#4a453f] sm:text-[5.2px]">
                    Kegiatan kelas
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#4a453f] sm:text-[5.2px]">
                    Mendukung dokumen acara.
                  </p>
                  <p className="mt-1 text-[5.2px] font-bold text-[#171717] sm:text-[6px]">
                    Siswa teladan
                  </p>
                  <p className="mt-0.5 text-[4.6px] leading-tight text-[#4a453f] sm:text-[5.2px]">
                    Apresiasi prestasi.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="grid min-h-0 grid-rows-[0.52fr_1.3fr_0.56fr_0.54fr] gap-2 rounded-[3px] bg-[#eae2d8] p-2">
            <section className="min-h-0 overflow-hidden rounded-[3px] border-l-2 border-[#d71920] bg-white/60 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                Profil
              </h3>
              <p className="text-[5px] leading-[1.4] text-[#4a453f] sm:text-[5.8px]">
                Lulusan Administrasi Perkantoran yang teliti dan komunikatif.
                Terbiasa mengelola dokumen, data, dan kebutuhan pelanggan.
              </p>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[3px] border-l-2 border-[#d71920] bg-white/60 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                Keahlian
              </h3>
              <div className="grid grid-cols-2 gap-x-1.5 gap-y-1">
                {coreSkills.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className={`flex min-w-0 items-center gap-1 text-[4.5px] font-semibold leading-tight text-[#34302c] sm:text-[5.2px] ${
                      label === 'Layanan pelanggan' ? 'col-span-2 whitespace-nowrap' : ''
                    }`}
                  >
                    <Icon className="h-2 w-2 shrink-0 text-[#d71920]" aria-hidden="true" />
                    <span>{label}</span>
                  </span>
                ))}
              </div>
              <div className="mt-1.5 border-t border-[#d8cec2] pt-1">
                <p className="mb-1 text-[4px] font-black uppercase tracking-[0.1em] text-[#d71920] sm:text-[4.6px]">
                  Soft skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-0.5 rounded-full border border-[#c8b8a7] bg-[#f5efeb] px-1 py-0.5 text-[4.1px] font-semibold leading-none text-[#39332e] sm:text-[4.8px]"
                    >
                      <Check className="h-1.5 w-1.5 text-[#d71920]" aria-hidden="true" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[3px] border-l-2 border-[#d71920] bg-white/60 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                Aplikasi
              </h3>
              <div className="grid grid-cols-2 gap-x-1 gap-y-1.5 text-[4.8px] text-[#555a55] sm:text-[5.5px]">
                {slideFourSoftware.map(({ label, Icon, color }) => (
                  <span key={label} className="flex min-w-0 items-center gap-1 leading-none">
                    <Icon className="h-2 w-2 shrink-0" style={{ color }} aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </span>
                ))}
              </div>
            </section>
            <section className="min-h-0 overflow-hidden rounded-[3px] border-l-2 border-[#d71920] bg-white/60 p-1.5">
              <h3 className="mb-1 flex min-h-2 items-center gap-1.5 text-[6px] font-black uppercase leading-none tracking-[0.12em] text-[#171717] sm:text-[7px]">
                Bahasa & minat
              </h3>
              <p className="text-[4.8px] leading-[1.3] text-[#4a453f] sm:text-[5.5px]">
                Indonesia · Sunda · Inggris dasar
                <br />
                Membaca · desain · kegiatan sosial
              </p>
            </section>
          </aside>
        </div>
      </div>
    </article>
  );
}

function SlideEightSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 flex items-center gap-1 border-b border-[#c9bdb0] pb-0.5">
      <span className="h-2 w-[2px] shrink-0 bg-[#d71920]" aria-hidden="true" />
      <h3 className="flex h-2 items-center text-[5px] font-black uppercase leading-none tracking-[0.11em] text-[#111] sm:text-[6px]">
        {children}
      </h3>
    </div>
  );
}

function SlideEightCv() {
  const skillGroups = [
    {
      title: 'Desain UI/UX',
      Icon: Palette,
      presentation: 'chips',
      SkillIcon: Palette,
      skills: [
        'UI Design',
        'UX Research',
        'Wireframing',
        'Design System',
        'Prototyping',
        'Figma Mastery',
      ],
    },
    {
      title: 'Pengembangan web',
      Icon: Code2,
      presentation: 'icon-list',
      SkillIcon: Check,
      skills: [
        'HTML5 Semantik',
        'CSS3 Grid/Flexbox',
        'JavaScript ES6+',
        'Desain Responsif',
        'Git & GitHub',
        'TailwindCSS',
      ],
    },
    {
      title: 'Soft skills',
      Icon: UsersRound,
      presentation: 'icon-list',
      SkillIcon: Check,
      skills: [
        'Problem Solving',
        'Komunikasi Efektif',
        'Kerja Sama Tim',
        'Berpikir Kritis',
      ],
    },
    {
      title: 'Bahasa',
      Icon: Languages,
      presentation: 'pills',
      SkillIcon: Globe2,
      skills: ['Indonesia · Penutur asli', 'Inggris · Tingkat kerja'],
    },
  ];

  const experiences = [
    {
      role: 'UI/UX Designer & Frontend Developer',
      date: '2025—Sekarang',
      place: 'Praktik mandiri · Klien digital freelance',
      detail:
        'Merancang aplikasi mobile fintech dan web e-commerce berbasis riset alur pengguna dan aksesibilitas. Membangun design system Figma dengan komponen modular, lalu mengubah prototipe menjadi frontend responsif.',
    },
    {
      role: 'Frontend Developer & UI Contributor',
      date: '2024—2025',
      place: 'Tim digital · Agensi kreatif',
      detail:
        'Mengembangkan landing page dan dashboard analitik yang cepat di berbagai perangkat. Melakukan usability testing dan evaluasi heuristik, lalu memastikan rilis sesuai standar desain.',
    },
    {
      role: 'Koordinator Kreatif & Desainer Antarmuka',
      date: '2023—2024',
      place: 'Komunitas teknologi siswa · Lab proyek',
      detail:
        'Memimpin pembuatan aset antarmuka, materi pembelajaran digital, dan presentasi teknis. Membimbing tim tentang dasar tata letak antarmuka aplikasi.',
    },
  ];

  const projects = [
    {
      label: 'Fintech',
      image: 'project-fintech.jpg',
      alt: 'Desain antarmuka aplikasi fintech',
    },
    {
      label: 'E-commerce',
      image: 'project-ecommerce.jpg',
      alt: 'Desain halaman e-commerce',
    },
    {
      label: 'Dashboard',
      image: 'project-dashboard.jpg',
      alt: 'Desain dashboard analitik',
    },
  ];

  return (
    <article
      aria-label="CV M Kamal Abdul Karim, kode Pemula-06"
      className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] flex-col overflow-hidden border border-[#dfd5c8] bg-[#f5efeb] text-left text-[#111] shadow-[0_12px_30px_rgba(0,0,0,0.3)] max-[640px]:aspect-[0.82] max-[640px]:w-[94%]"
      style={{ fontFamily: "'DM Sans', Arial, sans-serif" }}
    >
      <header className="relative grid min-h-[22.5%] shrink-0 grid-cols-[1fr_0.23fr] items-center gap-2 border-b-2 border-[#111] bg-[#f5efeb] px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-x-2">
            <p className="text-[4px] font-black uppercase tracking-[0.16em] text-[#d71920] sm:text-[4.8px]">
              Curriculum Vitae
            </p>
            <p className="text-[3.4px] font-bold uppercase tracking-[0.08em] text-[#4a453f] sm:text-[4px]">
              • Tersedia freelance & full-time
            </p>
          </div>
          <h2 className="font-[Oswald,Arial_Narrow,sans-serif] text-[12px] font-bold uppercase leading-[0.9] tracking-[-0.035em] sm:text-[16px]">
            M Kamal
            <br />
            <span className="text-[#d71920]">Abdul Karim</span>
          </h2>
          <p className="mt-1 w-fit border-l-2 border-[#d71920] bg-[#eae2d8] px-1.5 py-0.5 text-[4.2px] font-bold uppercase tracking-[0.06em] sm:text-[5px]">
            Desainer UI/UX · Pengembang Web Frontend
          </p>
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[3.8px] leading-tight text-[#292521] sm:text-[4.5px]">
            <span className="flex min-w-0 items-center gap-0.5">
              <Mail className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
              <span className="truncate">kamal.abdulkarim@example.com</span>
            </span>
            <span className="flex min-w-0 items-center gap-0.5">
              <Phone className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
              <span>+62 812-3456-7890</span>
            </span>
            <span className="flex min-w-0 items-center gap-0.5">
              <MapPin className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
              <span className="truncate">Garut, Jawa Barat</span>
            </span>
            <span className="flex min-w-0 items-center gap-0.5">
              <Globe2 className="h-1.5 w-1.5 shrink-0 text-[#d71920]" aria-hidden="true" />
              <span className="truncate">linkedin.com/in/kamal-abdulkarim</span>
            </span>
          </div>
        </div>
        <div className="relative aspect-[0.77] w-full overflow-hidden border border-[#111] bg-[#eae2d8]">
          <img
            src={kamalCvProfileImage}
            alt="Foto profil M Kamal Abdul Karim"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <span className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-[#d71920]" aria-hidden="true" />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] gap-2 p-2 sm:gap-2.5 sm:p-2.5">
        <div className="flex min-h-0 flex-col gap-1 sm:gap-1.5">
          <section className="shrink-0 rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Pendidikan</SlideEightSectionTitle>
            <div className="space-y-1.5 text-[4.2px] leading-[1.35] sm:text-[4.9px]">
              <div>
                <div className="flex items-baseline justify-between gap-1">
                  <h4 className="font-black">SMKN 1 GARUT</h4>
                  <span className="shrink-0 font-bold text-[#d71920]">2023—2026</span>
                </div>
                <p className="font-semibold text-[#d71920]">Rekayasa Perangkat Lunak</p>
                <ul className="mt-0.5 list-disc space-y-0.5 pl-2 text-[#4a453f]">
                  <li>Fokus pada pemrograman web, desain UI/UX, dan kode semantik.</li>
                  <li>Aktif membuat proyek aplikasi sekolah dan antarmuka responsif.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="shrink-0 rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Sertifikasi profesional</SlideEightSectionTitle>
            <p className="text-[4.2px] font-black leading-tight sm:text-[4.9px]">
              UI/UX Specialization & Web Frontend
            </p>
            <p className="mt-0.5 text-[4px] leading-[1.35] text-[#4a453f] sm:text-[4.6px]">
              2024—2025 · Pelatihan intensif riset pengguna, design system Figma, dan wireframing. Implementasi desain frontend dengan standar aksesibilitas.
            </p>
          </section>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Keahlian utama</SlideEightSectionTitle>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-[6px]">
              {skillGroups.map(({ title, Icon, presentation, SkillIcon, skills }) => (
                <div key={title}>
                  <h4 className="mb-0.5 flex items-center gap-1 text-[4.2px] font-black uppercase leading-none tracking-[0.06em] text-[#d71920] sm:text-[4.8px]">
                    <Icon className="h-1.5 w-1.5 shrink-0" aria-hidden="true" />
                    {title}
                  </h4>
                  <div
                    className={`flex flex-wrap pl-0.5 ${
                      presentation === 'icon-list'
                        ? 'grid grid-cols-2 gap-x-2 gap-y-1.5'
                        : 'gap-1.5'
                    }`}
                  >
                    {skills.map((skill) => (
                      presentation === 'chips' ? (
                        <span
                          key={skill}
                          className="inline-flex min-h-[9px] items-center justify-center rounded-[2px] border border-[#c9bdb0] bg-[#eae2d8] px-1.5 py-[1px] text-center text-[3.8px] font-semibold leading-none text-[#1c1c1c] sm:text-[4.4px]"
                        >
                          {skill}
                        </span>
                      ) : presentation === 'pills' ? (
                        <span
                          key={skill}
                          className="inline-flex min-h-[9px] items-center justify-center gap-0.5 rounded-full border border-[#d71920]/45 bg-[#eae2d8] px-1.5 py-0.5 text-center text-[3.7px] font-semibold leading-none text-[#1c1c1c] sm:text-[4.2px]"
                        >
                          <SkillIcon className="h-1 w-1 shrink-0 text-[#d71920]" aria-hidden="true" />
                          {skill}
                        </span>
                      ) : (
                        <span
                          key={skill}
                          className="flex min-w-0 items-start gap-0.5 text-[3.8px] font-semibold leading-tight text-[#1c1c1c] sm:text-[4.4px]"
                        >
                          <SkillIcon className="mt-px h-1 w-1 shrink-0 text-[#d71920]" aria-hidden="true" />
                          <span className="min-w-0 break-words">{skill}</span>
                        </span>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex min-h-0 flex-col gap-1.5 sm:gap-2">
          <section className="shrink-0 rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Tentang saya</SlideEightSectionTitle>
            <p className="text-[4.2px] leading-[1.4] text-[#4a453f] sm:text-[4.9px]">
              Desainer UI/UX dan pengembang frontend dengan fokus pada antarmuka digital yang intuitif, fungsional, dan estetis. Memadukan riset kebutuhan pengguna dengan sistem desain modular di Figma, lalu mengimplementasikannya ke kode frontend semantik dan responsif. Berorientasi pada detail, kenyamanan navigasi, dan efisiensi alur produk.
            </p>
          </section>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Pengalaman kerja & proyek</SlideEightSectionTitle>
            <div className="flex min-h-0 flex-1 flex-col justify-between gap-1.5">
              {experiences.map((experience) => (
                <article key={experience.role} className="border-l-2 border-[#d71920] pl-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <h4 className="text-[4.2px] font-black leading-tight sm:text-[4.9px]">
                      {experience.role}
                    </h4>
                    <span className="shrink-0 text-[3.8px] font-bold text-[#d71920] sm:text-[4.4px]">
                      {experience.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[3.9px] italic leading-tight text-[#4a453f] sm:text-[4.5px]">
                    {experience.place}
                  </p>
                  <p className="mt-0.5 text-[4px] leading-[1.35] text-[#4a453f] sm:text-[4.6px]">
                    {experience.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="shrink-0 rounded-[3px] border border-[#dfd5c8] bg-white/60 p-1.5">
            <SlideEightSectionTitle>Portofolio</SlideEightSectionTitle>
            <div className="grid grid-cols-3 gap-1">
              {projects.map((project) => (
                <figure key={project.label} className="min-w-0">
                  <img
                    src={`${assetBase}assets/cv-kamal/${project.image}`}
                    alt={project.alt}
                    className="aspect-[1.05] w-full border border-[#c9bdb0] object-cover"
                  />
                  <figcaption className="mt-0.5 truncate text-[3.5px] font-bold uppercase tracking-[0.04em] text-[#d71920] sm:text-[4px]">
                    {project.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t-2 border-[#111] bg-[#f5efeb] px-2.5 py-1 text-[3.4px] font-bold uppercase tracking-[0.06em] text-[#111] sm:px-3.5 sm:text-[4px]">
        <span className="text-[#d71920]">Siap bekerja sama · Freelance · Kontrak · Full-time</span>
        <span>Garut · 2026</span>
      </footer>
    </article>
  );
}

function SlideNineOrder({
  greetingTitle = false,
  productPoster = false,
  brandingMessage = false,
}: {
  greetingTitle?: boolean;
  productPoster?: boolean;
  brandingMessage?: boolean;
}) {
  const usesWarmTheme = greetingTitle || productPoster;
  const orderName = brandingMessage
    ? 'Desain Branding Usaha'
    : productPoster
    ? 'Poster Produk'
    : greetingTitle
      ? 'Greeting Card'
      : 'Nempo Karir';
  const channels = [
    {
      name: 'WhatsApp',
      handle: '0857 2498 1356',
      href: 'https://wa.me/6285724981356',
      color: '#25D366',
      Icon: FaWhatsapp,
    },
    {
      name: 'Instagram',
      handle: '@nempo.id',
      href: 'https://instagram.com/nempo.id',
      color: '#D9468F',
      Icon: FaInstagram,
    },
    {
      name: 'TikTok',
      handle: '@nempo.id',
      href: 'https://www.tiktok.com/@nempo.id',
      color: '#111827',
      Icon: FaTiktok,
    },
    {
      name: 'Telegram',
      handle: '@nempoid',
      href: 'https://t.me/nempoid',
      color: '#229ED9',
      Icon: FaTelegram,
    },
  ];

  return (
    <article className="w-full max-w-[420px] text-center">
      <span
        className={`inline-flex rounded-full border px-2.5 py-1 text-[6px] font-black tracking-[0.2em] sm:text-[7px] ${
          brandingMessage
            ? 'border-[#e4b7c0]/70 bg-[#503947]/70 text-[#fff0ef]'
            : productPoster
            ? 'border-[#f2b9a6]/65 bg-[#062f4d]/55 text-[#fff0e5]'
            : greetingTitle
            ? 'border-[#f2d1a2]/55 bg-[#54242a]/75 text-[#f2d1a2]'
            : 'border-[#ffdd00]/55 bg-[#062f4d]/55 text-[#ffdd00]'
        }`}
      >
        {brandingMessage
          ? 'ORDER DESAIN USAHA'
          : productPoster
          ? 'ORDER POSTER PRODUK'
          : greetingTitle
            ? 'ORDER GREETING CARD'
            : 'ORDER NEMPO KARIR'}
      </span>
      <h1
        className={`mx-auto mt-2 max-w-[90%] text-[25px] font-black leading-[0.98] tracking-[-0.035em] sm:text-[34px] ${
          brandingMessage
            ? 'text-[#fff0ef]'
            : usesWarmTheme
              ? 'text-[#fff7e5]'
              : 'text-white'
        }`}
      >
        {brandingMessage ? (
          <>
            Desain Apapun
            <br />
            <span className="text-[0.72em] text-[#edbac3]">
              untuk branding usaha kamu
            </span>
          </>
        ) : productPoster ? (
          <>
            Poster Produk
            <br />
            <span className="text-[#f2b9a6]">untuk usahamu</span>
          </>
        ) : greetingTitle ? (
          <>
            Greeting
            <br />
            <span className="text-[#f2d1a2]">Card</span>
          </>
        ) : (
          <>
            Pesan CV
            <br />
            <span className="text-[#ffdd00]">versi kamu</span>
          </>
        )}
      </h1>
      <p
        className={`mx-auto mt-2 max-w-[84%] text-[8px] font-medium leading-[1.35] sm:text-[10px] ${
          brandingMessage
            ? 'text-[#f6e5e6]/90'
            : usesWarmTheme
              ? 'text-[#fff7e5]/90'
              : 'text-white/90'
        }`}
      >
        Pilih kanal favorit untuk mulai order.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
        {channels.map(({ name, handle, href, color, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Order ${orderName} lewat ${name}: ${handle}`}
            className="group block min-w-0"
          >
            <div
              className={`flex min-h-[46px] items-center gap-2 rounded-[11px] border px-2 py-1.5 text-left shadow-[0_5px_14px_rgba(0,40,78,0.2)] transition-transform group-hover:-translate-y-0.5 sm:min-h-[54px] sm:gap-2.5 sm:px-2.5 ${
                brandingMessage
                  ? 'border-[#e3bbc2]/80 bg-[#f7eeee]'
                  : productPoster
                  ? 'border-[#f2b9a6]/75 bg-[#fff4e9]'
                  : greetingTitle
                  ? 'border-[#f2d1a2]/75 bg-[#fff7e5]'
                  : 'border-white/75 bg-[#fffdf8]'
              }`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] sm:h-8 sm:w-8"
                style={{
                  color: brandingMessage ? '#795464' : color,
                  backgroundColor: brandingMessage
                    ? 'rgba(121,84,100,0.1)'
                    : `${color}18`,
                }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[7px] font-black uppercase tracking-[0.08em] sm:text-[8px] ${
                    brandingMessage
                      ? 'text-[#5b414d]'
                      : usesWarmTheme
                        ? 'text-[#54242a]'
                        : 'text-[#12384e]'
                  }`}
                >
                  {name}
                </span>
                <span
                  className={`mt-0.5 block truncate text-[6px] font-bold sm:text-[7px] ${
                    brandingMessage
                      ? 'text-[#886b79]'
                      : usesWarmTheme
                        ? 'text-[#916e60]'
                        : 'text-[#526675]'
                  }`}
                >
                  {handle}
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div
        className={`mt-3 rounded-[12px] border px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)] ${
          brandingMessage
            ? 'border-[#d9aeb8]/60 bg-[#4b3543]/88'
            : productPoster
            ? 'border-[#f2b9a6]/65 bg-[#54242a]/85'
            : greetingTitle
            ? 'border-[#f2d1a2]/65 bg-[#54242a]/85'
            : 'border-[#ffdd00]/55 bg-[#062f4d]/70'
        }`}
      >
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[5.5px] font-black uppercase tracking-[0.14em] sm:text-[6px] ${
            brandingMessage
              ? 'bg-[#edbac3] text-[#503947]'
              : productPoster
              ? 'bg-[#f2b9a6] text-[#54242a]'
              : greetingTitle
              ? 'bg-[#f2d1a2] text-[#54242a]'
              : 'bg-[#ffdd00] text-[#062f4d]'
          }`}
        >
          Bisa custom
        </span>
        <h2
          className={`mt-1 text-[11px] font-black leading-tight sm:text-[14px] ${
          brandingMessage
            ? 'text-[#fff0ef]'
            : usesWarmTheme
              ? 'text-[#fff7e5]'
              : 'text-white'
          }`}
        >
          {brandingMessage
            ? 'Desain sesuai identitas usahamu'
            : productPoster
              ? 'Bikin produkmu makin dilirik'
              : 'Sesuai keinginanmu'}
        </h2>
        <p
          className={`mt-0.5 text-[7px] leading-[1.3] sm:text-[8px] ${
          brandingMessage
            ? 'text-[#f3dfe2]/90'
            : usesWarmTheme
              ? 'text-[#fff7e5]/85'
              : 'text-white/85'
          }`}
        >
          {brandingMessage
            ? 'Materi visual dan desain promosi bisa dibuat sesuai kebutuhan brand kamu.'
            : productPoster
            ? 'Warna, foto, dan informasi poster bisa disesuaikan dengan identitas usahamu.'
            : greetingTitle
            ? 'Warna, tata letak, dan isi greeting card bisa disesuaikan dengan kebutuhanmu.'
            : 'Warna, tata letak, dan isi CV bisa disesuaikan dengan kebutuhanmu.'}
        </p>
      </div>
    </article>
  );
}

function FeedArtwork({
  slide: selectedSlide,
  exportRef,
}: {
  slide: FeedSlide;
  exportRef: RefObject<HTMLElement | null>;
}) {
  // Both MusiComedy slides share the same artwork and branding.
  const isMusiComedySlide = selectedSlide === 31 || selectedSlide === 32;
  const slide = isMusiComedySlide ? 30 : selectedSlide;
  return (
    <main
      ref={exportRef}
      className="relative aspect-[3/4] h-[min(92vh,900px)] w-auto max-w-full overflow-hidden bg-[#0194f3] text-[#062f4d] shadow-[0_24px_80px_rgba(0,0,0,0.34)] max-[640px]:h-auto max-[640px]:w-full"
      style={{
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        background:
          slide === 30
            ? 'radial-gradient(ellipse at 12% 15%, rgba(206,54,59,0.42), transparent 37%), radial-gradient(ellipse at 92% 82%, rgba(194,44,52,0.34), transparent 42%), repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 8px), linear-gradient(145deg, #172b3e 0%, #203b50 53%, #382c35 100%)'
            : slide === 29
            ? `linear-gradient(180deg, rgba(26,17,13,0.36) 0%, rgba(26,17,13,0.08) 45%, rgba(20,12,10,0.55) 100%), linear-gradient(90deg, rgba(20,13,10,0.2) 0%, transparent 68%), url("${cafes[0].image}") center / cover no-repeat`
            : slide === 28
            ? `linear-gradient(180deg, rgba(26,17,13,0.36) 0%, rgba(26,17,13,0.08) 45%, rgba(20,12,10,0.55) 100%), linear-gradient(90deg, rgba(20,13,10,0.2) 0%, transparent 68%), url("${sangkuriangCoverImage}") 61% center / cover no-repeat`
            : slide === 20 ||
          slide === 21 ||
          slide === 22 ||
          slide === 23 ||
          slide === 24 ||
          slide === 25 ||
          slide === 26 ||
          slide === 27
            ? `linear-gradient(180deg, rgba(32,19,17,0.48) 0%, rgba(32,19,17,0.25) 42%, rgba(32,19,17,0.42) 100%), linear-gradient(90deg, rgba(32,19,17,0.2) 0%, transparent 45%), url("${
                slide === 20
                  ? sangkuriangBackground
                  : slide === 21
                    ? sangkuriangBackground21
                    : slide === 22
                      ? sangkuriangBackground22
                      : slide === 27
                        ? sangkuriangBackground27
                        : slide === 23 || slide === 26
                        ? sangkuriangBackground23
                        : sangkuriangBackground24
              }") ${slide === 20 ? 'left center' : 'center center'} / cover no-repeat`
            : (slide >= 18 && slide <= 27)
            ? 'radial-gradient(ellipse at 48% 44%, rgba(232,167,151,0.22), transparent 56%), repeating-linear-gradient(0deg, rgba(255,238,227,0.055) 0px, rgba(255,238,227,0.055) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, rgba(44,27,37,0.15) 0px, rgba(44,27,37,0.15) 1px, transparent 1px, transparent 5px), linear-gradient(145deg, #8f6269 0%, #76545e 52%, #51444f 100%)'
            : [15, 16, 17].includes(slide)
            ? 'radial-gradient(ellipse at 50% 46%, rgba(76,188,183,0.24), transparent 54%), repeating-linear-gradient(0deg, rgba(232,255,247,0.04) 0px, rgba(232,255,247,0.04) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(5,37,46,0.13) 0px, rgba(5,37,46,0.13) 1px, transparent 1px, transparent 5px), linear-gradient(145deg, #176f79 0%, #0d596d 52%, #163f55 100%)'
            : slide === 10 ||
          slide === 11 ||
          slide === 12 ||
          slide === 13 ||
          slide === 14
            ? 'radial-gradient(ellipse at 50% 48%, rgba(142,32,41,0.16), transparent 52%), repeating-linear-gradient(0deg, rgba(255,231,218,0.035) 0px, rgba(255,231,218,0.035) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(20,6,11,0.16) 0px, rgba(20,6,11,0.16) 1px, transparent 1px, transparent 5px), linear-gradient(145deg, #281529 0%, #54243f 52%, #30172f 100%)'
            : 'linear-gradient(145deg, #12a8f8 0%, #058fe7 48%, #006daf 100%)',
      }}
    >
      {slide !== 1 &&
        slide !== 10 &&
        slide !== 11 &&
        slide !== 12 &&
        slide !== 13 &&
        slide !== 14 &&
        slide !== 15 &&
        slide !== 16 &&
        slide !== 18 &&
        slide !== 19 &&
        slide !== 20 &&
        slide !== 21 &&
        slide !== 22 &&
        slide !== 23 &&
        slide !== 24 &&
        slide !== 25 &&
        slide !== 26 &&
        slide !== 27 &&
        slide !== 30 &&
        slide !== 28 &&
        slide !== 29 && (
        <>
          {slide === 2 && (
            <img
              src={`${assetBase}assets/nempo-karir-hero.jpg`}
              alt=""
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(4,39,67,0.82)_0%,rgba(4,39,67,0.55)_48%,rgba(4,39,67,0.08)_100%),linear-gradient(180deg,rgba(4,39,67,0.22)_0%,rgba(4,39,67,0.02)_35%,rgba(4,39,67,0.68)_100%)]"
            aria-hidden="true"
          />
        </>
      )}
      {slide !== 10 &&
        slide !== 11 &&
        slide !== 12 &&
        slide !== 13 &&
        slide !== 14 &&
        slide !== 15 &&
        slide !== 16 &&
        slide !== 18 &&
        slide !== 19 &&
        slide !== 20 &&
        slide !== 21 &&
        slide !== 22 &&
        slide !== 23 &&
        slide !== 24 &&
        slide !== 25 &&
        slide !== 26 &&
        slide !== 27 &&
        slide !== 30 &&
        slide !== 28 &&
        slide !== 29 && (
        <BlueTexture />
      )}
      {(slide === 1 || (slide >= 3 && slide <= 9) || slide === 14) && (
        <FeedMotif />
      )}
      {slide === 1 && <CompactFooterArt />}
      {isMusiComedySlide ? <SlideThirtyOneBackground showTalent={selectedSlide !== 32} /> : slide === 30 && <SlideThirtySumpahPemuda />}

      <div
        className="relative z-10 flex h-full flex-col p-[7.5%]"
      >
        <header className="flex items-start justify-between">
          <div
            className={`flex items-center gap-3 ${
              slide === 30
                ? '-translate-y-[7px] max-[640px]:-translate-y-[8px]'
                : ''
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-white/95 p-1.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              <img
                src={`${assetBase}assets/nempo-new.webp`}
                alt="Logo N resmi Nempo"
                className="h-full w-full object-contain"
              />
            </div>
            <div
              className={`border-l pl-3 leading-none ${
                (slide === 30 && !isMusiComedySlide)
                  ? 'border-[#062f4d]/40 text-[#062f4d]'
                  : 'border-white/30 text-white'
              }`}
            >
              <p className="text-[12px] font-extrabold tracking-[0.1em]">
                NEMPO.ID
              </p>
              <p
                className="mt-1 text-[9px] font-medium normal-case tracking-[0.12em]"
                style={{
                  fontFamily: "'Nunito', 'DM Sans', sans-serif",
                }}
              >
                {((slide >= 10 && slide <= 28) || slide === 30) ? (
                  <>
                    <span
                      className={`text-[11px] font-bold ${
                        (slide === 30 && !isMusiComedySlide) ? 'text-[#062f4d]' : 'text-[#f2d1a2]'
                      }`}
                    >
                      ×
                    </span>{" "}
                    <span className={(slide === 30 && !isMusiComedySlide) ? 'text-[#062f4d]' : 'text-white'}>
                      Kala Muda
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] italic text-white">Explore</span>{" "}
                    <span className="text-white">Jawa Barat</span>
                  </>
                )}
              </p>
            </div>
            {slide >= 3 && slide <= 8 && (
              <span
                role="note"
                aria-label={`Kode template CV: Pemula-0${slide - 2}`}
                className="ml-1 flex h-11 w-[90px] shrink-0 flex-col items-center justify-center gap-0.5 bg-[#ed1c24] pb-1 text-white shadow-[0_3px_8px_rgba(0,0,0,0.35)] max-[640px]:h-10 max-[640px]:w-[82px]"
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                }}
              >
                <span className="whitespace-nowrap text-[7px] font-bold uppercase leading-none tracking-[0.16em] text-white/75 max-[640px]:text-[6px]">
                  KODE CV
                </span>
                <span className="whitespace-nowrap text-[10px] font-black leading-none tracking-[0.04em] max-[640px]:text-[9px]">
                  PEMULA-0{slide - 2}
                </span>
              </span>
            )}
          </div>
          {isMusiComedySlide ? (
            <div className="-translate-y-[7px] max-[640px]:-translate-y-[8px] h-11 w-11 overflow-hidden rounded-[5px] bg-[#f6f1e7] p-0.5 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
              <img src={gscLogoAsset.url} alt="Logo Good Story Cafe" className="h-full w-full object-contain" decoding="async" />
            </div>
          ) : slide !== 1 ? (
            <div className="relative">
              <span
                className={`flex items-center whitespace-nowrap rounded-full border border-white/25 ${
                  slide === 30 ? 'bg-[#062f4d]/90' : 'bg-[#062f4d]/25'
                } ${
                  'px-3 py-1.5 text-[11px] font-black tracking-[0.02em] text-white'
                } ${
                  slide === 8 ||
                  slide === 9 ||
                  slide === 10 ||
                  slide === 11 ||
                  slide === 12 ||
                  slide === 13 ||
                  slide === 14 ||
                  slide === 15 ||
                  slide === 16 ||
                  slide === 17 ||
                  slide === 19 ||
                  slide === 18 ||
                  slide === 20 ||
                  slide === 21 ||
                  slide === 22 ||
                  slide === 23 ||
                  slide === 24 ||
                  slide === 25 ||
                  slide === 26 ||
                  slide === 27 ||
                  slide === 28 ||
                  slide === 29 ||
                  slide === 30
                    ? 'max-[640px]:px-2.5 max-[640px]:text-[9px]'
                    : ''
                }`}
              >
                {slide === 18
                  ? 'POSTER TARI'
                  : slide === 19
                    ? 'DESAIN USAHA'
                      : slide === 29
                        ? 'CAFE VINTAGE'
                    : (slide >= 20 && slide <= 28)
                      ? 'LEGENDA SUNDA'
                      : slide === 30
                        ? 'SUMPAH PEMUDA'
                    : slide === 16 || slide === 17
                    ? 'POSTER PRODUK'
                  : slide === 15
                    ? 'POSTER UMKM'
                    : slide >= 10 && slide <= 14
                      ? 'GREETING CARD'
                      : 'NEMPO KARIR'}
              </span>
            </div>
          ) : slide === 1 ? (
            <span className="rounded-full border border-white/25 bg-[#062f4d]/25 px-2 py-1 text-[8px] font-black tracking-[0.12em] text-white/80">
              0{slide} / 32
            </span>
          ) : null}
        </header>

        {slide === 1 ? (
          <>
            <section className="mt-[2.5%] text-center">
              <h1 className="mx-auto max-w-[94%] text-[30px] font-black leading-[0.96] tracking-[-0.045em] text-white sm:text-[38px]">
                3 Cafe Vintage
                <br />
                <span className="text-[#ffdd00]">Spot Foto</span>
              </h1>
              <p
                className="mx-auto mt-1.5 max-w-[90%] text-[9px] font-medium leading-[1.25] text-white/90 sm:text-[11px]"
                style={{
                  fontFamily: "'Nunito', 'DM Sans', sans-serif",
                }}
              >
                Sudut klasik, suasana nyaman—pilih yang paling kamu suka.
              </p>
            </section>

            <section
              className="mt-[3%] grid grid-cols-3 items-stretch gap-2"
              aria-label="Tiga cafe untuk dipilih"
            >
              {cafes.map((cafe) => (
                <article
                  key={cafe.name}
                  aria-label={`${cafe.name}: ${cafe.story}`}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border border-white/75 bg-[#fffdf8] text-left shadow-[0_5px_16px_rgba(0,40,78,0.18)]"
                >
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#c9d8d0]">
                    <img
                      src={cafe.image}
                      alt={cafe.imageAlt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                    />
                    <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#062f4d]/85 text-[6px] font-black text-white">
                      {cafe.number}
                    </span>
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-[#062f4d]/80 px-1 py-0.5 text-[4.5px] font-extrabold tracking-[0.08em] text-white">
                      ILUSTRASI
                    </span>
                  </div>
                  <div className="flex min-h-[105px] min-w-0 flex-1 flex-col px-1.5 py-1.5 sm:px-2 sm:py-2">
                    <p className="text-[7px] font-black leading-[1.12] text-[#12384e] sm:text-[9px]">
                      {cafe.name}
                    </p>
                    <p className="mt-1.5 text-[5.5px] leading-[1.25] text-[#435762] sm:text-[6.5px]">
                      {cafe.story}
                    </p>
                    <span className="mt-auto pt-1.5">
                      <span className="inline-block w-fit rounded-full bg-[#e4f1f1] px-1.5 py-0.5 text-[4.5px] font-extrabold tracking-[0.06em] text-[#1b6b83] sm:text-[5px]">
                        {cafe.fit}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </section>

            <div className="mt-[6%] rounded-[11px] border border-white/25 bg-[#062f4d]/35 px-2 py-1.5 text-center backdrop-blur-[2px]">
              <p className="text-[8px] font-black tracking-[0.08em] text-[#ffdd00] sm:text-[9px]">
                MANA YANG PALING KAMU BANGET?
              </p>
              <p className="mt-0.5 text-[6px] font-medium leading-tight text-white/95 sm:text-[7px]">
                Tulis 01, 02, atau 03 di komentar · foto ilustrasi, bukan foto lokasi asli.
              </p>
            </div>
          </>
        ) : (
          <section
            className={`relative z-10 flex flex-1 flex-col items-center justify-center text-center text-white ${
              slide >= 4
                ? 'min-h-0 px-[3%] pb-[7%]'
                : 'px-[3%] pb-[7%]'
            }`}
          >
            {slide === 2 && (
              <>
                <p className="text-[8px] font-black tracking-[0.28em] text-[#ffdd00] sm:text-[10px]">
                  PERSIAPAN KARIER
                </p>
                <h1 className="mt-2 max-w-[90%] text-[29px] font-black leading-[0.98] tracking-[-0.04em] drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] sm:text-[38px]">
                  Buat CV
                  <br />
                  <span className="text-[#ffdd00]">Profesional</span>
                </h1>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#062f4d]/80 px-4 py-2 text-[#062f4d] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                  <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white sm:text-[9px]">
                    Cuma
                  </span>
                  <span className="text-[20px] font-black leading-none tracking-[-0.04em] text-[#ffdd00] sm:text-[25px]">
                    Rp5.000
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#ffdd00]/65 bg-[#062f4d]/75 px-2.5 py-1 text-[#ffdd00] shadow-[0_4px_12px_rgba(0,0,0,0.16)]">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#ffdd00]"
                    aria-hidden="true"
                  />
                  <span className="text-[7px] font-black tracking-[0.08em] sm:text-[8px]">
                    Revisi Unlimited
                  </span>
                </div>
                <p className="mt-3 max-w-[76%] text-[9px] font-medium leading-[1.35] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-[11px]">
                  Tampil lebih siap untuk peluang kerja berikutnya.
                </p>
              </>
            )}
            {slide === 2 && (
              <article
                aria-label="Pratinjau CV"
                className="relative mt-3 w-[82%] max-w-[390px] overflow-hidden rounded-[12px] border border-white/70 bg-[#fffefa] text-left text-[#263b45] shadow-[0_12px_30px_rgba(0,0,0,0.34)]"
              >
              <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-b from-[#ffdd00] via-[#12a8f8] to-[#006daf]" />
              <div
                className="pointer-events-none absolute -right-5 -top-7 h-20 w-20 rounded-full bg-[#ffdd00]/35"
                aria-hidden="true"
              />

              <div className="relative p-4 pl-5">
                <header className="flex items-center gap-3">
                  <div className="relative h-[62px] w-[56px] shrink-0 rounded-[11px] bg-[#ffdd00] p-1 sm:h-[70px] sm:w-[62px]">
                    <div className="relative h-full w-full overflow-hidden rounded-[8px] bg-[#dceef4]">
                      <img
                        src={`${assetBase}assets/nempo-karir-hero.jpg`}
                        alt="Foto profil Rani"
                        className="absolute h-[250%] w-[250%] max-w-none object-cover"
                        style={{ left: '-120%', top: '-10%' }}
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#fffefa] bg-[#058fe7] text-[5px] font-black text-white">
                      CV
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 w-fit whitespace-nowrap rounded-full bg-[#e7f5fb] px-1.5 py-0.5 text-[6.5px] font-black tracking-[0.08em] text-[#0874ad] sm:text-[7.5px]">
                      PROFIL PROFESIONAL
                    </p>
                    <h2 className="whitespace-nowrap text-[14px] font-extrabold leading-tight tracking-[-0.035em] text-[#12384e] sm:text-[16px]">
                      Rani Kurniawati
                    </h2>
                    <p className="mt-0.5 whitespace-nowrap text-[7.5px] font-bold tracking-[0.07em] text-[#1683b5] sm:text-[8.5px]">
                      ADMINISTRASI
                    </p>
                    <p className="mt-1 whitespace-nowrap text-[6.5px] font-medium text-[#64767c] sm:text-[7.5px]">
                      GARUT, JAWA BARAT · 08xx-xxxx-xxxx
                    </p>
                  </div>
                </header>

                <div className="mt-3 grid grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] gap-2">
                  <section className="rounded-[8px] bg-[#eaf6fb] px-2.5 py-2">
                    <h3 className="mb-1 whitespace-nowrap text-[7px] font-black uppercase tracking-[0.08em] text-[#0874ad] sm:text-[8px]">
                      Profil singkat
                    </h3>
                    <p className="whitespace-nowrap text-[7px] leading-[1.35] text-[#3e5055] sm:text-[8px]">
                      Teliti dan komunikatif.
                    </p>
                  </section>
                  <section className="rounded-[8px] bg-[#fff5c7] px-2.5 py-2">
                    <h3 className="mb-1 whitespace-nowrap text-[7px] font-black uppercase tracking-[0.08em] text-[#927400] sm:text-[8px]">
                      Keahlian
                    </h3>
                    <div className="flex flex-nowrap gap-0.5">
                      {['Office', 'Admin', 'Teliti'].map((skill) => (
                        <span
                          key={skill}
                          className="whitespace-nowrap rounded-full bg-white/85 px-0.5 py-0.5 text-[4.5px] font-bold text-[#5d573c] sm:text-[5.5px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
              </article>
            )}
            {slide === 3 && (
              <article
                aria-label="Contoh CV kreatif satu halaman, kode Pemula-01"
                className="relative translate-y-2 flex aspect-[0.75] w-[86%] max-w-[430px] overflow-hidden border border-white/15 bg-[#111111] text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.48)]"
                style={{
                  backgroundImage:
                    'radial-gradient(ellipse at 8% 10%, rgba(130,20,20,0.2), transparent 34%), repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 8px)',
                }}
              >
                <div className="grid h-full w-full grid-cols-[0.94fr_1.06fr] gap-2.5 p-2.5 sm:gap-3 sm:p-3">
                  <div className="flex min-h-0 flex-col justify-between">
                    <div className="relative aspect-[0.9] w-full overflow-hidden border border-white/20 bg-[#201b1b]">
                      <img
                        src={raniCvProfileImage}
                        alt="Foto profil contoh CV Rani"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                      <span className="absolute left-1 top-1 h-1.5 w-1.5 border-l border-t border-[#ed1c24]" />
                      <span className="absolute bottom-1 right-1 h-1.5 w-1.5 border-b border-r border-[#ed1c24]" />
                    </div>

                    <section>
                      <p className="text-[5px] font-medium text-white/75 sm:text-[5.5px]">Halo, saya</p>
                      <h2 className="mt-0.5 text-[11px] font-black leading-[0.95] tracking-[-0.04em] sm:text-[13px]">
                        Rani <span className="text-[#ed1c24]">Kurniawati</span>
                      </h2>
                      <p className="mt-1 text-[5px] font-medium text-white/70 sm:text-[5.5px]">
                        Staf Administrasi
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        TENTANG SAYA
                      </h3>
                      <p className="text-[5px] leading-[1.35] text-white/80 sm:text-[5.5px]">
                        Lulusan Administrasi Perkantoran yang teliti dan komunikatif. Terbiasa mengelola dokumen, mencatat data, dan membantu pelanggan. Mampu bekerja mandiri maupun bersama tim, cepat beradaptasi, serta siap belajar hal baru.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        PENDIDIKAN
                      </h3>
                      <p className="text-[5.5px] font-bold sm:text-[6px]">SMK Negeri 1 Garut</p>
                      <p className="mt-0.5 text-[4.8px] leading-[1.3] text-white/70 sm:text-[5.2px]">
                        Otomatisasi dan Tata Kelola Perkantoran · 2020–2023
                      </p>
                      <p className="mt-1 text-[4.8px] leading-[1.3] text-white/70 sm:text-[5.2px]">
                        Prestasi: Siswa teladan · Lulus dengan baik
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        PELATIHAN
                      </h3>
                      <div className="space-y-1 text-[4.8px] leading-[1.3] text-white/75 sm:text-[5.2px]">
                        <p><span className="font-semibold text-white">Microsoft Excel Dasar</span> · 2023</p>
                        <p><span className="font-semibold text-white">Pelayanan Pelanggan</span> · 2022</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        KONTAK
                      </h3>
                      <div className="space-y-0.5 text-[4.8px] leading-[1.25] text-white/80 sm:text-[5.2px]">
                        <p>08xx-xxxx-xxxx</p>
                        <p className="break-all">rani.kurniawati@example.com</p>
                        <p>Garut, Jawa Barat</p>
                        <p>Portofolio: rani-kurniawati.example</p>
                      </div>
                    </section>
                  </div>

                  <div className="flex min-h-0 flex-col justify-between">
                    <section>
                      <h3 className="mb-1.5 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        PENGALAMAN KERJA
                      </h3>
                      <div className="space-y-1.5">
                        <div>
                          <p className="text-[5.3px] font-bold leading-tight sm:text-[5.8px]">
                            Staf Administrasi <span className="font-medium text-white/60">(2023–2024)</span>
                          </p>
                          <p className="mt-0.5 text-[4.8px] leading-[1.3] text-white/75 sm:text-[5.2px]">
                            Toko Sinar Jaya · Garut
                          </p>
                          <p className="mt-0.5 text-[4.8px] leading-[1.3] text-white/70 sm:text-[5.2px]">
                            Mengelola arsip dan transaksi harian, memeriksa kelengkapan dokumen, serta membantu pelanggan mendapatkan informasi produk.
                          </p>
                        </div>
                        <div>
                          <p className="text-[5.3px] font-bold leading-tight sm:text-[5.8px]">
                            Asisten Administrasi <span className="font-medium text-white/60">(2022)</span>
                          </p>
                          <p className="mt-0.5 text-[4.8px] leading-[1.3] text-white/70 sm:text-[5.2px]">
                            Praktik kerja lapangan · Garut. Menginput data, menata berkas, menyiapkan dokumen, dan membantu kebutuhan administrasi harian.
                          </p>
                        </div>
                        <div>
                          <p className="text-[5.3px] font-bold leading-tight sm:text-[5.8px]">
                            Relawan Administrasi <span className="font-medium text-white/60">(2021)</span>
                          </p>
                          <p className="mt-0.5 text-[4.8px] leading-[1.3] text-white/70 sm:text-[5.2px]">
                            Membantu pencatatan dan persiapan kegiatan warga di lingkungan setempat.
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="border-t border-[#ed1c24]/50 pt-1.5">
                      <h3 className="mb-1 w-fit whitespace-nowrap bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black leading-none tracking-[0.06em] sm:text-[5.5px]">
                        SOFT SKILLS
                      </h3>
                      <div className="space-y-0.5 text-[4.8px] text-white/80 sm:text-[5.2px]">
                        <p><span className="mr-1 text-[#ed1c24]">✦</span>Komunikasi dan kerja tim</p>
                        <p><span className="mr-1 text-[#ed1c24]">✦</span>Teliti dan terorganisir</p>
                        <p><span className="mr-1 text-[#ed1c24]">✦</span>Manajemen waktu</p>
                        <p><span className="mr-1 text-[#ed1c24]">✦</span>Adaptif dan bertanggung jawab</p>
                      </div>
                    </section>

                    <section className="border-t border-[#ed1c24]/50 pt-1.5">
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        KEAHLIAN TEKNIS
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {['Microsoft Office', 'Administrasi', 'Input data', 'Pengarsipan', 'Layanan pelanggan'].map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-[#ed1c24]/70 px-1.5 py-0.5 text-[4.5px] font-semibold text-white/90 sm:text-[4.8px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section className="border-t border-[#ed1c24]/50 pt-1.5">
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        PROYEK & ORGANISASI
                      </h3>
                      <p className="text-[4.8px] leading-[1.3] text-white/75 sm:text-[5.2px]">
                        Membantu menyusun arsip kegiatan sekolah dan menjadi panitia administrasi acara kelas.
                      </p>
                    </section>

                    <section className="border-t border-[#ed1c24]/50 pt-1.5">
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        SOFTWARE
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {['Word', 'Excel', 'Google Docs', 'Canva'].map((tool) => (
                          <span
                            key={tool}
                            className="shrink-0 whitespace-nowrap rounded-[2px] bg-[#ed1c24]/15 px-1.5 py-0.5 text-[4.8px] font-bold leading-none text-white/90 sm:text-[5.2px]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section className="border-t border-[#ed1c24]/50 pt-1.5">
                      <h3 className="mb-1 w-fit bg-[#ed1c24] px-1.5 py-0.5 text-[5px] font-black tracking-[0.06em] sm:text-[5.5px]">
                        BAHASA & MINAT
                      </h3>
                      <p className="text-[4.8px] leading-[1.35] text-white/80 sm:text-[5.2px]">
                        Indonesia · Sunda · Inggris dasar
                      </p>
                      <p className="mt-0.5 text-[4.8px] leading-[1.35] text-white/65 sm:text-[5.2px]">
                        Membaca · desain · kegiatan sosial
                      </p>
                    </section>

                    <div className="flex items-center justify-between border-t border-white/15 pt-1">
                      <span className="text-[4.5px] font-semibold tracking-[0.07em] text-white/55 sm:text-[4.8px]">
                        CONTOH CV PEMULA
                      </span>
                      <span className="text-[4.5px] font-black tracking-[0.1em] text-[#ed1c24] sm:text-[4.8px]">
                        NEMPO KARIR
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}
            {slide === 4 && <SlideFourCv />}
            {slide === 5 && <SlideFiveCv />}
            {slide === 6 && <SlideSixCv />}
            {slide === 7 && <SlideSevenCv />}
            {slide === 8 && <SlideEightCv />}
            {slide === 9 && <SlideNineOrder />}
            {slide === 14 && <SlideNineOrder greetingTitle />}
            {slide === 15 && <SlideFifteenProductPoster />}
            {slide === 16 && <SlideSixteenPosterExample />}
            {slide === 17 && <SlideNineOrder productPoster />}
            {slide === 18 && <SlideEighteenDancePhoto />}
            {slide === 19 && <SlideNineOrder productPoster brandingMessage />}
            {slide === 20 && <SlideSangkuriangComic slide={20} />}
            {slide === 21 && <SlideSangkuriangComic slide={21} />}
            {slide === 22 && <SlideSangkuriangComic slide={22} />}
            {slide === 23 && <SlideSangkuriangComic slide={23} />}
            {slide === 24 && <SlideSangkuriangComic slide={24} />}
            {slide === 25 && <SlideSangkuriangComic slide={25} />}
            {slide === 26 && <SlideSangkuriangComic slide={26} />}
            {slide === 27 && <SlideSangkuriangComic slide={27} />}
            {slide === 28 && <SlideSangkuriangCover />}
            {slide === 29 && <SlideTwentyNineCafeCover cafes={cafes} />}
            {slide === 10 && <SlideElevenGreetingPrice />}
            {slide === 11 && <ScrapbookSlideTenLove />}
            {slide === 12 && <SlideTwelveLove />}
            {slide === 13 && <SlideThirteenLoveLetter />}
          </section>
        )}
      </div>

      {!isMusiComedySlide && (
      <div
        className={`absolute z-20 flex items-center gap-2.5 ${
          slide >= 2
            ? 'bottom-[5%] left-1/2 w-max -translate-x-1/2'
            : 'bottom-[12%] right-[7.5%]'
        }`}
      >
        {slide !== 1 && (
          <a
            href="https://wa.me/6285724981356"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              slide === 14
                ? 'Hubungi Greeting Card melalui WhatsApp di 0857 2498 1356'
                : slide === 15
                  ? 'Hubungi Nempo untuk poster produk UMKM melalui WhatsApp di 0857 2498 1356'
                  : slide === 16
                  ? 'Contoh desain poster produk UMKM seblak'
                  : slide === 17
                    || slide === 19
                    ? 'Hubungi Nempo untuk pesan poster produk UMKM melalui WhatsApp di 0857 2498 1356'
                    : slide === 29
                      ? 'Hubungi Nempo tentang rekomendasi cafe melalui WhatsApp di 0857 2498 1356'
                      : slide === 30
                        ? 'Hubungi Nempo tentang konten Sumpah Pemuda melalui WhatsApp di 0857 2498 1356'
                      : slide >= 20 && slide <= 28
                      ? 'Hubungi Nempo tentang cerita rakyat Jawa Barat melalui WhatsApp di 0857 2498 1356'
                      : slide === 18
                      ? 'Contoh desain feed promosi sanggar tari'
                : 'Hubungi Nempo Karir melalui WhatsApp di 0857 2498 1356'
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#062f4d]/80 px-2.5 py-1.5 text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#062f4d]/95"
          >
            <FaWhatsapp
              className={`h-3.5 w-3.5 shrink-0 ${
                (slide >= 20 && slide <= 29) || slide === 30 ? 'text-white' : 'text-[#25D366]'
              }`}
              aria-hidden="true"
            />
            <span className="inline-flex h-3.5 shrink-0 items-center whitespace-nowrap text-[9px] font-bold leading-none tracking-[0.01em]">
              0857 2498 1356
            </span>
          </a>
        )}

        <div className="pointer-events-none flex items-center gap-2.5 rounded-full bg-[#062f4d]/75 px-3 py-1.5 text-white backdrop-blur-sm">
          <FaInstagram className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          <FaTiktok className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          <span
            className={`text-[11px] font-bold tracking-[0.04em] ${
              (slide >= 20 && slide <= 29) || slide === 30 ? 'text-white' : 'text-[#ffdd00]'
            }`}
          >
            @nempo.id
          </span>
        </div>
      </div>
      )}

    </main>
  );
}

function ClientFeedArtwork({
  exportRef,
  isStory,
  slide,
}: {
  exportRef: RefObject<HTMLElement | null>;
  isStory: boolean;
  slide: ClientSlide;
}) {
  if (isStory && slide === 2) {
    return <GgsBeautyStorySlideTwo exportRef={exportRef} />;
  }

  if (isStory && slide === 3) {
    return <GgsBeautyStorySlideThree exportRef={exportRef} />;
  }

  if (!isStory && (slide === 2 || slide === 3)) {
    return <GgsBeautyContentSlide slide={slide} exportRef={exportRef} />;
  }

  if (!isStory && (slide === 4 || slide === 5 || slide === 6)) {
    return <GgsBeautyContentSlide slide={slide} exportRef={exportRef} />;
  }

  return <GgsBeautySlideOne exportRef={exportRef} isStory={isStory} />;
}

function App() {
  const [activeFeed, setActiveFeed] = useState<
    | 'nempo'
    | 'client'
    | 'story'
    | 'coupon'
    | 'qcard'
    | 'photobooth'
    | 'member-card'
    | 'calendar'
    | 'spreadsheet'
  >('nempo');
  const [activeSlide, setActiveSlide] = useState<FeedSlide>(32);
  const [activeClientSlide, setActiveClientSlide] = useState<ClientSlide>(3);
  const [isDownloading, setIsDownloading] = useState(false);
  const [preparedNempoPng, setPreparedNempoPng] = useState<{
    url: string;
    fileName: string;
    slide: number;
  } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const exportRef = useRef<HTMLElement | null>(null);
  const isNempoFeed = activeFeed === 'nempo';
  const isHighQualityNempoStorySlide =
    isNempoFeed && activeSlide >= 20 && activeSlide <= 32;
  const isCoupon = activeFeed === 'coupon';
  const isQCard = activeFeed === 'qcard';
  const isPhotobooth = activeFeed === 'photobooth';
  const isMemberCard = activeFeed === 'member-card';
  const isCalendar = activeFeed === 'calendar';
  const isSpreadsheet = activeFeed === 'spreadsheet';
  const isGgsFeed = activeFeed === 'client' || activeFeed === 'story';
  const isGgsStory = activeFeed === 'story';
  const isGgsGrandOpeningSlide =
    activeFeed === 'client' && activeClientSlide === 3;

  useEffect(() => {
    if (
      preparedNempoPng &&
      (!isNempoFeed || activeSlide !== preparedNempoPng.slide)
    ) {
      setPreparedNempoPng(null);
    }
  }, [activeSlide, isNempoFeed, preparedNempoPng]);

  useEffect(() => {
    if (!preparedNempoPng) return;
    const objectUrl = preparedNempoPng.url;
    return () => URL.revokeObjectURL(objectUrl);
  }, [preparedNempoPng]);

  const handleDownload = async () => {
    const artwork = exportRef.current;
    if (!artwork || isDownloading) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      await Promise.all(
        Array.from(artwork.querySelectorAll('img')).map(async (image) => {
          if (!image.complete) {
            await new Promise<void>((resolve, reject) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener(
                'error',
                () => reject(new Error(`Gagal memuat gambar: ${image.currentSrc || image.src}`)),
                { once: true },
              );
            });
          }

          if (image.naturalWidth === 0) {
            throw new Error(`Gagal memuat gambar: ${image.currentSrc || image.src}`);
          }

          await image.decode();
        }),
      );

      const outputWidth = isCalendar
        ? 1969
        : isPhotobooth
        ? 4096
        : isMemberCard
          ? 1012
          : isGgsGrandOpeningSlide
            ? 1122
            : 1080;
      const outputHeight = isCalendar
        ? 2756
        : isPhotobooth
        ? 2731
        : isMemberCard
          ? 638
          : isGgsGrandOpeningSlide
            ? 1402
            : isGgsStory
              ? 1920
              : activeFeed === 'nempo'
                ? 1440
                : 1350;
      const renderScale = isHighQualityNempoStorySlide
        ? 3
        : isNempoFeed
          ? 1
          : isPhotobooth
            ? 3
            : isMemberCard
              ? 3
              : isCalendar || isGgsStory || activeFeed === 'client'
                ? 3
                : 2;
      let renderedCanvas: HTMLCanvasElement;
      if (isNempoFeed && activeSlide === 20) {
        renderedCanvas = await renderNempoSlide20Png(artwork, {
          width: outputWidth,
          height: outputHeight,
          pixelRatio: renderScale,
        });
      } else if (
        (isGgsStory && activeClientSlide === 2) ||
        (isGgsFeed &&
          (activeClientSlide === 4 ||
            activeClientSlide === 5 ||
            activeClientSlide === 6))
      ) {
        const svgDataUrl = await toSvg(artwork, {
          cacheBust: true,
          style: {
            boxShadow: 'none',
          },
        });
        const svgImage = new Image();
        svgImage.src = svgDataUrl;
        await svgImage.decode();

        const highQualityCanvas = document.createElement('canvas');
        highQualityCanvas.width = outputWidth * renderScale;
        highQualityCanvas.height = outputHeight * renderScale;
        const context = highQualityCanvas.getContext('2d');
        if (!context) {
          throw new Error('Tidak dapat menyiapkan canvas untuk PNG.');
        }
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(
          svgImage,
          0,
          0,
          highQualityCanvas.width,
          highQualityCanvas.height,
        );
        renderedCanvas = highQualityCanvas;
      } else if (isNempoFeed && (activeSlide === 30 || activeSlide === 31 || activeSlide === 32)) {
        const artworkWidth = artwork.getBoundingClientRect().width;
        const scale = (outputWidth / artworkWidth) * renderScale;
        renderedCanvas = await domToCanvas(artwork, {
          scale,
          style: {
            boxShadow: 'none',
          },
        });
        const targetWidth = outputWidth * renderScale;
        const targetHeight = outputHeight * renderScale;
        if (
          renderedCanvas.width !== targetWidth ||
          renderedCanvas.height !== targetHeight
        ) {
          const exactSizeCanvas = document.createElement('canvas');
          exactSizeCanvas.width = targetWidth;
          exactSizeCanvas.height = targetHeight;
          const context = exactSizeCanvas.getContext('2d');
          if (!context) {
            throw new Error('Tidak dapat menyiapkan canvas untuk PNG.');
          }
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(renderedCanvas, 0, 0, targetWidth, targetHeight);
          renderedCanvas = exactSizeCanvas;
        }
      } else {
        renderedCanvas = await toCanvas(artwork, {
          cacheBust: true,
          pixelRatio: renderScale,
          canvasWidth: outputWidth,
          canvasHeight: outputHeight,
          style: {
            boxShadow: 'none',
          },
        });
      }

      let downloadHref: string;
      let generatedObjectUrl: string | null = null;
      if (isNempoFeed) {
        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          renderedCanvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Tidak dapat menyiapkan berkas PNG.'));
            }
          }, 'image/png');
        });
        generatedObjectUrl = URL.createObjectURL(pngBlob);
        downloadHref = generatedObjectUrl;
      } else {
        let dataUrl: string;
        if (
          isPhotobooth ||
          isMemberCard ||
          isGgsFeed ||
          isCalendar ||
          activeSlide === 2 ||
          activeSlide === 3 ||
          activeSlide === 4 ||
          activeSlide === 5 ||
          activeSlide === 6 ||
          activeSlide === 7 ||
          activeSlide === 8 ||
          activeSlide === 9 ||
          activeSlide === 10 ||
          activeSlide === 11 ||
          activeSlide === 12 ||
          activeSlide === 13 ||
          activeSlide === 14 ||
          activeSlide === 15 ||
          activeSlide === 16 ||
          activeSlide === 17 ||
          activeSlide === 18 ||
          activeSlide === 19 ||
          activeSlide === 20 ||
          activeSlide === 21 ||
          activeSlide === 22 ||
          activeSlide === 23 ||
          activeSlide === 24 ||
          activeSlide === 25 ||
          activeSlide === 26 ||
          activeSlide === 27 ||
          activeSlide === 28 ||
          activeSlide === 29
        ) {
          dataUrl = renderedCanvas.toDataURL('image/png');
        } else {
          const outputCanvas = document.createElement('canvas');
          outputCanvas.width = outputWidth;
          outputCanvas.height = outputHeight;
          const context = outputCanvas.getContext('2d');
          if (!context) {
            throw new Error('Tidak dapat menyiapkan canvas untuk PNG.');
          }

          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(renderedCanvas, 0, 0, outputWidth, outputHeight);
          dataUrl = outputCanvas.toDataURL('image/png');
        }
        downloadHref = dataUrl;
      }

      const fileName =
        isCalendar
          ? 'ggs-beauty-calendar-2027-50x70cm-300dpi.png'
          : isMemberCard
          ? 'ggs-beauty-member-card.png'
          : isPhotobooth
          ? 'ggs-beauty-photobooth-3x2m.png'
          : isGgsFeed
          ? `ggs-${isGgsStory ? 'story' : 'feed'}-${String(activeClientSlide).padStart(2, '0')}.png`
          : activeSlide === 3
            ? 'nempo-feed-03-latest.png'
            : activeSlide === 4
              ? 'nempo-feed-04-aligned.png'
              : activeSlide === 7
                ? 'nempo-feed-07-latest.png'
                : activeSlide === 8
                  ? 'nempo-feed-08-latest.png'
                  : `nempo-feed-${String(activeSlide).padStart(2, '0')}.png`;
      const isAppleTouchBrowser =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (isNempoFeed && isAppleTouchBrowser && generatedObjectUrl) {
        setPreparedNempoPng({ url: generatedObjectUrl, fileName, slide: activeSlide });
        return;
      }

      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = downloadHref;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      if (generatedObjectUrl) {
        window.setTimeout(() => URL.revokeObjectURL(generatedObjectUrl), 60_000);
      }
    } catch (error) {
      setDownloadError('PNG tidak berhasil disiapkan. Silakan coba lagi.');
      console.error(
        isCalendar
          ? 'Gagal membuat PNG Kalender GGS:'
          : isPhotobooth
          ? 'Gagal membuat PNG Photobooth GGS:'
          : isMemberCard
          ? 'Gagal membuat PNG kartu member GGS:'
          : isGgsStory
          ? 'Gagal membuat PNG GGS Story:'
          : isGgsFeed
            ? 'Gagal membuat PNG GGS Feed:'
            : 'Gagal membuat PNG Nempo Feed:',
        error,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const visibleSlides =
    isPhotobooth || isMemberCard || isCalendar
      ? []
      : isGgsFeed
      ? isGgsStory
        ? [1, 2, 3]
        : [1, 2, 3, 4, 5, 6]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  const selectedSlide =
    isGgsFeed ? activeClientSlide : activeSlide;

  return (
    <div
      className={`min-h-screen w-full px-6 py-4 max-[640px]:px-0 max-[640px]:py-0 ${
        isSpreadsheet
          ? 'bg-[#f1f5f9]'
          : isPhotobooth ||
        isMemberCard ||
        isCalendar ||
        (isGgsFeed && activeClientSlide === 1)
          ? 'bg-[#f8edf1]'
          : 'bg-white'
      }`}
    >
      <div
        className={`flex min-h-[calc(100vh-4rem)] flex-col items-center max-[640px]:min-h-screen ${
          isSpreadsheet ? 'justify-start' : 'justify-center'
        }`}
      >
        <div
          role="tablist"
          aria-label="Pilih bagian feed"
          className="mb-3 flex max-w-[96vw] items-center gap-1 overflow-x-auto rounded-full bg-[#062f4d] p-1 shadow-[0_8px_20px_rgba(0,40,78,0.2)]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeFeed === 'nempo'}
            onClick={() => setActiveFeed('nempo')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              activeFeed === 'nempo'
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Nempo Feed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isSpreadsheet}
            onClick={() => setActiveFeed('spreadsheet')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              isSpreadsheet
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Spreadsheet
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFeed === 'client'}
            onClick={() => setActiveFeed('client')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              activeFeed === 'client'
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            GGS Feed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isCalendar}
            onClick={() => setActiveFeed('calendar')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              isCalendar
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Kalender GGS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isPhotobooth}
            onClick={() => setActiveFeed('photobooth')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              isPhotobooth
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Photobooth
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFeed === 'story'}
            onClick={() => {
              setActiveFeed('story');
              setActiveClientSlide(2);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              activeFeed === 'story'
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            GGS Story
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFeed === 'coupon'}
            onClick={() => setActiveFeed('coupon')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              activeFeed === 'coupon'
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            GGS Kupon
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isMemberCard}
            onClick={() => setActiveFeed('member-card')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              isMemberCard
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            GGS Member
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFeed === 'qcard'}
            onClick={() => setActiveFeed('qcard')}
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black transition-colors ${
              activeFeed === 'qcard'
                ? 'bg-[#ffdd00] text-[#062f4d]'
                : 'text-white/75 hover:text-white'
            }`}
          >
            Q Card MC
          </button>
        </div>
        {!isCoupon && !isQCard && !isSpreadsheet && (
          <div className="mb-3 flex flex-col items-center gap-2">
            {isNempoFeed && preparedNempoPng?.slide === activeSlide ? (
              <>
                <a
                  href={preparedNempoPng.url}
                  download={preparedNempoPng.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#062f4d] px-4 py-2 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(0,40,78,0.2)] transition-colors hover:bg-[#0b4d69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd00] focus-visible:ring-offset-2"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Simpan PNG · 3×
                </a>
                <p className="max-w-[92vw] text-center text-[10px] font-medium text-slate-600" role="status">
                  PNG siap disimpan. Jika gambar terbuka, pilih Bagikan → Simpan ke File.
                </p>
              </>
            ) : (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                aria-busy={isDownloading}
                className="inline-flex items-center gap-2 rounded-full bg-[#062f4d] px-4 py-2 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(0,40,78,0.2)] transition-colors hover:bg-[#0b4d69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd00] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
              >
                {isDownloading ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {isDownloading
                  ? 'Menyiapkan PNG…'
                  : isCalendar
                    ? 'Download PNG · 50×70 cm'
                    : isNempoFeed && (activeSlide === 30 || activeSlide === 31 || activeSlide === 32)
                      ? 'Download PNG · 3×'
                    : isPhotobooth || isGgsFeed || isHighQualityNempoStorySlide
                      ? 'Download PNG · 3×'
                      : 'Download PNG'}
              </button>
            )}
            {isNempoFeed && activeSlide === 32 && (
              <>
                <a
                  href={slide32VideoAsset.url}
                  download="Nempo-Feed-Slide-32-MusiComedy-Night.mp4"
                  className="inline-flex items-center gap-2 rounded-full bg-[#062f4d] px-4 py-2 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(0,40,78,0.2)] transition-colors hover:bg-[#0b4d69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd00] focus-visible:ring-offset-2"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download video · MP4
                </a>
                <p className="max-w-[92vw] text-center text-[10px] font-medium text-slate-600">
                  Video 30 detik · 1080×1440 · 30 fps, persis seperti pratinjau.
                </p>
              </>
            )}
            {downloadError && (
              <p className="max-w-[92vw] text-center text-[10px] font-semibold text-red-700" role="alert">
                {downloadError}
              </p>
            )}
          </div>
        )}
        {isSpreadsheet ? (
          <Suspense
            fallback={
              <div
                className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-600"
                role="status"
              >
                <LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
                Membuka tab spreadsheet…
              </div>
            }
          >
            <SpreadsheetViewer />
          </Suspense>
        ) : isCoupon ? (
          <GgsCouponDesigner />
        ) : isQCard ? (
          <GgsQCardCover />
        ) : isMemberCard ? (
          <GgsMemberCardDesigner exportRef={exportRef} />
        ) : isPhotobooth ? (
          <GgsBeautyPhotobooth exportRef={exportRef} />
        ) : isCalendar ? (
          <Ggs2027Calendar exportRef={exportRef} />
        ) : isGgsFeed ? (
          <ClientFeedArtwork
            exportRef={exportRef}
            isStory={isGgsStory}
            slide={activeClientSlide}
          />
        ) : (
          <FeedArtwork slide={activeSlide} exportRef={exportRef} />
        )}
        {!isSpreadsheet && !isCoupon && !isQCard && !isPhotobooth && !isMemberCard && !isCalendar && <div
          className="mt-4 flex max-w-[94vw] items-center gap-1 overflow-x-auto rounded-full bg-[#062f4d] p-1 shadow-[0_8px_20px_rgba(0,40,78,0.2)] max-[640px]:mb-4 max-[640px]:gap-0.5 max-[640px]:p-0.5"
          aria-label={
            isGgsStory
              ? 'Pilih slide GGS Story'
              : isGgsFeed
                ? 'Pilih slide GGS Feed'
                : 'Pilih slide Nempo Feed'
          }
        >
          {visibleSlides.map((slide) => (
            <button
              key={slide}
              type="button"
              aria-label={`Tampilkan slide ${String(slide).padStart(2, '0')}`}
              aria-pressed={selectedSlide === slide}
              onClick={() => {
                if (isGgsFeed) {
                  setActiveClientSlide(slide as ClientSlide);
                } else {
                  setActiveSlide(slide as FeedSlide);
                }
              }}
              className={`rounded-full px-3 py-1 text-[10px] font-black transition-colors max-[640px]:px-0.5 max-[640px]:text-[8px] ${
                selectedSlide === slide
                  ? 'bg-[#ffdd00] text-[#062f4d]'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {String(slide).padStart(2, '0')}
            </button>
          ))}
        </div>}
      </div>
    </div>
  );
}

export default App;