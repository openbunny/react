import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { CommandLine } from "./command-line.tsx"

afterEach(() => {
  cleanup()
})

describe("CommandLine", () => {
  it("shows the command and a copy button that names it", () => {
    const { container } = render(<CommandLine command="tar --list file" />)

    expect(container.querySelector("code")?.textContent).toBe(
      "$tar --list file"
    )
    expect(
      screen.getByRole("button", { name: "Copy command: tar --list file" })
    ).toBeInTheDocument()
  })
})
