import { describe, expect, it, vi, beforeEach } from "vitest";
import { importWithRetry } from "./lazy-with-retry";

describe("importWithRetry", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("succeeds when the second attempt loads", async () => {
    const factory = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Importing a module script failed."))
      .mockResolvedValueOnce({ default: "page" });
    await expect(importWithRetry(factory)).resolves.toEqual({ default: "page" });
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("reloads the page only once when loading keeps failing", async () => {
    const reload = vi.fn();
    Object.defineProperty(window, "location", { value: { ...window.location, reload }, configurable: true });
    const failing = () => Promise.reject(new TypeError("Importing a module script failed."));

    void importWithRetry(failing);
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));

    // a second failure right after the reload shows the error instead of reloading forever
    await expect(importWithRetry(failing)).rejects.toThrow("Importing a module script failed.");
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
