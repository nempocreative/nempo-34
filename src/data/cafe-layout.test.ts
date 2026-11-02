import { describe, expect, it } from "vitest";
import {
  CAFE_TABLES,
  CAFE_ZONES,
  cafeBestSpotTables,
  cafeJamRange,
  cafeReservationMessage,
  cafeReservationUrl,
  cafeZoneOf,
  formatJamWib,
} from "./cafe-layout";

describe("denah meja Good Story Cafe", () => {
  it("memuat semua nomor meja dari denah: VIP 1-2, M1-M52, 53-57, tambahan 58-65", () => {
    expect(CAFE_TABLES).toContain("VIP 1");
    expect(CAFE_TABLES).toContain("VIP 2");
    expect(CAFE_TABLES).toContain("M1");
    expect(CAFE_TABLES).toContain("M52");
    expect(CAFE_TABLES).toContain("53");
    expect(CAFE_TABLES).toContain("57");
    expect(CAFE_TABLES).toContain("58");
    expect(CAFE_TABLES).toContain("65");
    // 2 VIP + M1..M52 (52) + 53..57 (5) + 58..65 (8)
    expect(CAFE_TABLES).toHaveLength(67);
    expect(new Set(CAFE_TABLES).size).toBe(67);
  });

  it("zona paling dekat panggung adalah VIP, M1-M5, dan M36-M45", () => {
    const best = cafeBestSpotTables();
    expect(best).toContain("VIP 1");
    expect(best).toContain("M1");
    expect(best).toContain("M5");
    expect(best).toContain("M36");
    expect(best).toContain("M45");
    expect(best).not.toContain("M20");
    expect(best).not.toContain("58");
  });

  it("setiap meja punya satu zona", () => {
    for (const t of CAFE_TABLES) expect(cafeZoneOf(t)?.label).toBeTruthy();
    expect(cafeZoneOf("M12")?.id).toBe("lt2");
    expect(cafeZoneOf("58")?.id).toBe("tambahan");
  });

  it("jam ditampilkan gaya Indonesia: 15.00 – 23.00 WIB", () => {
    expect(formatJamWib("15:00")).toBe("15.00");
    expect(cafeJamRange("15:00", "23:00")).toBe("15.00 – 23.00 WIB");
    expect(cafeJamRange(null, null)).toBe("");
  });

  it("pesan reservasi memuat nama event, jam acara, dan nomor meja", () => {
    const msg = cafeReservationMessage({
      eventName: "MusiComedy Night",
      eventDate: "2026-11-04",
      timeStart: "15:00",
      timeEnd: "23:00",
      location: "Good Story Cafe",
      table: "M12",
    });
    expect(msg).toContain("MusiComedy Night");
    expect(msg).toContain("15.00 – 23.00 WIB");
    expect(msg).toContain("Meja dipilih: M12 (Lantai 2)");
    expect(msg).toContain("Good Story Cafe");
  });

  it("pesan tanpa meja minta dibantu posisi terbaik", () => {
    const msg = cafeReservationMessage({ eventName: "MusiComedy Night", timeStart: "15:00", timeEnd: "23:00" });
    expect(msg).toContain("Meja dipilih: belum dipilih — mohon dibantu posisi terbaik");
  });

  it("tautan menuju WhatsApp resmi Nempo dengan pesan terisi", () => {
    const url = cafeReservationUrl({
      eventName: "MusiComedy Night",
      eventDate: "2026-11-04",
      timeStart: "15:00",
      timeEnd: "23:00",
      location: "Good Story Cafe",
      table: "VIP 1",
    });
    expect(url.startsWith("https://wa.me/6285724981356?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Meja dipilih: VIP 1 (VIP)");
  });

  it("tidak ada zona yang kosong dan labelnya unik", () => {
    for (const z of CAFE_ZONES) expect(z.tables.length).toBeGreaterThan(0);
    expect(new Set(CAFE_ZONES.map((z) => z.id)).size).toBe(CAFE_ZONES.length);
    expect(new Set(CAFE_ZONES.map((z) => z.label)).size).toBe(CAFE_ZONES.length);
  });
});
