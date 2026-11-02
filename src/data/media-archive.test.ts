import { describe, expect, it } from "vitest";
import {
  MEDIA_ARCHIVE_ENTRIES,
  MEDIA_ARCHIVE_ID,
  mediaArchiveByFilename,
  mediaArchiveUpsertSql,
} from "./media-archive";

describe("media archive manifest", () => {
  it("keeps all 41 recovered files", () => {
    expect(MEDIA_ARCHIVE_ENTRIES).toHaveLength(41);
  });

  it("records a checksum, a size and a pointer for every file", () => {
    for (const entry of MEDIA_ARCHIVE_ENTRIES) {
      expect(entry.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(entry.size).toBeGreaterThan(0);
      expect(entry.pointer).toMatch(/^src\/assets\/.+\.asset\.json$/);
      expect(entry.url).toMatch(/^\/__l5e\/assets-v1\/.+/);
    }
  });

  it("never repeats a filename", () => {
    const names = MEDIA_ARCHIVE_ENTRIES.map((entry) => entry.filename);
    expect(new Set(names).size).toBe(names.length);
  });

  it("finds the MusiComedy group photo by filename", () => {
    const entry = mediaArchiveByFilename("musicomedy-group.webp");
    expect(entry?.content_type).toBe("image/webp");
  });

  it("writes one re-runnable database record", () => {
    const sql = mediaArchiveUpsertSql();
    expect(sql).toContain("public.media_archive");
    expect(sql).toContain(MEDIA_ARCHIVE_ID);
    expect(sql).toContain("on conflict (id) do update");
    expect(sql).toContain("4b1016ff394324068fa67e0c914a5ad5bf893c5ded7b2ac6fdb4564e57757e54");
  });
});
