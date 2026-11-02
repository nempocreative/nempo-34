import { useState, useEffect } from "react";

export type Language = "id" | "en" | "ar" | "zh" | "ja" | "ko";
export type Currency = "IDR" | "USD" | "SGD" | "MYR" | "EUR" | "JPY" | "AUD" | "GBP";

export interface DisplayPrefs {
  lang: Language;
  currency: Currency;
}

const DEFAULTS: DisplayPrefs = { lang: "id", currency: "IDR" };

function read(): DisplayPrefs {
  try {
    const raw = localStorage.getItem("nempo_display_prefs");
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return DEFAULTS; }
}

function save(prefs: DisplayPrefs) {
  localStorage.setItem("nempo_display_prefs", JSON.stringify(prefs));
  window.dispatchEvent(new Event("nempo_display_prefs_change"));
}

export function useDisplayPrefs() {
  const [prefs, setPrefs] = useState<DisplayPrefs>(read);

  useEffect(() => {
    const handler = () => setPrefs(read());
    window.addEventListener("nempo_display_prefs_change", handler);
    return () => window.removeEventListener("nempo_display_prefs_change", handler);
  }, []);

  const setLang = (lang: Language) => {
    const next = { ...prefs, lang };
    setPrefs(next);
    save(next);
  };

  const setCurrency = (currency: Currency) => {
    const next = { ...prefs, currency };
    setPrefs(next);
    save(next);
  };

  return { prefs, setLang, setCurrency };
}

export const LANGUAGE_OPTIONS: { code: Language; label: string; native: string; flag: string; available: boolean }[] = [
  { code: "id", label: "Bahasa Indonesia",  native: "Bahasa Indonesia", flag: "🇮🇩", available: true  },
  { code: "en", label: "English",           native: "English",          flag: "🇺🇸", available: false },
  { code: "ar", label: "Arabic",            native: "العربية",          flag: "🇸🇦", available: false },
  { code: "zh", label: "Chinese",           native: "中文",              flag: "🇨🇳", available: false },
  { code: "ja", label: "Japanese",          native: "日本語",            flag: "🇯🇵", available: false },
  { code: "ko", label: "Korean",            native: "한국어",            flag: "🇰🇷", available: false },
];

export const CURRENCY_OPTIONS: { code: Currency; label: string; symbol: string; flag: string }[] = [
  { code: "IDR", label: "Rupiah Indonesia",   symbol: "Rp",  flag: "🇮🇩" },
  { code: "USD", label: "US Dollar",          symbol: "$",   flag: "🇺🇸" },
  { code: "SGD", label: "Singapore Dollar",   symbol: "S$",  flag: "🇸🇬" },
  { code: "MYR", label: "Malaysian Ringgit",  symbol: "RM",  flag: "🇲🇾" },
  { code: "EUR", label: "Euro",               symbol: "€",   flag: "🇪🇺" },
  { code: "JPY", label: "Yen Jepang",         symbol: "¥",   flag: "🇯🇵" },
  { code: "AUD", label: "Australian Dollar",  symbol: "A$",  flag: "🇦🇺" },
  { code: "GBP", label: "British Pound",      symbol: "£",   flag: "🇬🇧" },
];
