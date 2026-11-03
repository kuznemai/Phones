import { describe, expect, it } from "vitest";
import { formatEta, formatPrice, formatStorage } from "~/utils/format";

describe("formatPrice", () => {
  it("renders whole amounts without decimals", () => {
    expect(formatPrice(119900)).toBe("$1,199");
  });

  it("keeps cents when the amount is not whole", () => {
    expect(formatPrice(119950)).toBe("$1,199.50");
  });

  it("never renders NaN for missing data", () => {
    expect(formatPrice(undefined)).toBe("$0");
    expect(formatPrice(Number.NaN)).toBe("$0");
  });
});

describe("formatEta", () => {
  it("collapses an equal range", () => {
    expect(formatEta(2, 2)).toBe("2 days");
  });

  it("renders a range", () => {
    expect(formatEta(3, 6)).toBe("3–6 days");
  });
});

describe("formatStorage", () => {
  it("switches to terabytes at 1024 GB", () => {
    expect(formatStorage(512)).toBe("512 GB");
    expect(formatStorage(1024)).toBe("1 TB");
  });
});
