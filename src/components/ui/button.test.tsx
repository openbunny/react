/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Button } from "./button.tsx"

afterEach(() => {
  cleanup()
})

describe("Button", () => {
  it("shows a focus ring and never rounds its corners", () => {
    render(<Button>Go</Button>)
    const button = screen.getByRole("button", { name: "Go" })

    expect(button.className).toMatch(/focus-visible:ring-ring/)
    expect(button.className).not.toMatch(/\brounded-/)
  })

  it("appends a caller class after the variant classes", () => {
    render(<Button className="extra-class">Go</Button>)

    expect(screen.getByRole("button", { name: "Go" }).className).toMatch(
      /extra-class$/
    )
  })
})
