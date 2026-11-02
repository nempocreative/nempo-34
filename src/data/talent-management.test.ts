import { describe, expect, it } from "vitest";
import { TALENT_CATEGORIES, buildTalentRequestMessage, buildTalentRequestUrl, canSendTalentRequest } from "./talent-management";

describe("talent management", () => {
  it("offers dancers, bands, MCs and models", () => {
    const ids = TALENT_CATEGORIES.map((c) => c.id);
    for (const id of ["penari", "band", "mc", "model"]) expect(ids).toContain(id);
  });

  it("builds a request message with the chosen talents", () => {
    const msg = buildTalentRequestMessage({ eventType: "Pernikahan", talentIds: ["mc", "penari"], date: "12 Des", location: "Garut", note: "" });
    expect(msg).toContain("Acara: Pernikahan");
    expect(msg).toContain("Talent: MC & Host, Penari");
    expect(msg).toContain("Lokasi: Garut");
    expect(msg).not.toContain("Catatan");
  });

  it("needs an event type and at least one talent before sending", () => {
    expect(canSendTalentRequest({ eventType: "", talentIds: ["mc"], date: "", location: "", note: "" })).toBe(false);
    expect(canSendTalentRequest({ eventType: "Pernikahan", talentIds: [], date: "", location: "", note: "" })).toBe(false);
    expect(canSendTalentRequest({ eventType: "Pernikahan", talentIds: ["band"], date: "", location: "", note: "" })).toBe(true);
  });

  it("opens the WhatsApp chat with the request pre-filled", () => {
    const url = buildTalentRequestUrl({ eventType: "Pernikahan", talentIds: ["mc"], date: "12 Des", location: "Garut", note: "" });
    expect(url).toMatch(/^https:\/\/wa\.me\/6285724981356\?text=/);
    const text = decodeURIComponent(url.split("?text=")[1]!);
    expect(text).toContain("Acara: Pernikahan");
    expect(text).toContain("Talent: MC & Host");
    expect(text).toContain("Tanggal: 12 Des");
  });
});
