import { describe, expect, it } from "vitest"

import { cn } from "./utils.ts"

describe("cn", () => {
  it("drops falsy inputs", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b")
  })

  it("keeps the later of two conflicting utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})
