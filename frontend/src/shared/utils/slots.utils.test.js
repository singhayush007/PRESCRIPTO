import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSlots,
  formatSlotDate,
  parseSlot,
  relativeDay,
  toSlotDate,
} from "@/shared/utils/slots.utils";

const label = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

describe("slot helpers", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("toSlotDate builds the <day>_<month>_<year> key the API uses", () => {
    expect(toSlotDate(new Date(2026, 10, 6))).toBe("6_11_2026");
    expect(toSlotDate(new Date(2026, 0, 31))).toBe("31_1_2026");
  });

  it("formatSlotDate turns a key into a readable date", () => {
    expect(formatSlotDate("20_1_2026")).toBe("20 Jan 2026");
    expect(formatSlotDate("6_11_2026")).toBe("6 Nov 2026");
  });

  describe("parseSlot", () => {
    it("reads 12-hour times with AM/PM", () => {
      expect(parseSlot("6_11_2026", "10:30 AM")).toEqual(new Date(2026, 10, 6, 10, 30));
      expect(parseSlot("6_11_2026", "02:00 PM")).toEqual(new Date(2026, 10, 6, 14, 0));
      expect(parseSlot("6_11_2026", "12:00 PM")).toEqual(new Date(2026, 10, 6, 12, 0));
      expect(parseSlot("6_11_2026", "12:15 AM")).toEqual(new Date(2026, 10, 6, 0, 15));
    });
    it("reads 24-hour times", () => {
      expect(parseSlot("6_11_2026", "14:45")).toEqual(new Date(2026, 10, 6, 14, 45));
    });
  });

  describe("relativeDay", () => {
    beforeEach(() => vi.setSystemTime(new Date(2026, 10, 6, 12, 0)));
    it("names nearby days", () => {
      expect(relativeDay(new Date(2026, 10, 6, 23, 0))).toBe("Today");
      expect(relativeDay(new Date(2026, 10, 7, 9, 0))).toBe("Tomorrow");
      expect(relativeDay(new Date(2026, 10, 9, 9, 0))).toBe("In 3 days");
      expect(relativeDay(new Date(2026, 10, 5, 9, 0))).toBe("1 day ago");
      expect(relativeDay(new Date(2026, 10, 3, 9, 0))).toBe("3 days ago");
    });
    it("falls back to a date for far-away days", () => {
      expect(relativeDay(new Date(2026, 10, 20, 9, 0))).not.toMatch(/Today|Tomorrow|In \d|ago/);
    });
  });

  describe("buildSlots", () => {
    it("returns 7 days of 30-minute slots from 10:00 to 20:30 for future days", () => {
      vi.setSystemTime(new Date(2026, 10, 6, 9, 0));
      const days = buildSlots({});
      expect(days).toHaveLength(7);
      const tomorrow = days[1];
      expect(tomorrow).toHaveLength(22);
      expect(tomorrow[0].time).toBe(label(new Date(2026, 10, 7, 10, 0)));
      expect(tomorrow.at(-1).time).toBe(label(new Date(2026, 10, 7, 20, 30)));
    });

    it("starts today at the next free half-hour", () => {
      vi.setSystemTime(new Date(2026, 10, 6, 15, 20));
      expect(buildSlots({})[0][0].time).toBe(label(new Date(2026, 10, 6, 16, 0)));
      vi.setSystemTime(new Date(2026, 10, 6, 15, 40));
      expect(buildSlots({})[0][0].time).toBe(label(new Date(2026, 10, 6, 16, 30)));
    });

    it("leaves out slots that are already booked", () => {
      vi.setSystemTime(new Date(2026, 10, 6, 9, 0));
      const first = label(new Date(2026, 10, 7, 10, 0));
      const days = buildSlots({ "7_11_2026": [first] });
      expect(days[1]).toHaveLength(21);
      expect(days[1].some((s) => s.time === first)).toBe(false);
      expect(days[2]).toHaveLength(22); // other days untouched
    });

    it("has no slots left for a day that is over", () => {
      vi.setSystemTime(new Date(2026, 10, 6, 21, 30));
      expect(buildSlots({})[0]).toHaveLength(0);
    });
  });
});
