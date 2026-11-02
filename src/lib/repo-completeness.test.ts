import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// Guard for "everything reaches GitHub". Git sync pushes tracked files only, and
// Lovable itself cannot write a file over 10 MB, so a needed file that is ignored,
// untracked, oversized, or pointing at another project's storage silently disappears
// after a clone or a remix. These checks fail loudly instead.

const ROOT = process.cwd();
const MAX_TRACKED_BYTES = 10 * 1024 * 1024;

function git(args: string): string {
  try {
    return execSync(`git ${args}`, {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    // git check-ignore exits 1 when nothing matched: that answer is still the output.
    const stdout = (error as { stdout?: string }).stdout;
    if (typeof stdout === "string") return stdout;
    throw error;
  }
}

const tracked = new Set(
  git("ls-files -z")
    .split("\0")
    .filter(Boolean),
);

function trackedFilesUnder(prefix: string): string[] {
  return [...tracked].filter((file) => file.startsWith(prefix));
}

/** Project id Lovable's own remote is named after, e.g. .../6377a22f-....git */
function remoteProjectId(): string | null {
  const url = git("remote get-url origin").trim();
  return url.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/)?.[1] ?? null;
}

describe("repository completeness for git sync", () => {
  it("tracks every file the site needs to build and run", () => {
    const required = [
      "package.json",
      "vite.config.ts",
      "vitest.config.ts",
      "src/router.tsx",
      "src/routes/__root.tsx",
      "src/routes/index.tsx",
      "src/routes/$.tsx",
      "src/nempo-app.tsx",
      "src/start.ts",
      "src/lib/backup.ts",
      "src/lib/security-policy.ts",
      "src/integrations/supabase/client.ts",
      "src/integrations/supabase/types.ts",
      "src/data/media-archive.json",
      "src/data/media-archive.ts",
      "src/data/event-seed.ts",
      "drizzle/migrations/meta/_journal.json",
      "drizzle/schema.ts",
    ];
    expect(required.filter((file) => !tracked.has(file))).toEqual([]);
  });

  it("keeps every required file out of .gitignore", () => {
    const probe = [
      "src/assets/musicomedy-night-poster.webp.asset.json",
      "src/data/media-archive.json",
      "src/data/event-seed.ts",
      "drizzle/migrations/meta/_journal.json",
      "public/manifest.json",
    ].join("\n");
    expect(git("check-ignore --stdin").trim()).toBe("");
  });

  it("tracks every stored media pointer", () => {
    const onDisk: string[] = [];
    const walk = (dir: string) => {
      for (const entry of execSync(`find ${dir} -name "*.asset.json"`, {
        cwd: ROOT,
        encoding: "utf8",
      })
        .split("\n")
        .filter(Boolean)) {
        onDisk.push(entry.replace(/^\.\//, ""));
      }
    };
    walk("src/assets");
    expect(onDisk.length).toBeGreaterThan(0);
    expect(onDisk.filter((file) => !tracked.has(file))).toEqual([]);
  });

  it("keeps every media pointer inside this project's own storage", () => {
    const projectId = remoteProjectId();
    expect(projectId).toBeTruthy();
    const foreign = trackedFilesUnder("src/assets/")
      .filter((file) => file.endsWith(".asset.json"))
      .filter((file) => {
        const pointer = JSON.parse(readFileSync(path.join(ROOT, file), "utf8")) as {
          project_id?: string;
        };
        return pointer.project_id !== projectId;
      });
    expect(foreign).toEqual([]);
  });

  it("lists a pointer for every archived file", () => {
    const manifest = JSON.parse(
      readFileSync(path.join(ROOT, "src/data/media-archive.json"), "utf8"),
    ) as { pointer: string; filename: string }[];
    expect(manifest.length).toBeGreaterThan(0);
    const missing = manifest.filter(
      (entry) => !existsSync(path.join(ROOT, entry.pointer)) || !tracked.has(entry.pointer),
    );
    expect(missing.map((entry) => entry.filename)).toEqual([]);
  });

  it("holds no tracked file that GitHub or Lovable would reject", () => {
    const oversized = [...tracked]
      .filter((file) => existsSync(path.join(ROOT, file)))
      .filter((file) => statSync(path.join(ROOT, file)).size >= MAX_TRACKED_BYTES);
    expect(oversized).toEqual([]);
  });
});
