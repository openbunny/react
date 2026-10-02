import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { PageShell } from "./page-shell.tsx"

afterEach(() => {
  cleanup()
})

describe("PageShell", () => {
  it("renders children inside the column", () => {
    render(<PageShell>content</PageShell>)

    expect(screen.getByText("content").className).toContain("max-w-[65ch]")
  })
})
