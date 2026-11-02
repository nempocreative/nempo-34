import { describe, expect, it } from "vitest";
import { INVITATION_BILLING, INVITATION_INCLUDED, INVITATION_PRICE, invitationRupiah, woPackagesWithFreeInvitation } from "./wedding-invitation";

describe("wedding invitation", () => {
  it("costs Rp199.000, paid once", () => {
    expect(INVITATION_PRICE).toBe(199_000);
    expect(invitationRupiah(INVITATION_PRICE)).toBe("Rp199.000");
    expect(INVITATION_BILLING).toBe("sekali bayar");
  });

  it("includes RSVP, gallery, guest wishes, music and a share link", () => {
    expect([...INVITATION_INCLUDED]).toEqual(["RSVP", "Galeri", "Ucapan tamu", "Musik", "Link undangan"]);
  });

  it("is free with WO Signature and Premium, not Essential", () => {
    expect(woPackagesWithFreeInvitation()).toEqual(["Signature", "Premium"]);
  });
});
