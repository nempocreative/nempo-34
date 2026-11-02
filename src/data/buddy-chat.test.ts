import { describe, expect, it } from "vitest";
import { matchBuddyService } from "./buddy-chat";

describe("Tanya Buddy service routing", () => {
  it.each([
    ["Event Organizer", "event"], ["Wedding Organizer", "wedding"],
    ["undangan wedding", "invitation"], ["Sosmed Management", "sosmed"],
    ["Web Development", "web"], ["Design Creative", "design"],
    ["penari", "talent"], ["band", "talent"], ["MC", "talent"], ["model", "talent"],
    ["Business System", "business"],
    ["Bikin undangan digital", "invitation"], ["Konten sosmed", "sosmed"], ["Bikin website", "web"],
  ])("routes %s to the matching website service", (input, id) => {
    expect(matchBuddyService(input)?.id).toBe(id);
  });
  it("does not mistake a tourism query for a service abbreviation", () => {
    expect(matchBuddyService("video wisata di Garut")).toBeUndefined();
  });
});