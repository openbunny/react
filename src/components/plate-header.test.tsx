/** @vitest-environment jsdom */

import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import type { PlateAsset } from "../lib/plate-asset.ts"
import { PlateHeader } from "./plate-header.tsx"

const ASSET: PlateAsset = {
  animatedSrc: "/plate.gif",
  staticSrc: "/plate-static.png",
  width: 490,
  height: 330,
}

afterEach(cleanup)

describe("PlateHeader", () => {
  it("rules off the masthead, so a page cannot drift from the shared separator", () => {
    const { container } = render(
      <PlateHeader asset={ASSET} plateClassName="w-[245px]" />
    )
    const header = container.querySelector("header")

    expect(header?.className).toBe("mt-6 border-b border-line")
  })

  it("renders the animated source and the reduced-motion source", () => {
    const { container } = render(
      <PlateHeader asset={ASSET} plateClassName="w-[245px]" />
    )
    const image = container.querySelector("img")
    const source = container.querySelector("picture > source")

    expect(image).toHaveAttribute("src", ASSET.animatedSrc)
    expect(source).toHaveAttribute("srcset", ASSET.staticSrc)
  })

  it("passes the display width through to the plate", () => {
    const { container } = render(
      <PlateHeader asset={ASSET} plateClassName="w-[245px]" />
    )

    expect(container.querySelector("span")?.className).toContain("w-[245px]")
  })
})
