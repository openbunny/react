import { describe, expect, it } from "vitest"

import { formatLongDate, parseIsoDate } from "./iso-date.ts"

describe("parseIsoDate", () => {
  it("parses a calendar date as UTC midnight", () => {
    expect(parseIsoDate("2026-02-28").toISOString()).toBe(
      "2026-02-28T00:00:00.000Z"
    )
  })

  it("rejects a malformed date", () => {
    expect(() => parseIsoDate("2026-2-28")).toThrow("Invalid ISO date")
  })

  it("rejects a date that does not exist", () => {
    expect(() => parseIsoDate("2026-02-30")).toThrow("Invalid ISO date")
  })

  it("rejects a date whose month is out of range", () => {
    expect(() => parseIsoDate("2026-13-01")).toThrow("Invalid ISO date")
  })
})

describe("formatLongDate", () => {
  it("formats day, month name and year", () => {
    expect(formatLongDate("2026-10-01")).toBe("1 October 2026")
  })
})
