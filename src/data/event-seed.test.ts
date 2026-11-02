import { describe, expect, it } from "vitest";
import { EVENT_SEEDS, eventSeedBySlug, eventSeedInsertSql } from "./event-seed";

describe("event seed data", () => {
  const event = eventSeedBySlug("musicomedy-night");

  it("carries the MusiComedy Night event the homepage card links to", () => {
    expect(event).toBeDefined();
    expect(event?.name).toBe("MusiComedy Night");
    expect(event?.slug).toBe("musicomedy-night");
  });

  it("keeps the announced date of 4 November 2026", () => {
    expect(event?.date).toBe("2026-11-04");
  });

  it("keeps the announced event hours of 15.00 – 23.00", () => {
    expect(event?.time_start).toBe("15:00");
    expect(event?.time_end).toBe("23:00");
  });

  it("keeps the event free", () => {
    expect(event?.price).toBe(0);
  });

  it("keeps the announced venue and guest star", () => {
    expect(event?.location).toBe("Good Story Cafe, Jl. Sudirman Copong No. 11, Garut");
    expect(event?.guest_stars).toEqual([{ name: "Saduli Ragap", role: "Bintang Tamu" }]);
  });

  it("points at the stored poster image", () => {
    expect(event?.image).toBe(
      "/__l5e/assets-v1/f1e49218-aeb5-4bd0-bb9f-055469beb200/musicomedy-night-poster.webp",
    );
  });

  it("produces insert SQL that carries every seed value", () => {
    const sql = eventSeedInsertSql(EVENT_SEEDS[0]);
    expect(sql).toContain("'musicomedy-night'");
    expect(sql).toContain("'2026-11-04'");
    expect(sql).toContain("'15:00'");
    expect(sql).toContain("'23:00'");
    expect(sql).toContain("Malam musik dan komedi bareng NEMPO.ID × Kala Muda");
    expect(sql).toContain("Saduli Ragap");
    expect(sql).toContain("::jsonb");
  });

  it("escapes single quotes instead of breaking the statement", () => {
    const sql = eventSeedInsertSql({ ...EVENT_SEEDS[0], name: "O'Brien" });
    expect(sql).toContain("'O''Brien'");
  });
});
