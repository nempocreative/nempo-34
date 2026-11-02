import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export const ALL_CITIES = "Semua Jawa Barat";

export const CITY_OPTIONS = [
  ALL_CITIES,
  "Banjar",
  "Bandung",
  "Bandung Barat",
  "Bekasi",
  "Bogor",
  "Cianjur",
  "Cimahi",
  "Cirebon",
  "Depok",
  "Garut",
  "Indramayu",
  "Karawang",
  "Kuningan",
  "Majalengka",
  "Pangandaran",
  "Purwakarta",
  "Subang",
  "Sukabumi",
  "Sumedang",
  "Tasikmalaya",
] as const;

export type CityName = (typeof CITY_OPTIONS)[number];

type CityFilterContextValue = {
  selectedCity: CityName;
  setSelectedCity: (city: CityName) => void;
  matchesCity: (location?: string | null, fallbackCity?: string) => boolean;
  isCityAvailable: (city: CityName) => boolean;
};

const LOCATION_ENDPOINTS = ["/api/wisata", "/api/kuliner", "/api/cafe", "/api/penginapan", "/api/events"];
const CityFilterContext = createContext<CityFilterContextValue | null>(null);

function normalizeLocation(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function canonicalCity(value: unknown): CityName | null {
  if (typeof value !== "string") return null;
  const normalized = normalizeLocation(value);
  if (!normalized) return null;

  const match = CITY_OPTIONS.find((city) => normalizeLocation(city) === normalized);
  if (match) return match;

  const withoutPrefix = normalized
    .replace(/^(kota|kabupaten|kab\.?)\s+/, "")
    .trim();
  return CITY_OPTIONS.slice(1).find((city) => normalizeLocation(city) === withoutPrefix) ?? null;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesCityKeyword(text: string, cityName: string) {
  const city = escapeRegex(normalizeLocation(cityName)).replace(/\s+/g, "\\s+");
  const qualifier = "(?:kota|kabupaten|kab\\.?|city|regency)";
  const cityExpression = `(?:${qualifier}\\s+${city}|${city}(?:\\s+${qualifier})?)`;
  return new RegExp(
    `(?:^|[\\s,|·/()])${cityExpression}(?=$|[,|·/()]|\\s*$)`,
  ).test(text);
}

function readSavedCity(): CityName {
  // The server location is the default for every new page visit. A previous
  // manual selection must not make a Garut deployment reopen in another city.
  return "Garut";
}

export function CityFilterProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<CityName>(readSavedCity);
  const hasManualPreference = useRef(false);
  const [availableCities, setAvailableCities] = useState<Set<CityName>>(
    () => new Set<CityName>(["Garut"]),
  );

  const setSelectedCity = useCallback((city: CityName) => {
    hasManualPreference.current = true;
    setSelectedCityState(city);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (hasManualPreference.current) return;

    fetch("/api/server-location", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (cancelled || hasManualPreference.current) return;
        const city = canonicalCity((payload as { city?: unknown } | null)?.city);
        if (!city) return;

        setSelectedCityState(city);
      })
      .catch(() => {
        // Keep the Garut fallback when the location endpoint is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      LOCATION_ENDPOINTS.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, { cache: "no-store" });
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      }),
    ).then((datasets) => {
      if (cancelled) return;

      const nextAvailable = new Set<CityName>();
      datasets.flat().forEach((item) => {
        const location = typeof item?.location === "string" ? item.location : "";
        const text = normalizeLocation(location);
        const matchedCities = CITY_OPTIONS.slice(1).filter((city) => matchesCityKeyword(text, city));

        if (matchedCities.length === 0) {
          // Existing records with only a street or district are legacy Garut data.
          nextAvailable.add("Garut");
        } else {
          matchedCities.forEach((city) => nextAvailable.add(city));
        }
      });

      // Keep Garut available even while legacy endpoints return no location text.
      nextAvailable.add("Garut");
      setAvailableCities(nextAvailable);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const matchesCity = useCallback(
    (location?: string | null, fallbackCity?: string) => {
      if (selectedCity === ALL_CITIES) return true;

      if (location?.trim()) {
        const text = normalizeLocation(location);
        // Match a complete city keyword so "Bandung" does not match "Bandung Barat".
        if (matchesCityKeyword(text, selectedCity)) return true;

        // Do not apply the legacy fallback when the address already names another city.
        const namesAnotherCity = CITY_OPTIONS.slice(1).some((city) => matchesCityKeyword(text, city));
        if (namesAnotherCity) return false;
      }

      // Older records contain only a street or district. Those records are
      // currently Garut data until their city field is completed.
      return Boolean(fallbackCity && normalizeLocation(fallbackCity) === normalizeLocation(selectedCity));
    },
    [selectedCity],
  );

  const isCityAvailable = useCallback(
    (city: CityName) => city === ALL_CITIES || availableCities.has(city),
    [availableCities],
  );

  const value = useMemo(
    () => ({ selectedCity, setSelectedCity, matchesCity, isCityAvailable }),
    [selectedCity, matchesCity, isCityAvailable],
  );

  return <CityFilterContext.Provider value={value}>{children}</CityFilterContext.Provider>;
}

export function useCityFilter() {
  const context = useContext(CityFilterContext);
  if (!context) {
    throw new Error("useCityFilter must be used inside CityFilterProvider");
  }
  return context;
}