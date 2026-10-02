import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CommandBlock } from "./command-block.tsx"

afterEach(() => {
  cleanup()
})

const steps = [
  { command: "one --a", comment: "First step." },
  { command: "two 'b c'", comment: "Second step." },
]

describe("CommandBlock", () => {
  it("renders one copy field per command", () => {
    render(<CommandBlock id="verify" number="4" title="Verify" steps={steps} />)
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("names every copy control after the command it copies", () => {
    render(<CommandBlock id="verify" number="4" title="Verify" steps={steps} />)
    expect(
      screen.getByRole("button", { name: "Copy command: one --a" })
    ).toBeTruthy()
    expect(
      screen.getByRole("button", { name: "Copy command: two 'b c'" })
    ).toBeTruthy()
  })

  it("adds one control that copies every command when asked", () => {
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps}
        copyAll
      />
    )
    expect(
      screen.getByRole("button", { name: "Copy all Verify commands" })
    ).toHaveTextContent("Copy all")
  })

  it("chains the copied commands so a failed step stops the ones after it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps}
        copyAll
      />
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Copy all Verify commands" })
    )

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        steps.map((step) => step.command).join(" &&\n")
      )
    })
  })

  it("numbers each step under the section number, hidden from the heading name", () => {
    render(<CommandBlock id="verify" number="4" title="Verify" steps={steps} />)
    expect(
      screen.getByRole("heading", { level: 2, name: "Verify" })
    ).toHaveTextContent("4Verify")
    expect(screen.getByText("Second step.")).toHaveTextContent(
      "4.2Second step."
    )
  })

  it("keeps the command text whole while colouring its parts", () => {
    const { container } = render(
      <CommandBlock id="verify" number="4" title="Verify" steps={steps} />
    )
    const code = container.querySelectorAll("code")[1]
    expect(code?.textContent).toBe("$two 'b c'")
    expect(code?.querySelector(".tok-cmd")?.textContent).toBe("two")
    expect(code?.querySelector(".tok-str")?.textContent).toBe("'b c'")
  })

  it("marks the prompt as decorative and unselectable", () => {
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps.slice(0, 1)}
      />
    )
    const prompt = screen.getByText("$")
    expect(prompt.getAttribute("aria-hidden")).toBe("true")
    expect(prompt.className).toMatch(/select-none/)
  })

  it("boxes each command row like the other bordered panels", () => {
    const { container } = render(
      <CommandBlock id="verify" number="4" title="Verify" steps={steps} />
    )
    const row = container.querySelectorAll("li > div")[0]
    expect(row?.className).toMatch(/\bborder\b/)
    expect(row?.className).toMatch(/\bborder-line\b/)
    expect(row?.className).toMatch(/\bbg-paper-inset\b/)
    expect(row?.className).not.toMatch(/\brounded-/)
  })

  it("keeps the step number out of the accessible name", () => {
    render(<CommandBlock id="verify" number="4" title="Verify" steps={steps} />)
    const index = screen.getByText("4.1")
    expect(index.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders a note under the commands when one is given", () => {
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps}
        note="compare the checksum elsewhere."
      />
    )
    expect(screen.getByText("compare the checksum elsewhere.")).toBeTruthy()
  })

  it("renders nothing beyond the step sentences without a note", () => {
    const { container } = render(
      <CommandBlock id="verify" number="4" title="Verify" steps={steps} />
    )
    expect(container.querySelectorAll("p")).toHaveLength(steps.length)
  })
})

describe("CommandBlock copy-all text", () => {
  it("uses the given caption and label", () => {
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps}
        copyAll
        copyAllCaption="copy chain"
        copyAllLabel="copy the chain"
      />
    )
    expect(
      screen.getByRole("button", { name: "copy the chain" })
    ).toHaveTextContent("copy chain")
  })
})

describe("CommandBlock copy forwarding", () => {
  it("passes copy text and the label builder to every command row", () => {
    render(
      <CommandBlock
        id="verify"
        number="4"
        title="Verify"
        steps={steps}
        copy={{ caption: "grab" }}
        copyLabel={(command) => `grab ${command}`}
      />
    )
    expect(
      screen.getByRole("button", { name: "grab one --a" })
    ).toHaveTextContent("grab")
  })
})
