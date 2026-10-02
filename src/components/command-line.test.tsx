import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CommandLine } from "./command-line.tsx"

afterEach(() => {
  cleanup()
})

describe("CommandLine", () => {
  it("calls the consumer's callback after copying a command", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const onCopy = vi.fn()
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    render(<CommandLine command="echo test" copy={{ onCopy }} />)
    fireEvent.click(
      screen.getByRole("button", { name: "Copy command: echo test" })
    )
    await waitFor(() => expect(onCopy).toHaveBeenCalledOnce())
    expect(writeText).toHaveBeenCalledWith("echo test")
  })
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
