/** @vitest-environment jsdom */

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CopyButton } from "./copy-button.tsx"

const onCopy = vi.fn()

const writeText = vi.fn()

beforeEach(() => {
  writeText.mockReset()
  onCopy.mockReset()
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
})

afterEach(() => {
  cleanup()
})

describe("CopyButton", () => {
  it("turns its text ink on hover, never the background colour", () => {
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    const className = screen.getByRole("button", {
      name: "copy item",
    }).className
    expect(className).not.toMatch(/hover:text-background/)
    expect(className).toMatch(/hover:text-ink\b/)
  })

  it("does not force a 44px min height", () => {
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    expect(
      screen.getByRole("button", { name: "copy item" }).className
    ).not.toMatch(/min-h-11/)
  })

  it("draws a border that clears the 3:1 non-text contrast floor", () => {
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    const className = screen.getByRole("button", {
      name: "copy item",
    }).className
    expect(className).toMatch(/border-foreground\/(4[5-9]|[5-9]\d|100)\b/)
  })

  it("takes its accessible name from context and still reads Copy", () => {
    render(<CopyButton text="secret-block" label="copy item" caption="copy" />)
    const button = screen.getByRole("button", { name: "copy item" })
    expect(button.textContent).toBe("copy")
  })

  it("keeps a status region beside the button from first render", () => {
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    const status = screen.getByRole("status")
    expect(status.className).toMatch(/sr-only/)
    expect(status.textContent).toBe("")
    expect(
      screen
        .getByRole("button", { name: "copy item" })
        .getAttribute("aria-live")
    ).toBeNull()
  })

  it("copies text without renaming itself", async () => {
    writeText.mockResolvedValue(undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )

    const button = screen.getByRole("button", { name: "copy item" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("secret-block")
    })
    await waitFor(() => {
      expect(button.textContent).toBe("copied")
    })
    expect(button.getAttribute("aria-label")).toBe("copy item")
  })

  it("keeps one accessible name across idle, copied and failed", async () => {
    const names: Array<string | null> = []

    writeText.mockResolvedValue(undefined)
    const copied = render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    const succeeding = screen.getByRole("button")
    names.push(succeeding.getAttribute("aria-label"))
    fireEvent.click(succeeding)
    await waitFor(() => {
      expect(succeeding.textContent).toBe("copied")
    })
    names.push(succeeding.getAttribute("aria-label"))
    copied.unmount()

    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    writeText.mockRejectedValue(new Error("denied"))
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )
    const failing = screen.getByRole("button")
    fireEvent.click(failing)
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("failed.")
    })
    names.push(failing.getAttribute("aria-label"))
    error.mockRestore()

    expect(names).toEqual(["copy item", "copy item", "copy item"])
  })

  it("says copied in the control itself, announcing nothing on success", async () => {
    writeText.mockResolvedValue(undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )

    const button = screen.getByRole("button", { name: "copy item" })
    fireEvent.click(button)

    await waitFor(() => {
      expect(button.textContent).toBe("copied")
    })
    expect(screen.getAllByRole("status")).toHaveLength(1)
    expect(screen.getByRole("status").textContent).toBe("")
  })

  it("hides its own text from assistive technology, so the name never shifts", async () => {
    writeText.mockResolvedValue(undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )

    const button = screen.getByRole("button", { name: "copy item" })
    expect(button.firstElementChild?.getAttribute("aria-hidden")).toBe("true")

    fireEvent.click(button)
    await waitFor(() => {
      expect(button.textContent).toBe("copied")
    })

    expect(button.firstElementChild?.getAttribute("aria-hidden")).toBe("true")
    expect(
      screen.getByRole("button", { name: "copy item" })
    ).toBeInTheDocument()
  })

  it("returns to its caption after the window, under the same name", async () => {
    vi.useFakeTimers()
    writeText.mockResolvedValue(undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
      />
    )

    const button = screen.getByRole("button", { name: "copy item" })
    fireEvent.click(button)
    await vi.waitFor(() => {
      expect(button.textContent).toBe("copied")
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(450)
    })

    expect(button.textContent).toBe("copy")
    expect(button.getAttribute("aria-label")).toBe("copy item")
    vi.useRealTimers()
  })

  it("uses neutral capitalised defaults when no strings are given", async () => {
    writeText.mockRejectedValue(new Error("denied"))
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    render(<CopyButton text="secret-block" label="Copy item" />)

    const button = screen.getByRole("button", { name: "Copy item" })
    expect(button.textContent).toBe("Copy")
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe(
        "Copy item failed. Select the text and copy it by hand."
      )
    })
    error.mockRestore()
  })

  it("calls onCopy once after a successful copy and never after a failure", async () => {
    writeText.mockResolvedValue(undefined)
    render(<CopyButton text="secret-block" label="copy item" onCopy={onCopy} />)
    fireEvent.click(screen.getByRole("button", { name: "copy item" }))
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledTimes(1)
    })
    cleanup()

    onCopy.mockReset()
    writeText.mockRejectedValue(new Error("denied"))
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    render(<CopyButton text="secret-block" label="copy item" onCopy={onCopy} />)
    fireEvent.click(screen.getByRole("button", { name: "copy item" }))
    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toContain("failed.")
    })
    expect(onCopy).not.toHaveBeenCalled()
    error.mockRestore()
  })

  it("still reports success when the onCopy callback throws", async () => {
    writeText.mockResolvedValue(undefined)
    onCopy.mockImplementation(() => {
      throw new Error("callback unavailable")
    })
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
        onCopy={onCopy}
        failureHint="use the download link above this block."
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "copy item" }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("secret-block")
    })
    const button = screen.getByRole("button", { name: "copy item" })
    await waitFor(() => {
      expect(button.textContent).toBe("copied")
    })
    expect(screen.getByRole("status").className).toMatch(/sr-only/)
    expect(screen.getByRole("status").textContent).not.toContain(
      "use the download link above this block."
    )
    error.mockRestore()
  })

  it("states the failure, names a fallback, and does not revert", async () => {
    vi.useFakeTimers()
    writeText.mockRejectedValue(new Error("denied"))
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    render(
      <CopyButton
        text="secret-block"
        label="copy item"
        caption="copy"
        copiedCaption="copied"
        onCopy={onCopy}
        failureHint="use the download link above this block."
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "copy item" }))
    await vi.waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe(
        "copy item failed. use the download link above this block."
      )
    })
    expect(screen.getByRole("status").className).not.toMatch(/sr-only/)

    await vi.advanceTimersByTimeAsync(5000)
    expect(screen.getByRole("status").textContent).toBe(
      "copy item failed. use the download link above this block."
    )
    const button = screen.getByRole("button", { name: "copy item" })
    expect(button.textContent).toBe("copy")
    expect(button.getAttribute("aria-label")).toContain(button.textContent)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
    vi.useRealTimers()
  })

  it("returns to idle once the announce window ends", async () => {
    vi.useFakeTimers()
    writeText.mockResolvedValue(undefined)
    render(<CopyButton text="secret-block" label="copy item" />)
    const button = screen.getByRole("button", { name: "copy item" })
    fireEvent.click(button)
    await vi.waitFor(() => {
      expect(button.getAttribute("data-copied")).toBe("")
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600)
    })

    expect(button.getAttribute("data-copied")).toBeNull()
    expect(screen.getByRole("status").textContent).toBe("")
    vi.useRealTimers()
  })
})
