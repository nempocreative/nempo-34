import { describe, expect, it } from "vitest";
import { eoTestimonials } from "./eo-testimonials";

const COMPANY_TOKENS = ["PT", "CV", "Tbk", "OSIS", "SMAN", "SMA", "Universitas", "Perusahaan"];

describe("Testimoni halaman EO", () => {
  it("shows more than twelve testimonials", () => {
    expect(eoTestimonials.length).toBeGreaterThan(12);
  });

  it("names a person and their part, never a company", () => {
    for (const t of eoTestimonials) {
      expect(t.name.trim().length).toBeGreaterThan(2);
      expect(t.role.trim().length).toBeGreaterThan(2);
      const label = `${t.name} ${t.role}`;
      for (const token of COMPANY_TOKENS) {
        expect(label).not.toContain(token);
      }
    }
  });

  it("has no duplicate people", () => {
    expect(new Set(eoTestimonials.map((t) => t.name)).size).toBe(eoTestimonials.length);
  });
});
