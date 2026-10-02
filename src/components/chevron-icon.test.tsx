import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { ChevronIcon } from "./chevron-icon.tsx"

afterEach(() => {
  cleanup()
})

describe("ChevronIcon", () => {
  it.each([
    ["left", "M10 3 5 8l5 5"],
    ["right", "M6 3l5 5-5 5"],
  ] as const)(
    "draws the %s path and hides itself from assistive tech",
    (direction, d) => {
      const { container } = render(<ChevronIcon direction={direction} />)
      const svg = container.querySelector("svg")

      expect(svg?.getAttribute("aria-hidden")).toBe("true")
      expect(container.querySelector("path")?.getAttribute("d")).toBe(d)
    }
  )
})
