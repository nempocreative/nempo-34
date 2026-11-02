import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { applicationWaUrl, buildApplicationMessage, interestOptions } from "./community-recruitment";
import { NEMPO_WA_URL } from "../lib/contact";

const sample = {
  full_name: "Asep Sunandar",
  email: "asep@example.com",
  whatsapp: "085724981356",
  interest: "Videografer dan Fotographer",
  reason: "Suka motret acara kampus",
};

describe("formulir recruitment", () => {
  it("pilihan minat persis seperti yang diminta", () => {
    expect([...interestOptions]).toEqual([
      "Designer",
      "Web Developer",
      "Content Creator",
      "Videografer dan Fotographer",
      "Marketing",
      "Event Management",
    ]);
  });

  it("pesan WhatsApp memuat semua isian", () => {
    const msg = buildApplicationMessage(sample);
    expect(msg).toContain("Asep Sunandar");
    expect(msg).toContain("085724981356");
    expect(msg).toContain("asep@example.com");
    expect(msg).toContain("Minat: Videografer dan Fotographer");
    expect(msg).toContain("Cerita: Suka motret acara kampus");
  });

  it("tanpa cerita opsional, pesan tidak menambah baris cerita", () => {
    const msg = buildApplicationMessage({ ...sample, reason: undefined });
    expect(msg).not.toContain("Cerita:");
  });

  it("tautan menuju WhatsApp resmi Nempo dengan pesan terisi", () => {
    const url = applicationWaUrl(sample);
    expect(url.startsWith(`${NEMPO_WA_URL}?text=`)).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Halo Nempo!");
    expect(decoded).toContain("Nama: Asep Sunandar");
    expect(decoded).toContain("Minat: Videografer dan Fotographer");
  });

  it("halaman recruitment tidak memakai ikon bintang", () => {
    const src = readFileSync(resolve(process.cwd(), "src/pages/recruitment.tsx"), "utf8");
    expect(src).not.toMatch(/\bSparkles\b/);
    expect(src).not.toMatch(/\bStar\b/);
    expect(src).not.toMatch(/lucide-(star|sparkles)/);
  });

  it("tombol kirim formulir mengarah ke WhatsApp", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/components/community-application-form.tsx"),
      "utf8",
    );
    expect(src).toContain("applicationWaUrl");
    expect(src).toContain("window.open(");
    expect(src).toContain("Kirim pendaftaran ke WhatsApp");
  });
});
