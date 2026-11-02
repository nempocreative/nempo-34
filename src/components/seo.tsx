import { useEffect } from "react";

const SITE_NAME = "Nempo Organizer";
const BASE_URL = "https://nempo.id";
const DEFAULT_OG_IMAGE = `${BASE_URL}/opengraph.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function SEO({
  title,
  description = "Temukan wisata alam, kuliner khas, penginapan, dan event budaya terbaik di Jawa Barat. Platform digital pariwisata Jawa Barat.",
  keywords,
  image = DEFAULT_OG_IMAGE,
  path = "/",
  type = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Destinasi Wisata, Kuliner & Budaya Jawa Barat`;
  const canonical = `${BASE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  useEffect(() => {
    document.title = fullTitle;
    const set = (attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = val;
    };
    set("name", "description", description);
    if (keywords) set("name", "keywords", keywords);
    set("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    set("property", "og:title", fullTitle);
    set("property", "og:description", description);
    set("property", "og:url", canonical);
    set("property", "og:type", type);
    set("property", "og:image", ogImage);
  }, [fullTitle, description, keywords, noIndex, canonical, type, ogImage]);
  return null;
}
