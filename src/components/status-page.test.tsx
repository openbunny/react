/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { StatusPage } from "./status-page.tsx"

const ASSET: PlateAsset = {
  gifSrc: "/plate.gif",
  staticSrc: "/plate-static.png",
  width: 490,
  height: 330,
}

afterEach(cleanup)

describe("StatusPage", () => {
  it("exposes one main landmark with id main, the skip-link target", () => {
    const { container } = render(
      <StatusPage
        asset={ASSET}
        plateClassName="w-[245px]"
        heading="Heading"
        actions={<a href="/">Back</a>}
      >
        Body
      </StatusPage>
    )

    expect(screen.getAllByRole("main")).toHaveLength(1)
    expect(container.querySelector("main")?.id).toBe("main")
  })

  it("renders heading, body and actions in that order", () => {
    render(
      <StatusPage
        asset={ASSET}
        plateClassName="w-[245px]"
        heading="Heading"
        actions={<a href="/">Back</a>}
      >
        Body
      </StatusPage>
    )
    const main = screen.getByRole("main")
    const order = [...main.children].map((child) => child.tagName)

    expect(order).toEqual(["SPAN", "H1", "P", "A"])
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Heading"
    )
    expect(main.querySelector("p")?.textContent).toBe("Body")
  })
})
