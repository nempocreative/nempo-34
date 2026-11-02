// Browser-safe access to the media archive manifest (src/data/media-archive.json).
// The manifest is the recovery record for every picture, sound and clip that was
// copied out of the old project: filename, size, sha256 and the CDN pointer.
// After a remix the new project's database starts without rows, so this module is
// the source of truth for re-applying the record with the database query tool.

import manifest from "./media-archive.json";

export interface MediaArchiveEntry {
  pointer: string;
  filename: string;
  source_url: string;
  url: string;
  size: number;
  content_type: string;
  sha256: string;
}

export const MEDIA_ARCHIVE_ID = "media-archive";

export const MEDIA_ARCHIVE_ENTRIES = manifest as MediaArchiveEntry[];

export function mediaArchiveByFilename(filename: string): MediaArchiveEntry | undefined {
  return MEDIA_ARCHIVE_ENTRIES.find((entry) => entry.filename === filename);
}

/** SQL that stores the whole manifest as one database record, safe to re-run. */
export function mediaArchiveUpsertSql(): string {
  const json = JSON.stringify(MEDIA_ARCHIVE_ENTRIES);
  const text = (value: string) => `'${value.replace(/'/g, "''")}'`;
  return [
    `insert into public.media_archive (id, manifest, updated_at)`,
    `values (${text(MEDIA_ARCHIVE_ID)}, ${text(json)}::jsonb, now())`,
    `on conflict (id) do update set manifest = excluded.manifest, updated_at = now();`,
  ].join("\n");
}
