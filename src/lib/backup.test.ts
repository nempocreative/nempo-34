import { describe, expect, it } from "vitest";
import { BACKUP_TABLES, backupFileName, buildBackupFile, fetchAllRows, type BackupTable, type BackupTableResult } from "./backup";

const empty = () =>
  Object.fromEntries(BACKUP_TABLES.map((t) => [t, { rows: [], expected: 0 }])) as unknown as Record<BackupTable, BackupTableResult>;

describe("backup", () => {
  it("covers all 20 database tables including the media recovery archive", () => {
    expect(BACKUP_TABLES).toHaveLength(20);
    expect(new Set(BACKUP_TABLES).size).toBe(20);
    expect(BACKUP_TABLES).toContain("media_archive");

  });

  it("reads past the 1000-row page limit", async () => {
    const source = Array.from({ length: 2500 }, (_, i) => ({ id: i + 1 }));
    const rows = await fetchAllRows(async (from, to) => source.slice(from, to + 1), 1000);
    expect(rows).toHaveLength(2500);
    expect(rows[2499]).toEqual({ id: 2500 });
  });

  it("marks backup complete only when every table matches its count", () => {
    const ok = empty();
    ok.wisata = { rows: [{ id: 1 }, { id: 2 }], expected: 2 };
    const file = buildBackupFile(ok);
    expect(file.summary.complete).toBe(true);
    expect(file.summary.totalRows).toBe(2);
    expect(Object.keys(file.data)).toHaveLength(20);

    const partial = empty();
    partial.kuliner = { rows: [{ id: 1 }], expected: 3 };
    expect(buildBackupFile(partial).summary.complete).toBe(false);

    const failed = empty();
    failed.events = { rows: [], expected: null, error: "gagal" };
    expect(buildBackupFile(failed).summary.problems).toEqual(["events: gagal"]);
  });

  it("includes the site design when given", () => {
    const file = buildBackupFile(empty(), new Date(), { "src/styles.css": ":root{--primary:red}" });
    expect(file.design?.files["src/styles.css"]).toBe(":root{--primary:red}");
  });

  it("names the file with date and time", () => {
    expect(backupFileName(new Date(2026, 9, 31, 20, 5))).toBe("nempo-organizer-backup-2026-10-31-2005.json");
  });
});
