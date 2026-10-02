import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { SkipLink } from "./skip-link.tsx"

afterEach(() => {
  cleanup()
})

describe("SkipLink", () => {
  it("targets the main content and leaves the flow until focused", () => {
    render(<SkipLink />)
    const link = screen.getByRole("link", { name: "Skip to content" })

    expect(link).toHaveAttribute("href", "#main")
    expect(link.className).toMatch(/\bsr-only\b/)
    expect(link.className).toMatch(/focus:not-sr-only/)
  })

  it("renders the label prop", () => {
    render(<SkipLink label="jump to main" />)

    expect(screen.getByRole("link", { name: "jump to main" })).toBeVisible()
  })
})
