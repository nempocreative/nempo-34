import { describe, expect, it } from "vitest";
import { backupAccessDenied, PUBLIC_NEWS_COLUMNS, SECURITY_HEADERS } from "./security-policy";

describe("security policy", () => {
  it("denies backup access until administrator authorization exists", async () => {
    const response = backupAccessDenied();
    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).not.toHaveProperty("data");
  });
  it("excludes both private submitter fields from public article reads", () => {
    const fields = PUBLIC_NEWS_COLUMNS.split(",");
    expect(fields).not.toContain("submitter_email");
    expect(fields).not.toContain("submitter_name");
    expect(fields).toContain("content");
  });
  it("restricts framing, plugins and content-type sniffing", () => {
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
    expect(SECURITY_HEADERS["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(SECURITY_HEADERS["Content-Security-Policy"]).not.toContain("frame-ancestors *");
  });
});