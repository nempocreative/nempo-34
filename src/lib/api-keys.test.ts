import { describe, expect, it } from "vitest";
import { toSnake } from "./api-keys";

describe("toSnake", () => {
  it("restores multi-word columns the API camelized", () => {
    expect(toSnake({ guestStars: [{ name: "Saduli Ragap", role: "Guest Star" }], dateEnd: null })).toEqual({
      guest_stars: [{ name: "Saduli Ragap", role: "Guest Star" }],
      date_end: null,
    });
  });

  it("normalizes nested objects and arrays of rows", () => {
    expect(toSnake([{ paymentInfo: { qrImage: "x" } }])).toEqual([{ payment_info: { qr_image: "x" } }]);
  });

  it("leaves single-word keys, primitives and null untouched", () => {
    expect(toSnake(null)).toBeNull();
    expect(toSnake({ name: "MusiComedy Night", price: 0 })).toEqual({ name: "MusiComedy Night", price: 0 });
  });
});
