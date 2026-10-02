import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { PageSection } from "./page-section.tsx"

afterEach(() => {
  cleanup()
})

describe("PageSection", () => {
  it("sets the id and renders children", () => {
    const { container } = render(<PageSection id="intro">body</PageSection>)
    const section = container.querySelector("section")

    expect(section?.id).toBe("intro")
    expect(section?.textContent).toBe("body")
  })

  it("merges className over conflicting defaults", () => {
    const { container } = render(
      <PageSection id="a" className="mt-4">
        x
      </PageSection>
    )
    const classes = container.querySelector("section")?.className.split(" ")

    expect(classes).toContain("mt-4")
    expect(classes).not.toContain("mt-14")
  })
})
