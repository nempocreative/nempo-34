const ABBREVIATIONS: Record<string, string> = {
  "JL.": "Jl.",
  "NO.": "No.",
  "KEC.": "Kec.",
  "KAB.": "Kab.",
  "KP.": "Kp.",
};
const PRESERVED_WORDS = new Set(["&", "RT", "RW"]);

function titleCasePart(part: string): string {
  if (!part || /^\d+$/.test(part)) return part;
  if (ABBREVIATIONS[part.toUpperCase()]) return ABBREVIATIONS[part.toUpperCase()];
  if (PRESERVED_WORDS.has(part.toUpperCase())) return part.toUpperCase();
  if (/^[A-Z]{1,3}\.?$/.test(part) && part.length <= 3) return part;
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

export function cleanPlaceName(value: string): string {
  let text = value.trim().replace(/\s+/g, " ");
  text = text.replace(/\s*\([^()]{1,80}\)\s*$/, "");
  text = text.replace(/\s*-\s*/g, " - ");
  text = text.replace(/\s*&\s*/g, " & ");
  text = text.replace(/\s*,\s*/g, ", ");
  text = text.replace(/\bNo\.?\s*(\d)/gi, "No. $1");
  return text.split(" ").map(word => word.split(/([.'’/-])/).map(titleCasePart).join("")).join(" ").trim();
}

export function cleanLocation(value: string): string {
  return cleanPlaceName(value)
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function cleanDescription(value: string, rawName: string, cleanedName: string): string {
  const text = cleanText(value);
  if (!text || !rawName.trim() || rawName.trim() === cleanedName) return text;
  return text.replace(new RegExp(rawName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), cleanedName);
}

export function cleanCommaList(value: string): string {
  return value.split(",").map(item => cleanPlaceName(item)).filter(Boolean).join(", ");
}