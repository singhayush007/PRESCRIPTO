import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bucketLast7Days } from "@/shared/utils/chart.utils";

describe("bucketLast7Days", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 6, 15, 0)); // Friday
  });
  afterEach(() => vi.useRealTimers());

  const at = (daysAgo, hour = 12) => new Date(2026, 10, 6 - daysAgo, hour, 0).getTime();

  it("always returns 7 days ending with Today", () => {
    const days = bucketLast7Days([]);
    expect(days).toHaveLength(7);
    expect(days.at(-1).label).toBe("Today");
    expect(days.map((d) => d.label)).toEqual(["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Today"]);
    expect(days.every((d) => d.value === 0)).toBe(true);
  });

  it("counts timestamps into the right local day", () => {
    const days = bucketLast7Days([at(0, 9), at(0, 14), at(1), at(3), at(3), at(3), at(6, 0)]);
    expect(days.map((d) => d.value)).toEqual([1, 0, 0, 3, 0, 1, 2]);
  });

  it("ignores timestamps older than the 7-day window", () => {
    const days = bucketLast7Days([at(7), at(20)]);
    expect(days.reduce((s, d) => s + d.value, 0)).toBe(0);
  });
});
